from datetime import datetime

from pydantic import BaseModel


class POIOut(BaseModel):
    id: str
    name: str
    category: str
    description: str
    image_url: str
    map_x: float
    map_y: float
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
