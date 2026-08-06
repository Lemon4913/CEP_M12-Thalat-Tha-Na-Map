import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, String

from app.db import Base


class ScanEvent(Base):
    __tablename__ = "scan_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    # Not a FK: unlike CheckIn, this log must still capture scans against a
    # poi_id that doesn't exist (tampered/malformed QR links) without failing.
    poi_id = Column(String, nullable=False)
    visitor_id = Column(String, nullable=False)
    token_valid = Column(Boolean, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
