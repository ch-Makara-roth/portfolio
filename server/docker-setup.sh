#!/bin/bash

# Docker Setup Script for Node.js + Express + Prisma + PostgreSQL

echo "🚀 Setting up Docker environment for your Node.js application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Desktop or Docker Compose plugin."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start the containers
echo "🏗️  Building and starting containers..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose run --rm app bunx prisma migrate deploy

# Start the application
echo "🚀 Starting the application..."
docker compose up -d app

echo "✅ Setup complete!"
echo ""
echo "🌐 Your application is running at: http://localhost:3000"
echo "🗄️  Database is running at: localhost:5432"
echo "🔧 To run Prisma Studio: docker compose --profile dev up prisma-studio"
echo "📊 Prisma Studio will be available at: http://localhost:5555"
echo ""
echo "📖 Useful commands:"
echo "  - View logs: docker compose logs -f app"
echo "  - Stop all: docker compose down"
echo "  - Rebuild: docker compose build --no-cache"
echo "  - Database shell: docker compose exec postgres psql -U postgres -d myapp" 