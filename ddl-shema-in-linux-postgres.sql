-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public.gtrgm;

CREATE TYPE public.gtrgm (
	INPUT = gtrgm_in,
	OUTPUT = gtrgm_out,
	ALIGNMENT = 4,
	STORAGE = plain,
	CATEGORY = U,
	DELIMITER = ',');

-- DROP SEQUENCE public.articles_id_seq;

CREATE SEQUENCE public.articles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.audit_logs_id_seq;

CREATE SEQUENCE public.audit_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.bookings_id_seq;

CREATE SEQUENCE public.bookings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.cms_pages_id_seq;

CREATE SEQUENCE public.cms_pages_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.contact_us_id_seq;

CREATE SEQUENCE public.contact_us_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.doctor_reviews_id_seq;

CREATE SEQUENCE public.doctor_reviews_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.integrations_id_seq;

CREATE SEQUENCE public.integrations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.medical_forms_id_seq;

CREATE SEQUENCE public.medical_forms_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.notifications_id_seq;

CREATE SEQUENCE public.notifications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.payments_id_seq;

CREATE SEQUENCE public.payments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pdf_download_requests_id_seq;

CREATE SEQUENCE public.pdf_download_requests_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pricing_bands_id_seq;

CREATE SEQUENCE public.pricing_bands_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.programs_id_seq;

CREATE SEQUENCE public.programs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.refunds_id_seq;

CREATE SEQUENCE public.refunds_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.room_availability_id_seq;

CREATE SEQUENCE public.room_availability_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.rooms_id_seq;

CREATE SEQUENCE public.rooms_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.alembic_version definition

-- Drop table

-- DROP TABLE public.alembic_version;

CREATE TABLE public.alembic_version (
	version_num varchar(32) NOT NULL,
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);


-- public.contact_us definition

-- Drop table

-- DROP TABLE public.contact_us;

CREATE TABLE public.contact_us (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(30) NULL,
	reason varchar(64) NOT NULL,
	message text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pk_contact_us PRIMARY KEY (id)
);
CREATE INDEX ix_contact_us_email ON public.contact_us USING btree (email);
CREATE INDEX ix_contact_us_id ON public.contact_us USING btree (id);


-- public.integrations definition

-- Drop table

-- DROP TABLE public.integrations;

