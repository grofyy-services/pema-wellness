#!/bin/bash
# Test internal Docker network connectivity

echo "🔍 TESTING INTERNAL DOCKER CONNECTIVITY"
echo "======================================="

cd /opt/apps/Pema_BE

echo "📊 Container Status:"
docker compose ps

echo ""
echo "🔍 Testing API container internal health:"
docker compose exec -T api curl -f --max-time 5 http://localhost:8000/health 2>/dev/null && echo " API internal health OK" || echo " API internal health FAILED"

echo ""
echo "🔍 Testing nginx to API connectivity:"
docker compose exec -T nginx curl -f --max-time 5 http://pema-api:8000/health 2>/dev/null && echo " Nginx to API connectivity OK" || echo " Nginx to API connectivity FAILED"

echo ""
echo "🔍 Testing nginx to API with IP:"
# Get API container IP
API_IP=$(docker compose exec -T api hostname -i 2>/dev/null | tr -d '\n\r')
if [ ! -z "$API_IP" ]; then
    echo "API Container IP: $API_IP"
    docker compose exec -T nginx curl -f --max-time 5 http://$API_IP:8000/health 2>/dev/null && echo " Nginx to API via IP OK" || echo " Nginx to API via IP FAILED"
else
    echo " Could not get API container IP"
fi

echo ""
echo "🔍 DNS resolution test:"
docker compose exec -T nginx nslookup pema-api 2>/dev/null && echo " DNS resolution OK" || echo " DNS resolution FAILED"

echo ""
echo "🔍 Network inspection:"
docker network ls | grep pema
docker network inspect pema_be_pema-network 2>/dev/null | grep -A 10 '"Containers"' || echo " Could not inspect network"

echo ""
echo "🎯 DIAGNOSIS:"
echo "- If API internal health OK but nginx connectivity fails: DNS/network issue"
echo "- If DNS resolution fails: nginx upstream config issue"
echo "- If IP connectivity works but hostname fails: DNS resolution problem"
