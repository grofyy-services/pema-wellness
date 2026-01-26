#!/bin/bash
echo "🔍 Emergency 502 Bad Gateway Diagnostic"
echo "======================================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "🐳 Container Status:"
docker compose ps
echo ""

echo "🌐 Network Status:"
docker network ls | grep pema
echo ""

echo "📡 Container IPs:"
echo "API IP:"
docker inspect pema-api 2>/dev/null | grep -A 5 "pema-network" | grep "IPAddress" | head -1 || echo "API IP not found"
echo "Nginx IP:"
docker inspect pema-nginx 2>/dev/null | grep -A 5 "pema-network" | grep "IPAddress" | head -1 || echo "Nginx IP not found"
echo ""

echo "🔗 Direct API Test from Host:"
curl -f --max-time 5 http://localhost:8080/api/health 2>/dev/null && echo " API reachable via nginx" || echo " API not reachable via nginx"
echo ""

echo "🏥 Direct API Test from Nginx Container:"
docker compose exec nginx curl -f --max-time 5 http://api:8000/health 2>/dev/null && echo " Nginx can reach API internally" || echo " Nginx cannot reach API internally"
echo ""

echo "📝 API Container Logs (Last 10 lines):"
docker compose logs api --tail=10
echo ""

echo "🌐 Nginx Container Logs (Last 10 lines):"
docker compose logs nginx --tail=10
echo ""

echo "⚙️ Nginx Configuration Test:"
docker compose exec nginx nginx -t 2>&1
echo ""

echo "🔧 Attempting Network Restart:"
echo "Stopping containers..."
docker compose down
echo "Removing network..."
docker network rm pema_be_pema-network 2>/dev/null || echo "Network removal failed or not found"
echo "Starting containers..."
docker compose up -d
echo "Waiting 15 seconds..."
sleep 15
echo ""

echo "🔄 Post-Restart Tests:"
echo "API health from nginx:"
docker compose exec nginx curl -f --max-time 5 http://api:8000/health 2>/dev/null && echo " API reachable after restart" || echo " API still unreachable"
echo ""

echo "External health check:"
curl -f --max-time 5 http://localhost:8080/health 2>/dev/null && echo " External health OK" || echo " External health failed"
echo ""

echo "🎯 Emergency Diagnostic Complete"
echo "==============================="
