package main

import (
  "fmt"
  "regexp"
  "strings"
  "time"

  "github.com/altinity/clickhouse-grafana/pkg/eval"
  "github.com/gopherjs/gopherjs/js"
)

type AdhocFilter struct {
  Key      string      `json:"key"`
  Operator string      `json:"operator"`
  Value    interface{} `json:"value"`
}



// applyAdhocFiltersGopherJS is the GopherJS-compatible function that processes adhoc filters
func applyAdhocFiltersGopherJS(_ *js.Object, args []*js.Object) interface{} {
  jsObj := args[0]
  query := jsObj.Get("query").String()
  adhocFiltersJS := jsObj.Get("adhocFilters")

  adhocFilters := make([]AdhocFilter, adhocFiltersJS.Length())
  for i := 0; i < adhocFiltersJS.Length(); i++ {
    filter := adhocFiltersJS.Index(i)
    adhocFilters[i] = AdhocFilter{
      Key:      filter.Get("key").String(),
      Operator: filter.Get("operator").String(),
      Value:    filter.Get("value").String(),
    }
  }

  // Target extraction not needed for ResourceAttributes syntax

  // Process the query
  adhocConditions := make([]string, 0)
  scanner := eval.NewScanner(query)
  ast, err := scanner.ToAST()
  topQueryAst := ast
  if err != nil {
    return map[string]interface{}{
      "error": fmt.Sprintf("Failed to parse query: %v", err),
    }
  }

  if len(adhocFilters) > 0 {
    // Navigate to the deepest FROM clause
    for ast.HasOwnProperty("from") && ast.Obj["from"].(*eval.EvalAST).Arr == nil {
      nextAst, ok := ast.Obj["from"].(*eval.EvalAST)
      if !ok {
        break
      }
      ast = nextAst
    }

    // Initialize WHERE clause if it doesn't exist
    if !ast.HasOwnProperty("where") {
      ast.Obj["where"] = &eval.EvalAST{
        Obj: make(map[string]interface{}),
        Arr: make([]interface{}, 0),
      }
    }

    // Process each adhoc filter - always use ResourceAttributes map syntax
    for _, filter := range adhocFilters {

      // Convert operator
      operator := filter.Operator
      switch operator {
      case "=~":
        operator = "LIKE"
      case "!~":
        operator = "NOT LIKE"
      }

      // Format value with consistent quoting
      var value string
      switch v := filter.Value.(type) {
      case float64:
        value = fmt.Sprintf("%g", v)
      case string:
        // Don't quote if it's already a number or contains special SQL syntax
        if regexp.MustCompile(`^\s*\d+(\.\d+)?\s*$`).MatchString(v) ||
          strings.Contains(v, "'") ||
          strings.Contains(v, ", ") {
          value = v
        } else {
          // Escape single quotes in string values
          escaped := strings.ReplaceAll(v, "'", "''")
          value = fmt.Sprintf("'%s'", escaped)
        }
      default:
        // For any other type, convert to string and escape quotes
        str := fmt.Sprintf("%v", v)
        escaped := strings.ReplaceAll(str, "'", "''")
        value = fmt.Sprintf("'%s'", escaped)
      }

      // Build the condition using ResourceAttributes map syntax
      condition := fmt.Sprintf("ResourceAttributes['%s'] %s %s", filter.Key, operator, value)
      adhocConditions = append(adhocConditions, condition)
    }

    // Handle conditions differently based on $adhoc presence
    if !strings.Contains(query, "$adhoc") {
      // If no $adhoc, modify WHERE clause through AST
      whereAst := ast.Obj["where"].(*eval.EvalAST)
      if len(adhocConditions) > 0 {
        combinedCondition := strings.Join(adhocConditions, " AND ")
        if len(whereAst.Arr) > 0 {
          // If WHERE has existing conditions, add with AND
          whereAst.Arr = append(whereAst.Arr, "AND", fmt.Sprintf("(%s)", combinedCondition))
        } else {
          // If WHERE is empty, add without AND
          whereAst.Arr = append(whereAst.Arr, combinedCondition)
        }
      }
      query = eval.PrintAST(topQueryAst, " ")
    }
  }

  // Always handle $adhoc replacement, even for empty filters
  if strings.Contains(query, "$adhoc") {
    renderedCondition := "1"
    if len(adhocConditions) > 0 {
      renderedCondition = fmt.Sprintf("(%s)", strings.Join(adhocConditions, " AND "))
    }
    query = strings.ReplaceAll(query, "$adhoc", renderedCondition)
  }

  // Return the result
  return map[string]interface{}{
    "query": query,
  }
}

