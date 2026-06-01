.PHONY: help install lint lint-fix fmt fmt-check typecheck test test-coverage build audit \
        go-fmt go-fmt-check go-vet go-test go-test-coverage go-build backend ci clean

GO_PKGS := ./pkg/... ./query_debugger/...
PRETTIER_GLOB := "src/**/*.{ts,tsx,js,jsx,json,scss,md}"

help:
	@echo "Targets:"
	@echo "  install           npm ci"
	@echo "  lint              eslint"
	@echo "  lint-fix          eslint --fix"
	@echo "  fmt               prettier --write"
	@echo "  fmt-check         prettier --check"
	@echo "  typecheck         tsc --noEmit"
	@echo "  test              jest (ci mode)"
	@echo "  test-coverage     jest --coverage"
	@echo "  build             webpack production build"
	@echo "  audit             npm audit (high+ severity fails)"
	@echo "  go-fmt            gofmt -w on pkg + query_debugger"
	@echo "  go-fmt-check      gofmt -l (fails if any file needs formatting)"
	@echo "  go-vet            go vet"
	@echo "  go-test           go test -race"
	@echo "  go-test-coverage  go test -race -coverprofile"
	@echo "  go-build          go build verify"
	@echo "  backend           mage buildAll (multi-arch backend binaries)"
	@echo "  ci                everything CI runs (no mage, no slow multi-arch build)"
	@echo "  clean             remove dist/ + coverage artifacts"

install:
	npm ci

lint:
	npm run lint

lint-fix:
	npm run lint:fix

fmt:
	npx prettier --write $(PRETTIER_GLOB)

fmt-check:
	npx prettier --check $(PRETTIER_GLOB)

typecheck:
	npm run typecheck

test:
	npm run test:ci

test-coverage:
	npm run test:coverage

build:
	npm run build

audit:
	npm audit --audit-level=high

go-fmt:
	gofmt -w pkg query_debugger

go-fmt-check:
	@unformatted=$$(gofmt -l pkg query_debugger); \
	if [ -n "$$unformatted" ]; then \
		echo "Files need gofmt:"; \
		echo "$$unformatted"; \
		exit 1; \
	fi

go-vet:
	go vet $(GO_PKGS)

go-test:
	go test -race $(GO_PKGS)

go-test-coverage:
	go test -race -coverprofile=coverage.out $(GO_PKGS)

go-build:
	go build $(GO_PKGS)

backend:
	mage buildAll

ci: install fmt-check lint typecheck test build audit go-fmt-check go-vet go-test go-build
	@echo ""
	@echo "✓ ci passed"

clean:
	rm -rf dist coverage coverage.out node_modules/.cache
