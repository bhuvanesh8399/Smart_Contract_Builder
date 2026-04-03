from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Contract Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Smart Contract Builder backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth_router)