// QueryRequest represents the structure of the query request
type QueryRequest struct {
  RefId                  string
  RuleUid                string
  RawQuery               bool
  Query                  string
  DateTimeCol            string
  DateCol                string
  DateTimeType           string
  Extrapolate            bool
  SkipComments           bool
  AddMetadata            bool
  Format                 string
  Round                  string
  IntervalFactor         int
  Interval               string
  Database               string
  Table                  string
  MaxDataPoints          int64
  FrontendDatasource     bool
  UseWindowFuncForMacros bool
  TimeRange              struct {
    From string
    To   string
  }
}

// findGroupByProperties recursively searches for GROUP BY clauses in the AST
func findGroupByProperties(ast *eval.EvalAST) []interface{} {
  // First, check if there's a GROUP BY at this level
  if prop, exists := ast.Obj["group by"]; exists {
    switch v := prop.(type) {
    case *eval.EvalAST:
      // If the property is an AST object, add all items from its array
      properties := make([]interface{}, len(v.Arr))
      copy(properties, v.Arr)
      return properties
    case []interface{}:
      // If the property is already a slice, use it directly
      return v
    default:
      // For any other type, add it as a single item
      return []interface{}{v}
    }
  }

  // If not found at this level, check if there's a FROM clause that might contain a subquery
  if from, exists := ast.Obj["from"]; exists {
    switch v := from.(type) {
    case *eval.EvalAST:
      // If FROM contains another AST (subquery), recursively search in it
      subProperties := findGroupByProperties(v)
      if len(subProperties) > 0 {
        return subProperties
      }
    }
  }

  // If nothing found in subqueries, check any other properties that might contain nested ASTs
  for _, obj := range ast.Obj {
    if subAST, ok := obj.(*eval.EvalAST); ok {
      subProperties := findGroupByProperties(subAST)
      if len(subProperties) > 0 {
        return subProperties
      }
    }
  }

  // Return empty slice if nothing found
  return []interface{}{}
}

// createQueryGopherJS is the GopherJS-compatible function that processes query creation
func createQueryGopherJS(_ *js.Object, args []*js.Object) interface{} {
  // Validate input arguments
  if len(args) != 1 {
    return map[string]interface{}{
      "error": "Invalid number of arguments. Expected query request object",
    }
  }

  // Extract request data from JavaScript object
  jsObj := args[0]
  reqData := QueryRequest{
    RefId:                  jsObj.Get("refId").String(),
    RuleUid:                jsObj.Get("ruleUid").String(),
    RawQuery:               jsObj.Get("rawQuery").Bool(),
    Query:                  jsObj.Get("query").String(),
    DateTimeCol:            jsObj.Get("dateTimeColDataType").String(),
    DateCol:                jsObj.Get("dateColDataType").String(),
    DateTimeType:           jsObj.Get("dateTimeType").String(),
    Extrapolate:            jsObj.Get("extrapolate").Bool(),
    SkipComments:           jsObj.Get("skip_comments").Bool(),
    AddMetadata:            jsObj.Get("add_metadata").Bool(),
    Format:                 jsObj.Get("format").String(),
    Round:                  jsObj.Get("round").String(),
    IntervalFactor:         jsObj.Get("intervalFactor").Int(),
    Interval:               jsObj.Get("interval").String(),
    Database:               jsObj.Get("database").String(),
    Table:                  jsObj.Get("table").String(),
    MaxDataPoints:          int64(jsObj.Get("maxDataPoints").Int()),
    FrontendDatasource:     jsObj.Get("frontendDatasource").Bool(),
    UseWindowFuncForMacros: jsObj.Get("useWindowFuncForMacros").Bool(),
  }

  // Extract time range
  timeRange := jsObj.Get("timeRange")
  reqData.TimeRange.From = timeRange.Get("from").String()
  reqData.TimeRange.To = timeRange.Get("to").String()

  // Parse time range
  from, err := time.Parse(time.RFC3339, reqData.TimeRange.From)
  if err != nil {
    return map[string]interface{}{
      "error": "Invalid `$from` time",
    }
  }

  to, err := time.Parse(time.RFC3339, reqData.TimeRange.To)
  if err != nil {
    return map[string]interface{}{
      "error": "Invalid `$to` time",
    }
  }

  // Create eval.EvalQuery
  evalQ := eval.EvalQuery{
    RefId:                  reqData.RefId,
    RuleUid:                reqData.RuleUid,
    RawQuery:               reqData.RawQuery,
    Query:                  reqData.Query,
    DateTimeCol:            reqData.DateTimeCol,
    DateCol:                reqData.DateCol,
    DateTimeType:           reqData.DateTimeType,
    Extrapolate:            reqData.Extrapolate,
    SkipComments:           reqData.SkipComments,
    AddMetadata:            reqData.AddMetadata,
    Format:                 reqData.Format,
    Round:                  reqData.Round,
    IntervalFactor:         reqData.IntervalFactor,
    Interval:               reqData.Interval,
    Database:               reqData.Database,
    Table:                  reqData.Table,
    MaxDataPoints:          reqData.MaxDataPoints,
    From:                   from,
    To:                     to,
    FrontendDatasource:     reqData.FrontendDatasource,
    UseWindowFuncForMacros: reqData.UseWindowFuncForMacros,
  }

  // Apply macros and get AST
  sql, err := evalQ.ApplyMacrosAndTimeRangeToQuery()
  if err != nil {
    return map[string]interface{}{
      "error": fmt.Sprintf("Failed to apply macros: %v", err),
    }
  }

  scanner := eval.NewScanner(sql)
  ast, err := scanner.ToAST()
  if err != nil {
    return map[string]interface{}{
      "error": fmt.Sprintf("Failed to parse query: %v", err),
    }
  }

  // Use the recursive function to find GROUP BY properties at any level
  properties := findGroupByProperties(ast)

  // Return the result
  return map[string]interface{}{
    "sql":  sql,
    "keys": properties,
  }
}

