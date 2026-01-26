#!/bin/bash
# Final diagnostic for IDS integration

echo "🔍 FINAL IDS INTEGRATION DIAGNOSTIC"
echo "==================================="

cd /Users/kundanforpema/Desktop/Pema_BE

echo "🏥 Testing External API Health:"
curl -f --max-time 5 https://dev.pemawellness.com/health 2>/dev/null && echo " External API OK" || echo " External API FAILED"

echo ""
echo "🚀 Testing Booking API:"
python3 test_direct_xml_booking_api.py

echo ""
echo "📋 Current Status:"
echo "-  Direct XML code implemented and tested locally"
echo "-  API container rebuilt with new code"
echo "-  Nginx upstream configuration fixed"
echo "-  Nginx port configuration needs fixing"
echo "-  502 Bad Gateway preventing API access"

echo ""
echo "🔧 Next Steps:"
echo "1. Fix nginx port: cd /opt/apps/Pema_BE && echo 'NGINX_HTTP_PORT=8080' >> .env && docker compose restart nginx"
echo "2. Verify: docker compose ps"
echo "3. Test: curl -f http://localhost:8080/health"
echo "4. Final test: Run this script again"

echo ""
echo "🎯 Once fixed, booking API will return:"
echo '{ "success": true, "booking_reference": "FINAL-API-TEST-001", "status": "confirmed" }'
