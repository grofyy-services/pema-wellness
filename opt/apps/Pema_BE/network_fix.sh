#!/bin/bash
echo "🔧 Deploying Network Fix for 502 Bad Gateway"
echo "==========================================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "📥 Pulling latest changes..."
git pull origin main
echo ""

echo "🐳 Stopping all containers..."
docker compose down
echo ""

echo "🔄 Removing old networks..."
docker network rm pema_be_pema-network 2>/dev/null || echo "Network not found or already removed"
echo ""

echo "🐳 Rebuilding and restarting with fresh network..."
docker compose up -d --build --remove-orphans
echo ""

echo "⏳ Waiting for services to start..."
sleep 15
echo ""

echo "🌐 Checking network connectivity..."
echo "Containers in network:"
docker network inspect pema_be_pema-network 2>/dev/null | grep -A 10 -B 2 "Containers" || echo "Network inspection failed"
echo ""

echo "🏥 Testing internal connectivity:"
docker compose exec nginx ping -c 3 api 2>/dev/null && echo " Nginx can ping API" || echo " Nginx cannot ping API"
echo ""

echo "🔗 Testing API reachability from nginx:"
docker compose exec nginx curl -f --max-time 5 http://api:8000/health 2>/dev/null && echo " Nginx can reach API health" || echo " Nginx cannot reach API health"
echo ""

echo "📝 Checking container IPs:"
docker inspect pema-api --format {{.NetworkSettings.Networks.pema_be_pema-network.IPAddress}} 2>/dev/null || echo "Cannot get API IP"
docker inspect pema-nginx --format {{.NetworkSettings.Networks.pema_be_pema-network.IPAddress}} 2>/dev/null || echo "Cannot get Nginx IP"
echo ""

echo "🌐 Testing external access:"
curl -I --max-time 5 http://localhost:8080/health 2>/dev/null | head -1 || echo " External access failed"
echo ""

echo "🎯 Network Fix Complete"
echo "====================="
echo "If issues persist, the containers may need manual network recreation"
