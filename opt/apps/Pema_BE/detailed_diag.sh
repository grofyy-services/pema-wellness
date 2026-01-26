#!/bin/bash
echo "🔍 Detailed 502 Bad Gateway Diagnosis"
echo "====================================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "🐳 Container Status:"
docker compose ps
echo ""

echo "📝 Nginx Container Logs:"
docker compose logs nginx --tail=10
echo ""

echo "📝 API Container Logs:"
docker compose logs api --tail=10
echo ""

echo "🔗 Testing internal connectivity:"
echo "API health from host:"
curl -f http://localhost:8081/health 2>/dev/null && echo " Nginx responding on 8081" || echo " Nginx not responding on 8081"
echo ""

echo "API health from nginx container:"
docker compose exec nginx curl -f http://api:8000/health 2>/dev/null && echo " Nginx can reach API container" || echo " Nginx cannot reach API container"
echo ""

echo "API health from api container:"
docker compose exec api curl -f http://localhost:8000/health 2>/dev/null && echo " API container healthy internally" || echo " API container unhealthy internally"
echo ""

echo "🌐 Nginx Configuration Test:"
docker compose exec nginx nginx -t 2>&1
echo ""

echo "📡 Network inspection:"
echo "Docker networks:"
docker network ls | grep pema
echo ""
echo "Containers in pema-network:"
docker network inspect pema_be_pema-network 2>/dev/null | grep -A 10 -B 10 "Containers" || echo "Network inspection failed"
echo ""

echo "🔧 Environment check:"
echo "NGINX_HTTP_PORT value:"
docker compose exec nginx env | grep NGINX || echo "No NGINX env vars set"
echo ""

echo "🎯 Diagnosis Complete"
echo "==================="
