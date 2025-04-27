from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from api.models import FundamentalRequest, FundamentalResponse, ErrorResponse
from agents.fundamental_agent import FundamentalAnalysisAgent

router = APIRouter(
    prefix="/fundamental",
    tags=["fundamental"],
    responses={404: {"model": ErrorResponse}},
)

def get_fundamental_agent():
    """Dependency to get fundamental analysis agent instance"""
    try:
        return FundamentalAnalysisAgent()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize fundamental agent: {str(e)}")

@router.post("/", response_model=FundamentalResponse)
async def analyze_fundamentals(
    request: FundamentalRequest,
    agent: FundamentalAnalysisAgent = Depends(get_fundamental_agent)
) -> Dict[str, Any]:
    """
    Analyze fundamental financial data for a stock ticker
    """
    try:
        result = agent.analyze(request.ticker)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=404, detail=result.get("message", "Fundamental analysis failed"))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fundamental analysis failed: {str(e)}") 