-- ROOM CODE FIX QUERIES FOR PGADMIN
-- Run these UPDATE statements if the check query shows "NEEDS UPDATE"

-- Executive rooms
UPDATE rooms SET code = 'EXT' WHERE category = 'Executive' AND bed_configuration = 'Twin';
UPDATE rooms SET code = 'EXQ' WHERE category = 'Executive' AND bed_configuration = 'Queen';

-- Executive Suite rooms
UPDATE rooms SET code = 'SUI' WHERE category IN ('Executive Suite', 'Executive Junior Suite') AND bed_configuration = 'Super King';

-- Pema Suite rooms
UPDATE rooms SET code = 'PES' WHERE category = 'Pema Suite' AND bed_configuration = 'Super King';

-- Standard rooms
UPDATE rooms SET code = 'STT' WHERE category = 'Standard' AND bed_configuration = 'Twin';
UPDATE rooms SET code = 'STQ' WHERE category = 'Standard' AND bed_configuration = 'Queen';

-- Premium Balcony rooms
UPDATE rooms SET code = 'PBT' WHERE category = 'Premium Balcony' AND bed_configuration = 'Twin';
UPDATE rooms SET code = 'PBQ' WHERE category = 'Premium Balcony' AND bed_configuration = 'Queen';

-- Premium Garden rooms
UPDATE rooms SET code = 'PGT' WHERE category = 'Premium Garden' AND bed_configuration = 'Twin';

-- Elemental Villa rooms
UPDATE rooms SET code = 'PEV' WHERE category = 'Elemental Villa' AND bed_configuration = 'Super King';
