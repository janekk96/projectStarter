#!/usr/bin/env python3
"""
Test script for JWT authentication endpoints
"""

import requests
import json


def test_auth_endpoints():
    base_url = "http://localhost:8000"

    print("🔐 Testing JWT Authentication Endpoints\n")

    # Test user registration
    print("1. Testing user registration...")
    register_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "is_active": True,
        "is_superuser": False,
        "is_verified": False
    }

    try:
        response = requests.post(
            f"{base_url}/auth/register", json=register_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            print("   ✅ User registered successfully!")
            user_data = response.json()
            print(f"   User ID: {user_data['id']}")
            print(f"   Email: {user_data['email']}")
        else:
            print(f"   ❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return

    # Test user login
    print("\n2. Testing user login...")
    login_data = {
        # Note: fastapi-users uses 'username' field for email
        "username": "test@example.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{base_url}/auth/jwt/login", data=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Login successful!")
            token_data = response.json()
            access_token = token_data.get('access_token')
            print(f"   Access Token: {access_token[:50]}...")
        else:
            print(f"   ❌ Login failed: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return

    # Test protected endpoint
    print("\n3. Testing protected endpoint...")
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(f"{base_url}/protected", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Protected endpoint access successful!")
            protected_data = response.json()
            print(f"   Response: {protected_data}")
        else:
            print(f"   ❌ Protected endpoint failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

    # Test protected endpoint without token
    print("\n4. Testing protected endpoint without token...")
    try:
        response = requests.get(f"{base_url}/protected")
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correctly rejected unauthorized access!")
        else:
            print(f"   ❌ Should have been unauthorized: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

    # Test user logout
    print("\n5. Testing user logout...")
    try:
        response = requests.post(
            f"{base_url}/auth/jwt/logout", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Logout successful!")
        else:
            print(f"   ❌ Logout failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")


if __name__ == "__main__":
    test_auth_endpoints()
