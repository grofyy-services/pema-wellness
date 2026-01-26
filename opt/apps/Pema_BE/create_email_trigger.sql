-- Create a function to handle booking confirmation notifications
CREATE OR REPLACE FUNCTION notify_booking_confirmation() RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger for bookings that are confirmed
    IF (TG_OP = 'INSERT' AND NEW.status = 'confirmed') OR 
       (TG_OP = 'UPDATE' AND NEW.status = 'confirmed' AND OLD.status != 'confirmed') THEN
        
        -- Send notification to application with booking details
        PERFORM pg_notify('booking_confirmed', 
            json_build_object(
                'booking_id', NEW.id,
                'confirmation_number', NEW.confirmation_number,
                'guest_email', NEW.guest_email,
                'guest_name', COALESCE(NEW.guest_first_name || ' ', '') || COALESCE(NEW.guest_last_name, ''),
                'total_amount', NEW.total_amount,
                'deposit_amount', NEW.deposit_amount,
                'check_in_date', NEW.check_in_date,
                'check_out_date', NEW.check_out_date,
                'room_id', NEW.room_id,
                'operation', TG_OP
            )::text
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS booking_confirmation_trigger ON bookings;
CREATE TRIGGER booking_confirmation_trigger
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION notify_booking_confirmation();

-- Test the trigger (optional - for verification)
-- INSERT INTO bookings (status, confirmation_number, guest_email) 
-- VALUES ('confirmed', 'TEST123', 'test@example.com');