CREATE TABLE public.integrations (
	id serial4 NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	config jsonb NOT NULL,
	credentials jsonb NULL,
	is_active bool DEFAULT true NOT NULL,
	last_status varchar(20) DEFAULT 'unknown'::character varying NOT NULL,
	last_error text NULL,
	webhook_url varchar(500) NULL,
	webhook_secret varchar(255) NULL,
	last_health_check timestamptz NULL,
	health_check_interval int4 DEFAULT 300 NOT NULL,
	request_count int4 DEFAULT 0 NOT NULL,
	error_count int4 DEFAULT 0 NOT NULL,
	last_used_at timestamptz NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT integrations_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_integrations_updated_at before
update
    on
    public.integrations for each row execute function update_updated_at_column();


-- public.room_availability definition

-- Drop table

-- DROP TABLE public.room_availability;

CREATE TABLE public.room_availability (
	id serial4 NOT NULL,
	"date" date NOT NULL,
	available_count int4 DEFAULT 0 NOT NULL,
	is_closed bool DEFAULT false NOT NULL,
	is_closed_to_arrival bool DEFAULT false NOT NULL,
	is_closed_to_departure bool DEFAULT false NOT NULL,
	min_length_of_stay int4 NULL,
	max_length_of_stay int4 NULL,
	rate_plan_code varchar(50) NULL,
	"source" varchar(50) DEFAULT 'manual'::character varying NOT NULL,
	external_reference varchar(255) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	room_code varchar(50) NULL,
	CONSTRAINT room_availability_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_room_availability_date ON public.room_availability USING btree (date);
CREATE INDEX idx_room_availability_rate_plan ON public.room_availability USING btree (rate_plan_code);

-- Table Triggers

create trigger update_room_availability_updated_at before
update
    on
    public.room_availability for each row execute function update_updated_at_column();


-- public.rooms definition

-- Drop table

-- DROP TABLE public.rooms;

CREATE TABLE public.rooms (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	code varchar(50) NULL,
	category varchar(50) NOT NULL,
	description text NULL,
	pricing_category varchar(100) NULL,
	occupancy_max_adults int4 DEFAULT 2 NOT NULL,
	occupancy_max_children int4 DEFAULT 2 NOT NULL,
	occupancy_max_total int4 DEFAULT 4 NOT NULL,
	price_per_night_single int4 NOT NULL,
	price_per_night_double int4 NOT NULL,
	price_per_night_extra_adult int4 DEFAULT 0 NOT NULL,
	price_per_night_child int4 DEFAULT 0 NOT NULL,
	inventory_count int4 DEFAULT 1 NOT NULL,
	refundable_full_payment_required bool DEFAULT false NOT NULL,
	deposit_amount int4 NULL,
	amenities jsonb NULL,
	features jsonb NULL,
	featured_image varchar(500) NULL,
	gallery_images jsonb NULL,
	floor_plan_image varchar(500) NULL,
	bed_configuration varchar(100) NULL,
	room_size_sqft int4 NULL,
	max_extra_beds int4 DEFAULT 2 NOT NULL,
	medical_equipment_compatible bool DEFAULT true NOT NULL,
	wheelchair_accessible bool DEFAULT false NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	maintenance_mode bool DEFAULT false NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT rooms_category_check CHECK (((category)::text = ANY (ARRAY[('suite'::character varying)::text, ('premium'::character varying)::text, ('deluxe'::character varying)::text, ('standard'::character varying)::text]))),
	CONSTRAINT rooms_code_key UNIQUE (code),
	CONSTRAINT rooms_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_rooms_active ON public.rooms USING btree (is_active);
CREATE INDEX idx_rooms_category ON public.rooms USING btree (category);
CREATE INDEX idx_rooms_pricing_category ON public.rooms USING btree (pricing_category);

-- Table Triggers

create trigger update_rooms_updated_at before
update
    on
    public.rooms for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(20) NULL,
	hashed_password varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'user'::character varying NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	is_verified bool DEFAULT false NOT NULL,
	date_of_birth timestamp NULL,
	gender varchar(20) NULL,
	emergency_contact_name varchar(255) NULL,
	emergency_contact_phone varchar(20) NULL,
	medical_conditions text NULL,
	dietary_restrictions text NULL,
	address_line1 varchar(255) NULL,
	address_line2 varchar(255) NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	postal_code varchar(20) NULL,
	country varchar(100) DEFAULT 'India'::character varying NULL,
	communication_preferences jsonb NULL,
	marketing_consent bool DEFAULT false NOT NULL,
	oauth_provider varchar(50) NULL,
	oauth_id varchar(255) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	last_login_at timestamptz NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_phone_key UNIQUE (phone),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('user'::character varying)::text, ('staff'::character varying)::text, ('doctor'::character varying)::text, ('admin'::character varying)::text])))
);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_phone ON public.users USING btree (phone);
CREATE INDEX idx_users_role ON public.users USING btree (role);

-- Table Triggers

create trigger update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();


-- public.articles definition

-- Drop table

-- DROP TABLE public.articles;

CREATE TABLE public.articles (
	id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	slug varchar(255) NOT NULL,
	excerpt varchar(500) NULL,
	body text NOT NULL,
	category varchar(100) NULL,
	tags jsonb NULL,
	featured_image varchar(500) NULL,
	gallery_images jsonb NULL,
	attachments jsonb NULL,
	meta_title varchar(255) NULL,
	meta_description varchar(500) NULL,
	published bool DEFAULT false NOT NULL,
	featured bool DEFAULT false NOT NULL,
	author_id int4 NOT NULL,
	last_edited_by int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	published_at timestamptz NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (id),
	CONSTRAINT articles_slug_key UNIQUE (slug),
	CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id),
	CONSTRAINT articles_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES public.users(id)
);

-- Table Triggers

create trigger update_articles_updated_at before
update
    on
    public.articles for each row execute function update_updated_at_column();


-- public.audit_logs definition

-- Drop table

-- DROP TABLE public.audit_logs;

