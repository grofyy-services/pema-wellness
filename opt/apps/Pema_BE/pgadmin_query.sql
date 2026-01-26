-- ROOM CODE CHECK QUERY FOR PGADMIN
-- Copy and paste this entire query into pgAdmin

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
