#!/bin/bash
# Copy and paste this entire script into your SSH session

echo "🔍 PRODUCTION SERVER DIAGNOSTICS"
echo "================================="

cd /opt/apps/Pema_BE
echo "📍 Current directory: $(pwd)"

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
    echo "Database Configuration:"
    grep -E "^POSTGRES_" .env 2>/dev/null || echo "No DB config found"
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
    echo ""
    echo "🎯 API IS HEALTHY - Ready for IDS booking test!"
    echo "Run: python3 production_booking_test.py"
else
    echo " API external health FAILED"
    echo ""
    echo "🔍 Troubleshooting steps:"
    echo "1. Check full logs: docker compose logs api"
    echo "2. Test database: docker compose exec api python -c 'import asyncpg'"
    echo "3. Check env vars: docker compose exec api env | grep -E '(IDS|POSTGRES)'"
fi
