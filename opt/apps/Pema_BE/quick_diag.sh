#!/bin/bash
echo "🔍 502 Bad Gateway Diagnostics"
echo "=============================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "📁 Directory: $(pwd)"
echo "📋 Git Status:"
git status --porcelain
echo ""

echo "🐳 Docker Services:"
docker compose ps
echo ""

echo "📝 API Logs (Last 5 lines):"
docker compose logs api --tail=5
echo ""

echo "🌐 Nginx Logs (Last 5 lines):"
docker compose logs nginx --tail=5
echo ""

echo "🏥 Internal Health Check:"
docker compose exec api curl -f http://localhost:8000/health 2>/dev/null && echo " API responding" || echo " API not responding"
echo ""

echo "🔗 Nginx to API Check:"
docker compose exec nginx curl -f http://api:8000/health 2>/dev/null && echo " Nginx can reach API" || echo " Nginx cannot reach API"
echo ""

echo "⚙️ Nginx Config Test:"
docker compose exec nginx nginx -t 2>&1
echo ""
