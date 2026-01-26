-- Populate pricing_bands table with Pema Wellness pricing data
-- All amounts are in rupees (not paise) as specified
-- Updated to match actual room.pricing_category instead of room.category

-- Clear existing data
DELETE FROM pricing_bands;

-- Insert pricing bands for up to 7 nights (Wellness Track)
-- Standard Rooms (₹47,000 single, ₹83,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    47000, 83000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Standard';

-- Premium Balcony Rooms (₹60,000 single, ₹98,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    60000, 98000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Premium Balcony';

-- Premium Garden Rooms (₹64,000 single, ₹1,07,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    64000, 107000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Premium Garden';

-- Executive Rooms (₹84,000 single, ₹1,30,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    84000, 130000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Executive';

-- Executive Junior Suite Rooms (₹1,30,000 single, ₹1,77,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    130000, 177000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Executive Junior Suite';

-- Garden Executive Suite Rooms (₹1,20,000 single, ₹1,60,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    120000, 160000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Garden Executive Suite';

-- Pema Suite Rooms (₹2,90,000 single, ₹3,70,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    290000, 370000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Pema Suite';

-- Elemental Villa (₹2,00,000 single, ₹2,60,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 3, 7, 'wellness',
    200000, 260000, 0, 0,
    0, 0, 3,
    true, 1
FROM rooms r
WHERE r.pricing_category = 'Elemental Villa';

-- Insert pricing bands for 8+ nights (Clinical Track)
-- Standard Rooms (₹45,000 single, ₹79,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    45000, 79000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Standard';

-- Premium Balcony Rooms (₹57,000 single, ₹93,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    57000, 93000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Premium Balcony';

-- Premium Garden Rooms (₹61,000 single, ₹1,02,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    61000, 102000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Premium Garden';

-- Executive Rooms (₹80,000 single, ₹1,24,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    80000, 124000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Executive';

-- Executive Junior Suite Rooms (₹1,24,000 single, ₹1,69,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    124000, 169000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Executive Junior Suite';

-- Garden Executive Suite Rooms (₹1,25,000 single, ₹1,65,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    125000, 165000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Garden Executive Suite';

-- Pema Suite Rooms (₹2,80,000 single, ₹3,50,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    280000, 350000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Pema Suite';

-- Elemental Villa (₹1,90,000 single, ₹2,50,000 double)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    is_active, priority
)
SELECT
    NULL, r.id, 8, NULL, 'clinical',
    190000, 250000, 0, 0,
    0, 0, 3,
    true, 2
FROM rooms r
WHERE r.pricing_category = 'Elemental Villa';

-- Add caregiver pricing bands
-- Caregiver sharing guest room: ₹8,000 per night
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'caregiver',
    8000, 8000, 0, 0,
    0, 0, 3,
    'Sharing Guest Room', true, 3
FROM rooms r;

-- Caregiver separate Standard room: ₹20,000 per night
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'caregiver',
    20000, 20000, 0, 0,
    0, 0, 3,
    'Separate Standard Room', true, 3
FROM rooms r
WHERE r.pricing_category = 'Standard';

-- Caregiver separate Premium Balcony room: ₹25,000 per night
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'caregiver',
    25000, 25000, 0, 0,
    0, 0, 3,
    'Separate Premium Balcony Room', true, 3
FROM rooms r
WHERE r.pricing_category = 'Premium Balcony';

-- Caregiver separate Premium Garden room: ₹28,000 per night
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'caregiver',
    28000, 28000, 0, 0,
    0, 0, 3,
    'Separate Premium Garden Room', true, 3
FROM rooms r
WHERE r.pricing_category = 'Premium Garden';

-- Caregiver in Executive/Suite rooms: Complimentary (₹0)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'caregiver',
    0, 0, 0, 0,
    0, 0, 3,
    'Complimentary in Executive/Suite', true, 3
FROM rooms r
WHERE r.pricing_category IN ('Executive', 'Executive Junior Suite', 'Garden Executive Suite', 'Pema Suite', 'Elemental Villa');

-- Add children pricing bands
-- Children under 4: Complimentary (₹0)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'children_under_4',
    0, 0, 0, 0,
    0, 0, 3,
    'Under 4 Years - Complimentary', true, 4
FROM rooms r;

-- Children 5-12: ₹7,000 per day for meals (stored as per night equivalent)
INSERT INTO pricing_bands (
    program_id, room_id, min_nights, max_nights, pricing_type,
    price_single, price_double, price_extra_adult, price_child,
    discount_percentage, early_bird_discount, minimum_advance_booking_days,
    season_name, is_active, priority
)
SELECT
    NULL, r.id, 3, NULL, 'children_5_12',
    7000, 7000, 0, 7000,
    0, 0, 3,
    '5-12 Years - Meals Only', true, 4
FROM rooms r;

-- Children 13-18: Adult program rates (already covered in main pricing above)
-- Teens follow adult program rates, so no separate band needed
