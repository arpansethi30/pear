from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from api.models import TechnicalRequest, TechnicalResponse, ErrorResponse
from agents.technical_agent import TechnicalAnalysisAgent

router = APIRouter(
    prefix="/technical",
    tags=["technical"],
    responses={404: {"model": ErrorResponse}},
)

def get_technical_agent():
    """Dependency to get technical analysis agent instance"""
    try:
        return TechnicalAnalysisAgent()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize technical agent: {str(e)}")

@router.post("/", response_model=TechnicalResponse)
async def analyze_technicals(
    request: TechnicalRequest,
    agent: TechnicalAnalysisAgent = Depends(get_technical_agent)
) -> Dict[str, Any]:
    """
    Analyze technical indicators and chart patterns for a stock ticker
    """
    try:
        result = agent.analyze(request.ticker, request.period)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=404, detail=result.get("message", "Technical analysis failed"))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Technical analysis failed: {str(e)}") 