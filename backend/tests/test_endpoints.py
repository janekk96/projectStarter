import pytest
from httpx import AsyncClient


class TestBasicEndpoints:
    """Test basic API endpoints."""

    async def test_root_endpoint(self, client: AsyncClient):
        """Test the root endpoint."""
        response = await client.get("/")
        assert response.status_code == 200
        assert response.json() == {
            "message": "FastAPI with JWT Authentication"}

    async def test_protected_endpoint_without_auth(self, client: AsyncClient):
        """Test protected endpoint without authentication."""
        response = await client.get("/protected")
        assert response.status_code == 401

    async def test_health_check(self, client: AsyncClient):
        """Test that the app is responsive."""
        response = await client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
