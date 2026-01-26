#!/bin/bash
# Production Server Diagnostics - Run directly on the server

echo "🔍 PRODUCTION SERVER DIAGNOSTICS"
echo "================================="

# Navigate to app directory
cd /opt/apps/Pema_BE
echo "📍 Current directory: $(pwd)"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo " docker-compose.yml not found!"
    echo "Files in directory:"
    ls -la
    exit 1
fi

echo ""
echo "📊 Docker Container Status:"
docker compose ps

echo ""
echo "📋 API Container Logs (last 20 lines):"
docker compose logs api --tail=20 2>/dev/null || echo "No API logs available"

echo ""
echo "📋 Nginx Container Logs (last 20 lines):"
docker compose logs nginx --tail=20 2>/dev/null || echo "No nginx logs available"

echo ""
echo "🌐 Network Connectivity Test:"
echo "Testing API container internal health..."
if docker compose exec -T api curl -f --max-time 5 http://localhost:8000/health 2>/dev/null; then
    echo " API internal health OK"
else
    echo " API internal health FAILED"
    echo "Checking if API container is running..."
    docker compose ps api
fi

echo ""
echo "🔧 Environment Check:"
echo "Checking for .env file..."
if [ -f ".env" ]; then
    echo " .env file exists"
    echo "IDS Configuration:"
    grep -E "^IDS_" .env 2>/dev/null || echo "No IDS config found"
else
    echo " .env file missing!"
fi

echo ""
echo "🔄 Restarting Services..."
docker compose restart

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "📊 Status after restart:"
docker compose ps

echo ""
echo "🏥 Final Health Check:"
echo "Testing external API access..."
if curl -f --max-time 10 http://localhost:8080/health 2>/dev/null; then
    echo " API external health OK"
else
    echo " API external health FAILED"
fi

echo ""
echo "🎯 Next Steps if API health fails:"
echo "1. Check .env file has correct database and IDS credentials"
echo "2. Check database connectivity: docker compose exec api python -c 'import asyncpg'"
echo "3. Check application logs: docker compose logs api"
echo "4. Test IDS connectivity: docker compose exec api python -c 'from app.services.ids import IDSService; s=IDSService(); print(\"IDS OK\")'"
