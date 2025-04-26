import yfinance as yf
import pandas as pd
import numpy as np
from newsapi import NewsApiClient
import os
from datetime import datetime, timedelta

def fetch_stock_data(ticker, period="1y", interval="1d"):
    """
    Fetch stock price data using yfinance
    
    Args:
        ticker (str): Stock ticker symbol
        period (str): Time period to fetch data for (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
        interval (str): Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
        
    Returns:
        pandas.DataFrame: Stock price data
    """
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period, interval=interval)
        return data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return None

def fetch_company_info(ticker):
    """
    Fetch company information using yfinance
    
    Args:
        ticker (str): Stock ticker symbol
        
    Returns:
        dict: Company information
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return info
    except Exception as e:
        print(f"Error fetching company info: {e}")
        return None

def fetch_financial_data(ticker):
    """
    Fetch financial statements using yfinance
    
    Args:
        ticker (str): Stock ticker symbol
        
    Returns:
        tuple: (income_statement, balance_sheet, cash_flow)
    """
    try:
        stock = yf.Ticker(ticker)
        income_stmt = stock.income_stmt
        balance_sheet = stock.balance_sheet
        cash_flow = stock.cashflow
        return income_stmt, balance_sheet, cash_flow
    except Exception as e:
        print(f"Error fetching financial data: {e}")
        return None, None, None

def fetch_news_articles(ticker, days_back=7):
    """
    Fetch news articles related to a stock ticker
    
    Args:
        ticker (str): Stock ticker symbol
        days_back (int): Number of days to look back for news
        
    Returns:
        list: News articles
    """
    try:
        # Initialize NewsAPI client
        newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_KEY"))
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Format dates for NewsAPI
        from_date = start_date.strftime("%Y-%m-%d")
        to_date = end_date.strftime("%Y-%m-%d")
        
        # Fetch news articles
        company_info = fetch_company_info(ticker)
        company_name = company_info.get('shortName', ticker) if company_info else ticker
        
        # Search by both ticker and company name for better results
        articles = newsapi.get_everything(
            q=f"{ticker} OR {company_name}",
            from_param=from_date,
            to=to_date,
            language='en',
            sort_by='relevancy',
            page_size=20
        )
        
        return articles.get('articles', [])
    except Exception as e:
        print(f"Error fetching news articles: {e}")
        return []

def calculate_technical_indicators(data):
    """
    Calculate common technical indicators
    
    Args:
        data (pd.DataFrame): Stock price data
        
    Returns:
        pd.DataFrame: Data with technical indicators
    """
    df = data.copy()
    
    # Simple Moving Averages
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    df['SMA_200'] = df['Close'].rolling(window=200).mean()
    
    # Exponential Moving Averages
    df['EMA_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['Close'].ewm(span=26, adjust=False).mean()
    
    # MACD
    df['MACD'] = df['EMA_12'] - df['EMA_26']
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    
    # Relative Strength Index (RSI)
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # Bollinger Bands
    df['BB_Middle'] = df['Close'].rolling(window=20).mean()
    std_dev = df['Close'].rolling(window=20).std()
    df['BB_Upper'] = df['BB_Middle'] + (std_dev * 2)
    df['BB_Lower'] = df['BB_Middle'] - (std_dev * 2)
    
    return df

def calculate_fundamental_ratios(ticker):
    """
    Calculate fundamental financial ratios
    
    Args:
        ticker (str): Stock ticker symbol
        
    Returns:
        dict: Financial ratios
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        ratios = {}
        
        # Price ratios
        ratios['P/E'] = info.get('trailingPE', None)
        ratios['Forward P/E'] = info.get('forwardPE', None)
        ratios['P/S'] = info.get('priceToSalesTrailing12Months', None)
        ratios['P/B'] = info.get('priceToBook', None)
        
        # Growth rates
        ratios['Revenue Growth (YoY)'] = info.get('revenueGrowth', None)
        ratios['Earnings Growth (YoY)'] = info.get('earningsGrowth', None)
        
        # Profitability ratios
        ratios['Profit Margin'] = info.get('profitMargins', None)
        ratios['Operating Margin'] = info.get('operatingMargins', None)
        ratios['ROE'] = info.get('returnOnEquity', None)
        ratios['ROA'] = info.get('returnOnAssets', None)
        
        # Dividend metrics
        ratios['Dividend Yield'] = info.get('dividendYield', None)
        ratios['Dividend Rate'] = info.get('dividendRate', None)
        ratios['Payout Ratio'] = info.get('payoutRatio', None)
        
        # Debt metrics
        ratios['Debt to Equity'] = info.get('debtToEquity', None)
        ratios['Current Ratio'] = info.get('currentRatio', None)
        
        # Filter out None values
        ratios = {k: v for k, v in ratios.items() if v is not None}
        
        return ratios
    except Exception as e:
        print(f"Error calculating fundamental ratios: {e}")
        return {} 