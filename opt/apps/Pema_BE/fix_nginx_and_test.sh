#!/bin/bash
# Fix nginx configuration and test booking API

echo "🔧 FIXING NGINX CONFIGURATION AND TESTING BOOKING API"
echo "===================================================="

# Copy updated nginx.conf to server
echo "📤 Copying updated nginx.conf to server..."
scp nginx.conf root@82.25.104.195:/opt/apps/Pema_BE/nginx.conf

echo ""
echo "🔄 Restarting nginx container..."
ssh root@82.25.104.195 "cd /opt/apps/Pema_BE && docker compose restart nginx"

echo ""
echo "⏳ Waiting for nginx to restart..."
sleep 5

echo ""
echo "📊 Container Status:"
ssh root@82.25.104.195 "cd /opt/apps/Pema_BE && docker compose ps"

echo ""
echo "🏥 Testing API Health:"
ssh root@82.25.104.195 "curl -f --max-time 10 http://localhost:8080/health 2>/dev/null && echo ' API Health OK' || echo ' API Health FAILED'"

echo ""
echo "🎯 Testing External API Access:"
curl -f --max-time 10 https://dev.pemawellness.com/health && echo " External API OK" || echo " External API FAILED"

echo ""
echo "🚀 Testing Direct XML Booking API:"
cd /Users/kundanforpema/Desktop/Pema_BE
python3 test_direct_xml_booking_api.py

echo ""
echo "📋 If booking test succeeds, the integration is complete!"
echo "🎉 Frontend → API → Direct XML → IDS flow is working!"
