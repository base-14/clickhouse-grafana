# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Altinity ClickHouse Grafana Datasource Plugin** - a production-ready Grafana plugin that enables visualization of data from ClickHouse databases. Originally developed by Vertamedia, maintained by Altinity since 2020.

**Architecture**: Hybrid TypeScript (React frontend) + Go (backend service) plugin following Grafana's standard datasource plugin architecture.

**Key Technologies**:
- Frontend: React 18.3.0, TypeScript 5.2.0, Grafana SDK 11.5.2, Webpack 5
- Backend: Go 1.24, Grafana Plugin SDK for Go
- Build: Mage (Go), npm scripts, Docker Compose for development

## Essential Development Commands

### Build Commands
- `npm run build` - Full build (backend + frontend)
- `npm run build:frontend` - Frontend only
- `npm run build:backend` - Backend only (uses Docker)
- `npm run dev` - Development mode with watch
- `mage -v` - Build Go backend binaries for all platforms

### Testing Commands
- `npm run test` - Run Jest tests
- `npm run test:coverage` - Run tests with coverage
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint (use `npm run lint:fix` to auto-fix)
- `mage coverage` - Go backend tests with coverage

### Development Environment
- `npm run server` - Start Grafana with plugin loaded
- `docker compose up --no-deps -d grafana clickhouse` - Full development environment
- After code changes: `docker compose run --rm frontend_builder && docker compose restart grafana`

### Docker Development Workflow
1. Make code changes
2. `docker compose run --rm frontend_builder` (for frontend changes)
3. `docker compose run --rm backend_builder` (for backend changes)  
4. `docker compose restart grafana`
5. Open http://localhost:3000/

## Architecture Overview

**Frontend Structure** (`/src/`):
- `ConfigEditor` - Datasource configuration UI
- `QueryEditor` - ClickHouse query builder and raw SQL editor
- `DataSource` - Main datasource implementation with query execution
- Support for multiple visualizations: time series, tables, logs, flamegraphs, traces
- Advanced features: macros, functions, ad-hoc filters, annotations

**Backend Structure** (`/pkg/`):
- Go service using Grafana Plugin SDK
- Handles ClickHouse connections, authentication (basic auth, TLS, X-ClickHouse headers)
- Query parsing, execution, and response formatting
- Entry point: `pkg/main.go`

**Key Plugin Features**:
- Raw SQL editor with ClickHouse macros (`$timeFilter`, `$timeSeries`, etc.)
- Special functions: `$rate()`, `$columns()`, `$perSecond()`, etc.
- Multiple compression formats (gzip, zstd, brotli)
- Template variables and conditional predicates
- Comprehensive alerting support (legacy + unified alerts)

## Testing Infrastructure

**Frontend Testing**: Jest with React Testing Library
**Backend Testing**: Go tests with coverage via Mage
**E2E Testing**: Cypress (`npm run e2e`)  
**Integration Testing**: TestFlows with Selenium (in `/tests/testflows/`)

## Important Development Notes

**Hybrid Build System**: The project uses both npm scripts and Mage. Frontend is built with Webpack, backend with Mage/Go tooling.

**GopherJS Component**: The project includes a GopherJS component (`npm run build:gopherjs`) that bridges Go code to JavaScript.

**Docker-first Development**: The project is designed for Docker-based development with comprehensive docker-compose setup including ClickHouse, Grafana, and auxiliary services.

**Plugin Signing**: Production plugins must be signed. Use `npm run sign` with proper Grafana API credentials.

**Release Process**: Use `./release.sh [major|minor|patch]` for version bumping and `git push origin main --follow-tags` for releases.

## Common Patterns

**Macro System**: The plugin implements a comprehensive macro system for ClickHouse queries. When working with query functionality, understand that macros like `$timeFilter`, `$timeSeries` are replaced server-side.

**Multi-format Support**: The plugin supports multiple output formats (time series, table, logs, traces, flamegraph). Format-specific logic is in the DataSource class.

**Compression**: The plugin supports multiple compression formats. This is handled in the backend Go service with configuration in the ConfigEditor.

**Authentication**: Multiple auth methods supported including basic auth, TLS certificates, and X-ClickHouse headers. Configuration is in ConfigEditor, implementation in Go backend.


## WAY OF WORKING

- Start with minimal functionality and verify it works before adding complexity
- For all compiled languages please compile after each change.
- Do not leave code with compile errors.
- Once you are done making a change, kindly run linting and fix any errors.
- Follow Test Driven Development
   -  Make sure to add test cases before you make a change.
   -  Be kind and run a failing test, fix it and then run test again.
- Please make sure after Compilation and Linting that the tests are passing before reporting any success.
- Kindly avoid stating things like "it works", if you want to show, show me green tests.
- I cannot request this enough, please make sure to run tests after every change.
- I prefer trunk based development, and git for version control.
- Prefer latest version of libs unless there is a reason not to.
- Use dbmate when any table is added or changed.
- Use Makefile for all build commands