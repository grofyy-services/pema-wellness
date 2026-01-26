-- Pema Wellness Database Schema
-- Complete DDL for all tables

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'staff', 'doctor', 'admin')),
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    
    -- Profile details
    date_of_birth TIMESTAMP,
    gender VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    medical_conditions TEXT,
    dietary_restrictions TEXT,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Preferences
    communication_preferences JSONB,
    marketing_consent BOOLEAN DEFAULT false NOT NULL,
    
    -- OAuth
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. Programs table
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pricing_category VARCHAR(100),
    program_type VARCHAR(20) NOT NULL CHECK (program_type IN ('medical', 'wellness', 'lite')),
    category VARCHAR(100),
    
    -- Duration
    duration_days_min INTEGER DEFAULT 3 NOT NULL,
    duration_days_max INTEGER,
    
    -- Pricing
    price_base INTEGER, -- in paise
    min_age INTEGER,
    max_age INTEGER,
    
    -- Audit
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('suite', 'premium', 'deluxe', 'standard')),
    description TEXT,
    pricing_category VARCHAR(100),
    
    -- Occupancy
    occupancy_max_adults INTEGER DEFAULT 2 NOT NULL,
    occupancy_max_children INTEGER DEFAULT 2 NOT NULL,
    occupancy_max_total INTEGER DEFAULT 4 NOT NULL,
    
    -- Pricing (per night in paise)
    price_per_night_single INTEGER NOT NULL,
    price_per_night_double INTEGER NOT NULL,
    price_per_night_extra_adult INTEGER DEFAULT 0 NOT NULL,
    price_per_night_child INTEGER DEFAULT 0 NOT NULL,
    
    -- Inventory
    inventory_count INTEGER DEFAULT 1 NOT NULL,
    
    -- Payment policy
    refundable_full_payment_required BOOLEAN DEFAULT false NOT NULL,
    deposit_amount INTEGER,
    
    -- Features
    amenities JSONB,
    features JSONB,
    
    -- Media
    featured_image VARCHAR(500),
    gallery_images JSONB,
    floor_plan_image VARCHAR(500),
    
    -- Specifications
    bed_configuration VARCHAR(100),
    room_size_sqft INTEGER,
    max_extra_beds INTEGER DEFAULT 2 NOT NULL,
    
    -- Accessibility
    medical_equipment_compatible BOOLEAN DEFAULT true NOT NULL,
    wheelchair_accessible BOOLEAN DEFAULT false NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    maintenance_mode BOOLEAN DEFAULT false NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Pricing bands table
