from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.poi import POI


def seed():

    db: Session = SessionLocal()

    coffee = POI(
        id="coffee",
        name="ร้านกาแฟโบราณ",
        category="food",
        description="ร้านกาแฟเก่าแก่กว่า 40 ปี",
        image_url="/images/coffee.jpg",
        map_x=250,
        map_y=180,
        qr_secret="abc123",
        status="active",
    )

    noodle = POI(
        id="noodle",
        name="ร้านก๋วยเตี๋ยวเจ๊แดง",
        category="food",
        description="ร้านก๋วยเตี๋ยวชื่อดัง",
        image_url="/images/noodle.jpg",
        map_x=300,
        map_y=220,
        qr_secret="xyz123",
        status="active",
    )

    db.add_all([coffee, noodle])

    db.commit()

    db.close()


if __name__ == "__main__":
    seed()
