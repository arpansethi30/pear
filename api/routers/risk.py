from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from api.models import RiskRequest, RiskResponse, ErrorResponse
from agents.risk_agent import RiskAnalysisAgent

router = APIRouter(
    prefix="/risk",
    tags=["risk"],
    responses={404: {"model": ErrorResponse}},
)

def get_risk_agent():
    """Dependency to get risk analysis agent instance"""
    try:
        return RiskAnalysisAgent()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize risk agent: {str(e)}")

@router.post("/", response_model=RiskResponse)
async def analyze_portfolio_risk(
    request: RiskRequest,
    agent: RiskAnalysisAgent = Depends(get_risk_agent)
) -> Dict[str, Any]:
    """
    Analyze portfolio risk including correlations, volatility, and sector exposure
    """
    try:
        result = agent.analyze(request.tickers, request.period)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=404, detail=result.get("message", "Risk analysis failed"))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk analysis failed: {str(e)}") 