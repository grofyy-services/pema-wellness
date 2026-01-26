#!/bin/bash
echo "🚀 Deploying Swagger Fix for 502 Bad Gateway"
echo "============================================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "📥 Pulling latest changes..."
git pull origin main
echo ""

echo "🐳 Rebuilding and restarting containers..."
docker compose down
docker compose up -d --build
echo ""

echo "⏳ Waiting for services to start..."
sleep 10
echo ""

echo "🔍 Checking service status..."
docker compose ps
echo ""

echo "🏥 Testing API health..."
curl -f https://dev.pemawellness.com/health && echo " API Health OK" || echo " API Health Failed"
echo ""

echo "📖 Testing Swagger endpoint..."
curl -I https://dev.pemawellness.com/swagger/ 2>/dev/null | head -1
echo ""

echo "📝 Checking logs..."
echo "API Logs (Last 5 lines):"
docker compose logs api --tail=5
echo ""
echo "Swagger UI Logs (Last 5 lines):"
docker compose logs swagger-ui --tail=5
echo ""

echo "🎯 Deployment Complete!"
echo "======================"
echo "Test: https://dev.pemawellness.com/swagger/"
echo "Test: https://dev.pemawellness.com/health"
echo "Test: https://dev.pemawellness.com/api/v1/ids/status"
