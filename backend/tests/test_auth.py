import pytest
from httpx import AsyncClient


class TestAuthentication:
    """Test authentication endpoints and workflows."""

    async def test_user_registration(self, client: AsyncClient):
        """Test user registration."""
        user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        response = await client.post("/auth/register", json=user_data)
        assert response.status_code == 201

        response_data = response.json()
        assert response_data["email"] == user_data["email"]
        assert response_data["is_active"] == user_data["is_active"]
        assert "id" in response_data
        assert "password" not in response_data  # Password should not be returned

    async def test_user_registration_duplicate_email(self, client: AsyncClient):
        """Test registration with duplicate email."""
        user_data = {
            "email": "duplicate@example.com",
            "password": "testpassword123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        # First registration should succeed
        response = await client.post("/auth/register", json=user_data)
        assert response.status_code == 201

        # Second registration with same email should fail
        response = await client.post("/auth/register", json=user_data)
        assert response.status_code == 400

    async def test_user_login(self, client: AsyncClient):
        """Test user login flow."""
        # First register a user
        user_data = {
            "email": "login@example.com",
            "password": "testpassword123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        registration_response = await client.post("/auth/register", json=user_data)
        assert registration_response.status_code == 201

        # Now try to login
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }

        response = await client.post(
            "/auth/jwt/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        assert response.status_code == 200
        response_data = response.json()
        assert "access_token" in response_data
        assert response_data["token_type"] == "bearer"

    async def test_user_login_invalid_credentials(self, client: AsyncClient):
        """Test login with invalid credentials."""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }

        response = await client.post(
            "/auth/jwt/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        assert response.status_code == 400

    async def test_protected_endpoint_with_valid_token(self, client: AsyncClient):
        """Test accessing protected endpoint with valid token."""
        # Register and login user
        user_data = {
            "email": "protected@example.com",
            "password": "testpassword123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        await client.post("/auth/register", json=user_data)

        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }

        login_response = await client.post(
            "/auth/jwt/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        token = login_response.json()["access_token"]

        # Access protected endpoint
        response = await client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        response_data = response.json()
        assert "message" in response_data
        assert user_data["email"] in response_data["message"]

    async def test_protected_endpoint_with_invalid_token(self, client: AsyncClient):
        """Test accessing protected endpoint with invalid token."""
        response = await client.get(
            "/protected",
            headers={"Authorization": "Bearer invalid_token"}
        )

        assert response.status_code == 401
