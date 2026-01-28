# Schema Comparison Report

## Overview
- **File 1 (Left/Incorrect)**: Untitled-1
- **File 2 (Right/Correct)**: Untitled-2

This report identifies missing tables and columns in File 1 compared to File 2.

---

## Missing Tables

**No missing tables** - Both schemas contain the same tables.

---

## Column Differences

### 1. `bookings` Table

#### Missing Columns in File 1 (compared to File 2):

1. **`ids_booking_reference`**
   ```sql
   ids_booking_reference varchar(50) NULL
   ```
   - Location: After `updated_at` column

2. **`other_guests`**
   ```sql
   other_guests json NULL
   ```
   - Location: After `ids_booking_reference`

3. **`estimate_details`**
   ```sql
   estimate_details json NULL
   ```
   - Location: After `other_guests`

4. **`confirmation_email_sent`**
   ```sql
   confirmation_email_sent bool DEFAULT false NULL
   ```
   - Location: After `estimate_details`

---

### 2. `pricing_bands` Table

#### Missing Columns in File 1 (compared to File 2):

1. **`package_price_extra_adult`**
   ```sql
   package_price_extra_adult int4 DEFAULT 0 NULL
   ```
   - Location: After `package_price_double`

2. **`package_price_child`**
   ```sql
   package_price_child int4 DEFAULT 0 NULL
   ```
   - Location: After `package_price_extra_adult`

#### Column Definition Differences:

| Column Name | File 1 (Incorrect) | File 2 (Correct) |
|------------|-------------------|------------------|
| `min_nights` | `int4 NOT NULL` | `int4 NULL` |
| `max_nights` | `int4 NULL` | `int4 NULL` ✓ |
| `pricing_type` | `varchar(20) DEFAULT 'per_night'::character varying NOT NULL` | `varchar(50) NULL` |
| `price_single` | `int4 NOT NULL` | `int4 NULL` |
| `price_double` | `int4 NOT NULL` | `int4 NULL` |
| `price_extra_adult` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 0 NULL` |
| `price_child` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 0 NULL` |
| `package_price_single` | `int4 NULL` | `int4 NULL` ✓ |
| `package_price_double` | `int4 NULL` | `int4 NULL` ✓ |
| `discount_percentage` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 0 NULL` |
| `early_bird_discount` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 0 NULL` |
| `season_name` | `varchar(50) NULL` | `varchar(50) NULL` ✓ |
| `valid_from` | `timestamp NULL` | `date NULL` |
| `valid_until` | `timestamp NULL` | `date NULL` |
| `minimum_advance_booking_days` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 3 NULL` |
| `maximum_advance_booking_days` | `int4 NULL` | `int4 NULL` ✓ |
| `notes` | `text NULL` | `text NULL` ✓ |
| `internal_notes` | `text NULL` | `text NULL` ✓ |
| `is_active` | `bool DEFAULT true NOT NULL` | `bool DEFAULT true NULL` |
| `priority` | `int4 DEFAULT 0 NOT NULL` | `int4 DEFAULT 1 NULL` |
| `created_at` | `timestamptz DEFAULT now() NOT NULL` | `timestamptz DEFAULT now() NULL` |
| `updated_at` | `timestamptz DEFAULT now() NOT NULL` | `timestamptz DEFAULT now() NULL` |

#### Missing Constraints in File 2:

File 2 does NOT have:
- `CONSTRAINT pricing_bands_pricing_type_check` (CHECK constraint for pricing_type values)
- `CONSTRAINT pricing_bands_program_id_fkey` (Foreign key to programs table)

---

## Summary

### Missing Columns in File 1 (Total: 6 columns)

**bookings table (4 missing columns):**
1. `ids_booking_reference varchar(50) NULL`
2. `other_guests json NULL`
3. `estimate_details json NULL`
4. `confirmation_email_sent bool DEFAULT false NULL`

**pricing_bands table (2 missing columns):**
1. `package_price_extra_adult int4 DEFAULT 0 NULL`
2. `package_price_child int4 DEFAULT 0 NULL`

### Column Type/Constraint Differences:

**pricing_bands table:**
- Most columns in File 1 have `NOT NULL` constraints that are `NULL` in File 2
- `pricing_type`: `varchar(20) NOT NULL` in File 1 → `varchar(50) NULL` in File 2
- `valid_from` and `valid_until`: `timestamp` in File 1 → `date` in File 2
- `minimum_advance_booking_days`: default `0` in File 1 → default `3` in File 2
- `priority`: default `0` in File 1 → default `1` in File 2

---

## Recommended SQL Migration

To update File 1 to match File 2, you would need:

```sql
-- ============================================
-- 1. Add missing columns to bookings table
-- ============================================
ALTER TABLE public.bookings 
    ADD COLUMN IF NOT EXISTS ids_booking_reference varchar(50) NULL,
    ADD COLUMN IF NOT EXISTS other_guests json NULL,
    ADD COLUMN IF NOT EXISTS estimate_details json NULL,
    ADD COLUMN IF NOT EXISTS confirmation_email_sent bool DEFAULT false NULL;

-- ============================================
-- 2. Add missing columns to pricing_bands table
-- ============================================
ALTER TABLE public.pricing_bands 
    ADD COLUMN IF NOT EXISTS package_price_extra_adult int4 DEFAULT 0 NULL,
    ADD COLUMN IF NOT EXISTS package_price_child int4 DEFAULT 0 NULL;

-- ============================================
-- 3. Modify pricing_bands columns to match File 2
-- WARNING: These changes involve removing NOT NULL constraints
-- and changing data types. Test carefully in a development environment first.
-- ============================================

-- Change pricing_type from varchar(20) NOT NULL to varchar(50) NULL
ALTER TABLE public.pricing_bands 
    ALTER COLUMN pricing_type TYPE varchar(50),
    ALTER COLUMN pricing_type DROP NOT NULL,
    ALTER COLUMN pricing_type DROP DEFAULT;

-- Change valid_from and valid_until from timestamp to date
ALTER TABLE public.pricing_bands 
    ALTER COLUMN valid_from TYPE date USING valid_from::date,
    ALTER COLUMN valid_until TYPE date USING valid_until::date;

-- Remove NOT NULL constraints and update defaults
ALTER TABLE public.pricing_bands 
    ALTER COLUMN min_nights DROP NOT NULL,
    ALTER COLUMN price_single DROP NOT NULL,
    ALTER COLUMN price_double DROP NOT NULL,
    ALTER COLUMN price_extra_adult DROP NOT NULL,
    ALTER COLUMN price_child DROP NOT NULL,
    ALTER COLUMN discount_percentage DROP NOT NULL,
    ALTER COLUMN early_bird_discount DROP NOT NULL,
    ALTER COLUMN minimum_advance_booking_days DROP NOT NULL,
    ALTER COLUMN minimum_advance_booking_days SET DEFAULT 3,
    ALTER COLUMN is_active DROP NOT NULL,
    ALTER COLUMN priority DROP NOT NULL,
    ALTER COLUMN priority SET DEFAULT 1,
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

-- Remove constraints that don't exist in File 2
ALTER TABLE public.pricing_bands 
    DROP CONSTRAINT IF EXISTS pricing_bands_pricing_type_check,
    DROP CONSTRAINT IF EXISTS pricing_bands_program_id_fkey;
```
