from pydantic import BaseModel

from app.schemas.contract import ContractOut


class DashboardSummary(BaseModel):
    total_contracts: int
    drafts_count: int
    finalized_count: int
    risky_contracts_count: int
    recent_contracts: list[ContractOut]
