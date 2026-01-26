"""Convert pricing bands from paise to rupees

Revision ID: dcc4aedea65c
Revises: 7dd50179166d
Create Date: 2025-12-02 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dcc4aedea65c'
down_revision = '7dd50179166d'
branch_labels = None
depends_on = None


def upgrade():
    # Convert pricing band amounts from paise to rupees (divide by 100)
    op.execute("UPDATE pricing_bands SET price_single = price_single / 100 WHERE price_single IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_double = price_double / 100 WHERE price_double IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_extra_adult = price_extra_adult / 100 WHERE price_extra_adult IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_child = price_child / 100 WHERE price_child IS NOT NULL")
    op.execute("UPDATE pricing_bands SET package_price_single = package_price_single / 100 WHERE package_price_single IS NOT NULL")
    op.execute("UPDATE pricing_bands SET package_price_double = package_price_double / 100 WHERE package_price_double IS NOT NULL")


def downgrade():
    # Convert pricing band amounts back from rupees to paise (multiply by 100)
    op.execute("UPDATE pricing_bands SET price_single = price_single * 100 WHERE price_single IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_double = price_double * 100 WHERE price_double IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_extra_adult = price_extra_adult * 100 WHERE price_extra_adult IS NOT NULL")
    op.execute("UPDATE pricing_bands SET price_child = price_child * 100 WHERE price_child IS NOT NULL")
    op.execute("UPDATE pricing_bands SET package_price_single = package_price_single * 100 WHERE package_price_single IS NOT NULL")
    op.execute("UPDATE pricing_bands SET package_price_double = package_price_double * 100 WHERE package_price_double IS NOT NULL")
