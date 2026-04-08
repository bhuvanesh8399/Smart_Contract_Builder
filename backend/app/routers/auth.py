from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db import get_db
from app.schemas.auth import LoginRequest, SignupRequest, TokenOut, UserOut
from app.schemas.common import APIResponse
from app.services.auth_service import authenticate_user, create_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=APIResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user, token = create_user(db, payload)
    return APIResponse(
        success=True,
        message="Signup successful",
        data=TokenOut(access_token=token, user=UserOut.model_validate(user)),
    )


@router.post("/login", response_model=APIResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user, token = authenticate_user(db, payload)
    return APIResponse(
        success=True,
        message="Login successful",
        data=TokenOut(access_token=token, user=UserOut.model_validate(user)),
    )


@router.get("/me", response_model=APIResponse)
def me(current_user=Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Current user fetched",
        data=UserOut.model_validate(current_user),
    )
