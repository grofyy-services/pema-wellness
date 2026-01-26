-- Make booking_id nullable in payments table
-- This allows payments to be created before bookings

ALTER TABLE payments
ALTER COLUMN booking_id DROP NOT NULL;

-- Add comment to document the change
COMMENT ON COLUMN payments.booking_id IS 'Reference to booking (nullable for pre-booking payments)';
