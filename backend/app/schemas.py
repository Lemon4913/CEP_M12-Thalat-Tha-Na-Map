from datetime import datetime

from pydantic import BaseModel


class POIOut(BaseModel):
    id: str
    name: str
    category: str
    description: str
    image_url: str
    map_x: float  # longitude (WGS84 decimal degrees)
    map_y: float  # latitude  (WGS84 decimal degrees)
    status: str

    class Config:
        from_attributes = True


class CheckInRequest(BaseModel):
    poi_id: str
    t: str
    visitor_id: str


class CheckInOut(BaseModel):
    id: str
    poi_id: str
    visitor_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class CheckInResponse(BaseModel):
    stamped: bool
    checkins: list[CheckInOut]


class VisitorRegisterRequest(BaseModel):
    visitor_id: str
    name: str
    phone: str


class VisitorStatus(BaseModel):
    registered: bool


class POIScanStats(BaseModel):
    poi_id: str
    total_scans: int
    valid_scans: int
    unique_visitors: int


class ScanLogEntry(BaseModel):
    visitor_id: str
    name: str
    phone: str
    token_valid: bool
    created_at: datetime