CREATE TABLE pricing_bands (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    room_id INTEGER REFERENCES rooms(id),
    
    -- Duration range
    min_nights INTEGER NOT NULL,
    max_nights INTEGER,
    
    -- Pricing
    pricing_type VARCHAR(20) DEFAULT 'per_night' NOT NULL CHECK (pricing_type IN ('per_night', 'per_package')),
    price_single INTEGER NOT NULL, -- in paise
    price_double INTEGER NOT NULL, -- in paise
    price_extra_adult INTEGER DEFAULT 0 NOT NULL,
    price_child INTEGER DEFAULT 0 NOT NULL,
    
    -- Package pricing
    package_price_single INTEGER,
    package_price_double INTEGER,
    
    -- Modifiers
    discount_percentage INTEGER DEFAULT 0 NOT NULL,
    early_bird_discount INTEGER DEFAULT 0 NOT NULL,
    
    -- Seasonal
    season_name VARCHAR(50),
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Business rules
    minimum_advance_booking_days INTEGER DEFAULT 0 NOT NULL,
    maximum_advance_booking_days INTEGER,
    
    -- Meta
    notes TEXT,
    internal_notes TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    priority INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    program_id INTEGER REFERENCES programs(id),
    room_id INTEGER REFERENCES rooms(id) NOT NULL,
    
    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INTEGER NOT NULL,
    
    -- Occupancy
    occupancy_details JSONB NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'initiated' NOT NULL 
        CHECK (status IN ('initiated', 'pending_medical', 'doctor_approved', 'confirmed', 'on_hold', 'not_suitable', 'cancelled', 'checked_in', 'completed')),
    
    -- Pricing
    total_amount INTEGER NOT NULL, -- in paise
    deposit_amount INTEGER NOT NULL,
    paid_amount INTEGER DEFAULT 0 NOT NULL,
    balance_amount INTEGER NOT NULL,
    
    -- Business rules
    minimum_stay_enforced BOOLEAN DEFAULT true NOT NULL,
    full_payment_required BOOLEAN DEFAULT false NOT NULL,
    
    -- Details
    special_requests TEXT,
    internal_notes TEXT,
    guest_notes TEXT,

    -- Guest contact (guest checkout without login)
    guest_first_name VARCHAR(100),
    guest_last_name VARCHAR(100),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_country VARCHAR(100),
    number_of_rooms INTEGER DEFAULT 1 NOT NULL,

    -- Caregiver/transfer options
    caregiver_required BOOLEAN DEFAULT false NOT NULL,
    caregiver_stay_with_guest BOOLEAN DEFAULT false NOT NULL,
    caregiver_meal VARCHAR(50), -- simple | restaurant_dining
    private_transfer BOOLEAN DEFAULT false NOT NULL,
    
    -- Confirmation
    confirmation_number VARCHAR(20) UNIQUE,
    invoice_id VARCHAR(50),
    
    -- Check-in/out
    actual_check_in_date DATE,
    actual_check_out_date DATE,
    early_checkout BOOLEAN DEFAULT false NOT NULL,
    late_checkout BOOLEAN DEFAULT false NOT NULL,
    
    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    refund_amount INTEGER DEFAULT 0 NOT NULL,
    
    -- Medical workflow
    medical_form_submitted BOOLEAN DEFAULT false NOT NULL,
    medical_form_submitted_at TIMESTAMP WITH TIME ZONE,
    doctor_review_required BOOLEAN DEFAULT true NOT NULL,
    doctor_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Communication
    reminder_emails_sent INTEGER DEFAULT 0 NOT NULL,
    last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    whatsapp_notifications_sent INTEGER DEFAULT 0 NOT NULL,
    
    -- Emergency contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Gateway details
    gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('razorpay', 'stripe', 'manual', 'payu')),
    payment_intent_id VARCHAR(255),
    payment_order_id VARCHAR(255),
    
    -- Amount
    amount INTEGER NOT NULL, -- in paise
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    
    -- Payment details
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'partial', 'full', 'balance', 'refund')),
    status VARCHAR(20) DEFAULT 'initiated' NOT NULL 
        CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
    
    -- Method
    payment_method VARCHAR(50),
    payment_method_details JSONB,
    
    -- Gateway response
    raw_response JSONB,
    gateway_fee INTEGER DEFAULT 0 NOT NULL,
    net_amount INTEGER NOT NULL,
    
    -- Transaction tracking
    reference_number VARCHAR(100),
    order_id VARCHAR(100),
    receipt_number VARCHAR(100),
    
    -- Failure details
    failure_reason TEXT,
    failure_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Refund details
    refund_id VARCHAR(255),
    refunded_amount INTEGER DEFAULT 0 NOT NULL,
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    -- Reconciliation
    reconciled BOOLEAN DEFAULT false NOT NULL,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    bank_reference VARCHAR(100),
    
    -- Metadata
    user_agent TEXT,
    ip_address VARCHAR(45),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Medical forms table
CREATE TABLE medical_forms (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) UNIQUE NOT NULL,
    
    -- Form data
    form_data JSONB NOT NULL,
    form_version VARCHAR(10) DEFAULT '1.0' NOT NULL,
    is_complete BOOLEAN DEFAULT false NOT NULL,
    completion_percentage INTEGER DEFAULT 0 NOT NULL,
    
    -- Submission
    submitted_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Reminders
    reminder_sent_count INTEGER DEFAULT 0 NOT NULL,
    last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Doctor assignment
    assigned_doctor_id INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Review
    doctor_review_id INTEGER,
    review_status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (review_status IN ('pending', 'confirmed', 'not_suitable', 'on_hold')),
    
    -- Notes
    patient_notes TEXT,
    staff_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Doctor reviews table
CREATE TABLE doctor_reviews (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES users(id) NOT NULL,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    medical_form_id INTEGER REFERENCES medical_forms(id),
    
    -- Review decision
    status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'not_suitable', 'on_hold')),
    
    -- Assessment
    medical_notes TEXT NOT NULL,
    recommendations TEXT,
    contraindications TEXT,
    
    -- Program suitability
    program_suitable BOOLEAN,
    alternative_program_suggestions TEXT,
    modifications_required TEXT,
    
    -- Risk assessment
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    special_precautions TEXT,
    monitoring_requirements TEXT,
    
    -- Follow-up
    requires_follow_up BOOLEAN DEFAULT false NOT NULL,
    follow_up_timeline VARCHAR(100),
    follow_up_notes TEXT,
    
    -- Refund handling
    refund_required BOOLEAN DEFAULT false NOT NULL,
    refund_amount INTEGER, -- in paise
    refund_reason TEXT,
    
    -- Internal tracking
    review_duration_minutes INTEGER,
    complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),
    
    -- Timestamps
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Refunds table
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) NOT NULL,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    initiated_by INTEGER REFERENCES users(id),
    
    -- Refund details
    amount INTEGER NOT NULL, -- in paise
    status VARCHAR(20) DEFAULT 'initiated' NOT NULL CHECK (status IN ('initiated', 'processing', 'completed', 'failed')),
    reason TEXT NOT NULL,
    
    -- Gateway details
    gateway_refund_id VARCHAR(255),
    gateway_response JSONB,
    
    -- Processing
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Failure tracking
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. CMS Pages table
CREATE TABLE cms_pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    excerpt VARCHAR(500),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    meta_keywords TEXT,
    
    -- Metadata
    metadata JSONB,
    
    -- Publishing
    published BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    
    -- Template
    template VARCHAR(100) DEFAULT 'default' NOT NULL,
    layout_config JSONB,
    
    -- Authoring
    author_id INTEGER REFERENCES users(id),
    last_edited_by INTEGER REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 11. Articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt VARCHAR(500),
    body TEXT NOT NULL,
    
    -- Categorization
    category VARCHAR(100),
    tags JSONB,
    
    -- Media
    featured_image VARCHAR(500),
    gallery_images JSONB,
    attachments JSONB,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    
    -- Publishing
    published BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    
    -- Authoring
    author_id INTEGER REFERENCES users(id) NOT NULL,
    last_edited_by INTEGER REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 12. PDF Download Requests table
