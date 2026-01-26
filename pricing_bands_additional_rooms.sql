-- ============================================
-- ADDITIONAL PRICING BANDS INSERT QUERIES
-- For Executive, Executive Junior Suite, Elemental Villa, Garden Executive Suite, and Pema Suite 8+ nights
-- ============================================

-- ============================================
-- EXECUTIVE ROOM (3-7 nights)
-- Room ID: 69 (Executive Room 101)
-- Pricing Category: Executive
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (69, NULL, 3, 7, 'per_night', 80000, 124000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE ROOM (8+ nights)
-- Room ID: 69 (Executive Room 101)
-- Pricing Category: Executive
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (69, NULL, 8, NULL, 'per_night', 80000, 124000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE JUNIOR SUITE (3-7 nights)
-- Room ID: 72 (Suite Room 401)
-- Pricing Category: Executive Junior Suite
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (72, NULL, 3, 7, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE JUNIOR SUITE (8+ nights)
-- Room ID: 72 (Suite Room 401)
-- Pricing Category: Executive Junior Suite
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (72, NULL, 8, NULL, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- ELEMENTAL VILLA (3-7 nights)
-- Room ID: 131
-- Pricing Category: Elemental Villa
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (131, NULL, 3, 7, 'per_night', 190000, 250000, 0, 0, true, NOW(), NOW());

-- ============================================
-- ELEMENTAL VILLA (8+ nights)
-- Room ID: 131
-- Pricing Category: Elemental Villa
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (131, NULL, 8, NULL, 'per_night', 190000, 250000, 0, 0, true, NOW(), NOW());

-- ============================================
-- GARDEN EXECUTIVE SUITE (3-7 nights)
-- Room ID: 129 (Garden Executive Suite)
-- Pricing Category: Garden Executive Suite
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (129, NULL, 3, 7, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- GARDEN EXECUTIVE SUITE (8+ nights)
-- Room ID: 129 (Garden Executive Suite)
-- Pricing Category: Garden Executive Suite
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (129, NULL, 8, NULL, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PEMA SUITE (8+ nights) - MISSING ROW
-- Room ID: 93
-- Pricing Category: Pema Suite
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (93, NULL, 8, NULL, 'per_night', 280000, 350000, 0, 0, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Verify the new pricing bands were inserted correctly
SELECT 
    pb.id,
    pb.room_id,
    r.name AS room_name,
    r.pricing_category,
    pb.min_nights,
    pb.max_nights,
    pb.price_single,
    pb.price_double,
    pb.is_active
FROM pricing_bands pb
JOIN rooms r ON pb.room_id = r.id
WHERE pb.room_id IN (69, 72, 93, 129, 131)
ORDER BY pb.room_id, pb.min_nights;