CREATE TABLE public.audit_logs (
	id serial4 NOT NULL,
	user_id int4 NULL,
	"action" varchar(100) NOT NULL,
	entity_type varchar(50) NULL,
	entity_id int4 NULL,
	ip_address varchar(45) NULL,
	user_agent text NULL,
	request_id varchar(100) NULL,
	old_values jsonb NULL,
	new_values jsonb NULL,
	changes jsonb NULL,
	details jsonb NULL,
	notes text NULL,
	severity varchar(20) DEFAULT 'info'::character varying NOT NULL,
	category varchar(50) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
	CONSTRAINT audit_logs_severity_check CHECK (((severity)::text = ANY (ARRAY[('info'::character varying)::text, ('warning'::character varying)::text, ('error'::character varying)::text, ('critical'::character varying)::text]))),
	CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


-- public.cms_pages definition

-- Drop table

-- DROP TABLE public.cms_pages;

CREATE TABLE public.cms_pages (
	id serial4 NOT NULL,
	slug varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	body text NULL,
	excerpt varchar(500) NULL,
	meta_title varchar(255) NULL,
	meta_description varchar(500) NULL,
	meta_keywords text NULL,
	metadata jsonb NULL,
	published bool DEFAULT false NOT NULL,
	featured bool DEFAULT false NOT NULL,
	sort_order int4 DEFAULT 0 NOT NULL,
	"template" varchar(100) DEFAULT 'default'::character varying NOT NULL,
	layout_config jsonb NULL,
	author_id int4 NULL,
	last_edited_by int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	published_at timestamptz NULL,
	CONSTRAINT cms_pages_pkey PRIMARY KEY (id),
	CONSTRAINT cms_pages_slug_key UNIQUE (slug),
	CONSTRAINT cms_pages_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id),
	CONSTRAINT cms_pages_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES public.users(id)
);

-- Table Triggers

create trigger update_cms_pages_updated_at before
update
    on
    public.cms_pages for each row execute function update_updated_at_column();


-- public.pdf_download_requests definition

-- Drop table

-- DROP TABLE public.pdf_download_requests;

CREATE TABLE public.pdf_download_requests (
	id serial4 NOT NULL,
	article_id int4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(20) NULL,
	download_token varchar(255) NOT NULL,
	downloaded_at timestamptz NULL,
	download_count int4 DEFAULT 0 NOT NULL,
	ip_address varchar(45) NULL,
	user_agent text NULL,
	referrer varchar(500) NULL,
	expires_at timestamptz NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pdf_download_requests_download_token_key UNIQUE (download_token),
	CONSTRAINT pdf_download_requests_pkey PRIMARY KEY (id),
	CONSTRAINT pdf_download_requests_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);

-- Table Triggers

create trigger update_pdf_download_requests_updated_at before
update
    on
    public.pdf_download_requests for each row execute function update_updated_at_column();


-- public.pricing_bands definition

-- Drop table

-- DROP TABLE public.pricing_bands;

CREATE TABLE public.pricing_bands (
	id serial4 NOT NULL,
	program_id int4 NULL,
	room_id int4 NULL,
	min_nights int4 NULL,
	max_nights int4 NULL,
	pricing_type varchar(50) NULL,
	price_single int4 NULL,
	price_double int4 NULL,
	price_extra_adult int4 DEFAULT 0 NULL,
	price_child int4 DEFAULT 0 NULL,
	discount_percentage int4 DEFAULT 0 NULL,
	early_bird_discount int4 DEFAULT 0 NULL,
	season_name varchar(50) NULL,
	valid_from date NULL,
	valid_until date NULL,
	minimum_advance_booking_days int4 DEFAULT 3 NULL,
	maximum_advance_booking_days int4 NULL,
	notes text NULL,
	internal_notes text NULL,
	is_active bool DEFAULT true NULL,
	priority int4 DEFAULT 1 NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	package_price_single int4 NULL,
	package_price_double int4 NULL,
	package_price_extra_adult int4 DEFAULT 0 NULL,
	package_price_child int4 DEFAULT 0 NULL,
	CONSTRAINT pricing_bands_pkey PRIMARY KEY (id),
	CONSTRAINT pricing_bands_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);


-- public.programs definition

-- Drop table

-- DROP TABLE public.programs;

