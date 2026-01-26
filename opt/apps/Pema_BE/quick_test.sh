#!/bin/bash
echo "🔍 Quick Network Connectivity Test"
echo "=================================="
echo ""

cd /opt/apps/Pema_BE || exit 1

echo "🐳 Container Status:"
docker compose ps
echo ""

echo "🌐 Network Inspection:"
docker network inspect pema_be_pema-network 2>/dev/null | jq .Containers