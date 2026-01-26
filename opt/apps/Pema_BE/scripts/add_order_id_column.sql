-- Add missing order_id column to payments table
-- This column is required for PayU payment processing

ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);

-- Add index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Update existing payments to set order_id = reference_number if order_id is null
UPDATE payments SET order_id = reference_number WHERE order_id IS NULL AND reference_number IS NOT NULL;
