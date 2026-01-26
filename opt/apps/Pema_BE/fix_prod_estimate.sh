#!/bin/bash
# Production Fix Script - Run this on your VPS after diagnostics
# ssh root@82.25.104.195 (password: 1pJ-5BSduxNKHQ-#C#-@)

echo "🔧 PEMA PRODUCTION FIX"
echo "====================="

# Find project directory
PROJECT_DIR=$(find /root -maxdepth 3 -name "docker-compose.yml" -path "*/Pema_BE/*" 2>/dev/null | head -1 | xargs dirname)

if [ -z "$PROJECT_DIR" ]; then
    echo " Could not find Pema_BE project directory"
    echo "Please run this from your project directory or update PROJECT_DIR variable"
    exit 1
fi

cd "$PROJECT_DIR"
echo "📁 Working directory: $(pwd)"

echo ""
echo "1️⃣ Stopping all containers to avoid conflicts:"
docker-compose down

echo ""
echo "2️⃣ Checking for orphaned/duplicate containers:"
ORPHANS=$(docker ps -a | grep -i pema | awk '{print $1}')
if [ ! -z "$ORPHANS" ]; then
    echo "⚠️  Found orphaned containers, removing:"
    echo "$ORPHANS" | xargs docker rm -f
else
    echo " No orphaned containers"
fi

echo ""
echo "3️⃣ Pulling latest code:"
git fetch origin main
git pull origin main

echo ""
echo "4️⃣ Rebuilding API container with latest code:"
docker-compose build --no-cache api

echo ""
echo "5️⃣ Starting containers:"
docker-compose up -d

echo ""
echo "6️⃣ Waiting for containers to be healthy (30 seconds):"
sleep 30

echo ""
echo "7️⃣ Checking container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "8️⃣ Testing health endpoint:"
curl -k --max-time 5 https://dev.pemawellness.com/health

echo ""
echo "9️⃣ Testing estimate endpoint (with timeout):"
timeout 10s curl -k -X POST https://dev.pemawellness.com/api/v1/bookings/estimate \
  -H "Content-Type: application/json" \
  -d '{"room_pricing_category": "Premium Garden", "check_in_date": "2025-11-15", "check_out_date": "2025-11-18", "number_of_rooms": 1, "adults_total": 2, "children_total_under_4": 0, "children_total_5to12": 0, "teens_13to18": 0, "caregiver_required": false}' \
  | python3 -m json.tool || echo " Request failed or timed out"

echo ""
echo "🔟 Checking logs for estimate requests:"
docker logs --tail 50 pema-api | grep -E "(estimate|pricing|timeout)" | tail -20

echo ""
echo "====================="
echo " Fix Complete"

