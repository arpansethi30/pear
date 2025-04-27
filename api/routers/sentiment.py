from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict, Any
import traceback
import sys

from api.models import SentimentRequest, SentimentResponse, ErrorResponse
from agents.sentiment_agent import SentimentAnalysisAgent

router = APIRouter(
    prefix="/sentiment",
    tags=["sentiment"],
    responses={404: {"model": ErrorResponse}},
)

def get_sentiment_agent():
    """Dependency to get sentiment analysis agent instance"""
    try:
        return SentimentAnalysisAgent()
    except Exception as e:
        print(f"Error initializing sentiment agent: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to initialize sentiment agent: {str(e)}")

@router.post("/", response_model=SentimentResponse)
async def analyze_sentiment(
    request: SentimentRequest,
    agent: SentimentAnalysisAgent = Depends(get_sentiment_agent)
) -> Dict[str, Any]:
    """
    Analyze sentiment for a stock ticker based on recent news
    """
    try:
        print(f"Analyzing sentiment for {request.ticker} with days_back={request.days_back}")
        result = agent.analyze(request.ticker, request.days_back)
        
        if result.get("status") == "error":
            print(f"Error in sentiment analysis: {result.get('message')}")
            raise HTTPException(status_code=404, detail=result.get("message", "Sentiment analysis failed"))
        
        # Ensure the response matches the expected model
        for analysis in result.get("detailed_analyses", []):
            # Convert keys to match the expected model if needed
            for key in ["sentiment_score", "confidence"]:
                if key in analysis and analysis[key] is None:
                    analysis[key] = 0.0  # Default value
        
        return result
    except Exception as e:
        print(f"Exception in sentiment analysis: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Sentiment analysis failed: {str(e)}") 