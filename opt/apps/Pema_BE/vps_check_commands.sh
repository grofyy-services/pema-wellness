#!/bin/bash

# Simple commands to check room code status on VPS
# Run this script on your VPS after uploading it

echo "=== CHECKING ROOM CODE STATUS ON VPS ==="
echo ""

# Method 1: Use the SQL file if psql is installed
if command -v psql &> /dev/null; then
    echo "PostgreSQL client found. Running check..."
    psql -d pema_wellness -f /tmp/check_room_codes.sql
else
    echo " PostgreSQL client not found. Install with: apt install postgresql-client"
    echo ""
    echo "Alternative: Use this manual query in your database admin tool:"
    echo ""
    cat << 'EOF'
SELECT
    id,
    name,
    code,
    category,
    bed_configuration,
    CASE
        WHEN category = 'Executive' AND bed_configuration = 'Twin' THEN 'EXT'
        WHEN category = 'Executive' AND bed_configuration = 'Queen' THEN 'EXQ'
        WHEN category IN ('Executive Suite', 'Executive Junior Suite') AND bed_configuration = 'Super King' THEN 'SUI'
        WHEN category = 'Pema Suite' AND bed_configuration = 'Super King' THEN 'PES'
        WHEN category = 'Standard' AND bed_configuration = 'Twin' THEN 'STT'
        WHEN category = 'Standard' AND bed_configuration = 'Queen' THEN 'STQ'
        WHEN category = 'Premium Balcony' AND bed_configuration = 'Twin' THEN 'PBT'
        WHEN category = 'Premium Balcony' AND bed_configuration = 'Queen' THEN 'PBQ'
        WHEN category = 'Premium Garden' AND bed_configuration = 'Twin' THEN 'PGT'
        WHEN category = 'Elemental Villa' AND bed_configuration = 'Super King' THEN 'PEV'
        ELSE 'UNKNOWN'
    END as required_code,
    CASE
        WHEN code = (
            CASE
                WHEN category = 'Executive' AND bed_configuration = 'Twin' THEN 'EXT'
                WHEN category = 'Executive' AND bed_configuration = 'Queen' THEN 'EXQ'
                WHEN category IN ('Executive Suite', 'Executive Junior Suite') AND bed_configuration = 'Super King' THEN 'SUI'
                WHEN category = 'Pema Suite' AND bed_configuration = 'Super King' THEN 'PES'
                WHEN category = 'Standard' AND bed_configuration = 'Twin' THEN 'STT'
                WHEN category = 'Standard' AND bed_configuration = 'Queen' THEN 'STQ'
                WHEN category = 'Premium Balcony' AND bed_configuration = 'Twin' THEN 'PBT'
                WHEN category = 'Premium Balcony' AND bed_configuration = 'Queen' THEN 'PBQ'
                WHEN category = 'Premium Garden' AND bed_configuration = 'Twin' THEN 'PGT'
                WHEN category = 'Elemental Villa' AND bed_configuration = 'Super King' THEN 'PEV'
                ELSE 'UNKNOWN'
            END
        ) THEN 'CORRECT'
        ELSE ' NEEDS UPDATE'
    END as status
FROM rooms
WHERE is_active = true
ORDER BY id
LIMIT 20;
EOF
fi

echo ""
echo "=== INTERPRETING RESULTS ==="
echo "CORRECT = Room code is properly set for IDS integration"
echo " NEEDS UPDATE = Room code still needs to be fixed"
echo ""
echo "If you see mostly CORRECT, the room codes are fixed!"
echo "If you see  NEEDS UPDATE, run the fix commands next."
