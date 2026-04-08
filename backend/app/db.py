from __future__ import annotations

import json
import shutil
import sqlite3
from collections.abc import Generator
from datetime import datetime
from pathlib import Path

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

NEW_USER_COLUMNS = {
    "id",
    "full_name",
    "email",
    "hashed_password",
    "freelancer_type",
    "is_active",
    "created_at",
}
NEW_CONTRACT_COLUMNS = {
    "id",
    "owner_id",
    "title",
    "client_name",
    "client_email",
    "freelancer_name",
    "project_scope",
    "payment_terms",
    "delivery_timeline",
    "revisions",
    "ownership_clause",
    "confidentiality_clause",
    "termination_clause",
    "notes",
    "status",
    "contract_text",
    "risk_score",
    "risk_level",
    "created_at",
    "updated_at",
}


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    _migrate_legacy_sqlite_if_needed()
    Base.metadata.create_all(bind=engine)


def _migrate_legacy_sqlite_if_needed() -> None:
    db_path = _get_sqlite_path()
    if db_path is None or not db_path.exists():
        return

    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    if not tables.intersection({"users", "contracts"}):
        return

    user_columns = (
        {column["name"] for column in inspector.get_columns("users")}
        if "users" in tables
        else set()
    )
    contract_columns = (
        {column["name"] for column in inspector.get_columns("contracts")}
        if "contracts" in tables
        else set()
    )

    schema_is_current = (
        ("users" not in tables or NEW_USER_COLUMNS.issubset(user_columns))
        and ("contracts" not in tables or NEW_CONTRACT_COLUMNS.issubset(contract_columns))
    )
    if schema_is_current:
        return

    backup_path = db_path.with_name(
        f"{db_path.stem}.legacy-backup-{datetime.now():%Y%m%d%H%M%S}{db_path.suffix}"
    )
    shutil.copy2(db_path, backup_path)

    legacy_users, legacy_contracts = _read_legacy_data(db_path, tables)

    from app.models import Contract, User
    from app.schemas.contract import PreviewRequest, RiskAnalyzeRequest
    from app.services.contract_builder import build_contract_text
    from app.services.risk_engine import analyze_contract_risk

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    try:
        for row in legacy_users:
            session.add(
                User(
                    id=row["id"],
                    full_name=row.get("full_name") or "Unknown User",
                    email=row["email"],
                    hashed_password=row["hashed_password"],
                    freelancer_type=row.get("freelancer_type"),
                    is_active=bool(row.get("is_active", True)),
                    created_at=_coerce_datetime(row.get("created_at")),
                )
            )
        session.flush()

        for row in legacy_contracts:
            transformed = _transform_legacy_contract(row)
            risk_payload = RiskAnalyzeRequest(
                title=transformed["title"],
                client_name=transformed["client_name"],
                project_scope=transformed["project_scope"],
                payment_terms=transformed["payment_terms"],
                delivery_timeline=transformed["delivery_timeline"],
                revisions=transformed["revisions"],
                ownership_clause=transformed["ownership_clause"],
                confidentiality_clause=transformed["confidentiality_clause"],
                termination_clause=transformed["termination_clause"],
            )
            risk = analyze_contract_risk(risk_payload)
            preview_payload = PreviewRequest(**transformed)
            contract_text = row.get("contract_text") or build_contract_text(preview_payload)

            session.add(
                Contract(
                    id=row["id"],
                    owner_id=row.get("owner_id") or row.get("user_id"),
                    contract_text=contract_text,
                    risk_score=risk.risk_score,
                    risk_level=risk.risk_level,
                    created_at=_coerce_datetime(row.get("created_at")),
                    updated_at=_coerce_datetime(row.get("updated_at")),
                    **transformed,
                )
            )

        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def _get_sqlite_path() -> Path | None:
    prefix = "sqlite:///"
    if not settings.database_url.startswith(prefix):
        return None
    return Path(settings.database_url[len(prefix) :])


def _read_legacy_data(db_path: Path, tables: set[str]) -> tuple[list[dict], list[dict]]:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    try:
        users = (
            [dict(row) for row in connection.execute("SELECT * FROM users").fetchall()]
            if "users" in tables
            else []
        )
        contracts = (
            [dict(row) for row in connection.execute("SELECT * FROM contracts").fetchall()]
            if "contracts" in tables
            else []
        )
        return users, contracts
    finally:
        connection.close()


