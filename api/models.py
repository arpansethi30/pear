from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

# Request Models
class SentimentRequest(BaseModel):
    ticker: str
    days_back: int = 7

class FundamentalRequest(BaseModel):
    ticker: str

class TechnicalRequest(BaseModel):
    ticker: str
    period: str = "1y"

class RiskRequest(BaseModel):
    tickers: List[str]
    period: str = "1y"

# Response Models
class ErrorResponse(BaseModel):
    status: str = "error"
    message: str

class SentimentAnalysis(BaseModel):
    sentiment_score: Optional[float] = 0.0
    confidence: Optional[float] = 0.0
    key_drivers: Optional[str] = ""
    market_impact: Optional[str] = ""
    source: Optional[str] = "Unknown"
    title: Optional[str] = "Unknown"
    url: Optional[str] = ""
    published_at: Optional[str] = ""

    class Config:
        extra = "allow"  # Allow extra fields

class SentimentResponse(BaseModel):
    status: str = "success"
    ticker: str
    average_sentiment: float
    articles_analyzed: int
    summary: str
    detailed_analyses: List[SentimentAnalysis]

    class Config:
        extra = "allow"  # Allow extra fields

class KeyMetrics(BaseModel):
    class Config:
        extra = "allow"  # Allow extra fields that might be specific to each analysis type

class FundamentalResponse(BaseModel):
    status: str = "success"
    ticker: str
    company_name: str
    sector: str
    industry: str
    key_metrics: Dict[str, Any]
    analysis: str

class ChartData(BaseModel):
    price_chart: Optional[str] = None
    rsi_chart: Optional[str] = None
    macd_chart: Optional[str] = None

class TechnicalResponse(BaseModel):
    status: str = "success"
    ticker: str
    period: str
    key_metrics: Dict[str, Any]
    analysis: str
    charts: ChartData

class RiskMetrics(BaseModel):
    annualized_return: str
    annualized_volatility: str
    sharpe_ratio: str
    max_drawdown: str
    var_95: str
    average_correlation: str

class RiskCharts(BaseModel):
    correlation_heatmap: str
    sector_chart: str

class RiskResponse(BaseModel):
    status: str = "success"
    tickers: List[str]
    period: str
    metrics: RiskMetrics
    analysis: str
    charts: RiskCharts 