"""Add estimate_details column to bookings table

Revision ID: 7dd50179166d
Revises: cc1f05c5e66d
Create Date: 2025-11-24 05:15:43.861925

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7dd50179166d'
down_revision = 'cc1f05c5e66d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('bookings', sa.Column('estimate_details', sa.JSON(), nullable=True))


def downgrade():
    op.drop_column('bookings', 'estimate_details')
