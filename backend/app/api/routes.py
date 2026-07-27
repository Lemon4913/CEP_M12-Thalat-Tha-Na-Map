from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.checkin import CheckIn
from app.models.poi import POI
from app.schemas import CheckInOut, CheckInRequest, CheckInResponse, POIOut
from app.services.checkins import record_checkin

router = APIRouter()


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
