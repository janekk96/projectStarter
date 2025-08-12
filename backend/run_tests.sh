#!/bin/bash

# Simple test runner for backend tests
echo "🚀 Running Backend Tests"
echo "========================"

# Set environment variables for testing
export PYTHONPATH=/app
export DATABASE_URL="sqlite+aiosqlite:///./test.db"
export SECRET_KEY="test-secret-key"
export JWT_SECRET_KEY="test-jwt-secret-key"

# Clean up any existing test database
rm -f test.db

# Run tests
echo "Running pytest..."
python -m pytest tests/ -v --tb=short

# Clean up test database after tests
rm -f test.db

echo "✅ Tests completed!"