CREATE TABLE public.programs (
	id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	pricing_category varchar(100) NULL,
	program_type varchar(20) NOT NULL,
	category varchar(100) NULL,
	duration_days_min int4 DEFAULT 3 NOT NULL,
	duration_days_max int4 NULL,
	price_base int4 NULL,
	min_age int4 NULL,
	max_age int4 NULL,
	created_by int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT programs_pkey PRIMARY KEY (id),
	CONSTRAINT programs_program_type_check CHECK (((program_type)::text = ANY (ARRAY[('medical'::character varying)::text, ('wellness'::character varying)::text, ('lite'::character varying)::text]))),
	CONSTRAINT programs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE INDEX idx_programs_type ON public.programs USING btree (program_type);

-- Table Triggers

create trigger update_programs_updated_at before
update
    on
    public.programs for each row execute function update_updated_at_column();


-- public.bookings definition

-- Drop table

-- DROP TABLE public.bookings;

CREATE TABLE public.bookings (
	id serial4 NOT NULL,
	user_id int4 NULL,
	program_id int4 NULL,
	room_id int4 NOT NULL,
	check_in_date date NOT NULL,
	check_out_date date NOT NULL,
	nights int4 NOT NULL,
	occupancy_details jsonb NOT NULL,
	status varchar(20) DEFAULT 'initiated'::character varying NOT NULL,
	total_amount int4 NOT NULL,
	deposit_amount int4 NOT NULL,
	paid_amount int4 DEFAULT 0 NOT NULL,
	balance_amount int4 NOT NULL,
	minimum_stay_enforced bool DEFAULT true NOT NULL,
	full_payment_required bool DEFAULT false NOT NULL,
	special_requests text NULL,
	internal_notes text NULL,
	guest_notes text NULL,
	guest_first_name varchar(100) NULL,
	guest_last_name varchar(100) NULL,
	guest_email varchar(255) NULL,
	guest_phone varchar(20) NULL,
	guest_country varchar(100) NULL,
	number_of_rooms int4 DEFAULT 1 NOT NULL,
	caregiver_required bool DEFAULT false NOT NULL,
	caregiver_stay_with_guest bool DEFAULT false NOT NULL,
	caregiver_meal varchar(50) NULL,
	private_transfer bool DEFAULT false NOT NULL,
	confirmation_number varchar(20) NULL,
	invoice_id varchar(50) NULL,
	actual_check_in_date date NULL,
	actual_check_out_date date NULL,
	early_checkout bool DEFAULT false NOT NULL,
	late_checkout bool DEFAULT false NOT NULL,
	cancelled_at timestamptz NULL,
	cancellation_reason text NULL,
	refund_amount int4 DEFAULT 0 NOT NULL,
	medical_form_submitted bool DEFAULT false NOT NULL,
	medical_form_submitted_at timestamptz NULL,
	doctor_review_required bool DEFAULT true NOT NULL,
	doctor_reviewed_at timestamptz NULL,
	reminder_emails_sent int4 DEFAULT 0 NOT NULL,
	last_reminder_sent_at timestamptz NULL,
	whatsapp_notifications_sent int4 DEFAULT 0 NOT NULL,
	emergency_contact_name varchar(255) NULL,
	emergency_contact_phone varchar(20) NULL,
	emergency_contact_relation varchar(50) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	ids_booking_reference varchar(50) NULL,
	other_guests json NULL,
	estimate_details json NULL,
	confirmation_email_sent bool DEFAULT false NULL,
	CONSTRAINT bookings_confirmation_number_key UNIQUE (confirmation_number),
	CONSTRAINT bookings_pkey PRIMARY KEY (id),
	CONSTRAINT bookings_status_check CHECK (((status)::text = ANY (ARRAY[('initiated'::character varying)::text, ('pending_medical'::character varying)::text, ('doctor_approved'::character varying)::text, ('confirmed'::character varying)::text, ('on_hold'::character varying)::text, ('not_suitable'::character varying)::text, ('cancelled'::character varying)::text, ('checked_in'::character varying)::text, ('completed'::character varying)::text]))),
	CONSTRAINT bookings_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
	CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
	CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_bookings_check_in_date ON public.bookings USING btree (check_in_date);
CREATE INDEX idx_bookings_created_at ON public.bookings USING btree (created_at);
CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);
CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);

