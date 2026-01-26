"""
Room Availability model for date-specific inventory management
"""

from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.postgresql import Base


class RoomAvailability(Base):
    """
    Stores date-specific availability for each room type.
    This table tracks how many rooms of each type are available on specific dates.
    """
    __tablename__ = "room_availability"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Room code (e.g., "STD", "EXT", "PBQ") instead of individual room_id
    room_code = Column(String(50), nullable=False, index=True)

    # Date for this availability record
    date = Column(Date, nullable=False, index=True)

    # Availability count (total rooms of this type available on this date)
    available_count = Column(Integer, default=0, nullable=False)

    # Restriction flags
    is_closed = Column(Boolean, default=False, nullable=False)
    is_closed_to_arrival = Column(Boolean, default=False, nullable=False)
    is_closed_to_departure = Column(Boolean, default=False, nullable=False)

    # Length of stay restrictions
    min_length_of_stay = Column(Integer, nullable=True)  # Minimum nights
    max_length_of_stay = Column(Integer, nullable=True)  # Maximum nights

    # Rate plan code (if availability is rate-plan specific)
    rate_plan_code = Column(String(50), nullable=True, index=True)

    # Source of this availability data (manual, ids_sync, etc.)
    source = Column(String(50), default="manual", nullable=False)

    # External reference (IDS echo token, etc.)
    external_reference = Column(String(255), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<RoomAvailability(room_code='{self.room_code}', date={self.date}, available={self.available_count})>"

    @property
    def is_available(self) -> bool:
        """Check if room is available (not closed and has available count > 0)"""
        return not self.is_closed and self.available_count > 0