// replaceTimeFiltersGopherJS is the GopherJS-compatible function that processes time filter replacements
func replaceTimeFiltersGopherJS(_ *js.Object, args []*js.Object) interface{} {
  jsObj := args[0]
  reqData := QueryRequest{
    Query:        jsObj.Get("query").String(),
    DateTimeType: jsObj.Get("dateTimeType").String(),
  }

  // Extract time range
  timeRange := jsObj.Get("timeRange")
  reqData.TimeRange.From = timeRange.Get("from").String()
  reqData.TimeRange.To = timeRange.Get("to").String()

  // Extract query
  query := reqData.Query
  dateTimeType := reqData.DateTimeType
  fromStr := reqData.TimeRange.From
  toStr := reqData.TimeRange.To
  // Parse time range
  from, err := time.Parse(time.RFC3339, fromStr)
  if err != nil {
    return map[string]interface{}{
      "error": "Invalid from time",
      "data":  from,
    }
  }

  to, err := time.Parse(time.RFC3339, toStr)
  if err != nil {
    return map[string]interface{}{
      "error": "Invalid to time",
      "data":  to,
    }
  }

  //// Create eval.EvalQuery
  evalQ := eval.EvalQuery{
    Query:        query,
    From:         from,
    To:           to,
    DateTimeType: dateTimeType,
  }

  // Replace time filters
  sql := evalQ.ReplaceTimeFilters(evalQ.Query, 0)

  // Return the result
  return map[string]interface{}{
    "sql": sql,
  }
}

// getAstPropertyGopherJS is the WebAssembly-compatible function that processes AST property requests
func getAstPropertyGopherJS(_ *js.Object, args []*js.Object) interface{} {
  // Validate input arguments
  if len(args) != 2 {
    return map[string]interface{}{
      "error": "Invalid number of arguments. Expected query and propertyName",
    }
  }

  // Extract query and propertyName from arguments
  query := args[0].String()
  propertyName := args[1].String()

  // Create scanner and parse AST
  scanner := eval.NewScanner(query)
  ast, err := scanner.ToAST()
  if err != nil {
    return map[string]interface{}{
      "error": fmt.Sprintf("Failed to parse query: %v", err),
    }
  }

  // Use the recursive function if we're looking for group by
  if propertyName == "group by" {
    properties := findGroupByProperties(ast)
    return map[string]interface{}{
      "properties": properties,
    }
  }

  // Standard extraction for other properties
  var properties []interface{}
  if prop, exists := ast.Obj[propertyName]; exists {
    switch v := prop.(type) {
    case *eval.EvalAST:
      // If the property is an AST object, add all items from its array
      properties = make([]interface{}, len(v.Arr))
      copy(properties, v.Arr)
    case []interface{}:
      // If the property is already a slice, use it directly
      properties = v
    case map[string]interface{}:
      // If the property is an object, add it as a single item
      properties = []interface{}{v}
    default:
      // For any other type, add it as a single item
      properties = []interface{}{v}
    }
  }

  // Return the result
  return map[string]interface{}{
    "properties": properties,
  }
}

func main() {
  js.Global.Set("applyAdhocFilters", js.MakeFunc(applyAdhocFiltersGopherJS))
  js.Global.Set("createQuery", js.MakeFunc(createQueryGopherJS))
  js.Global.Set("replaceTimeFilters", js.MakeFunc(replaceTimeFiltersGopherJS))
  js.Global.Set("getAstProperty", js.MakeFunc(getAstPropertyGopherJS))

  // GopherJS doesn't need the channel trick to keep the program running
}
