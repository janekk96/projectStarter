# Nginx Reverse Proxy

This directory contains the nginx configuration for serving the application through a reverse proxy.

## Configuration

The nginx container acts as a reverse proxy with the following routing:

- **Frontend (`/`)**: Routes to the React/Vite frontend service
- **Backend API (`/api`)**: Routes to the FastAPI backend service
  - The `/api` prefix is stripped before forwarding to the backend
  - Example: `GET /api/users` becomes `GET /users` to the backend

## Features

- **Reverse Proxy**: Routes requests to appropriate services
- **CORS Support**: Handles CORS headers for API requests
- **WebSocket Support**: Enables Vite hot reload in development
- **Gzip Compression**: Compresses responses for better performance
- **Security Headers**: Adds basic security headers
- **Health Check**: Provides `/health` endpoint for monitoring

## Usage

With nginx in place, your application will be available at:

- **Frontend**: http://localhost/
- **Backend API**: http://localhost/api/

## Environment Variables

Update your `.env` file to use the nginx proxy:

```
VITE_API_URL=http://localhost/api
```

## Development Notes

- The nginx container depends on both frontend and backend services
- Port 80 is exposed for external access
- Internal service ports (5173, 8000) are no longer exposed directly
- WebSocket connections for Vite HMR are proxied through nginx
