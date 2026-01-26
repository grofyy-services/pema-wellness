"""Add other_guests column to bookings table

Revision ID: cc1f05c5e66d
Revises: 010ba7636538
Create Date: 2025-11-24 04:25:46.444676

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc1f05c5e66d'
down_revision = '010ba7636538'
branch_labels = None
depends_on = None


def upgrade():
    # Add other_guests column to bookings table
    op.add_column('bookings', sa.Column('other_guests', sa.JSON(), nullable=True))


def downgrade():
    # Remove other_guests column from bookings table
    op.drop_column('bookings', 'other_guests')
