# Migration Status Report

## Overview
This report shows which schema changes have migrations in `opt/apps/Pema_BE/alembic/versions/` and which are missing.

---

## Missing Columns Analysis

### ✅ **Migrations That EXIST**

#### 1. `other_guests` column in `bookings` table
- **Migration File**: `cc1f05c5e66d_add_other_guests_column_to_bookings_.py`
- **Status**: ✅ Migration exists
- **Revision**: `cc1f05c5e66d`
- **Down Revision**: `010ba7636538`
- **Date**: 2025-11-24 04:25:46

```python
def upgrade():
    op.add_column('bookings', sa.Column('other_guests', sa.JSON(), nullable=True))
```

#### 2. `estimate_details` column in `bookings` table
- **Migration File**: `7dd50179166d_add_estimate_details_column_to_bookings_.py`
- **Status**: ✅ Migration exists
- **Revision**: `7dd50179166d`
- **Down Revision**: `cc1f05c5e66d`
- **Date**: 2025-11-24 05:15:43

```python
def upgrade():
    op.add_column('bookings', sa.Column('estimate_details', sa.JSON(), nullable=True))
```

---

### ❌ **Migrations That are MISSING**

#### 1. `ids_booking_reference` column in `bookings` table
- **Status**: ❌ **NO MIGRATION FILE EXISTS**
- **Model Definition**: ✅ Defined in `app/models/booking.py` (line 85)
- **Usage**: ✅ Used in multiple files (payments.py, bookings.py, ids_booking_storage.py, etc.)
- **Documentation**: Mentioned in `IDS_INTEGRATION_VPS_BOOKING_MANAGEMENT.md` with manual SQL:
  ```sql
  ALTER TABLE bookings ADD COLUMN ids_booking_reference VARCHAR(50);
  ```
- **Action Required**: Create migration file

#### 2. `confirmation_email_sent` column in `bookings` table
- **Status**: ❌ **NO MIGRATION FILE EXISTS**
- **Model Definition**: ✅ Defined in `app/models/booking.py` (line 109)
- **Usage**: ✅ Used in `app/main.py` and `app/api/v1/payments.py`
- **Action Required**: Create migration file

#### 3. `package_price_extra_adult` column in `pricing_bands` table
- **Status**: ❌ **NO MIGRATION FILE EXISTS**
- **Model Definition**: ❌ **NOT EVEN IN THE MODEL** (`app/models/pricing.py`)
- **Schema File 2**: ✅ Present in correct schema (Untitled-2)
- **Action Required**: 
  1. Add to model first
  2. Create migration file

#### 4. `package_price_child` column in `pricing_bands` table
- **Status**: ❌ **NO MIGRATION FILE EXISTS**
- **Model Definition**: ❌ **NOT EVEN IN THE MODEL** (`app/models/pricing.py`)
- **Schema File 2**: ✅ Present in correct schema (Untitled-2)
- **Action Required**: 
  1. Add to model first
  2. Create migration file

---

## Migration Chain

Current migration chain (from oldest to newest):
1. `010ba7636538_add_booking_details_to_payments_table.py` (base)
2. `cc1f05c5e66d_add_other_guests_column_to_bookings_.py` ✅
3. `7dd50179166d_add_estimate_details_column_to_bookings_.py` ✅
4. `3c9cc395a411_convert_all_paise_to_rupees.py`
5. `dcc4aedea65c_convert_pricing_bands_from_paise_to_rupees.py`

---

## Recommended Actions

### Priority 1: Create Missing Migrations

#### 1. Create migration for `ids_booking_reference`
```bash
cd opt/apps/Pema_BE
alembic revision -m "add_ids_booking_reference_to_bookings"
```

Migration content:
```python
def upgrade():
    op.add_column('bookings', sa.Column('ids_booking_reference', sa.String(50), nullable=True))
    op.create_index(op.f('ix_bookings_ids_booking_reference'), 'bookings', ['ids_booking_reference'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_bookings_ids_booking_reference'), table_name='bookings')
    op.drop_column('bookings', 'ids_booking_reference')
```

#### 2. Create migration for `confirmation_email_sent`
```bash
alembic revision -m "add_confirmation_email_sent_to_bookings"
```

Migration content:
```python
def upgrade():
    op.add_column('bookings', sa.Column('confirmation_email_sent', sa.Boolean(), nullable=False, server_default='false'))

def downgrade():
    op.drop_column('bookings', 'confirmation_email_sent')
```

#### 3. Update `pricing.py` model first, then create migration for `package_price_extra_adult` and `package_price_child`
```bash
# First update app/models/pricing.py to add:
# package_price_extra_adult = Column(Integer, nullable=True)
# package_price_child = Column(Integer, nullable=True)

# Then create migration:
alembic revision -m "add_package_price_extra_adult_and_child_to_pricing_bands"
```

Migration content:
```python
def upgrade():
    op.add_column('pricing_bands', sa.Column('package_price_extra_adult', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('pricing_bands', sa.Column('package_price_child', sa.Integer(), nullable=True, server_default='0'))

def downgrade():
    op.drop_column('pricing_bands', 'package_price_child')
    op.drop_column('pricing_bands', 'package_price_extra_adult')
```

---

## Summary

| Column | Table | Migration Status | Model Status | Action Needed |
|--------|-------|----------------|-------------|---------------|
| `other_guests` | bookings | ✅ Exists | ✅ Defined | None |
| `estimate_details` | bookings | ✅ Exists | ✅ Defined | None |
| `ids_booking_reference` | bookings | ❌ Missing | ✅ Defined | Create migration |
| `confirmation_email_sent` | bookings | ❌ Missing | ✅ Defined | Create migration |
| `package_price_extra_adult` | pricing_bands | ❌ Missing | ❌ Missing | Add to model + Create migration |
| `package_price_child` | pricing_bands | ❌ Missing | ❌ Missing | Add to model + Create migration |

---

## Notes

1. **`ids_booking_reference`** and **`confirmation_email_sent`** are already in the codebase models and being used, but migrations were never created. These were likely added manually to the database.

2. **`package_price_extra_adult`** and **`package_price_child`** are missing from both the model AND migrations. These need to be added to the model first, then migrations created.

3. The migration chain should be updated to include these missing migrations in the correct order.
