#!/bin/bash
echo "🔍 Production Server Diagnostics - 502 Bad Gateway"
echo "=================================================="
echo ""

# Check current directory
echo "📁 Current Directory: $(pwd)"
echo ""

# Check git status
echo "📋 Git Status:"
git status --porcelain
echo ""

# Check docker services
echo "🐳 Docker Services Status:"
docker compose ps
echo ""

# Check container logs
echo "📝 API Container Logs (Last 10 lines):"
docker compose logs api --tail=10
echo ""

# Check nginx logs
echo "🌐 Nginx Container Logs (Last 10 lines):"
docker compose logs nginx --tail=10
echo ""

# Test internal API health
echo "🏥 Internal API Health Check:"
docker compose exec api curl -f http://localhost:8000/health 2>/dev/null || echo " Internal API not responding"
echo ""

# Check nginx configuration
echo "⚙️ Nginx Configuration Test:"
docker compose exec nginx nginx -t 2>&1
echo ""

# Check container networking
echo "🔗 Container Networking:"
docker compose exec nginx curl -f http://api:8000/health 2>/dev/null || echo " Cannot reach api container from nginx"
echo ""

# Check environment variables
echo "🔑 IDS Configuration Check:"
docker compose exec api env | grep -E "(IDS_|API_)" | head -5
echo ""

echo "🎯 Diagnostics Complete"
echo "======================"
