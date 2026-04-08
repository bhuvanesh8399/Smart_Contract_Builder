from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, computed_field


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=6, max_length=128)
    new_password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    auth_provider: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ContractBase(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    project_type: str = Field(min_length=2, max_length=80)
    freelancer_role: str = Field(min_length=2, max_length=80)
    client_name: str = Field(min_length=2, max_length=120)
    client_email: EmailStr | None = None
    client_company: str | None = Field(default=None, max_length=120)
    scope_summary: str = Field(min_length=20, max_length=5000)
    deliverables: list[str] = Field(default_factory=list)
    payment_amount: float | None = Field(default=None, ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=12)
    payment_structure: str = Field(default="fixed", min_length=3, max_length=40)
    advance_payment_percentage: int = Field(default=0, ge=0, le=100)
    payment_due_days: int | None = Field(default=None, ge=0, le=365)
    start_date: str | None = Field(default=None, max_length=20)
    delivery_date: str | None = Field(default=None, max_length=20)
    revision_count: int | None = Field(default=None, ge=0, le=100)
    ownership_transfer: str = Field(
        default="after_full_payment",
        min_length=3,
        max_length=80,
    )
    includes_confidentiality: bool = False
    includes_delay_protection: bool = False
    includes_cancellation: bool = False
    includes_extra_work_clause: bool = False
    includes_dispute_clause: bool = False
    status: str = Field(default="draft", min_length=3, max_length=40)


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    project_type: str | None = Field(default=None, min_length=2, max_length=80)
    freelancer_role: str | None = Field(default=None, min_length=2, max_length=80)
    client_name: str | None = Field(default=None, min_length=2, max_length=120)
    client_email: EmailStr | None = None
    client_company: str | None = Field(default=None, max_length=120)
    scope_summary: str | None = Field(default=None, min_length=20, max_length=5000)
    deliverables: list[str] | None = None
    payment_amount: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=3, max_length=12)
    payment_structure: str | None = Field(default=None, min_length=3, max_length=40)
    advance_payment_percentage: int | None = Field(default=None, ge=0, le=100)
    payment_due_days: int | None = Field(default=None, ge=0, le=365)
    start_date: str | None = Field(default=None, max_length=20)
    delivery_date: str | None = Field(default=None, max_length=20)
    revision_count: int | None = Field(default=None, ge=0, le=100)
    ownership_transfer: str | None = Field(default=None, min_length=3, max_length=80)
    includes_confidentiality: bool | None = None
    includes_delay_protection: bool | None = None
    includes_cancellation: bool | None = None
    includes_extra_work_clause: bool | None = None
    includes_dispute_clause: bool | None = None
    status: str | None = Field(default=None, min_length=3, max_length=40)


class RiskAnalysis(BaseModel):
    score: int
    level: str
    reasons: list[str]
    suggestions: list[str]
    missing_protections: list[str]


class ContractPreview(BaseModel):
    contract_text: str
    risk_score: int
    risk_level: str
    risk_reasons: list[str]
    risk_suggestions: list[str]
    missing_protections: list[str]

    @computed_field
    @property
    def analysis(self) -> RiskAnalysis:
        return RiskAnalysis(
            score=self.risk_score,
            level=self.risk_level,
            reasons=self.risk_reasons,
            suggestions=self.risk_suggestions,
            missing_protections=self.missing_protections,
        )


class ContractOut(ContractBase, ContractPreview):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ContractListItem(BaseModel):
    id: int
    title: str
    project_type: str
    freelancer_role: str
    client_name: str
    status: str
    risk_score: int
    risk_level: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class ContractListResponse(BaseModel):
    items: list[ContractListItem]
    total: int


class DashboardStats(BaseModel):
    total_contracts: int
    draft_contracts: int
    completed_contracts: int
    high_risk_contracts: int
    recent_contracts: list[ContractListItem]


class MessageResponse(BaseModel):
    message: str


class HealthData(BaseModel):
    status: str
    database: str
    version: str


class RootData(BaseModel):
    name: str
    version: str
    modules: list[str]
