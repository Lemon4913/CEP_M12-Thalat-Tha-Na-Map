from sqlalchemy.orm import Session

from app.crypto.encryption import decrypt, encrypt
from app.models.visitor import Visitor


def is_registered(db: Session, visitor_id: str) -> bool:
    return db.get(Visitor, visitor_id) is not None


def register_visitor(db: Session, visitor_id: str, name: str, phone: str) -> Visitor:
    """Idempotent: a visitor registers once, up front, and it's reused for all 7 scans."""
    existing = db.get(Visitor, visitor_id)
    if existing is not None:
        return existing

    visitor = Visitor(
        visitor_id=visitor_id,
        name_encrypted=encrypt(name),
        phone_encrypted=encrypt(phone),
    )
    db.add(visitor)
    db.commit()
    return visitor


def decrypt_visitor(visitor: Visitor) -> tuple[str, str]:
    return decrypt(visitor.name_encrypted), decrypt(visitor.phone_encrypted)
