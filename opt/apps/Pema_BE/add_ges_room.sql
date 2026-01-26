DO $$
DECLARE
    room_id_val integer;
BEGIN
    -- Delete if exists to avoid duplicates/conflicts
    DELETE FROM pricing_bands WHERE room_id IN (SELECT id FROM rooms WHERE code = 'GES');
    DELETE FROM rooms WHERE code = 'GES';

    INSERT INTO rooms (
        name, code, category, pricing_category,
        description,
        occupancy_max_adults, occupancy_max_children, occupancy_max_total,
        price_per_night_single, price_per_night_double,
        inventory_count,
        is_active, maintenance_mode,
        refundable_full_payment_required
    ) VALUES (
        'Garden Executive Suite', 'GES', 'suite', 'Garden Executive Suite',
        'A premium executive suite with garden views.',
        2, 2, 4,
        13000000, 17700000,
        4,
        true, false,
        true
    ) RETURNING id INTO room_id_val;

    -- Insert pricing band for 8+ nights (Clinical rate)
    INSERT INTO pricing_bands (
        room_id, min_nights, max_nights, pricing_type,
        price_single, price_double, price_extra_adult, price_child,
        is_active, priority
    ) VALUES (
        room_id_val, 8, NULL, 'per_night',
        12400000, 16900000, 0, 0,
        true, 2
    );
    
    -- Insert pricing band for 3-7 nights (Wellness rate)
    INSERT INTO pricing_bands (
        room_id, min_nights, max_nights, pricing_type,
        price_single, price_double, price_extra_adult, price_child,
        is_active, priority
    ) VALUES (
        room_id_val, 3, 7, 'per_night',
        13000000, 17700000, 0, 0,
        true, 1
    );
END $$;

