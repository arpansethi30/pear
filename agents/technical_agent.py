import os
import anthropic
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from utils.common import fetch_stock_data, calculate_technical_indicators
import io
import base64

class TechnicalAnalysisAgent:
    def __init__(self):
        """Initialize the technical analysis agent with Claude"""
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        
        # Initialize direct Anthropic client
        self.client = anthropic.Anthropic(api_key=self.api_key)
        
        # Initialize LangChain components
        self.llm = ChatAnthropic(model_name="claude-3-7-sonnet-20250219", anthropic_api_key=self.api_key)
        
        # Prompt for technical analysis
        self.analysis_prompt = PromptTemplate(
            input_variables=["ticker", "period", "price_data", "indicator_data"],
            template="""
            You are a technical analyst specializing in chart patterns and technical indicators. Analyze the following data for {ticker} over the past {period} and provide a technical analysis:
            
            ## Price Data Summary
            {price_data}
            
            ## Technical Indicators
            {indicator_data}
            
            Based on this data, provide:
            1. Current Trend: Identify the primary trend (bullish, bearish, or neutral)
            2. Support/Resistance Levels: Identify key support and resistance levels
            3. Pattern Recognition: Identify any chart patterns present (e.g., head and shoulders, double tops)
            4. Moving Averages: Analyze the relationship between price and key moving averages
            5. RSI Analysis: Interpret the RSI indicator and identify overbought/oversold conditions
            6. MACD Analysis: Interpret the MACD indicator and identify potential buy/sell signals
            7. Bollinger Bands: Analyze volatility and price channels
            8. Short-term Outlook: Provide a short-term price outlook based on technical factors
            9. Trading Signals: Identify potential buy, sell, or hold signals based on technical analysis
            
            Format your analysis as a structured report with clear sections that a trader could use to make informed decisions.
            Keep your analysis based strictly on the technical aspects without considering fundamental or news-based factors.
            """
        )
        
        self.analysis_chain = LLMChain(llm=self.llm, prompt=self.analysis_prompt)
    
    def generate_price_chart(self, df):
        """
        Generate an interactive price chart with indicators
        
        Args:
            df (pd.DataFrame): Stock data with technical indicators
            
        Returns:
            dict: HTML for the interactive chart
        """
        fig = go.Figure()
        
        # Add candlestick chart
        fig.add_trace(go.Candlestick(
            x=df.index,
            open=df['Open'],
            high=df['High'],
            low=df['Low'],
            close=df['Close'],
            name='Price'
        ))
        
        # Add moving averages
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df['SMA_20'],
            line=dict(color='blue', width=1),
            name='SMA 20'
        ))
        
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df['SMA_50'],
            line=dict(color='orange', width=1),
            name='SMA 50'
        ))
        
        # Add Bollinger Bands
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df['BB_Upper'],
            line=dict(color='rgba(0,128,0,0.3)', width=1),
            name='BB Upper'
        ))
        
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df['BB_Lower'],
            line=dict(color='rgba(0,128,0,0.3)', width=1),
            name='BB Lower',
            fill='tonexty'
        ))
        
        # Set layout
        fig.update_layout(
            title=f'Price Chart with Indicators',
            yaxis_title='Price',
            xaxis_title='Date',
            height=600,
            template='plotly_white'
        )
        
        # Create a second chart for RSI
        fig_rsi = go.Figure()
        
        fig_rsi.add_trace(go.Scatter(
            x=df.index,
            y=df['RSI'],
            line=dict(color='purple', width=1),
            name='RSI'
        ))
        
        # Add overbought/oversold lines
        fig_rsi.add_trace(go.Scatter(
            x=df.index,
            y=[70] * len(df),
            line=dict(color='red', width=1, dash='dash'),
            name='Overbought'
        ))
        
        fig_rsi.add_trace(go.Scatter(
            x=df.index,
            y=[30] * len(df),
            line=dict(color='green', width=1, dash='dash'),
            name='Oversold'
        ))
        
        fig_rsi.update_layout(
            title='RSI Indicator',
            yaxis_title='RSI',
            xaxis_title='Date',
            height=300,
            template='plotly_white'
        )
        
        # Create a third chart for MACD
        fig_macd = go.Figure()
        
        fig_macd.add_trace(go.Scatter(
            x=df.index,
            y=df['MACD'],
            line=dict(color='blue', width=1),
            name='MACD'
        ))
        
        fig_macd.add_trace(go.Scatter(
            x=df.index,
            y=df['MACD_Signal'],
            line=dict(color='red', width=1),
            name='Signal Line'
        ))
        
        fig_macd.update_layout(
            title='MACD Indicator',
            yaxis_title='MACD',
            xaxis_title='Date',
            height=300,
            template='plotly_white'
        )
        
        return {
            'price_chart': fig.to_html(full_html=False, include_plotlyjs='cdn'),
            'rsi_chart': fig_rsi.to_html(full_html=False, include_plotlyjs='cdn'),
            'macd_chart': fig_macd.to_html(full_html=False, include_plotlyjs='cdn')
        }
    
    def summarize_price_data(self, df):
        """
        Create a summary of price data
        
        Args:
            df (pd.DataFrame): Stock data
            
        Returns:
            str: Summary of price data
        """
        if df is None or df.empty:
            return "No data available"
        
        current_price = df['Close'].iloc[-1]
        price_change = df['Close'].iloc[-1] - df['Close'].iloc[0]
        pct_change = (price_change / df['Close'].iloc[0]) * 100
        
        highest_price = df['High'].max()
        lowest_price = df['Low'].min()
        avg_volume = df['Volume'].mean()
        
        summary = f"""
        Current Price: ${current_price:.2f}
        Price Change: ${price_change:.2f} ({pct_change:.2f}%)
        Highest Price: ${highest_price:.2f}
        Lowest Price: ${lowest_price:.2f}
        Average Daily Volume: {avg_volume:.0f}
        Data Period: {df.index[0].strftime('%Y-%m-%d')} to {df.index[-1].strftime('%Y-%m-%d')}
        """
        
        return summary
    
    def summarize_indicators(self, df):
        """
        Create a summary of technical indicators
        
        Args:
            df (pd.DataFrame): Stock data with technical indicators
            
        Returns:
            str: Summary of technical indicators
        """
        if df is None or df.empty:
            return "No indicator data available"
        
        # Get most recent values
        last_row = df.iloc[-1]
        
        # Determine if price is above/below moving averages
        price_vs_sma20 = "above" if last_row['Close'] > last_row['SMA_20'] else "below"
        price_vs_sma50 = "above" if last_row['Close'] > last_row['SMA_50'] else "below"
        
        # Determine if price is breaking through Bollinger Bands
        bb_status = "within Bollinger Bands"
        if last_row['Close'] > last_row['BB_Upper']:
            bb_status = "above upper Bollinger Band (potentially overbought)"
        elif last_row['Close'] < last_row['BB_Lower']:
            bb_status = "below lower Bollinger Band (potentially oversold)"
        
        # Determine RSI status
        rsi_status = "neutral"
        if last_row['RSI'] > 70:
            rsi_status = "overbought"
        elif last_row['RSI'] < 30:
            rsi_status = "oversold"
        
        # Determine MACD status
        macd_status = "neutral"
        if last_row['MACD'] > last_row['MACD_Signal']:
            macd_status = "bullish"
        else:
            macd_status = "bearish"
        
        # Get 5-day trend
        if len(df) >= 5:
            five_day_change = (df['Close'].iloc[-1] - df['Close'].iloc[-5]) / df['Close'].iloc[-5] * 100
            five_day_trend = f"5-day price change: {five_day_change:.2f}%"
        else:
            five_day_trend = "Insufficient data for 5-day trend"
        
        summary = f"""
        Moving Averages:
        - Price is {price_vs_sma20} the 20-day SMA (${last_row['SMA_20']:.2f})
        - Price is {price_vs_sma50} the 50-day SMA (${last_row['SMA_50']:.2f})
        
        Bollinger Bands:
        - Current price is {bb_status}
        - Upper band: ${last_row['BB_Upper']:.2f}
        - Lower band: ${last_row['BB_Lower']:.2f}
        
        RSI:
        - Current RSI: {last_row['RSI']:.2f} ({rsi_status})
        
        MACD:
        - MACD line: {last_row['MACD']:.3f}
        - Signal line: {last_row['MACD_Signal']:.3f}
        - MACD is {macd_status}
        
        Recent Trend:
        - {five_day_trend}
        """
        
        return summary
    
    def analyze(self, ticker, period="1y"):
        """
        Perform technical analysis on a stock
        
        Args:
            ticker (str): Stock ticker symbol
            period (str): Time period to analyze
            
        Returns:
            dict: Technical analysis results
        """
        try:
            # Fetch stock data
            data = fetch_stock_data(ticker, period=period)
            
            if data is None or data.empty:
                return {
                    "status": "error",
                    "message": f"Could not fetch stock data for {ticker}."
                }
            
            # Calculate technical indicators
            df_with_indicators = calculate_technical_indicators(data)
            
            # Generate price chart
            charts = self.generate_price_chart(df_with_indicators)
            
            # Create summaries
            price_summary = self.summarize_price_data(data)
            indicator_summary = self.summarize_indicators(df_with_indicators)
            
            # Get analysis from Claude
            analysis = self.analysis_chain.run(
                ticker=ticker,
                period=period,
                price_data=price_summary,
                indicator_data=indicator_summary
            )
            
            # Calculate key metrics
            last_row = df_with_indicators.iloc[-1]
            key_metrics = {
                "Current Price": f"${last_row['Close']:.2f}",
                "RSI": f"{last_row['RSI']:.2f}",
                "MACD": f"{last_row['MACD']:.3f}",
                "20-day SMA": f"${last_row['SMA_20']:.2f}",
                "50-day SMA": f"${last_row['SMA_50']:.2f}",
                "Upper BB": f"${last_row['BB_Upper']:.2f}",
                "Lower BB": f"${last_row['BB_Lower']:.2f}"
            }
            
            # Compile results
            results = {
                "status": "success",
                "ticker": ticker,
                "period": period,
                "key_metrics": key_metrics,
                "analysis": analysis,
                "charts": charts
            }
            
            return results
        except Exception as e:
            print(f"Error in technical analysis: {e}")
            return {
                "status": "error",
                "message": f"An error occurred during technical analysis: {str(e)}"
            } 