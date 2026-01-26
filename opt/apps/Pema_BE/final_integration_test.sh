#!/bin/bash
# Final integration test after API container restart

echo "🎯 FINAL IDS INTEGRATION TEST"
echo "============================"

cd /Users/kundanforpema/Desktop/Pema_BE

echo "🏥 Testing API Health..."
if curl -f --max-time 5 https://dev.pemawellness.com/health &>/dev/null; then
    echo " API Health OK"
else
    echo " API Health FAILED"
    exit 1
fi

echo ""
echo "🚀 Testing Direct XML Booking API..."
python3 test_direct_xml_booking_api.py

echo ""
echo "📊 Test Results:"
echo "- If booking succeeds: 🎉 INTEGRATION COMPLETE!"
echo "- If still failing: Contact IDS for API whitelisting"
echo ""
echo "🎯 Integration Flow: Frontend → API → Direct XML → IDS → Success"