-- Table Triggers

create trigger booking_confirmation_trigger after
insert
    or
update
    on
    public.bookings for each row execute function notify_booking_confirmation();
create trigger update_bookings_updated_at before
update
    on
    public.bookings for each row execute function update_updated_at_column();


-- public.payments definition

-- Drop table

-- DROP TABLE public.payments;

CREATE TABLE public.payments (
	id serial4 NOT NULL,
	booking_id int4 NULL,
	user_id int4 NULL,
	gateway varchar(20) NOT NULL,
	payment_intent_id varchar(255) NULL,
	payment_order_id varchar(255) NULL,
	amount int4 NOT NULL,
	currency varchar(3) DEFAULT 'INR'::character varying NOT NULL,
	payment_type varchar(20) NOT NULL,
	status varchar(20) DEFAULT 'initiated'::character varying NOT NULL,
	payment_method varchar(50) NULL,
	payment_method_details jsonb NULL,
	raw_response jsonb NULL,
	gateway_fee int4 DEFAULT 0 NOT NULL,
	net_amount int4 NOT NULL,
	reference_number varchar(100) NULL,
	order_id varchar(100) NULL,
	receipt_number varchar(100) NULL,
	failure_reason text NULL,
	failure_code varchar(50) NULL,
	retry_count int4 DEFAULT 0 NOT NULL,
	refund_id varchar(255) NULL,
	refunded_amount int4 DEFAULT 0 NOT NULL,
	refund_reason text NULL,
	refunded_at timestamptz NULL,
	reconciled bool DEFAULT false NOT NULL,
	reconciled_at timestamptz NULL,
	bank_reference varchar(100) NULL,
	user_agent text NULL,
	ip_address varchar(45) NULL,
	notes text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	completed_at timestamptz NULL,
	booking_details jsonb NULL,
	CONSTRAINT payments_gateway_check CHECK (((gateway)::text = ANY (ARRAY[('razorpay'::character varying)::text, ('stripe'::character varying)::text, ('manual'::character varying)::text, ('payu'::character varying)::text]))),
	CONSTRAINT payments_payment_type_check CHECK (((payment_type)::text = ANY (ARRAY[('deposit'::character varying)::text, ('partial'::character varying)::text, ('full'::character varying)::text, ('balance'::character varying)::text, ('refund'::character varying)::text]))),
	CONSTRAINT payments_pkey PRIMARY KEY (id),
	CONSTRAINT payments_status_check CHECK (((status)::text = ANY (ARRAY[('initiated'::character varying)::text, ('pending'::character varying)::text, ('success'::character varying)::text, ('failed'::character varying)::text, ('cancelled'::character varying)::text, ('refunded'::character varying)::text, ('partially_refunded'::character varying)::text]))),
	CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
	CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_payments_booking_id ON public.payments USING btree (booking_id);
CREATE INDEX idx_payments_gateway ON public.payments USING btree (gateway);
CREATE INDEX idx_payments_status ON public.payments USING btree (status);
CREATE INDEX idx_payments_user_id ON public.payments USING btree (user_id);

-- Table Triggers

create trigger update_payments_updated_at before
update
    on
    public.payments for each row execute function update_updated_at_column();


-- public.refunds definition

-- Drop table

-- DROP TABLE public.refunds;

CREATE TABLE public.refunds (
	id serial4 NOT NULL,
	payment_id int4 NOT NULL,
	booking_id int4 NOT NULL,
	initiated_by int4 NULL,
	amount int4 NOT NULL,
	status varchar(20) DEFAULT 'initiated'::character varying NOT NULL,
	reason text NOT NULL,
	gateway_refund_id varchar(255) NULL,
	gateway_response jsonb NULL,
	initiated_at timestamptz DEFAULT now() NOT NULL,
	completed_at timestamptz NULL,
	failure_reason text NULL,
	retry_count int4 DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT refunds_pkey PRIMARY KEY (id),
	CONSTRAINT refunds_status_check CHECK (((status)::text = ANY (ARRAY[('initiated'::character varying)::text, ('processing'::character varying)::text, ('completed'::character varying)::text, ('failed'::character varying)::text]))),
	CONSTRAINT refunds_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
	CONSTRAINT refunds_initiated_by_fkey FOREIGN KEY (initiated_by) REFERENCES public.users(id),
	CONSTRAINT refunds_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);

-- Table Triggers

create trigger update_refunds_updated_at before
update
    on
    public.refunds for each row execute function update_updated_at_column();


-- public.notifications definition

-- Drop table

-- DROP TABLE public.notifications;

CREATE TABLE public.notifications (
	id serial4 NOT NULL,
	"type" varchar(20) NOT NULL,
	template_name varchar(100) NULL,
	recipient_id int4 NULL,
	recipient_email varchar(255) NULL,
	recipient_phone varchar(20) NULL,
	subject varchar(255) NULL,
	message text NOT NULL,
	message_html text NULL,
	template_data jsonb NULL,
	status varchar(20) DEFAULT 'pending'::character varying NOT NULL,
	attempts int4 DEFAULT 0 NOT NULL,
	max_attempts int4 DEFAULT 3 NOT NULL,
	external_id varchar(255) NULL,
	provider_response jsonb NULL,
	send_at timestamptz NULL,
	sent_at timestamptz NULL,
	delivered_at timestamptz NULL,
	error_message text NULL,
	last_attempted_at timestamptz NULL,
	booking_id int4 NULL,
	payment_id int4 NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT notifications_pkey PRIMARY KEY (id),
	CONSTRAINT notifications_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('sent'::character varying)::text, ('delivered'::character varying)::text, ('failed'::character varying)::text, ('bounced'::character varying)::text]))),
	CONSTRAINT notifications_type_check CHECK (((type)::text = ANY (ARRAY[('email'::character varying)::text, ('whatsapp'::character varying)::text, ('sms'::character varying)::text, ('push'::character varying)::text]))),
	CONSTRAINT notifications_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
	CONSTRAINT notifications_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id),
	CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id)
);
CREATE INDEX idx_notifications_recipient_id ON public.notifications USING btree (recipient_id);
CREATE INDEX idx_notifications_status ON public.notifications USING btree (status);
CREATE INDEX idx_notifications_type ON public.notifications USING btree (type);

