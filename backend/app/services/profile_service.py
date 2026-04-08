from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models import User
from ..schemas import PasswordChange
from ..security import get_password_hash, verify_password


def change_user_password(payload: PasswordChange, current_user: User, db: Session) -> str:
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )

    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return "Password updated successfully"
