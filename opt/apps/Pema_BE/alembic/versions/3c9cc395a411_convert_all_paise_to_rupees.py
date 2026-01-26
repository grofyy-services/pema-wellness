"""Convert all paise amounts to rupees

Revision ID: 3c9cc395a411
Revises: dcc4aedea65c
Create Date: 2025-12-02 16:15:00.000000

Convert all monetary amounts from paise to rupees throughout the database.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c9cc395a411'
down_revision = 'dcc4aedea65c'
branch_labels = None
depends_on = None


def upgrade():
    """Convert all paise amounts to rupees by dividing by 100"""

    # Convert booking amounts
    op.execute("UPDATE bookings SET total_amount = total_amount / 100 WHERE total_amount IS NOT NULL")
    op.execute("UPDATE bookings SET deposit_amount = deposit_amount / 100 WHERE deposit_amount IS NOT NULL")
    op.execute("UPDATE bookings SET paid_amount = paid_amount / 100 WHERE paid_amount IS NOT NULL")
    op.execute("UPDATE bookings SET balance_amount = balance_amount / 100 WHERE balance_amount IS NOT NULL")
    op.execute("UPDATE bookings SET refund_amount = refund_amount / 100 WHERE refund_amount IS NOT NULL")

    # Convert payment amounts
    op.execute("UPDATE payments SET amount = amount / 100 WHERE amount IS NOT NULL")
    op.execute("UPDATE payments SET net_amount = net_amount / 100 WHERE net_amount IS NOT NULL")
    op.execute("UPDATE payments SET refunded_amount = refunded_amount / 100 WHERE refunded_amount IS NOT NULL")

    # Convert refund amounts
    op.execute("UPDATE refunds SET amount = amount / 100 WHERE amount IS NOT NULL")

    # Convert room pricing
    op.execute("UPDATE rooms SET price_per_night_single = price_per_night_single / 100 WHERE price_per_night_single IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_double = price_per_night_double / 100 WHERE price_per_night_double IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_extra_adult = price_per_night_extra_adult / 100 WHERE price_per_night_extra_adult IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_child = price_per_night_child / 100 WHERE price_per_night_child IS NOT NULL")
    op.execute("UPDATE rooms SET deposit_amount = deposit_amount / 100 WHERE deposit_amount IS NOT NULL")

    # Convert program pricing
    op.execute("UPDATE programs SET price_base = price_base / 100 WHERE price_base IS NOT NULL")

    # Convert medical form refund amounts
    op.execute("UPDATE medical_forms SET refund_amount = refund_amount / 100 WHERE refund_amount IS NOT NULL")

    # Update pricing bands (already in rupees from previous migration, but ensure consistency)
    op.execute("UPDATE pricing_bands SET price_single = price_single WHERE price_single IS NOT NULL")  # No-op, already rupees
    op.execute("UPDATE pricing_bands SET price_double = price_double WHERE price_double IS NOT NULL")  # No-op, already rupees
    op.execute("UPDATE pricing_bands SET price_extra_adult = price_extra_adult WHERE price_extra_adult IS NOT NULL")  # No-op
    op.execute("UPDATE pricing_bands SET price_child = price_child WHERE price_child IS NOT NULL")  # No-op
    op.execute("UPDATE pricing_bands SET package_price_single = package_price_single WHERE package_price_single IS NOT NULL")  # No-op
    op.execute("UPDATE pricing_bands SET package_price_double = package_price_double WHERE package_price_double IS NOT NULL")  # No-op


def downgrade():
    """Convert all rupee amounts back to paise by multiplying by 100"""

    # Convert booking amounts back to paise
    op.execute("UPDATE bookings SET total_amount = total_amount * 100 WHERE total_amount IS NOT NULL")
    op.execute("UPDATE bookings SET deposit_amount = deposit_amount * 100 WHERE deposit_amount IS NOT NULL")
    op.execute("UPDATE bookings SET paid_amount = paid_amount * 100 WHERE paid_amount IS NOT NULL")
    op.execute("UPDATE bookings SET balance_amount = balance_amount * 100 WHERE balance_amount IS NOT NULL")
    op.execute("UPDATE bookings SET refund_amount = refund_amount * 100 WHERE refund_amount IS NOT NULL")

    # Convert payment amounts back to paise
    op.execute("UPDATE payments SET amount = amount * 100 WHERE amount IS NOT NULL")
    op.execute("UPDATE payments SET net_amount = net_amount * 100 WHERE net_amount IS NOT NULL")
    op.execute("UPDATE payments SET refunded_amount = refunded_amount * 100 WHERE refunded_amount IS NOT NULL")

    # Convert refund amounts back to paise
    op.execute("UPDATE refunds SET amount = amount * 100 WHERE amount IS NOT NULL")

    # Convert room pricing back to paise
    op.execute("UPDATE rooms SET price_per_night_single = price_per_night_single * 100 WHERE price_per_night_single IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_double = price_per_night_double * 100 WHERE price_per_night_double IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_extra_adult = price_per_night_extra_adult * 100 WHERE price_per_night_extra_adult IS NOT NULL")
    op.execute("UPDATE rooms SET price_per_night_child = price_per_night_child * 100 WHERE price_per_night_child IS NOT NULL")
    op.execute("UPDATE rooms SET deposit_amount = deposit_amount * 100 WHERE deposit_amount IS NOT NULL")

    # Convert program pricing back to paise
    op.execute("UPDATE programs SET price_base = price_base * 100 WHERE price_base IS NOT NULL")

    # Convert medical form refund amounts back to paise
    op.execute("UPDATE medical_forms SET refund_amount = refund_amount * 100 WHERE refund_amount IS NOT NULL")