-- Table Triggers

create trigger update_notifications_updated_at before
update
    on
    public.notifications for each row execute function update_updated_at_column();


-- public.doctor_reviews definition

-- Drop table

-- DROP TABLE public.doctor_reviews;

CREATE TABLE public.doctor_reviews (
	id serial4 NOT NULL,
	doctor_id int4 NOT NULL,
	booking_id int4 NOT NULL,
	medical_form_id int4 NULL,
	status varchar(20) NOT NULL,
	medical_notes text NOT NULL,
	recommendations text NULL,
	contraindications text NULL,
	program_suitable bool NULL,
	alternative_program_suggestions text NULL,
	modifications_required text NULL,
	risk_level varchar(20) NULL,
	special_precautions text NULL,
	monitoring_requirements text NULL,
	requires_follow_up bool DEFAULT false NOT NULL,
	follow_up_timeline varchar(100) NULL,
	follow_up_notes text NULL,
	refund_required bool DEFAULT false NOT NULL,
	refund_amount int4 NULL,
	refund_reason text NULL,
	review_duration_minutes int4 NULL,
	complexity_score int4 NULL,
	reviewed_at timestamptz DEFAULT now() NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT doctor_reviews_complexity_score_check CHECK (((complexity_score >= 1) AND (complexity_score <= 10))),
	CONSTRAINT doctor_reviews_pkey PRIMARY KEY (id),
	CONSTRAINT doctor_reviews_risk_level_check CHECK (((risk_level)::text = ANY (ARRAY[('low'::character varying)::text, ('medium'::character varying)::text, ('high'::character varying)::text]))),
	CONSTRAINT doctor_reviews_status_check CHECK (((status)::text = ANY (ARRAY[('confirmed'::character varying)::text, ('not_suitable'::character varying)::text, ('on_hold'::character varying)::text])))
);
CREATE INDEX idx_doctor_reviews_booking_id ON public.doctor_reviews USING btree (booking_id);
CREATE INDEX idx_doctor_reviews_doctor_id ON public.doctor_reviews USING btree (doctor_id);

