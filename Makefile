# Makefile for managing FastAPI + Vite + Postgres starter (with npm)

# Default target
.DEFAULT_GOAL := help

# Variables
COMPOSE = docker compose
FRONTEND_CONTAINER = frontend
BACKEND_CONTAINER = backend
NGINX_CONTAINER = nginx

## —— 🛠️ Project Management —————————————————————————————————————————————

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services (detached)
	$(COMPOSE) up -d

up-build: ## Build and start all services
	$(COMPOSE) up -d --build

build-clean: ## Build and start all services, removing old containers
	$(COMPOSE) build --no-cache

build-frontend: ## Build frontend container
	$(COMPOSE) build $(FRONTEND_CONTAINER) --no-cache 

build-backend: ## Build backend container
	$(COMPOSE) build $(BACKEND_CONTAINER) --no-cache

build-nginx: ## Build nginx container
	$(COMPOSE) build $(NGINX_CONTAINER) --no-cache

rebuild:
	$(COMPOSE) down
	$(COMPOSE) up -d --build

down-up: ## Stop all services and then start them again
	$(COMPOSE) down
	$(COMPOSE) up -d

rebuild-frontend: ## Rebuild frontend container
	$(COMPOSE) down
	$(COMPOSE) build $(FRONTEND_CONTAINER) --no-cache
	$(COMPOSE) up -d 

rebuild-backend: ## Rebuild backend container
	$(COMPOSE) down
	$(COMPOSE) build $(BACKEND_CONTAINER) --no-cache
	$(COMPOSE) up -d 

rebuild-nginx: ## Rebuild nginx container
	$(COMPOSE) down
	$(COMPOSE) build $(NGINX_CONTAINER) --no-cache
	$(COMPOSE) up -d 

down: ## Stop all services
	$(COMPOSE) down

logs: ## Show logs for all services
	$(COMPOSE) logs -f

ps: ## Show running services
	$(COMPOSE) ps

prune: ## Remove stopped containers, unused networks, images, and volumes
	$(COMPOSE) down --rmi all --volumes --remove-orphans
	@docker system prune -af

restart: ## Restart all services
	$(COMPOSE) restart

## —— 🖥️ Backend ———————————————————————————————————————————————

backend-shell: ## Open a shell inside backend container
	$(COMPOSE) exec $(BACKEND_CONTAINER) /bin/bash

backend-logs: ## Show backend logs
	$(COMPOSE) logs -f $(BACKEND_CONTAINER)

backend-test: ## Run backend tests (pytest)
	$(COMPOSE) exec $(BACKEND_CONTAINER) pytest

backend-test-verbose: ## Run backend tests with verbose output
	$(COMPOSE) exec $(BACKEND_CONTAINER) pytest -v

backend-test-coverage: ## Run backend tests with coverage report
	$(COMPOSE) exec $(BACKEND_CONTAINER) pytest --cov=app --cov-report=term-missing

backend-test-specific: ## Run specific test file (usage: make backend-test-specific TEST=test_auth.py)
	$(COMPOSE) exec $(BACKEND_CONTAINER) pytest tests/$(TEST) -v

## —— 💻 Frontend ————————————————————————————————————————————————

frontend-shell: ## Open a shell inside frontend container
	$(COMPOSE) exec $(FRONTEND_CONTAINER) sh

frontend-logs: ## Show frontend logs
	$(COMPOSE) logs -f $(FRONTEND_CONTAINER)

frontend-install: ## Install frontend dependencies using npm
	$(COMPOSE) exec $(FRONTEND_CONTAINER) npm install

frontend-dev: ## Run Vite dev server
	$(COMPOSE) exec $(FRONTEND_CONTAINER) npm dev

frontend-build: ## Build frontend (Vite)
	$(COMPOSE) exec $(FRONTEND_CONTAINER) npm build

frontend-preview: ## Preview production build
	$(COMPOSE) exec $(FRONTEND_CONTAINER) npm preview

## —— 🌐 Nginx ——————————————————————————————————————————————————

nginx-shell: ## Open a shell inside nginx container
	$(COMPOSE) exec $(NGINX_CONTAINER) sh

nginx-logs: ## Show nginx logs
	$(COMPOSE) logs -f $(NGINX_CONTAINER)

nginx-reload: ## Reload nginx configuration
	$(COMPOSE) exec $(NGINX_CONTAINER) nginx -s reload

nginx-test: ## Test nginx configuration
	$(COMPOSE) exec $(NGINX_CONTAINER) nginx -t

## —— 🗄️ Database ————————————————————————————————————————————————

db-shell: ## Open psql shell in database container
	$(COMPOSE) exec db psql -U postgres -d appdb

db-reset: ## Drop and recreate database (⚠️ will delete data)
	$(COMPOSE) exec db psql -U postgres -c "DROP DATABASE IF EXISTS appdb;"
	$(COMPOSE) exec db psql -U postgres -c "CREATE DATABASE appdb;"

## —— 🔐 Authentication Testing ————————————————————————————————————————

setup-venv: ## Set up virtual environment for testing
	python3 -m venv venv
	./venv/bin/pip install requests

test-auth: ## Test JWT authentication endpoints
	./venv/bin/python ./utils/test_auth.py

test-register: ## Test user registration only
	curl -X POST "http://localhost/api/auth/register" \
		-H "Content-Type: application/json" \
		-d '{"email":"test@example.com","password":"testpassword123","is_active":true,"is_superuser":false,"is_verified":false}'

test-login: ## Test user login only
	curl -X POST "http://localhost/api/auth/jwt/login" \
		-H "Content-Type: application/x-www-form-urlencoded" \
		-d "username=test@example.com&password=testpassword123"
