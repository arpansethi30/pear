import os
import anthropic
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from utils.common import fetch_stock_data, fetch_company_info

class RiskAnalysisAgent:
    def __init__(self):
        """Initialize the risk analysis agent with Claude"""
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        
        # Initialize direct Anthropic client
        self.client = anthropic.Anthropic(api_key=self.api_key)
        
        # Initialize LangChain components
        self.llm = ChatAnthropic(model_name="claude-3-7-sonnet-20250219", anthropic_api_key=self.api_key)
        
        # Prompt for risk analysis
        self.analysis_prompt = PromptTemplate(
            input_variables=["tickers", "portfolio_summary", "risk_metrics", "correlation_data", "sector_exposure"],
            template="""
            You are a risk management specialist analyzing a stock portfolio. Analyze the following portfolio data and provide a comprehensive risk assessment:
            
            ## Portfolio Stocks
            {tickers}
            
            ## Portfolio Summary
            {portfolio_summary}
            
            ## Risk Metrics
            {risk_metrics}
            
            ## Correlation Data
            {correlation_data}
            
            ## Sector Exposure
            {sector_exposure}
            
            Based on this data, provide:
            1. Risk Assessment: Evaluate the overall portfolio risk level (low, medium, high)
            2. Diversification Analysis: Assess how well-diversified the portfolio is
            3. Sector Concentration: Identify any concerning sector concentrations
            4. Correlation Risk: Analyze the portfolio's internal correlations
            5. Volatility Analysis: Evaluate the portfolio's historical volatility
            6. Drawdown Risk: Identify maximum potential drawdowns based on historical data
            7. Risk Reduction Recommendations: Suggest ways to reduce portfolio risk
            8. Optimal Asset Allocation: Recommend a more balanced allocation if needed
            
            Format your analysis as a structured report that a portfolio manager could use to make informed risk management decisions.
            """
        )
        
        self.analysis_chain = LLMChain(llm=self.llm, prompt=self.analysis_prompt)
    
    def calculate_portfolio_metrics(self, stock_data, weights=None):
        """
        Calculate portfolio risk metrics
        
        Args:
            stock_data (dict): Dictionary of stock data frames
            weights (list): Portfolio weights
            
        Returns:
            dict: Portfolio metrics
        """
        # Prepare returns data
        returns_data = {}
        for ticker, data in stock_data.items():
            if data is not None and not data.empty:
                returns_data[ticker] = data['Close'].pct_change().dropna()
        
        # If any stock has no data, return error
        if not returns_data:
            return None
        
        # Combine returns into a single dataframe
        returns_df = pd.DataFrame(returns_data)
        
        # If weights not provided, assume equal weighting
        if weights is None:
            weights = [1/len(returns_data)] * len(returns_data)
        
        # Calculate portfolio return
        portfolio_returns = returns_df.dot(weights)
        
        # Calculate metrics
        metrics = {}
        
        # Annualized return (assuming daily data)
        metrics['annualized_return'] = portfolio_returns.mean() * 252 * 100  # in percent
        
        # Annualized volatility
        metrics['annualized_volatility'] = portfolio_returns.std() * np.sqrt(252) * 100  # in percent
        
        # Sharpe ratio (assuming risk-free rate of 0 for simplicity)
        metrics['sharpe_ratio'] = metrics['annualized_return'] / metrics['annualized_volatility']
        
        # Max drawdown
        cumulative_returns = (1 + portfolio_returns).cumprod()
        running_max = cumulative_returns.cummax()
        drawdown = (cumulative_returns / running_max) - 1
        metrics['max_drawdown'] = drawdown.min() * 100  # in percent
        
        # Value at Risk (95% confidence)
        metrics['var_95'] = portfolio_returns.quantile(0.05) * 100  # in percent
        
        # Calculate correlation matrix
        metrics['correlation_matrix'] = returns_df.corr()
        
        # Calculate average correlation
        corr_matrix = metrics['correlation_matrix'].values
        corr_matrix = np.triu(corr_matrix, k=1)  # Upper triangular matrix excluding diagonal
        non_zero_elements = corr_matrix[corr_matrix != 0]
        metrics['average_correlation'] = non_zero_elements.mean() if len(non_zero_elements) > 0 else 0
        
        return metrics
    
    def generate_correlation_heatmap(self, corr_matrix):
        """
        Generate a correlation heatmap
        
        Args:
            corr_matrix (pd.DataFrame): Correlation matrix
            
        Returns:
            str: HTML for the heatmap
        """
        fig = px.imshow(
            corr_matrix,
            color_continuous_scale='RdBu_r',
            labels=dict(color="Correlation"),
            title="Stock Correlation Heatmap"
        )
        
        fig.update_layout(
            height=600,
            width=700,
        )
        
        return fig.to_html(full_html=False, include_plotlyjs='cdn')
    
    def generate_sector_breakdown(self, tickers):
        """
        Generate sector breakdown for a list of tickers
        
        Args:
            tickers (list): List of stock tickers
            
        Returns:
            tuple: (sector_breakdown, sector_chart_html)
        """
        sector_counts = {}
        
        for ticker in tickers:
            info = fetch_company_info(ticker)
            if info and 'sector' in info:
                sector = info['sector']
                if sector in sector_counts:
                    sector_counts[sector] += 1
                else:
                    sector_counts[sector] = 1
            else:
                if 'Unknown' in sector_counts:
                    sector_counts['Unknown'] += 1
                else:
                    sector_counts['Unknown'] = 1
        
        # Calculate percentages
        total = sum(sector_counts.values())
        sector_percentages = {sector: (count / total) * 100 for sector, count in sector_counts.items()}
        
        # Create pie chart
        fig = px.pie(
            values=list(sector_percentages.values()),
            names=list(sector_percentages.keys()),
            title="Portfolio Sector Allocation"
        )
        
        fig.update_layout(
            height=500,
            width=700
        )
        
        return sector_percentages, fig.to_html(full_html=False, include_plotlyjs='cdn')
    
    def analyze(self, tickers, period="1y"):
        """
        Perform risk analysis on a portfolio
        
        Args:
            tickers (list): List of stock tickers
            period (str): Time period to analyze
            
        Returns:
            dict: Risk analysis results
        """
        try:
            if not tickers:
                return {
                    "status": "error",
                    "message": "No tickers provided for analysis."
                }
            
            # Fetch stock data for all tickers
            stock_data = {}
            for ticker in tickers:
                data = fetch_stock_data(ticker, period=period)
                stock_data[ticker] = data
            
            # Calculate portfolio metrics
            metrics = self.calculate_portfolio_metrics(stock_data)
            
            if not metrics:
                return {
                    "status": "error",
                    "message": "Could not calculate portfolio metrics."
                }
            
            # Generate correlation heatmap
            corr_heatmap = self.generate_correlation_heatmap(metrics['correlation_matrix'])
            
            # Get sector breakdown
            sector_breakdown, sector_chart = self.generate_sector_breakdown(tickers)
            
            # Format portfolio summary
            portfolio_summary = f"""
            Number of Stocks: {len(tickers)}
            Stocks: {', '.join(tickers)}
            Analysis Period: {period}
            """
            
            # Format risk metrics
            risk_metrics = f"""
            Annualized Return: {metrics['annualized_return']:.2f}%
            Annualized Volatility: {metrics['annualized_volatility']:.2f}%
            Sharpe Ratio: {metrics['sharpe_ratio']:.2f}
            Maximum Drawdown: {metrics['max_drawdown']:.2f}%
            Value at Risk (95%): {metrics['var_95']:.2f}%
            Average Correlation: {metrics['average_correlation']:.2f}
            """
            
            # Format correlation data
            correlation_data = metrics['correlation_matrix'].to_string()
            
            # Format sector exposure
            sector_exposure = "\n".join([f"{sector}: {percentage:.2f}%" for sector, percentage in sector_breakdown.items()])
            
            # Get analysis from Claude
            analysis = self.analysis_chain.run(
                tickers=', '.join(tickers),
                portfolio_summary=portfolio_summary,
                risk_metrics=risk_metrics,
                correlation_data=correlation_data,
                sector_exposure=sector_exposure
            )
            
            # Compile results
            results = {
                "status": "success",
                "tickers": tickers,
                "period": period,
                "metrics": {
                    "annualized_return": f"{metrics['annualized_return']:.2f}%",
                    "annualized_volatility": f"{metrics['annualized_volatility']:.2f}%",
                    "sharpe_ratio": f"{metrics['sharpe_ratio']:.2f}",
                    "max_drawdown": f"{metrics['max_drawdown']:.2f}%",
                    "var_95": f"{metrics['var_95']:.2f}%",
                    "average_correlation": f"{metrics['average_correlation']:.2f}"
                },
                "analysis": analysis,
                "charts": {
                    "correlation_heatmap": corr_heatmap,
                    "sector_chart": sector_chart
                }
            }
            
            return results
        except Exception as e:
            print(f"Error in risk analysis: {e}")
            return {
                "status": "error",
                "message": f"An error occurred during risk analysis: {str(e)}"
            } 