# Project Starter

A full-stack application starter with FastAPI backend, React/Vite frontend, PostgreSQL database, and Nginx reverse proxy.

## 🏗️ Architecture

```
┌─── Frontend (React/Vite) ───┐     ┌─── Backend (FastAPI) ───┐
│     Port: 5173              │ ◄─► │     Port: 8000          │
│     Path: /                 │     │     Path: /api          │
└─────────────────────────────┘     └─────────────────────────┘
                ▲                                   ▲
                │                                   │
        ┌───────▼───────────────────────────────────▼───────┐
        │              Nginx (Port 80)                      │
        │   Frontend: /          Backend API: /api          │
        └───────────────────────────────────────────────────┘
                                ▲
                                │
                ┌───────────────▼───────────────┐
                │     PostgreSQL Database       │
                │         Port: 5432            │
                └───────────────────────────────┘
```

## 🚀 Quick Start

1. **Clone and setup environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start all services**:

   ```bash
   make up
   ```

3. **Access the application**:
   - **Frontend**: http://localhost/
   - **Backend API**: http://localhost/api/
   - **API Documentation**: http://localhost/api/docs

## 📁 Project Structure

```
.
├── backend/                # FastAPI backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py        # FastAPI application
│       ├── models.py      # Database models
│       ├── users.py       # User authentication
│       └── ...
├── frontend/               # React/Vite frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       └── ...
├── nginx/                  # Nginx reverse proxy
│   ├── Dockerfile
│   ├── nginx.conf         # Nginx configuration
│   └── README.md
├── utils/                  # Testing utilities
│   ├── test_auth.py       # Authentication testing script
│   └── frontend_auth_example.js
├── docker-compose.yml      # Service orchestration
├── Makefile              # Development commands
└── .env.example          # Environment variables template
```

## 🛠️ Development Commands

### General

- `make up` - Start all services
- `make down` - Stop all services
- `make logs` - Show logs for all services
- `make ps` - Show running services

### Frontend

- `make frontend-logs` - Show frontend logs
- `make frontend-shell` - Open shell in frontend container
- `make frontend-install` - Install npm dependencies
- `make build-frontend` - Rebuild frontend container

### Backend

- `make backend-logs` - Show backend logs
- `make backend-shell` - Open shell in backend container
- `make backend-test` - Run backend tests
- `make build-backend` - Rebuild backend container

### Nginx

- `make nginx-logs` - Show nginx logs
- `make nginx-shell` - Open shell in nginx container
- `make nginx-reload` - Reload nginx configuration
- `make nginx-test` - Test nginx configuration
- `make build-nginx` - Rebuild nginx container

### Database

- `make db-shell` - Open PostgreSQL shell
- `make db-reset` - Reset database (⚠️ destroys data)

### Authentication Testing

- `make test-auth` - Test authentication endpoints
- `make test-register` - Test user registration
- `make test-login` - Test user login

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=appdb

# Backend
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/appdb
SECRET=supersecretchangeme

# Frontend (with nginx proxy)
VITE_API_URL=http://localhost/api
```

### Nginx Routing

- **Frontend** (`/`): Served from React/Vite application
  - Includes WebSocket support for hot reload
- **Backend API** (`/api`): Proxied to FastAPI with `/api` prefix removed
  - Example: `GET /api/users` → `GET /users` (to backend)
- **Health Check** (`/health`): Nginx health endpoint

## 🔐 Authentication

The application includes JWT-based authentication with:

- User registration and login
- Token-based authentication
- FastAPI Users integration

### Testing Authentication

```bash
# Run the full authentication test suite
make test-auth

# Or test individual endpoints
make test-register
make test-login
```

## 📊 Services

| Service  | Internal Port | External Access      | Purpose                 |
| -------- | ------------- | -------------------- | ----------------------- |
| Frontend | 5173          | http://localhost/    | React/Vite application  |
| Backend  | 8000          | http://localhost/api | FastAPI REST API        |
| Database | 5432          | localhost:5432       | PostgreSQL database     |
| Nginx    | 80            | http://localhost/    | Reverse proxy & routing |

## 🐳 Docker

Each service runs in its own container:

- **Frontend**: Node.js with Vite development server
- **Backend**: Python with FastAPI and uvicorn
- **Database**: PostgreSQL 15
- **Nginx**: Alpine-based nginx with custom configuration

## 🔍 Monitoring & Debugging

### View Logs

```bash
make logs                # All services
make frontend-logs       # Frontend only
make backend-logs        # Backend only
make nginx-logs          # Nginx only
```

### Access Containers

```bash
make frontend-shell      # Frontend container
make backend-shell       # Backend container
make nginx-shell         # Nginx container
make db-shell           # Database shell
```

### Health Checks

- Nginx: http://localhost/health
- Backend API docs: http://localhost/api/docs
- Backend health: http://localhost/api/health (if implemented)

## 📝 Notes

- The nginx proxy removes the `/api` prefix before forwarding requests to the backend
- WebSocket connections for Vite HMR are properly proxied through nginx
- CORS is handled at the nginx level for API requests
- All inter-service communication uses Docker service names
- External ports are only exposed for nginx (80) and PostgreSQL (5432)

## 🚧 Production Considerations

For production deployment:

1. Use environment-specific `.env` files
2. Implement proper SSL/TLS termination in nginx
3. Add security headers and rate limiting
4. Use multi-stage Docker builds for smaller images
5. Implement proper logging and monitoring
6. Consider using docker-compose override files for different environments
