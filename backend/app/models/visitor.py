from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, String

from app.db import Base


class Visitor(Base):
    __tablename__ = "visitors"

    # Same anonymous id already used for check-ins (frontend/src/lib/visitor.ts).
    visitor_id = Column(String, primary_key=True)
    name_encrypted = Column(String, nullable=False)
    phone_encrypted = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
