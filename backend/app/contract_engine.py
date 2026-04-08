from app.schemas.contract import PreviewRequest, RiskAnalyzeRequest
from app.services.contract_builder import build_contract_text
from app.services.risk_engine import analyze_contract_risk


def analyze_contract(contract: RiskAnalyzeRequest):
    return analyze_contract_risk(contract)


def render_contract_text(contract: PreviewRequest) -> str:
    return build_contract_text(contract)
