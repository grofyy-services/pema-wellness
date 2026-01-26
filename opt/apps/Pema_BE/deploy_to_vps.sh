#!/bin/bash
# Deploy code directly to VPS without git
# Run this from your LOCAL machine in the Pema_BE directory

VPS_HOST="root@82.25.104.195"
VPS_DIR="/root/Pema_BE"
SSH_KEY="~/.ssh/pema_ci"

echo "🚀 Deploying Pema BE to VPS"
echo "============================"

# Files to sync (exclude unnecessary files)
echo "📦 Syncing code to VPS..."
rsync -avz --checksum --progress \
  -e "ssh -i $SSH_KEY" \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='.pytest_cache' \
  --exclude='*.log' \
  --exclude='.env.local' \
  --exclude='venv' \
  --exclude='node_modules' \
  --exclude='*.xml' \
  --exclude='*.xlsx' \
  --exclude='backups/' \
  ./.env \
  ./app \
  ./requirements.txt \
  ./docker-compose.yml \
  ./Dockerfile \
  ./nginx.conf \
  ./scripts/ \
  $VPS_HOST:$VPS_DIR/

echo ""
echo " Code synced successfully!"
echo ""
echo "🔄 Rebuilding containers on VPS..."

# SSH into VPS and rebuild
ssh -i $SSH_KEY $VPS_HOST << 'ENDSSH'
cd /root/Pema_BE

echo "Ensuring all services are running before database operations..."
docker compose up -d

set +e # Continue executing script even if a command fails

echo "Applying necessary database migrations..."
# This makes the booking_id in the payments table optional.
docker compose exec -T db psql -U pema_user -d pema_wellness -c "ALTER TABLE payments ALTER COLUMN booking_id DROP NOT NULL;"
echo "Migration to make booking_id nullable attempted."

set -e # Exit script immediately if a command fails from here on

echo "Rebuilding and restarting the API container..."
docker compose build --no-cache api
docker compose up -d --no-deps api

echo "Waiting for services to start..."
sleep 15

echo "Current container status:"
docker compose ps

echo ""
echo "🔄 Restarting all containers to ensure latest code is loaded..."
docker compose restart

echo "Waiting for services to restart..."
sleep 10

echo "Final container status:"
docker compose ps

echo ""
echo "Verifying payment endpoint..."
# Test the new payment endpoint directly. We expect a 200 OK or a 422, but NOT an error for a missing booking_id.
TEST_RESPONSE=$(timeout 10s docker compose exec -T api curl -s -o /dev/stderr -w "%{http_code}" -X POST http://localhost:8000/api/v1/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "payment_type": "deposit", "guest_email": "test@test.com"}')

if [[ "$TEST_RESPONSE" == "422" || "$TEST_RESPONSE" == "200" ]]; then
    echo " Verification successful! API is responding correctly (Status: $TEST_RESPONSE)."
else
    echo " Verification FAILED! API returned status $TEST_RESPONSE."
fi

echo ""
echo "Checking logs:"
docker compose logs --tail 30 api

ENDSSH

echo ""
echo "============================"
echo " Deployment complete!"

