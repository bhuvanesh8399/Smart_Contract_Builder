from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.api import ApiResponse, success_response
from ..dependencies import get_current_user, get_db
from ..models import User
from ..schemas import MessageResponse, PasswordChange, UserOut
from ..services.profile_service import change_user_password

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ApiResponse[UserOut])
def get_profile(current_user: User = Depends(get_current_user)):
    return success_response(current_user, message="Profile loaded successfully")


@router.post("/change-password", response_model=ApiResponse[MessageResponse])
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return success_response(
        MessageResponse(message=change_user_password(payload, current_user, db)),
        message="Password changed successfully",
    )
