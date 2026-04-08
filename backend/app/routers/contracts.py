from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db import get_db
from app.models import Contract, User
from app.schemas.common import APIResponse
from app.schemas.contract import (
    ContractCreate,
    ContractOut,
    ContractUpdate,
    PreviewRequest,
    PreviewResponse,
    RiskAnalyzeRequest,
)
from app.services.contract_builder import build_contract_text
from app.services.risk_engine import analyze_contract_risk

router = APIRouter(prefix="/contracts", tags=["Contracts"])


def _get_user_contract_or_404(db: Session, contract_id: int, user_id: int) -> Contract:
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.owner_id == user_id)
        .first()
    )
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    return contract


@router.post("", response_model=APIResponse)
def create_contract(
    payload: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preview_text = build_contract_text(PreviewRequest(**payload.model_dump()))
    risk = analyze_contract_risk(RiskAnalyzeRequest(**payload.model_dump()))

    contract = Contract(
        owner_id=current_user.id,
        contract_text=preview_text,
        risk_score=risk.risk_score,
        risk_level=risk.risk_level,
        **payload.model_dump(),
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    return APIResponse(
        success=True,
        message="Contract created",
        data=ContractOut.model_validate(contract),
    )


@router.get("", response_model=APIResponse)
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contracts = (
        db.query(Contract)
        .filter(Contract.owner_id == current_user.id)
        .order_by(Contract.updated_at.desc())
        .all()
    )
    return APIResponse(
        success=True,
        message="Contracts fetched",
        data=[ContractOut.model_validate(contract) for contract in contracts],
    )


@router.post("/preview", response_model=APIResponse)
def preview_contract(payload: PreviewRequest):
    contract_text = build_contract_text(payload)
    return APIResponse(
        success=True,
        message="Preview generated",
        data=PreviewResponse(contract_text=contract_text),
    )


@router.post("/analyze-risk", response_model=APIResponse)
def analyze_risk(payload: RiskAnalyzeRequest):
    result = analyze_contract_risk(payload)
    return APIResponse(
        success=True,
        message="Risk analysis completed",
        data=result,
    )


@router.get("/{contract_id}", response_model=APIResponse)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = _get_user_contract_or_404(db, contract_id, current_user.id)
    return APIResponse(
        success=True,
        message="Contract fetched",
        data=ContractOut.model_validate(contract),
    )


@router.put("/{contract_id}", response_model=APIResponse)
def update_contract(
    contract_id: int,
    payload: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = _get_user_contract_or_404(db, contract_id, current_user.id)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(contract, field, value)

    preview_payload = PreviewRequest(
        title=contract.title,
        client_name=contract.client_name,
        client_email=contract.client_email,
        freelancer_name=contract.freelancer_name,
        project_scope=contract.project_scope,
        payment_terms=contract.payment_terms,
        delivery_timeline=contract.delivery_timeline,
        revisions=contract.revisions,
        ownership_clause=contract.ownership_clause,
        confidentiality_clause=contract.confidentiality_clause,
        termination_clause=contract.termination_clause,
        notes=contract.notes,
        status=contract.status,
    )
    risk_payload = RiskAnalyzeRequest(
        title=contract.title,
        client_name=contract.client_name,
        project_scope=contract.project_scope,
        payment_terms=contract.payment_terms,
        delivery_timeline=contract.delivery_timeline,
        revisions=contract.revisions,
        ownership_clause=contract.ownership_clause,
        confidentiality_clause=contract.confidentiality_clause,
        termination_clause=contract.termination_clause,
    )

    contract.contract_text = build_contract_text(preview_payload)
    risk = analyze_contract_risk(risk_payload)
    contract.risk_score = risk.risk_score
    contract.risk_level = risk.risk_level

    db.commit()
    db.refresh(contract)

    return APIResponse(
        success=True,
        message="Contract updated",
        data=ContractOut.model_validate(contract),
    )


@router.delete("/{contract_id}", response_model=APIResponse)
def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = _get_user_contract_or_404(db, contract_id, current_user.id)
    db.delete(contract)
    db.commit()

    return APIResponse(
        success=True,
        message="Contract deleted",
        data={"id": contract_id},
    )
