from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(title="Thalat Tha Na Map API")
app.include_router(router)
