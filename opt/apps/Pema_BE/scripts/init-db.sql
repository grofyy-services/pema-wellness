-- Database initialization script for Pema Wellness
-- This script creates necessary extensions and initial data

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create indexes for performance (will be handled by Alembic in production)
-- This is mainly for development setup

-- Create an admin user (password: admin123)
-- This will be created by the application startup in development mode
