from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.db import Base, SessionLocal, engine
from app.models.poi import POI

app = FastAPI(title="Thalat Tha Na Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Sample POIs so the team can test the QR check-in flow end to end this week.
# Swap for the real, agreed POI list (see docs/webapp-plan.md §6) before field testing.
SEED_POIS = [
    POI(
        id="1",
        name="Ban Khun Mae Noodle Shop",
        category="food",
        description="A family-run boat-noodle shop open since the 1960s, known for its dark herbal broth.",
        image_url="/placeholder-poi.jpg",
        map_x=22,
        map_y=38,
        qr_secret="dev-secret-1",
        status="active",
    ),
    POI(
        id="2",
        name="Old Rice Pier",
        category="history",
        description='The pier that gave the market its name ("Tha Na") — once used to trade rice by boat.',
        image_url="/placeholder-poi.jpg",
        map_x=55,
        map_y=20,
        qr_secret="dev-secret-2",
        status="active",
    ),
    POI(
        id="3",
        name="Riverside Mural Wall",
        category="art",
        description="A community mural project depicting the market's history, painted by local artists.",
        image_url="/placeholder-poi.jpg",
        map_x=70,
        map_y=60,
        qr_secret="dev-secret-3",
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
            db.commit()
    finally:
        db.close()
