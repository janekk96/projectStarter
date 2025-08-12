"""
Test configuration module that sets up SQLite database for testing
"""
import os
import tempfile

# Set environment variables before importing anything else
test_db_file = tempfile.mktemp(suffix=".db")
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{test_db_file}"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["JWT_SECRET_KEY"] = "test-jwt-secret-key"
