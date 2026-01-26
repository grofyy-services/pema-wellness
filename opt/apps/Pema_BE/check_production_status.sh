#!/bin/bash
# Production Server Diagnostics Script
# Run this on the production VPS to diagnose the 502 Bad Gateway issue

echo "🔍 PRODUCTION SERVER DIAGNOSTICS"
echo "================================="

# Check docker containers
echo "📊 Docker Container Status:"
docker compose ps

echo ""
echo "📋 Container Logs (API):"
docker compose logs api --tail=20

echo ""
echo "📋 Container Logs (Nginx):"
docker compose logs nginx --tail=20

echo ""
echo "🌐 Network Status:"
echo "Checking API container connectivity..."
docker compose exec api curl -f http://localhost:8000/health 2>/dev/null && echo " API internal health OK" || echo " API internal health FAILED"

echo ""
echo "🔧 Recent Deployments:"
echo "Last 5 git commits:"
git log --oneline -5

echo ""
echo "📁 Current Directory & Permissions:"
pwd
ls -la

echo ""
echo "🔄 Restarting Services..."
docker compose restart

echo ""
echo "⏳ Waiting for services..."
sleep 10

echo "📊 Status after restart:"
docker compose ps

echo ""
echo "🏥 Final Health Check:"
curl -f http://localhost:8080/health 2>/dev/null && echo " API health OK" || echo " API health FAILED"

echo ""
echo "🎯 If API health fails, check:"
echo "1. Environment variables (.env file)"
echo "2. Database connectivity"
echo "3. IDS API credentials"
echo "4. Python dependencies"
