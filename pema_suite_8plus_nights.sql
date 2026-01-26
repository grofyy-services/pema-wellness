-- ============================================
-- PEMA SUITE 8+ NIGHTS PRICING BAND
-- Room ID: 93
-- ============================================

-- Insert 8+ nights pricing band for Pema Suite
INSERT INTO pricing_bands (room_id, program_id, min_nights, max_nights, pricing_type, price_single, price_double, price_extra_adult, price_child, is_active, created_at, updated_at)
VALUES
    (93, NULL, 8, NULL, 'per_night', 280000, 350000, 0, 0, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify the insert
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
WHERE pb.room_id = 93
ORDER BY pb.min_nights;