CREATE TABLE pdf_download_requests (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) NOT NULL,
    
    -- Requester
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Download tracking
    download_token VARCHAR(255) UNIQUE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Request metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    
    -- Token expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 13. Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'whatsapp', 'sms', 'push')),
    template_name VARCHAR(100),
    
    -- Recipient
    recipient_id INTEGER REFERENCES users(id),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    
    -- Content
    subject VARCHAR(255),
    message TEXT NOT NULL,
    message_html TEXT,
    template_data JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    attempts INTEGER DEFAULT 0 NOT NULL,
    max_attempts INTEGER DEFAULT 3 NOT NULL,
    
    -- External service
    external_id VARCHAR(255),
    provider_response JSONB,
    
    -- Scheduling
    send_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Error tracking
    error_message TEXT,
    last_attempted_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    booking_id INTEGER REFERENCES bookings(id),
    payment_id INTEGER REFERENCES payments(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 14. Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    
    -- Request details
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    -- Context
    details JSONB,
    notes TEXT,
    
    -- Classification
    severity VARCHAR(20) DEFAULT 'info' NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    category VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 15. Integrations table
CREATE TABLE integrations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Configuration
    config JSONB NOT NULL,
    credentials JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_status VARCHAR(20) DEFAULT 'unknown' NOT NULL,
    last_error TEXT,
    
    -- Webhook
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(255),
    
    -- Health monitoring
    last_health_check TIMESTAMP WITH TIME ZONE,
    health_check_interval INTEGER DEFAULT 300 NOT NULL,
    
    -- Usage tracking
    request_count INTEGER DEFAULT 0 NOT NULL,
    error_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_programs_type ON programs(program_type);

CREATE INDEX idx_rooms_category ON rooms(category);
CREATE INDEX idx_rooms_pricing_category ON rooms(pricing_category);
CREATE INDEX idx_rooms_active ON rooms(is_active);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in_date ON bookings(check_in_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway);

CREATE INDEX idx_medical_forms_booking_id ON medical_forms(booking_id);
CREATE INDEX idx_medical_forms_assigned_doctor ON medical_forms(assigned_doctor_id);

CREATE INDEX idx_doctor_reviews_doctor_id ON doctor_reviews(doctor_id);
CREATE INDEX idx_doctor_reviews_booking_id ON doctor_reviews(booking_id);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add foreign key for medical_forms.doctor_review_id
ALTER TABLE medical_forms ADD CONSTRAINT fk_medical_forms_doctor_review 
    FOREIGN KEY (doctor_review_id) REFERENCES doctor_reviews(id);

-- Create trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 16. Room Availability table
CREATE TABLE room_availability (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) NOT NULL,
    date DATE NOT NULL,
    available_count INTEGER DEFAULT 0 NOT NULL,

    -- Restriction flags
    is_closed BOOLEAN DEFAULT false NOT NULL,
    is_closed_to_arrival BOOLEAN DEFAULT false NOT NULL,
    is_closed_to_departure BOOLEAN DEFAULT false NOT NULL,

    -- Length of stay restrictions
    min_length_of_stay INTEGER,
    max_length_of_stay INTEGER,

    -- Rate plan code (if availability is rate-plan specific)
    rate_plan_code VARCHAR(50),

    -- Source of this availability data (manual, ids_sync, etc.)
    source VARCHAR(50) DEFAULT 'manual' NOT NULL,

    -- External reference (IDS echo token, etc.)
    external_reference VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_room_availability_updated_at BEFORE UPDATE ON room_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_room_availability_room_id ON room_availability(room_id);
CREATE INDEX idx_room_availability_date ON room_availability(date);
CREATE INDEX idx_room_availability_rate_plan ON room_availability(rate_plan_code);

CREATE TRIGGER update_pricing_bands_updated_at BEFORE UPDATE ON pricing_bands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_forms_updated_at BEFORE UPDATE ON medical_forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_reviews_updated_at BEFORE UPDATE ON doctor_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON refunds 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_download_requests_updated_at BEFORE UPDATE ON pdf_download_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
