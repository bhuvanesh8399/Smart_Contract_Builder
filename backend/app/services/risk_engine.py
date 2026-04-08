from app.schemas.contract import (
    RiskAnalyzeRequest,
    RiskAnalyzeResponse,
    RiskBreakdownItem,
)


def _contains_any(text: str, keywords: list[str]) -> bool:
    lower = (text or "").lower()
    return any(keyword in lower for keyword in keywords)


def analyze_contract_risk(payload: RiskAnalyzeRequest) -> RiskAnalyzeResponse:
    risk_score = 0
    warnings: list[str] = []
    suggestions: list[str] = []

    scope_text = payload.project_scope or ""
    payment_text = payload.payment_terms or ""
    timeline_text = payload.delivery_timeline or ""
    revisions_text = payload.revisions or ""
    ownership_text = payload.ownership_clause or ""
    confidentiality_text = payload.confidentiality_clause or ""
    termination_text = payload.termination_clause or ""

    if not _contains_any(payment_text, ["advance", "upfront", "deposit", "%"]):
        risk_score += 20
        warnings.append("No strong advance payment protection detected.")
        suggestions.append("Add 30%-50% advance payment before work begins.")

    if len(scope_text.strip()) < 60:
        risk_score += 15
        warnings.append("Project scope looks vague or too short.")
        suggestions.append("Describe deliverables, exclusions, and number of outputs clearly.")

    if not _contains_any(timeline_text, ["day", "date", "week", "month", "deadline"]):
        risk_score += 15
        warnings.append("No clear deadline or delivery timeline found.")
        suggestions.append("Add a delivery date and milestone schedule.")

    if _contains_any(revisions_text, ["unlimited"]) or len(revisions_text.strip()) < 10:
        risk_score += 10
        warnings.append("Revision policy is weak or unlimited.")
        suggestions.append("Cap revisions to a fixed number and define extra charges.")

    if len(ownership_text.strip()) < 20:
        risk_score += 15
        warnings.append("Ownership/IP clause is weak or missing.")
        suggestions.append("State when ownership transfers and after which payment condition.")

    if len(confidentiality_text.strip()) < 20:
        risk_score += 10
        warnings.append("Confidentiality clause is weak or missing.")
        suggestions.append("Add a confidentiality clause covering client data and project assets.")

    if len(termination_text.strip()) < 20:
        risk_score += 10
        warnings.append("Termination clause is weak or missing.")
        suggestions.append("Add cancellation notice period and payment terms for terminated work.")

    if not _contains_any(payment_text, ["late fee", "non-refundable", "invoice", "due", "payment"]):
        risk_score += 5
        warnings.append("Payment terms do not strongly protect delayed or missed payments.")
        suggestions.append("Add invoice due dates, late fees, and non-refundable deposit terms.")

    risk_score = min(float(risk_score), 100.0)

    if risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    payment_has_deposit = _contains_any(payment_text, ["advance", "upfront", "deposit", "%"])
    payment_has_enforcement = _contains_any(
        payment_text, ["late fee", "invoice", "due", "payment"]
    )
    timeline_has_dates = _contains_any(
        timeline_text, ["day", "date", "week", "month", "deadline"]
    )

    protection_breakdown = [
        RiskBreakdownItem(
            name="Payment Safety",
            score=max(
                0,
                100
                - (20 if not payment_has_deposit else 0)
                - (5 if not payment_has_enforcement else 0),
            ),
            status="Strong" if payment_has_deposit else "Weak",
        ),
        RiskBreakdownItem(
            name="Scope Clarity",
            score=85 if len(scope_text.strip()) >= 60 else 45,
            status="Strong" if len(scope_text.strip()) >= 60 else "Weak",
        ),
        RiskBreakdownItem(
            name="Timeline Protection",
            score=85 if timeline_has_dates else 40,
            status="Strong" if timeline_has_dates else "Weak",
        ),
        RiskBreakdownItem(
            name="Legal Ownership",
            score=85 if len(ownership_text.strip()) >= 20 else 35,
            status="Strong" if len(ownership_text.strip()) >= 20 else "Weak",
        ),
        RiskBreakdownItem(
            name="Confidentiality",
            score=80 if len(confidentiality_text.strip()) >= 20 else 35,
            status="Strong" if len(confidentiality_text.strip()) >= 20 else "Weak",
        ),
        RiskBreakdownItem(
            name="Termination Safety",
            score=80 if len(termination_text.strip()) >= 20 else 35,
            status="Strong" if len(termination_text.strip()) >= 20 else "Weak",
        ),
    ]

    return RiskAnalyzeResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        warnings=warnings,
        suggestions=suggestions,
        protection_breakdown=protection_breakdown,
    )
