# Makefile

# Docker Compose main commands
build:
	@echo "Building Docker images..."
	@docker compose build

build-clean:
	@echo "Building Docker images without cache..."
	@docker compose build --no-cache

up:
	@echo "Starting Docker containers..."
	@docker compose up -d

down:
	@echo "Stopping Docker containers..."
	@docker compose down

ps:
	@echo "Listing Docker containers..."
	@docker compose ps

# Logs commands
logs-backend:
	@echo "Showing logs for backend..."
	@docker compose logs -f backend

logs-frontend:
	@echo "Showing logs for frontend..."
	@docker compose logs -f frontend

logs-keycloak:
	@echo "Showing logs for keycloak..."
	@docker compose logs -f keycloak

logs-db:
	@echo "Showing logs for db..."
	@docker compose logs -f db

logs-nginx:
	@echo "Showing logs for nginx..."
	@docker compose logs -f nginx

# Restart commands
restart:
	@echo "Restarting all containers..."
	@docker compose restart
	
restart-backend:
	@echo "Restarting backend container..."
	@docker compose restart backend

restart-frontend:
	@echo "Restarting frontend container..."
	@docker compose restart frontend

restart-keycloak:
	@echo "Restarting keycloak container..."
	@docker compose restart keycloak

restart-db:
	@echo "Restarting db container..."
	@docker compose restart db

restart-nginx:
	@echo "Restarting nginx container..."
	@docker compose restart nginx

# Execute commands
exec-backend:
	@echo "Executing command in backend container..."
	@docker compose exec backend bash

exec-frontend:
	@echo "Executing command in frontend container..."
	@docker compose exec frontend bash

exec-db:
	@echo "Executing command in db container..."
	@docker compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}