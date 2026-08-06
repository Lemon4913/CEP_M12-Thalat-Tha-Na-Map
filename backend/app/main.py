from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.db import Base, SessionLocal, engine
from app.models.poi import POI
from app.models.scan_event import ScanEvent  # noqa: F401 — registers table with Base
from app.models.visitor import Visitor  # noqa: F401 — registers table with Base

app = FastAPI(title="Thalat Tha Na Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Real 7 check-in points, gathered on-site by the team. qr_secret values are
# random tokens generated once here — they must match whatever gets printed
# on the physical QR signage (see Person 5's QR generation step).
#
# COORDINATES: map_x is LONGITUDE and map_y is LATITUDE (WGS84 decimal degrees),
# plotted on a real Leaflet/OpenStreetMap map by the frontend. The column names
# and Float type are historical — they used to hold 0-100 layout percentages for
# the old illustrated SVG map — and are kept as-is to avoid a DB migration.
#
# REAL SURVEYED COORDINATES, recorded on-site by the team (DMS, converted to
# WGS84 decimal degrees below). Replacing any of these later is still a
# one-line change (edit map_x / map_y, restart the API — startup syncs the
# new values into an already-seeded database) and needs no frontend change.
MARKET_CENTER_LAT = 13.80187
MARKET_CENTER_LNG = 100.18711

SEED_POIS = [
    POI(
        id="1",
        name="ศาลเจ้าแม่เบิกไพร",
        category="history",
        description="ศาลเจ้าแม่เบิกไพร จุดสักการะภายในตลาดท่านา",
        image_url="/placeholder-poi.jpg",
        map_x=100.18577,  # lng — 100°11'08.76"E
        map_y=13.80173,  # lat — 13°48'06.24"N
        qr_secret="TCuNESUrsuTXuh1h",
        status="active",
    ),
    POI(
        id="2",
        name="ท่าเรือริมน้ำตลาดท่านา",
        category="history",
        description="ท่าเรือริมแม่น้ำตลาดท่านา จุดสังเกตคือป้ายตลาดท่านา",
        image_url="/placeholder-poi.jpg",
        map_x=100.18731,  # lng — 100°11'14.32"E
        map_y=13.80192,  # lat — 13°48'06.91"N
        qr_secret="07gCmUoTTqEj0Uad",
        status="active",
    ),
    POI(
        id="3",
        name="โซนร้านค้าสามแยก",
        category="shop",
        description="โซนร้านค้าใกล้สามแยก รวมร้านเบเกอรี่มาม่อนจัง ร้านป้าระเบียบ ร้านของฝากตลาดท่านา และร้านลั่งเอง",
        image_url="/placeholder-poi.jpg",
        map_x=100.18663,  # lng — 100°11'11.85"E
        map_y=13.80214,  # lat — 13°48'07.70"N
        qr_secret="jFuIRGeZjGrEsqkp",
        status="active",
    ),
    POI(
        id="4",
        name="โซนเดินเล่นทางเข้าฝั่งซ้าย",
        category="shop",
        description="โซนเดินเล่นและช้อปปิ้งบริเวณทางเข้าฝั่งซ้าย มีทั้งร้านของเล่นและที่นั่งกินข้าว",
        image_url="/placeholder-poi.jpg",
        map_x=100.18711,  # lng — 100°11'13.61"E
        map_y=13.80182,  # lat — 13°48'06.54"N
        qr_secret="L0SJeZHRHB_ifTLh",
        status="active",
    ),
    POI(
        id="5",
        name="ร้าน Aya Coffee",
        category="food",
        description="ร้านกาแฟ Aya Coffee",
        image_url="/placeholder-poi.jpg",
        map_x=100.18635,  # lng — 100°11'10.86"E
        map_y=13.80206,  # lat — 13°48'07.41"N
        qr_secret="2koretcwPISIjrLI",
        status="active",
    ),
    POI(
        id="6",
        name="ร้านบ้านส้มโอหวาน",
        category="food",
        description="ร้านบ้านส้มโอหวาน จำหน่ายส้มโอ",
        image_url="/placeholder-poi.jpg",
        map_x=100.18678,  # lng — 100°11'12.42"E
        map_y=13.80226,  # lat — 13°48'08.12"N
        qr_secret="sY-SIXmCOqNOeGUF",
        status="active",
    ),
    POI(
        id="7",
        name="ร้านแม่จำเริญ กล้วยอบน้ำผึ้งทอด",
        category="food",
        description="ร้านแม่จำเริญ ขายกล้วยอบน้ำผึ้งทอด",
        image_url="/placeholder-poi.jpg",
        map_x=100.18626,  # lng — 100°11'10.55"E
        map_y=13.80204,  # lat — 13°48'07.35"N
        qr_secret="uQoQXZsyMEYPSxbi",
        status="active",
    ),
]


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(POI).count() == 0:
            db.add_all(SEED_POIS)
        else:
            # Already seeded. Push coordinate edits from SEED_POIS into the
            # existing rows so that dropping in real surveyed GPS is genuinely a
            # one-line change per POI — without this, edits above would be
            # silently ignored on any database that has already been seeded
            # (including every dev.db created before the switch to lat/lng).
            # Only coordinates are synced; visitor check-ins are never touched.
            for seed in SEED_POIS:
                existing = db.get(POI, seed.id)
                if existing is not None:
                    existing.map_x = seed.map_x
                    existing.map_y = seed.map_y
        db.commit()
    finally:
        db.close()
