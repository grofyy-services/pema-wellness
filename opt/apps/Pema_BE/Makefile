# Pema Wellness API - Makefile for development tasks

.PHONY: help venv install dev test lint format clean docker-build docker-up docker-down deploy setup

# Default target
help:
	@echo "Pema Wellness API - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  setup       Setup development environment (creates venv, installs deps)"
	@echo "  venv       Create virtual environment"
	@echo "  install    Install dependencies"
	@echo "  dev        Start development server"
	@echo "  test       Run tests"
	@echo "  lint        Run linting checks"
	@echo "  format      Format code"
	@echo "  clean       Clean cache and temporary files"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build    Build Docker images"
	@echo "  docker-up       Start Docker services"
	@echo "  docker-down     Stop Docker services"
	@echo "  docker-logs     View Docker logs"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy      Deploy to VPS"
	@echo "  db-migrate  Run database migrations"
	@echo "  db-seed     Seed database with sample data"

# Development commands
# Check if venv exists, create if not
venv:
	@if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
		echo "Virtual environment created!"; \
	fi

install: venv
	@echo "Installing dependencies..."
	./venv/bin/pip install -r requirements.txt
	@echo "Dependencies installed!"

dev: venv
	@echo "Starting development server..."
	./venv/bin/uvicorn app.main:app --reload --port 8000

test:
	pytest tests/ -v --cov=app --cov-report=html --cov-report=term

test-fast:
	pytest tests/ -v -x

lint:
	flake8 app/ tests/
	mypy app/

format:
	black app/ tests/
	isort app/ tests/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f api

docker-clean:
	docker-compose down -v
	docker system prune -f

# Database commands
db-migrate:
	alembic upgrade head

db-seed:
	python scripts/seed_data.py

db-reset:
	docker-compose exec db psql -U pema_user -d pema_wellness -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	psql postgresql://pema_user:pema_password@localhost:5432/pema_wellness < scripts/schema.sql

# Deployment commands
deploy:
	@echo "Deploying to VPS (dev.pemawellness.com)..."
	@echo "1. Build and push Docker image"
	@echo "2. Connect to VPS and pull updates"
	@echo "3. Restart services"
	@echo "Manual deployment required - see README.md"

# Quality checks
check: lint test
	@echo "All quality checks passed!"

# Setup development environment
setup: venv
	@echo "Setting up development environment..."
	./venv/bin/pip install -r requirements.txt
	@if [ ! -f ".env" ]; then \
		if [ -f "env.example" ]; then \
			cp env.example .env; \
			echo "Created .env file from env.example"; \
		else \
			echo "Warning: env.example not found. Please create .env manually."; \
		fi; \
	else \
		echo ".env file already exists, skipping..."; \
	fi
	@echo "Environment setup complete!"
	@echo "Please edit .env file with your configuration"
	@echo "Then run: make dev (or make docker-up for Docker)"

# Production commands
prod-build:
	docker build -t pema-wellness-api:latest .

prod-deploy:
	@echo "Production deployment checklist:"
	@echo "- Set DEBUG=false in .env"
	@echo "- Configure production database"
	@echo "- Setup SSL certificates"
	@echo "- Configure monitoring"
	@echo "- Setup backup strategy"
