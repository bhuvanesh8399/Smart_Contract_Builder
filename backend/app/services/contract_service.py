from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..contract_engine import analyze_contract, render_contract_text
from ..models import Contract, User
from ..schemas import (
    ContractCreate,
    ContractListResponse,
    ContractOut,
    ContractPreview,
    ContractUpdate,
)


def get_owned_contract(contract_id: int, user_id: int, db: Session) -> Contract:
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.user_id == user_id)
        .first()
    )
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )
    return contract


def preview_contract(payload: ContractCreate) -> ContractPreview:
    analysis = analyze_contract(payload)
    contract_text = render_contract_text(payload)
    return ContractPreview(
        contract_text=contract_text,
        risk_score=analysis.score,
        risk_level=analysis.level,
        risk_reasons=analysis.reasons,
        risk_suggestions=analysis.suggestions,
        missing_protections=analysis.missing_protections,
    )


def create_contract(payload: ContractCreate, current_user: User, db: Session) -> Contract:
    preview = preview_contract(payload)
    contract = Contract(
        user_id=current_user.id,
        **payload.model_dump(),
        contract_text=preview.contract_text,
        risk_score=preview.risk_score,
        risk_level=preview.risk_level,
        risk_reasons=preview.risk_reasons,
        risk_suggestions=preview.risk_suggestions,
        missing_protections=preview.missing_protections,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


def list_contracts(
    current_user: User,
    db: Session,
    status_filter: str | None = None,
    search: str | None = None,
) -> ContractListResponse:
    query = db.query(Contract).filter(Contract.user_id == current_user.id)

    if status_filter:
        query = query.filter(Contract.status == status_filter)

    if search:
        like = f"%{search.strip()}%"
        query = query.filter(
            Contract.title.ilike(like)
            | Contract.client_name.ilike(like)
            | Contract.project_type.ilike(like)
        )

    items = query.order_by(Contract.updated_at.desc()).all()
    return ContractListResponse(items=items, total=len(items))


def get_contract(contract_id: int, current_user: User, db: Session) -> Contract:
    return get_owned_contract(contract_id, current_user.id, db)


def update_contract(
    contract_id: int,
    payload: ContractUpdate,
    current_user: User,
    db: Session,
) -> Contract:
    contract = get_owned_contract(contract_id, current_user.id, db)
    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(contract, field, value)

    analysis = analyze_contract(contract)
    contract.contract_text = render_contract_text(contract)
    contract.risk_score = analysis.score
    contract.risk_level = analysis.level
    contract.risk_reasons = analysis.reasons
    contract.risk_suggestions = analysis.suggestions
    contract.missing_protections = analysis.missing_protections

    db.commit()
    db.refresh(contract)
    return contract


def refresh_contract_analysis(contract_id: int, current_user: User, db: Session) -> Contract:
    contract = get_owned_contract(contract_id, current_user.id, db)
    analysis = analyze_contract(contract)
    contract.contract_text = render_contract_text(contract)
    contract.risk_score = analysis.score
    contract.risk_level = analysis.level
    contract.risk_reasons = analysis.reasons
    contract.risk_suggestions = analysis.suggestions
    contract.missing_protections = analysis.missing_protections
    db.commit()
    db.refresh(contract)
    return contract


def delete_contract(contract_id: int, current_user: User, db: Session) -> None:
    contract = get_owned_contract(contract_id, current_user.id, db)
    db.delete(contract)
    db.commit()


def download_contract(contract_id: int, current_user: User, db: Session) -> tuple[str, str]:
    contract = get_owned_contract(contract_id, current_user.id, db)
    filename = f"contract-{contract.id}.txt"
    return contract.contract_text, filename
