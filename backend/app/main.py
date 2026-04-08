from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import init_db
from app.routers.auth import router as auth_router
from app.routers.contracts import router as contracts_router
from app.routers.dashboard import router as dashboard_router

init_db()

app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "API is healthy",
        "data": {"service": settings.app_name},
    }


app.include_router(auth_router)
app.include_router(contracts_router)
app.include_router(dashboard_router)
