#!/bin/bash
# Force rebuild API container to load new code

echo "🔨 FORCING API CONTAINER REBUILD"
echo "==============================="

cd /opt/apps/Pema_BE

echo "🛑 Stopping all containers..."
docker compose down

echo ""
echo "🗑️ Removing API container and image..."
docker compose rm -f api
docker rmi pema_be-api 2>/dev/null || echo "API image not found or in use"

echo ""
echo "🔨 Rebuilding API container..."
docker compose build --no-cache api

echo ""
echo "🚀 Starting all containers..."
docker compose up -d

echo ""
echo "⏳ Waiting for containers to start..."
sleep 15

echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "🏥 Testing API Health:"
curl -f --max-time 10 http://localhost:8080/health && echo " API Health OK" || echo " API Health FAILED"

echo ""
echo "🎯 Now test the booking API from local machine:"
echo "cd /Users/kundanforpema/Desktop/Pema_BE && python3 test_direct_xml_booking_api.py"
