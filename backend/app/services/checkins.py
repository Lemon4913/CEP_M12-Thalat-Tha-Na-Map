from sqlalchemy.orm import Session

from app.models.checkin import CheckIn
from app.models.poi import POI


def record_checkin(db: Session, poi_id: str, token: str, visitor_id: str) -> tuple[bool, list[CheckIn]]:
    """Validate the QR token and record a stamp. Returns (stamped, this visitor's checkins).

    Invalid/missing token or unknown POI does not raise — it just doesn't grant a
    stamp, so a broken/copied link still lets the check-in page render POI info.
    """
    poi = db.get(POI, poi_id)
    stamped = False

    if poi is not None and poi.qr_secret == token:
        already_stamped = (
            db.query(CheckIn)
            .filter(CheckIn.poi_id == poi_id, CheckIn.visitor_id == visitor_id)
            .first()
        )
        if already_stamped is None:
            db.add(CheckIn(poi_id=poi_id, visitor_id=visitor_id))
            db.commit()
        stamped = True

    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.visitor_id == visitor_id)
        .order_by(CheckIn.created_at)
        .all()
    )
    return stamped, checkins
