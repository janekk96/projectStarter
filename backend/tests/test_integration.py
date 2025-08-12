import pytest
from httpx import AsyncClient


class TestIntegration:
    """Integration tests that test complete workflows."""

    async def test_complete_user_workflow(self, client: AsyncClient):
        """Test complete user registration, login, and access workflow."""

        # Step 1: Register a new user
        user_data = {
            "email": "integration@example.com",
            "password": "securepassword123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        registration_response = await client.post("/auth/register", json=user_data)
        assert registration_response.status_code == 201

        user_response_data = registration_response.json()
        assert user_response_data["email"] == user_data["email"]
        user_id = user_response_data["id"]

        # Step 2: Login with the registered user
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }

        login_response = await client.post(
            "/auth/jwt/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        assert login_response.status_code == 200
        token_data = login_response.json()
        access_token = token_data["access_token"]

        # Step 3: Access protected endpoint with token
        protected_response = await client.get(
            "/protected",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        assert protected_response.status_code == 200
        protected_data = protected_response.json()
        assert user_data["email"] in protected_data["message"]

    async def test_multiple_users_workflow(self, client: AsyncClient):
        """Test workflow with multiple users to ensure isolation."""

        # Create first user
        user1_data = {
            "email": "user1@example.com",
            "password": "password123",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        response1 = await client.post("/auth/register", json=user1_data)
        assert response1.status_code == 201

        # Create second user
        user2_data = {
            "email": "user2@example.com",
            "password": "password456",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False
        }

        response2 = await client.post("/auth/register", json=user2_data)
        assert response2.status_code == 201

        # Login both users
        login1_response = await client.post(
            "/auth/jwt/login",
            data={"username": user1_data["email"],
                  "password": user1_data["password"]},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        login2_response = await client.post(
            "/auth/jwt/login",
            data={"username": user2_data["email"],
                  "password": user2_data["password"]},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        assert login1_response.status_code == 200
        assert login2_response.status_code == 200

        token1 = login1_response.json()["access_token"]
        token2 = login2_response.json()["access_token"]

        # Verify each user can access their own protected routes
        protected1_response = await client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token1}"}
        )

        protected2_response = await client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token2}"}
        )

        assert protected1_response.status_code == 200
        assert protected2_response.status_code == 200

        # Verify responses contain correct user emails
        assert user1_data["email"] in protected1_response.json()["message"]
        assert user2_data["email"] in protected2_response.json()["message"]
