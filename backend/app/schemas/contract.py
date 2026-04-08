from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContractBase(BaseModel):
    title: str
    client_name: str
    client_email: str | None = None
    freelancer_name: str | None = None
    project_scope: str
    payment_terms: str
    delivery_timeline: str
    revisions: str
    ownership_clause: str
    confidentiality_clause: str
    termination_clause: str
    notes: str | None = None
    status: str = "draft"


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: str | None = None
    client_name: str | None = None
    client_email: str | None = None
    freelancer_name: str | None = None
    project_scope: str | None = None
    payment_terms: str | None = None
    delivery_timeline: str | None = None
    revisions: str | None = None
    ownership_clause: str | None = None
    confidentiality_clause: str | None = None
    termination_clause: str | None = None
    notes: str | None = None
    status: str | None = None


class ContractOut(ContractBase):
    id: int
    owner_id: int
    contract_text: str | None = None
    risk_score: float
    risk_level: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RiskAnalyzeRequest(BaseModel):
    title: str
    client_name: str
    project_scope: str
    payment_terms: str
    delivery_timeline: str
    revisions: str
    ownership_clause: str
    confidentiality_clause: str
    termination_clause: str


class RiskBreakdownItem(BaseModel):
    name: str
    score: int
    status: str


class RiskAnalyzeResponse(BaseModel):
    risk_score: float
    risk_level: str
    warnings: list[str]
    suggestions: list[str]
    protection_breakdown: list[RiskBreakdownItem]


class PreviewRequest(ContractBase):
    pass


class PreviewResponse(BaseModel):
    contract_text: str
