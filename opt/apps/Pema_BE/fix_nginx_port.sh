#!/bin/bash
# Fix nginx port configuration

echo "🔧 FIXING NGINX PORT CONFIGURATION"
echo "==================================="

cd /opt/apps/Pema_BE

echo "📝 Adding NGINX_HTTP_PORT=8080 to .env file..."
echo "NGINX_HTTP_PORT=8080" >> .env

echo ""
echo "🔄 Restarting nginx container..."
docker compose restart nginx

echo ""
echo "⏳ Waiting for nginx to restart..."
sleep 5

echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "🏥 Testing API Health:"
curl -f --max-time 10 http://localhost:8080/health && echo " API Health OK" || echo " API Health FAILED"

echo ""
echo "🎯 Now test the booking API from local machine:"
echo "cd /Users/kundanforpema/Desktop/Pema_BE && python3 test_direct_xml_booking_api.py"
