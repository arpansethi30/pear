from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api.routers import sentiment, fundamental, technical, risk

# Load environment variables
load_dotenv()

# Check for required API keys
if not os.getenv("ANTHROPIC_API_KEY"):
    raise ValueError("ANTHROPIC_API_KEY is missing from environment variables")

if not os.getenv("NEWSAPI_KEY"):
    print("Warning: NEWSAPI_KEY is missing. Sentiment analysis functionality will be limited.")

# Create FastAPI app
app = FastAPI(
    title="EquiFolio API",
    description="AI-powered financial analysis API for sentiment, fundamental, technical, and risk analysis",
    version="1.0.0",
    debug=True  # Enable debug mode
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sentiment.router)
app.include_router(fundamental.router)
app.include_router(technical.router)
app.include_router(risk.router)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "EquiFolio API",
        "version": "1.0.0",
        "description": "AI-powered financial analysis API",
        "endpoints": [
            {"path": "/sentiment", "description": "Sentiment analysis for stocks"},
            {"path": "/fundamental", "description": "Fundamental analysis for stocks"},
            {"path": "/technical", "description": "Technical analysis for stocks"},
            {"path": "/risk", "description": "Portfolio risk analysis"},
        ]
    } 