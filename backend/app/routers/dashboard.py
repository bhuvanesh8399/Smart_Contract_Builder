from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db import get_db
from app.models import Contract, User
from app.schemas.common import APIResponse
from app.schemas.contract import ContractOut
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=APIResponse)
def summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_contracts = db.query(Contract).filter(Contract.owner_id == current_user.id)

    total_contracts = user_contracts.count()
    drafts_count = user_contracts.filter(Contract.status == "draft").count()
    finalized_count = user_contracts.filter(Contract.status == "finalized").count()
    risky_contracts_count = user_contracts.filter(Contract.risk_level == "HIGH").count()

    recent = user_contracts.order_by(Contract.updated_at.desc()).limit(5).all()

    data = DashboardSummary(
        total_contracts=total_contracts,
        drafts_count=drafts_count,
        finalized_count=finalized_count,
        risky_contracts_count=risky_contracts_count,
        recent_contracts=[ContractOut.model_validate(item) for item in recent],
    )

    return APIResponse(
        success=True,
        message="Dashboard summary fetched",
        data=data,
    )
