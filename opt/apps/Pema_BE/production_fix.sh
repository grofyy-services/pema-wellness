#!/bin/bash

echo "🔧 Production API Fix Script"
echo "============================="

# Check container status
echo "📊 Checking container status..."
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n🔄 Restarting containers..."
docker-compose down
docker-compose up -d

echo -e "\n⏳ Waiting for containers to start..."
sleep 10

echo -e "\n📊 Container status after restart:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n🩺 Testing health endpoint..."
curl -k --max-time 5 https://dev.pemawellness.com/health || echo " Health endpoint failed"

echo -e "\n🛏️  Testing room-types endpoint..."
curl -k --max-time 5 https://dev.pemawellness.com/api/v1/room-types | head -c 200 || echo " Room-types endpoint failed"

echo -e "\n📝 Checking API container logs..."
docker logs --tail 10 pema-api

echo -e "\n Fix script completed"
