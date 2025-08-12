#!/bin/bash

# Frontend Test Runner Script
# This script provides convenient ways to run different types of tests

set -e

echo "🧪 Frontend Test Runner"
echo "======================"

case "$1" in
    "all")
        echo "Running all tests..."
        npm run test:run
    ;;
    "coverage")
        echo "Running tests with coverage..."
        npm run test:coverage
    ;;
    "watch")
        echo "Running tests in watch mode..."
        npm test
    ;;
    "ui")
        echo "Running tests with UI..."
        npm run test:ui
    ;;
    "quick")
        echo "Running quick test suite..."
        npm test -- --run src/lib/__tests__/utils.test.ts src/hooks/__tests__/useAuth.test.tsx src/pages/__tests__/Home.test.tsx
    ;;
    "unit")
        echo "Running unit tests..."
        npm test -- --run src/lib/__tests__/ src/hooks/__tests__/
    ;;
    "components")
        echo "Running component tests..."
        npm test -- --run src/components/__tests__/ src/pages/__tests__/
    ;;
    "integration")
        echo "Running integration tests..."
        npm test -- --run src/__tests__/integration.test.tsx
    ;;
    *)
        echo "Usage: $0 {all|coverage|watch|ui|quick|unit|components|integration}"
        echo ""
        echo "Commands:"
        echo "  all         - Run all tests once"
        echo "  coverage    - Run tests with coverage report"
        echo "  watch       - Run tests in watch mode"
        echo "  ui          - Run tests with UI interface"
        echo "  quick       - Run a quick subset of tests"
        echo "  unit        - Run unit tests only"
        echo "  components  - Run component tests only"
        echo "  integration - Run integration tests only"
        exit 1
    ;;
esac
