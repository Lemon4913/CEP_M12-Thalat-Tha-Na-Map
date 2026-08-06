import os

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.checkin import CheckIn
from app.models.poi import POI
from app.models.scan_event import ScanEvent
from app.models.visitor import Visitor
from app.schemas import (
    CheckInOut,
    CheckInRequest,
    CheckInResponse,
    POIOut,
    POIScanStats,
    ScanLogEntry,
    VisitorRegisterRequest,
    VisitorStatus,
)
from app.services.checkins import record_checkin
from app.services.visitors import decrypt_visitor, is_registered, register_visitor

router = APIRouter()


def require_admin(x_admin_key: str = Header(default="")) -> None:
    """Guards endpoints that return decrypted visitor PII.

    Minimal shared-secret check — there's no broader auth system in this app
    yet. Swap for real admin auth before this is used for anything beyond a
    small organizing team looking up scan activity.
    """
    expected = os.environ.get("ADMIN_API_KEY")
    if not expected or x_admin_key != expected:
        raise HTTPException(status_code=403, detail="Not authorized")


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/pois", response_model=list[POIOut])
def list_pois(db: Session = Depends(get_db)):
    return db.query(POI).filter(POI.status == "active").all()


@router.get("/api/pois/{poi_id}", response_model=POIOut)
def get_poi(poi_id: str, db: Session = Depends(get_db)):
    poi = db.get(POI, poi_id)
    if poi is None:
        raise HTTPException(status_code=404, detail="POI not found")
    return poi


@router.post("/api/checkins", response_model=CheckInResponse)
def create_checkin(body: CheckInRequest, db: Session = Depends(get_db)):
    stamped, checkins = record_checkin(db, body.poi_id, body.t, body.visitor_id)
    return CheckInResponse(stamped=stamped, checkins=[CheckInOut.model_validate(c) for c in checkins])


@router.get("/api/checkins", response_model=list[CheckInOut])
def list_checkins(visitor_id: str, db: Session = Depends(get_db)):
    return db.query(CheckIn).filter(CheckIn.visitor_id == visitor_id).order_by(CheckIn.created_at).all()


@router.post("/api/visitors/register", response_model=VisitorStatus)
def register(body: VisitorRegisterRequest, db: Session = Depends(get_db)):
    register_visitor(db, body.visitor_id, body.name, body.phone)
    return VisitorStatus(registered=True)


@router.get("/api/visitors/{visitor_id}/status", response_model=VisitorStatus)
def visitor_status(visitor_id: str, db: Session = Depends(get_db)):
    return VisitorStatus(registered=is_registered(db, visitor_id))


@router.get("/api/pois/{poi_id}/scans", response_model=POIScanStats)
def poi_scan_stats(poi_id: str, db: Session = Depends(get_db)):
    """Public counts only — no visitor identity, safe to expose without auth."""
    events = db.query(ScanEvent).filter(ScanEvent.poi_id == poi_id).all()
    return POIScanStats(
        poi_id=poi_id,
        total_scans=len(events),
        valid_scans=sum(1 for e in events if e.token_valid),
        unique_visitors=len({e.visitor_id for e in events}),
    )


@router.get(
    "/api/admin/pois/{poi_id}/scan-log",
    response_model=list[ScanLogEntry],
    dependencies=[Depends(require_admin)],
)
def poi_scan_log(poi_id: str, db: Session = Depends(get_db)):
    """Who scanned this POI and when, with decrypted name/phone. Admin-key gated."""
    events = (
        db.query(ScanEvent)
        .filter(ScanEvent.poi_id == poi_id)
        .order_by(ScanEvent.created_at)
        .all()
    )
    entries = []
    for event in events:
        visitor = db.get(Visitor, event.visitor_id)
        if visitor is not None:
            name, phone = decrypt_visitor(visitor)
        else:
            name, phone = "(not registered)", ""
        entries.append(
            ScanLogEntry(
                visitor_id=event.visitor_id,
                name=name,
                phone=phone,
                token_valid=event.token_valid,
                created_at=event.created_at,
            )
        )
    return entries
