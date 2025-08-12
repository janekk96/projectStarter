import pytest


class TestSmoke:
    """Smoke tests to verify basic functionality."""

    def test_import_app(self):
        """Test that we can import the main app."""
        from app.main import app
        assert app is not None

    def test_import_models(self):
        """Test that we can import models."""
        from app.models import User
        assert User is not None

    def test_import_config(self):
        """Test that we can import config."""
        from app.config import settings
        assert settings is not None

    async def test_basic_client_response(self, client):
        """Test that client fixture works and returns a response."""
        response = await client.get("/")
        assert response.status_code == 200
