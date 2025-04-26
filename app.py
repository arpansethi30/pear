import streamlit as st
import os
from dotenv import load_dotenv

# Import agents
from agents.sentiment_agent import SentimentAnalysisAgent
from agents.fundamental_agent import FundamentalAnalysisAgent
from agents.technical_agent import TechnicalAnalysisAgent
from agents.risk_agent import RiskAnalysisAgent

# Load environment variables
load_dotenv()

# App title and description
st.set_page_config(page_title="EquiFolio", page_icon="📈", layout="wide")
st.title("EquiFolio - Your Personal AI Quant")
st.markdown("""
Use the power of AI to analyze stocks and make informed investment decisions.
* **Sentiment Analysis**: Track market sentiment from news
* **Fundamental Analysis**: Evaluate company financials
* **Technical Analysis**: Identify price patterns
* **Risk Assessment**: Personalized portfolio risk evaluation
""")

# Sidebar for navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio(
    "Select Analysis Type",
    ["Sentiment Analysis", "Fundamental Analysis", "Technical Analysis", "Risk Analysis"]
)

# Stock ticker input
ticker = st.sidebar.text_input("Enter Stock Ticker (e.g., AAPL, MSFT)", "AAPL")

# Initialize appropriate agent based on selection
if page == "Sentiment Analysis":
    st.header("Sentiment Analysis")
    
    # Initialize sentiment agent
    if os.getenv("ANTHROPIC_API_KEY") and os.getenv("NEWSAPI_KEY"):
        agent = SentimentAnalysisAgent()
        
        if st.button("Analyze Sentiment"):
            with st.spinner(f"Analyzing sentiment for {ticker}..."):
                results = agent.analyze(ticker)
                st.subheader("Results")
                st.write(results)
    else:
        st.error("Missing API keys. Please set ANTHROPIC_API_KEY and NEWSAPI_KEY in .env file.")

elif page == "Fundamental Analysis":
    st.header("Fundamental Analysis")
    
    # Initialize fundamental agent
    agent = FundamentalAnalysisAgent()
    
    if st.button("Analyze Fundamentals"):
        with st.spinner(f"Analyzing fundamentals for {ticker}..."):
            results = agent.analyze(ticker)
            st.subheader("Results")
            st.write(results)

elif page == "Technical Analysis":
    st.header("Technical Analysis")
    
    # Initialize technical agent
    agent = TechnicalAnalysisAgent()
    
    period = st.sidebar.selectbox("Time Period", ["1mo", "3mo", "6mo", "1y", "2y", "5y"], index=3)
    
    if st.button("Analyze Technicals"):
        with st.spinner(f"Analyzing technical indicators for {ticker}..."):
            results = agent.analyze(ticker, period)
            st.subheader("Results")
            st.write(results)

elif page == "Risk Analysis":
    st.header("Risk Analysis")
    
    # Initialize risk agent
    agent = RiskAnalysisAgent()
    
    # Allow multi-stock input for portfolio
    portfolio_tickers = st.sidebar.text_input("Enter Portfolio Tickers (comma-separated)", "AAPL, MSFT, GOOGL")
    tickers_list = [t.strip() for t in portfolio_tickers.split(",")]
    
    if st.button("Analyze Portfolio Risk"):
        with st.spinner("Analyzing portfolio risk..."):
            results = agent.analyze(tickers_list)
            st.subheader("Results")
            st.write(results)

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("EquiFolio - Your AI Financial Assistant") 