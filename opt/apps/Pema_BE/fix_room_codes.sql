-- FIX ROOM CODES FOR IDS INTEGRATION
-- Update room codes from room numbers to IDS codes based on category + bed type

-- Executive Twin rooms → EXT
UPDATE rooms SET code = 'EXT' WHERE id IN (3, 9, 10);

-- Executive Queen rooms → EXQ
UPDATE rooms SET code = 'EXQ' WHERE id IN (4, 5, 6, 7, 8, 11, 13, 14);

-- Executive Suite Super King rooms → SUI
UPDATE rooms SET code = 'SUI' WHERE id IN (12, 15);

-- Pema Suite Super King rooms → PES
UPDATE rooms SET code = 'PES' WHERE category = 'Pema Suite';

-- Standard Twin rooms → STT
UPDATE rooms SET code = 'STT' WHERE category = 'Standard' AND bed_configuration = 'Twin';

-- Standard Queen rooms → STQ
UPDATE rooms SET code = 'STQ' WHERE category = 'Standard' AND bed_configuration = 'Queen';

-- Premium Balcony Twin rooms → PBT
UPDATE rooms SET code = 'PBT' WHERE category = 'Premium Balcony' AND bed_configuration = 'Twin';

-- Premium Balcony Queen rooms → PBQ
UPDATE rooms SET code = 'PBQ' WHERE category = 'Premium Balcony' AND bed_configuration = 'Queen';

-- Premium Garden Twin rooms → PGT
UPDATE rooms SET code = 'PGT' WHERE category = 'Premium Garden' AND bed_configuration = 'Twin';

-- Elemental Villa Super King rooms → PEV
UPDATE rooms SET code = 'PEV' WHERE category = 'Elemental Villa' AND bed_configuration = 'Super King';

-- Verification query
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
    END as expected_code,
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
ORDER BY id;
