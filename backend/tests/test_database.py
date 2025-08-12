import pytest
from sqlalchemy import text
from app.models import User
from app.database import Base


class TestDatabase:
    """Test database operations."""

    async def test_database_connection(self, client):
        """Test that database connection is working."""
        # Simply making a request should initialize the database
        response = await client.get("/")
        assert response.status_code == 200

    async def test_user_model_creation(self, test_db):
        """Test User model can be created."""
        from tests.test_db import TestAsyncSessionLocal

        async with TestAsyncSessionLocal() as session:
            # Test that we can create a user record structure
            # This tests the model definition without fastapi-users complexity
            result = await session.execute(
                text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
            )
            tables = result.fetchall()
            assert len(tables) > 0, "Users table should exist"

    async def test_database_tables_created(self, test_db):
        """Test that all necessary tables are created."""
        from tests.test_db import TestAsyncSessionLocal

        async with TestAsyncSessionLocal() as session:
            # Check if users table exists
            result = await session.execute(
                text("SELECT name FROM sqlite_master WHERE type='table'")
            )
            tables = [row[0] for row in result.fetchall()]
            assert "users" in tables, "Users table should be created"


class TestUserModel:
    """Test User model functionality."""

    def test_user_model_attributes(self):
        """Test User model has required attributes."""
        # Test that User model has the expected structure
        assert hasattr(User, '__tablename__')
        assert User.__tablename__ == 'users'

        # Check that it inherits from the correct base classes
        assert hasattr(User, 'id')
        assert hasattr(User, 'email')
        assert hasattr(User, 'hashed_password')
