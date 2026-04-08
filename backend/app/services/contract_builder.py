from app.schemas.contract import PreviewRequest


def build_contract_text(payload: PreviewRequest) -> str:
    return f"""
SMART FREELANCE SERVICE AGREEMENT

Title: {payload.title}

1. Parties
This agreement is between the Freelancer ({payload.freelancer_name or "Freelancer"}) and the Client ({payload.client_name}).

2. Project Scope
{payload.project_scope}

3. Payment Terms
{payload.payment_terms}

4. Delivery Timeline
{payload.delivery_timeline}

5. Revisions
{payload.revisions}

6. Ownership / Intellectual Property
{payload.ownership_clause}

7. Confidentiality
{payload.confidentiality_clause}

8. Termination
{payload.termination_clause}

9. Additional Notes
{payload.notes or "None"}

10. Status
Current document status: {payload.status}

By proceeding with this agreement, both parties acknowledge the above terms.
""".strip()
