# JWT Authentication Implementation

## Overview

Your FastAPI application now has a complete JWT authentication system implemented using `fastapi-users`. The system provides secure user registration, login, logout, and protected endpoints.

## 🔐 Available Authentication Endpoints

### User Registration

- **Endpoint**: `POST /auth/register`
- **Purpose**: Register a new user account
- **Example**:
  ```bash
  curl -X POST "http://localhost:8000/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@example.com",
      "password": "securepassword123",
      "is_active": true,
      "is_superuser": false,
      "is_verified": false
    }'
  ```

### User Login

- **Endpoint**: `POST /auth/jwt/login`
- **Purpose**: Authenticate user and receive JWT token
- **Example**:
  ```bash
  curl -X POST "http://localhost:8000/auth/jwt/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=user@example.com&password=securepassword123"
  ```

### User Logout

- **Endpoint**: `POST /auth/jwt/logout`
- **Purpose**: Logout user (invalidates token on server side)
- **Headers**: `Authorization: Bearer <token>`

### Reset Password

- **Endpoint**: `POST /auth/forgot-password`
- **Purpose**: Request password reset
- **Endpoint**: `POST /auth/reset-password`
- **Purpose**: Reset password with token

### Email Verification

- **Endpoint**: `POST /auth/request-verify-token`
- **Purpose**: Request email verification token
- **Endpoint**: `POST /auth/verify`
- **Purpose**: Verify email with token

### User Management

- **Endpoint**: `GET /users/me`
- **Purpose**: Get current user information
- **Endpoint**: `PATCH /users/me`
- **Purpose**: Update current user information
- **Endpoint**: `GET /users/{id}`
- **Purpose**: Get user by ID (admin only)
- **Endpoint**: `PATCH /users/{id}`
- **Purpose**: Update user by ID (admin only)
- **Endpoint**: `DELETE /users/{id}`
- **Purpose**: Delete user by ID (admin only)

## 🔒 Protected Endpoints

### Example Protected Route

- **Endpoint**: `GET /protected`
- **Purpose**: Example of a protected endpoint that requires authentication
- **Headers**: `Authorization: Bearer <jwt_token>`

## 📁 Project Structure

```
backend/app/
├── config.py          # Configuration settings (JWT secrets, database URL, etc.)
├── database.py        # Database connection and session management
├── main.py           # FastAPI app with authentication routes
├── models.py         # User model with SQLAlchemy
├── users.py          # User management, authentication backend, JWT strategy
└── requirements.txt  # Updated dependencies
```

## 🛠️ Makefile Commands

Use these convenient makefile targets for testing and development:

### Authentication Testing

```bash
make setup-venv     # Set up virtual environment for testing
make test-auth      # Run comprehensive authentication tests
make test-register  # Test user registration endpoint
make test-login     # Test user login endpoint
```

### Development

```bash
make up             # Start all services
make rebuild-backend # Rebuild backend with new dependencies
make backend-logs   # View backend logs
make backend-shell  # Access backend container shell
```

### Database

```bash
make db-shell       # Open PostgreSQL shell
make db-reset       # Reset database (⚠️ deletes all data)
```

## 🔧 Configuration

The authentication system uses environment variables for configuration:

- `SECRET_KEY`: Main secret key for password reset/verification tokens
- `JWT_SECRET_KEY`: JWT token signing secret
- `DATABASE_URL`: PostgreSQL connection string
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token lifetime (default: 8 days)

## 🧪 Testing

The authentication system has been tested and verified:

✅ User registration works  
✅ User login returns valid JWT tokens  
✅ Protected endpoints require authentication  
✅ Unauthorized requests are properly rejected  
✅ JWT tokens are properly validated

## 🚀 Usage Example

1. **Register a new user**:

   ```bash
   make test-register
   ```

2. **Login to get JWT token**:

   ```bash
   make test-login
   ```

3. **Access protected endpoint**:

   ```bash
   curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:8000/protected
   ```

4. **Run comprehensive tests**:
   ```bash
   make test-auth
   ```

## 📚 API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation of all endpoints.

Visit `http://localhost:8000/redoc` for ReDoc documentation.

## 🔄 Token Lifecycle

1. User registers with email/password
2. User logs in with credentials
3. Server returns JWT access token
4. Client includes token in `Authorization: Bearer <token>` header
5. Server validates token for protected endpoints
6. Token expires after configured time (default: 8 days)
7. User can logout to invalidate token server-side

## 🏗️ Database Schema

The `User` table includes:

- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `hashed_password` (String)
- `is_active` (Boolean)
- `is_superuser` (Boolean)
- `is_verified` (Boolean)

## ⚠️ Security Notes

- JWT secrets should be changed in production
- Use HTTPS in production
- Tokens have configurable expiration times
- Passwords are properly hashed with bcrypt
- CORS is configured for frontend integration
