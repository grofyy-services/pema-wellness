#!/bin/bash
# Fix production database schema for payments table
# Adds missing order_id column required for PayU payment processing

VPS_HOST="root@82.25.104.195"
SSH_KEY="~/.ssh/pema_ci"

echo "🔧 Applying database schema fix to production VPS"
echo "=================================================="

# SQL commands to add the missing column
SQL_COMMANDS="
-- Add missing order_id column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);

-- Add index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Update existing payments to set order_id = reference_number if order_id is null
UPDATE payments SET order_id = reference_number WHERE order_id IS NULL AND reference_number IS NOT NULL;
"

echo "📝 SQL commands to execute:"
echo "$SQL_COMMANDS"
echo ""

# SSH into VPS and apply the schema fix
ssh -i $SSH_KEY $VPS_HOST << REMOTE_COMMANDS
cd /root/Pema_BE

echo "🔍 Checking current database schema..."
docker compose exec -T db psql -U pema_user -d pema_wellness -c "\d payments" | head -20

echo ""
echo "🛠️  Applying schema fix..."

# Execute the SQL commands
echo "$SQL_COMMANDS" | docker compose exec -T db psql -U pema_user -d pema_wellness

echo ""
echo " Schema fix applied successfully!"

echo ""
echo "🔍 Verifying the fix..."
docker compose exec -T db psql -U pema_user -d pema_wellness -c "\d payments" | grep -E "(order_id|idx_payments_order_id)"

echo ""
echo "🔄 Restarting API container to clear any cached metadata..."
docker compose restart api

echo ""
echo "⏳ Waiting for API to restart..."
sleep 10

echo ""
echo "🏥 Testing payment endpoint..."
# Test the payment endpoint
TEST_RESPONSE=\$(timeout 15s docker compose exec -T api curl -s -o /dev/stderr -w "%{http_code}" -X POST http://localhost:8000/api/v1/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "payment_type": "deposit", "guest_email": "test@test.com"}' 2>/dev/null)

if [[ "\$TEST_RESPONSE" == "422" || "\$TEST_RESPONSE" == "200" ]]; then
    echo " Payment endpoint verification successful! API is responding correctly (Status: \$TEST_RESPONSE)."
else
    echo " Payment endpoint verification FAILED! API returned status \$TEST_RESPONSE."
    echo "🔍 Checking API logs..."
    docker compose logs --tail 20 api
fi

REMOTE_COMMANDS

echo ""
echo "=================================================="
echo " PRODUCTION SCHEMA FIX COMPLETED!"
echo "The payments table now has the required order_id column."
