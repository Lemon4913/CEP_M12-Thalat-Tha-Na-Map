from sqlalchemy import Column, Float, String

from app.db import Base


class POI(Base):
    __tablename__ = "pois"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # shop | history | art | food
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    # Real-world WGS84 decimal degrees, plotted on a Leaflet/OpenStreetMap map.
    # The x/y names are historical (these once held 0-100 layout percentages for
    # the illustrated SVG map) and are kept to avoid a migration.
    map_x = Column(Float, nullable=False)  # longitude
    map_y = Column(Float, nullable=False)  # latitude
    qr_secret = Column(String, nullable=False)
    status = Column(String, nullable=False, default="active")  # active | closed | relocated
