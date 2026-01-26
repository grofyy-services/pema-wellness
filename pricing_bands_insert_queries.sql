-- ============================================
-- PRICING BANDS INSERT QUERIES
-- Using specific room IDs provided
-- ============================================

-- ============================================
-- STANDARD ROOMS (3-7 nights)
-- Room IDs: 70, 80, 81
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (70, NULL, 3, 7, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW()),
    (80, NULL, 3, 7, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW()),
    (81, NULL, 3, 7, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW());

-- ============================================
-- STANDARD ROOMS (8+ nights)
-- Room IDs: 70, 80, 81
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (70, NULL, 8, NULL, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW()),
    (80, NULL, 8, NULL, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW()),
    (81, NULL, 8, NULL, 'per_night', 45000, 79000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PREMIUM BALCONY ROOMS (3-7 nights)
-- Room IDs: 77, 78
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (77, NULL, 3, 7, 'per_night', 57000, 93000, 0, 0, true, NOW(), NOW()),
    (78, NULL, 3, 7, 'per_night', 57000, 93000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PREMIUM BALCONY ROOMS (8+ nights)
-- Room IDs: 77, 78
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (77, NULL, 8, NULL, 'per_night', 57000, 93000, 0, 0, true, NOW(), NOW()),
    (78, NULL, 8, NULL, 'per_night', 57000, 93000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PREMIUM GARDEN ROOMS (3-7 nights)
-- Room IDs: 71, 75, 76, 79
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (71, NULL, 3, 7, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (75, NULL, 3, 7, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (76, NULL, 3, 7, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (79, NULL, 3, 7, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PREMIUM GARDEN ROOMS (8+ nights)
-- Room IDs: 71, 75, 76, 79
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (71, NULL, 8, NULL, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (75, NULL, 8, NULL, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (76, NULL, 8, NULL, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW()),
    (79, NULL, 8, NULL, 'per_night', 61000, 102000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PEMA SUITE (3-7 nights)
-- Room ID: 93
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (93, NULL, 3, 7, 'per_night', 280000, 350000, 0, 0, true, NOW(), NOW());

-- ============================================
-- PEMA SUITE (8+ nights)
-- Room ID: 93
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (93, NULL, 8, NULL, 'per_night', 280000, 350000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE ROOM (3-7 nights)
-- Room ID: 69 (Executive Room 101)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (69, NULL, 3, 7, 'per_night', 80000, 124000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE ROOM (8+ nights)
-- Room ID: 69 (Executive Room 101)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (69, NULL, 8, NULL, 'per_night', 80000, 124000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE JUNIOR SUITE (3-7 nights)
-- Room ID: 72 (Suite Room 401)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (72, NULL, 3, 7, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- EXECUTIVE JUNIOR SUITE (8+ nights)
-- Room ID: 72 (Suite Room 401)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (72, NULL, 8, NULL, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- ELEMENTAL VILLA (3-7 nights)
-- Room ID: 131
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (131, NULL, 3, 7, 'per_night', 190000, 250000, 0, 0, true, NOW(), NOW());

-- ============================================
-- ELEMENTAL VILLA (8+ nights)
-- Room ID: 131
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (131, NULL, 8, NULL, 'per_night', 190000, 250000, 0, 0, true, NOW(), NOW());

-- ============================================
-- GARDEN EXECUTIVE SUITE (3-7 nights)
-- Room ID: 129 (Garden Executive Suite)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (129, NULL, 3, 7, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- GARDEN EXECUTIVE SUITE (8+ nights)
-- Room ID: 129 (Garden Executive Suite)
-- ============================================
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (129, NULL, 8, NULL, 'per_night', 124000, 169000, 0, 0, true, NOW(), NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify all pricing bands were inserted correctly
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
ORDER BY r.pricing_category, pb.min_nights, pb.room_id;

-- Count pricing bands by category
SELECT 
    r.pricing_category,
    COUNT(*) AS total_bands,
    COUNT(CASE WHEN pb.min_nights = 3 AND pb.max_nights = 7 THEN 1 END) AS bands_3_7_nights,
    COUNT(CASE WHEN pb.min_nights = 8 AND pb.max_nights IS NULL THEN 1 END) AS bands_8_plus_nights
FROM pricing_bands pb
JOIN rooms r ON pb.room_id = r.id
GROUP BY r.pricing_category
ORDER BY r.pricing_category;