-- Table Triggers

create trigger update_doctor_reviews_updated_at before
update
    on
    public.doctor_reviews for each row execute function update_updated_at_column();


-- public.medical_forms definition

-- Drop table

-- DROP TABLE public.medical_forms;

CREATE TABLE public.medical_forms (
	id serial4 NOT NULL,
	booking_id int4 NOT NULL,
	form_data jsonb NOT NULL,
	form_version varchar(10) DEFAULT '1.0'::character varying NOT NULL,
	is_complete bool DEFAULT false NOT NULL,
	completion_percentage int4 DEFAULT 0 NOT NULL,
	submitted_at timestamptz NULL,
	ip_address varchar(45) NULL,
	user_agent text NULL,
	reminder_sent_count int4 DEFAULT 0 NOT NULL,
	last_reminder_sent_at timestamptz NULL,
	assigned_doctor_id int4 NULL,
	assigned_at timestamptz NULL,
	doctor_review_id int4 NULL,
	review_status varchar(20) DEFAULT 'pending'::character varying NOT NULL,
	patient_notes text NULL,
	staff_notes text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT medical_forms_booking_id_key UNIQUE (booking_id),
	CONSTRAINT medical_forms_pkey PRIMARY KEY (id),
	CONSTRAINT medical_forms_review_status_check CHECK (((review_status)::text = ANY (ARRAY[('pending'::character varying)::text, ('confirmed'::character varying)::text, ('not_suitable'::character varying)::text, ('on_hold'::character varying)::text])))
);
CREATE INDEX idx_medical_forms_assigned_doctor ON public.medical_forms USING btree (assigned_doctor_id);
CREATE INDEX idx_medical_forms_booking_id ON public.medical_forms USING btree (booking_id);

-- Table Triggers

create trigger update_medical_forms_updated_at before
update
    on
    public.medical_forms for each row execute function update_updated_at_column();


-- public.doctor_reviews foreign keys

ALTER TABLE public.doctor_reviews ADD CONSTRAINT doctor_reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);
ALTER TABLE public.doctor_reviews ADD CONSTRAINT doctor_reviews_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);
ALTER TABLE public.doctor_reviews ADD CONSTRAINT doctor_reviews_medical_form_id_fkey FOREIGN KEY (medical_form_id) REFERENCES public.medical_forms(id);


-- public.medical_forms foreign keys

ALTER TABLE public.medical_forms ADD CONSTRAINT fk_medical_forms_doctor_review FOREIGN KEY (doctor_review_id) REFERENCES public.doctor_reviews(id);
ALTER TABLE public.medical_forms ADD CONSTRAINT medical_forms_assigned_doctor_id_fkey FOREIGN KEY (assigned_doctor_id) REFERENCES public.users(id);
ALTER TABLE public.medical_forms ADD CONSTRAINT medical_forms_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);



-- DROP FUNCTION public.gin_extract_query_trgm(text, internal, int2, internal, internal, internal, internal);

CREATE OR REPLACE FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_extract_query_trgm$function$
;

-- DROP FUNCTION public.gin_extract_value_trgm(text, internal);

CREATE OR REPLACE FUNCTION public.gin_extract_value_trgm(text, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_extract_value_trgm$function$
;

-- DROP FUNCTION public.gin_trgm_consistent(internal, int2, text, int4, internal, internal, internal, internal);

CREATE OR REPLACE FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_trgm_consistent$function$
;

-- DROP FUNCTION public.gin_trgm_triconsistent(internal, int2, text, int4, internal, internal, internal);

CREATE OR REPLACE FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal)
 RETURNS "char"
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_trgm_triconsistent$function$
;

-- DROP FUNCTION public.gtrgm_compress(internal);

