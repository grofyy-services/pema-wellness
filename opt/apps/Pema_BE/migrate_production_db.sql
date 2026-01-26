-- MIGRATE PRODUCTION DATABASE: room_availability table
-- Run these commands in pgAdmin on your production database

-- Step 1: Alter table structure
ALTER TABLE room_availability DROP COLUMN room_id;
ALTER TABLE room_availability ADD COLUMN room_code VARCHAR(50);

-- Step 2: Create mapping from room_id to room_code for existing data
-- (You'll need to check what room_id 75 corresponds to first)
-- Example: If room_id 75 is an Executive room, set room_code to 'EXT'

-- For your existing data (room_id = 75), set the appropriate room_code:
UPDATE room_availability
SET room_code = (
    CASE
        WHEN (SELECT category FROM rooms WHERE id = 75) = 'Executive' THEN 'EXT'
        WHEN (SELECT category FROM rooms WHERE id = 75) = 'Premium Balcony' THEN 'PBQ'
        WHEN (SELECT category FROM rooms WHERE id = 75) = 'Premium Garden' THEN 'PGT'
        WHEN (SELECT category FROM rooms WHERE id = 75) = 'Standard' THEN 'STD'
        WHEN (SELECT category FROM rooms WHERE id = 75) = 'Executive Suite' THEN 'SUI'
        ELSE 'EXT' -- default fallback
    END
)
WHERE room_code IS NULL;

-- Step 3: Verify the migration
SELECT
    id,
    room_code,
    date,
    available_count,
    source,
    created_at
FROM room_availability
ORDER BY created_at DESC
LIMIT 5;

-- Step 4: Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'room_availability'
ORDER BY ordinal_position;
