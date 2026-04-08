from sqlalchemy.orm import Session

from ..models import Contract, User
from ..schemas import DashboardStats


def get_dashboard_stats(current_user: User, db: Session) -> DashboardStats:
    contracts = (
        db.query(Contract)
        .filter(Contract.user_id == current_user.id)
        .order_by(Contract.updated_at.desc())
        .all()
    )

    total_contracts = len(contracts)
    draft_contracts = sum(1 for contract in contracts if contract.status.lower() == "draft")
    completed_contracts = sum(
        1 for contract in contracts if contract.status.lower() == "completed"
    )
    high_risk_contracts = sum(1 for contract in contracts if contract.risk_level == "High")

    return DashboardStats(
        total_contracts=total_contracts,
        draft_contracts=draft_contracts,
        completed_contracts=completed_contracts,
        high_risk_contracts=high_risk_contracts,
        recent_contracts=contracts[:5],
    )
