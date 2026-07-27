from sqlalchemy import Column, Float, String

from app.db import Base


class POI(Base):
    __tablename__ = "pois"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # shop | history | art | food
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    map_x = Column(Float, nullable=False)
    map_y = Column(Float, nullable=False)
    qr_secret = Column(String, nullable=False)
    status = Column(String, nullable=False, default="active")  # active | closed | relocated
