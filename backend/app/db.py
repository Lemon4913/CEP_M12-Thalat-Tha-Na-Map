import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# app.db is imported before anything else that reads os.environ (DATABASE_URL
# right below, ENCRYPTION_KEY / ADMIN_API_KEY read lazily elsewhere), so this
# is the one place .env needs to be loaded from.
load_dotenv()

# Falls back to a local SQLite file if DATABASE_URL isn't set, so the team can
# run the prototype without standing up Postgres. Set DATABASE_URL in .env to
# use Postgres instead (see .env.example).
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./dev.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