CREATE OR REPLACE FUNCTION public.gtrgm_compress(internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_compress$function$
;

-- DROP FUNCTION public.gtrgm_consistent(internal, text, int2, oid, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_consistent$function$
;

-- DROP FUNCTION public.gtrgm_decompress(internal);

CREATE OR REPLACE FUNCTION public.gtrgm_decompress(internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_decompress$function$
;

-- DROP FUNCTION public.gtrgm_distance(internal, text, int2, oid, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal)
 RETURNS double precision
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_distance$function$
;

-- DROP FUNCTION public.gtrgm_in(cstring);

CREATE OR REPLACE FUNCTION public.gtrgm_in(cstring)
 RETURNS gtrgm
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_in$function$
;

-- DROP FUNCTION public.gtrgm_options(internal);

CREATE OR REPLACE FUNCTION public.gtrgm_options(internal)
 RETURNS void
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE
AS '$libdir/pg_trgm', $function$gtrgm_options$function$
;

-- DROP FUNCTION public.gtrgm_out(gtrgm);

CREATE OR REPLACE FUNCTION public.gtrgm_out(gtrgm)
 RETURNS cstring
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_out$function$
;

-- DROP FUNCTION public.gtrgm_penalty(internal, internal, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_penalty(internal, internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_penalty$function$
;

-- DROP FUNCTION public.gtrgm_picksplit(internal, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_picksplit(internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_picksplit$function$
;

-- DROP FUNCTION public.gtrgm_same(gtrgm, gtrgm, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_same(gtrgm, gtrgm, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_same$function$
;

-- DROP FUNCTION public.gtrgm_union(internal, internal);

CREATE OR REPLACE FUNCTION public.gtrgm_union(internal, internal)
 RETURNS gtrgm
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_union$function$
;

-- DROP FUNCTION public.notify_booking_confirmation();

CREATE OR REPLACE FUNCTION public.notify_booking_confirmation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- DROP FUNCTION public.set_limit(float4);

CREATE OR REPLACE FUNCTION public.set_limit(real)
 RETURNS real
 LANGUAGE c
 STRICT
AS '$libdir/pg_trgm', $function$set_limit$function$
;

-- DROP FUNCTION public.show_limit();

CREATE OR REPLACE FUNCTION public.show_limit()
 RETURNS real
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$show_limit$function$
;

-- DROP FUNCTION public.show_trgm(text);

CREATE OR REPLACE FUNCTION public.show_trgm(text)
 RETURNS text[]
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$show_trgm$function$
;

-- DROP FUNCTION public.similarity(text, text);

CREATE OR REPLACE FUNCTION public.similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity$function$
;

-- DROP FUNCTION public.similarity_dist(text, text);

CREATE OR REPLACE FUNCTION public.similarity_dist(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity_dist$function$
;

-- DROP FUNCTION public.similarity_op(text, text);

CREATE OR REPLACE FUNCTION public.similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity_op$function$
;

-- DROP FUNCTION public.strict_word_similarity(text, text);

CREATE OR REPLACE FUNCTION public.strict_word_similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity$function$
;

-- DROP FUNCTION public.strict_word_similarity_commutator_op(text, text);

CREATE OR REPLACE FUNCTION public.strict_word_similarity_commutator_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_commutator_op$function$
;

-- DROP FUNCTION public.strict_word_similarity_dist_commutator_op(text, text);

CREATE OR REPLACE FUNCTION public.strict_word_similarity_dist_commutator_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_dist_commutator_op$function$
;

-- DROP FUNCTION public.strict_word_similarity_dist_op(text, text);

CREATE OR REPLACE FUNCTION public.strict_word_similarity_dist_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_dist_op$function$
;

-- DROP FUNCTION public.strict_word_similarity_op(text, text);

CREATE OR REPLACE FUNCTION public.strict_word_similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_op$function$
;

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;

-- DROP FUNCTION public.word_similarity(text, text);

CREATE OR REPLACE FUNCTION public.word_similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity$function$
;

-- DROP FUNCTION public.word_similarity_commutator_op(text, text);

CREATE OR REPLACE FUNCTION public.word_similarity_commutator_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_commutator_op$function$
;

-- DROP FUNCTION public.word_similarity_dist_commutator_op(text, text);

CREATE OR REPLACE FUNCTION public.word_similarity_dist_commutator_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_dist_commutator_op$function$
;

-- DROP FUNCTION public.word_similarity_dist_op(text, text);

CREATE OR REPLACE FUNCTION public.word_similarity_dist_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_dist_op$function$
;

-- DROP FUNCTION public.word_similarity_op(text, text);

CREATE OR REPLACE FUNCTION public.word_similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_op$function$
;