def _transform_legacy_contract(row: dict) -> dict:
    if "project_scope" in row:
        return {
            "title": row["title"],
            "client_name": row["client_name"],
            "client_email": row.get("client_email"),
            "freelancer_name": row.get("freelancer_name"),
            "project_scope": row["project_scope"],
            "payment_terms": row["payment_terms"],
            "delivery_timeline": row["delivery_timeline"],
            "revisions": row["revisions"],
            "ownership_clause": row["ownership_clause"],
            "confidentiality_clause": row["confidentiality_clause"],
            "termination_clause": row["termination_clause"],
            "notes": row.get("notes"),
            "status": row.get("status", "draft"),
        }

    deliverables = _normalize_list(row.get("deliverables"))
    project_scope_parts = [row.get("scope_summary") or ""]
    if deliverables:
        project_scope_parts.append(
            "Deliverables:\n" + "\n".join(f"- {item}" for item in deliverables)
        )

    payment_terms_parts = [
        f"Payment structure: {row.get('payment_structure') or 'fixed'}."
    ]
    if row.get("payment_amount") is not None:
        payment_terms_parts.append(
            f"Project fee: {(row.get('currency') or 'USD')} {float(row['payment_amount']):,.2f}."
        )
    payment_terms_parts.append(
        f"Advance payment: {row.get('advance_payment_percentage', 0)}% before work begins."
    )
    if row.get("payment_due_days") is not None:
        payment_terms_parts.append(
            f"Invoices are due within {row['payment_due_days']} days."
        )
    if row.get("includes_extra_work_clause"):
        payment_terms_parts.append(
            "Out-of-scope work requires written approval and additional billing."
        )

    timeline_parts = []
    if row.get("start_date"):
        timeline_parts.append(f"Project start date: {row['start_date']}.")
    if row.get("delivery_date"):
        timeline_parts.append(f"Delivery date: {row['delivery_date']}.")
    if row.get("includes_delay_protection"):
        timeline_parts.append(
            "Client-side delays extend the delivery timeline proportionally."
        )
    if not timeline_parts:
        timeline_parts.append("Timeline will be agreed in writing before work starts.")

    revision_count = row.get("revision_count")
    if revision_count is None:
        revisions = "Revision policy will be agreed in writing before work begins."
    else:
        revisions = (
            f"{revision_count} revision round(s) are included. Additional changes are billed separately."
        )

    ownership_clause = (
        "Ownership transfers to the client only after full payment is received."
        if (row.get("ownership_transfer") or "").lower() == "after_full_payment"
        else f"Ownership transfer setting: {row.get('ownership_transfer') or 'custom'}."
    )
    confidentiality_clause = (
        "Both parties agree to keep confidential information private and use it only for this project."
        if row.get("includes_confidentiality")
        else "No standalone confidentiality clause was present in the legacy contract."
    )
    termination_parts = []
    if row.get("includes_cancellation"):
        termination_parts.append(
            "Either party may terminate with written notice, and completed work remains billable."
        )
    if row.get("includes_dispute_clause"):
        termination_parts.append(
            "Disputes should be resolved in good faith before formal escalation."
        )
    if not termination_parts:
        termination_parts.append("Termination terms were not clearly defined in the legacy contract.")

    notes_parts = []
    if row.get("project_type"):
        notes_parts.append(f"Legacy project type: {row['project_type']}.")
    if row.get("freelancer_role"):
        notes_parts.append(f"Freelancer role: {row['freelancer_role']}.")
    if row.get("client_company"):
        notes_parts.append(f"Client company: {row['client_company']}.")

    return {
        "title": row["title"],
        "client_name": row["client_name"],
        "client_email": row.get("client_email"),
        "freelancer_name": row.get("freelancer_role"),
        "project_scope": "\n\n".join(part for part in project_scope_parts if part.strip()),
        "payment_terms": " ".join(payment_terms_parts),
        "delivery_timeline": " ".join(timeline_parts),
        "revisions": revisions,
        "ownership_clause": ownership_clause,
        "confidentiality_clause": confidentiality_clause,
        "termination_clause": " ".join(termination_parts),
        "notes": " ".join(notes_parts) or None,
        "status": row.get("status", "draft"),
    }


def _normalize_list(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if str(item).strip()]
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return []
        try:
            parsed = json.loads(stripped)
        except json.JSONDecodeError:
            return [item.strip() for item in stripped.splitlines() if item.strip()]
        if isinstance(parsed, list):
            return [str(item) for item in parsed if str(item).strip()]
    return []


def _coerce_datetime(value: object) -> datetime:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            pass
    return datetime.utcnow()
