#!/bin/bash
# Production Diagnostic Script - Run this on your VPS
# ssh root@82.25.104.195 (password: 1pJ-5BSduxNKHQ-#C#-@)

echo "🔍 PEMA PRODUCTION DIAGNOSTICS"
echo "================================"

echo ""
echo "1️⃣ Checking for duplicate/conflicting containers:"
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep -i pema

echo ""
echo "2️⃣ Checking container resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{CPUPerc}}\t{{MemUsage}}\t{{MemPerc}}"

echo ""
echo "3️⃣ Finding Pema project directory:"
find /root -maxdepth 3 -name "docker-compose.yml" 2>/dev/null | grep -i pema

echo ""
echo "4️⃣ Checking current directory and git status:"
if [ -f "docker-compose.yml" ]; then
    echo "Found docker-compose.yml in $(pwd)"
    git status
    git log --oneline -3
else
    echo "Not in project directory - need to cd to correct location"
fi

echo ""
echo "5️⃣ Testing API container health directly (bypass nginx):"
docker exec pema-api curl -f http://localhost:8000/health 2>/dev/null || echo " API container not responding"

echo ""
echo "6️⃣ Testing estimate endpoint INSIDE container (bypass network):"
timeout 10s docker exec pema-api curl -s -X POST http://localhost:8000/api/v1/bookings/estimate \
  -H "Content-Type: application/json" \
  -d '{"room_pricing_category": "Premium Garden", "check_in_date": "2025-11-15", "check_out_date": "2025-11-18", "number_of_rooms": 1, "adults_total": 2, "children_total_under_4": 0, "children_total_5to12": 0, "teens_13to18": 0, "caregiver_required": false}' \
  | head -c 200 || echo " Estimate endpoint timed out or failed"

echo ""
echo "7️⃣ Checking recent API logs for errors:"
docker logs --tail 30 pema-api

echo ""
echo "8️⃣ Checking if code is up to date:"
if [ -f "docker-compose.yml" ]; then
    git fetch origin main
    BEHIND=$(git rev-list HEAD..origin/main --count)
    if [ "$BEHIND" -gt 0 ]; then
        echo "⚠️  Code is $BEHIND commits behind origin/main - need to pull!"
        git log HEAD..origin/main --oneline
    else
        echo " Code is up to date with origin/main"
    fi
fi

echo ""
echo "9️⃣ Checking container image build date:"
docker inspect pema-api | grep -A 5 "Created"

echo ""
echo "🔟 Checking network connectivity between containers:"
docker exec pema-nginx ping -c 2 api || echo " Cannot ping api from nginx"

echo ""
echo "================================"
echo " Diagnostics Complete"

