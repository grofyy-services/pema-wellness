#!/bin/bash
# Apply database trigger for booking confirmation emails

VPS_HOST="root@82.25.104.195"
VPS_DIR="/root/Pema_BE"
SSH_KEY="~/.ssh/pema_ci"

echo "🚀 Applying database trigger for booking confirmation emails"
echo "=========================================================="

# Copy the trigger SQL file to VPS
scp -i $SSH_KEY create_email_trigger.sql $VPS_HOST:$VPS_DIR/

# Apply the trigger to the database
ssh -i $SSH_KEY $VPS_HOST << 'ENDSSH'
cd /root/Pema_BE

echo "Applying database trigger..."
docker compose exec -T db psql -U pema_user -d pema_wellness -f create_email_trigger.sql

echo ""
echo "Trigger applied successfully!"
echo "The database will now notify the application whenever a booking status becomes 'confirmed'"

ENDSSH

echo ""
echo "=========================================================="
echo "✅ Database trigger deployment complete!"
