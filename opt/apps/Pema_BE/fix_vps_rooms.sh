#!/bin/bash

# Script to fix room codes on VPS
# Usage: ./fix_vps_rooms.sh

VPS_IP="82.25.104.195"
VPS_USER="root"
DB_NAME="pema_wellness"  # Change this if your database name is different

echo "🔧 VPS Room Code Fix Script"
echo "============================"

echo "📤 Step 1: Uploading SQL files to VPS..."
scp fix_room_codes.sql check_room_codes.sql ${VPS_USER}@${VPS_IP}:/tmp/

if [ $? -ne 0 ]; then
    echo " Failed to upload files. Please check your connection and try again."
    exit 1
fi

echo "Files uploaded successfully"

echo ""
echo "🔍 Step 2: Checking current room code status..."
ssh ${VPS_USER}@${VPS_IP} "psql -d ${DB_NAME} -f /tmp/check_room_codes.sql"

echo ""
echo "🔧 Step 3: Applying room code fixes..."
ssh ${VPS_USER}@${VPS_IP} "psql -d ${DB_NAME} -f /tmp/fix_room_codes.sql"

echo ""
echo "Step 4: Verifying fixes..."
ssh ${VPS_USER}@${VPS_IP} "psql -d ${DB_NAME} -f /tmp/check_room_codes.sql"

echo ""
echo "🎉 Room code fix completed!"
echo "📝 Next steps:"
echo "   1. Configure IDS credentials in your .env file"
echo "   2. Test IDS connection: POST /api/v1/ids/test-connection"
echo "   3. Enable IDS integration"
