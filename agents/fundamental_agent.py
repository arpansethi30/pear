import os
import anthropic
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import pandas as pd
from utils.common import fetch_company_info, fetch_financial_data, calculate_fundamental_ratios

class FundamentalAnalysisAgent:
    def __init__(self):
        """Initialize the fundamental analysis agent with Claude"""
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        
        # Initialize direct Anthropic client
        self.client = anthropic.Anthropic(api_key=self.api_key)
        
        # Initialize LangChain components
        self.llm = ChatAnthropic(model_name="claude-3-7-sonnet-20250219", anthropic_api_key=self.api_key)
        
        # Prompt for fundamental analysis
        self.analysis_prompt = PromptTemplate(
            input_variables=["ticker", "company_info", "financial_ratios", "income_statement", "balance_sheet", "cash_flow"],
            template="""
            You are a financial analyst specializing in fundamental analysis. Analyze the following data for {ticker} and provide a comprehensive fundamental analysis:
            
            ## Company Information
            {company_info}
            
            ## Financial Ratios
            {financial_ratios}
            
            ## Income Statement (Most recent 2 years)
            {income_statement}
            
            ## Balance Sheet (Most recent 2 years)
            {balance_sheet}
            
            ## Cash Flow (Most recent 2 years)
            {cash_flow}
            
            Based on this data, provide:
            1. Valuation Assessment: Are shares overvalued, undervalued, or fairly valued? Why?
            2. Financial Health: Assess the company's financial health and stability
            3. Growth Prospects: Evaluate past growth and future growth potential
            4. Profitability: Analyze margins and returns on capital
            5. Risks: Identify key financial risks based on the data
            6. Strengths: Highlight financial strengths
            7. Investment Thesis: Provide a concise investment thesis based on fundamentals
            
            Format your analysis as a structured report with clear sections that an investor could use to make informed decisions.
            """
        )
        
        self.analysis_chain = LLMChain(llm=self.llm, prompt=self.analysis_prompt)
    
    def format_financial_table(self, df):
        """
        Format a financial dataframe for human readability
        
        Args:
            df (pd.DataFrame): Financial data
            
        Returns:
            str: Formatted table as string
        """
        if df is None or df.empty:
            return "No data available"
        
        # Format columns to show only last 2 years (most recent quarters/years)
        if len(df.columns) > 2:
            df = df.iloc[:, :2]
        
        # Format values as millions/billions for readability
        def format_value(val):
            if pd.isna(val):
                return "N/A"
            if abs(val) >= 1e9:
                return f"${val/1e9:.2f}B"
            elif abs(val) >= 1e6:
                return f"${val/1e6:.2f}M"
            else:
                return f"${val:.2f}"
        
        # Apply formatting
        formatted_df = df.applymap(format_value)
        
        # Convert to string representation
        return formatted_df.to_string()
    
    def analyze(self, ticker):
        """
        Perform fundamental analysis on a stock
        
        Args:
            ticker (str): Stock ticker symbol
            
        Returns:
            dict: Fundamental analysis results
        """
        try:
            # Fetch all necessary data
            company_info = fetch_company_info(ticker)
            income_stmt, balance_sheet, cash_flow = fetch_financial_data(ticker)
            financial_ratios = calculate_fundamental_ratios(ticker)
            
            if not company_info:
                return {
                    "status": "error",
                    "message": f"Could not fetch company information for {ticker}."
                }
            
            # Format company info for readability
            company_info_str = "\n".join([
                f"Name: {company_info.get('shortName', 'N/A')}",
                f"Sector: {company_info.get('sector', 'N/A')}",
                f"Industry: {company_info.get('industry', 'N/A')}",
                f"Market Cap: ${company_info.get('marketCap', 0)/1e9:.2f}B",
                f"Current Price: ${company_info.get('currentPrice', 'N/A')}",
                f"52-Week High: ${company_info.get('fiftyTwoWeekHigh', 'N/A')}",
                f"52-Week Low: ${company_info.get('fiftyTwoWeekLow', 'N/A')}",
                f"Business Summary: {company_info.get('longBusinessSummary', 'N/A')}"
            ])
            
            # Format financial ratios
            financial_ratios_str = "\n".join([f"{k}: {v}" for k, v in financial_ratios.items()])
            
            # Format financial statements
            income_statement_str = self.format_financial_table(income_stmt)
            balance_sheet_str = self.format_financial_table(balance_sheet)
            cash_flow_str = self.format_financial_table(cash_flow)
            
            # Get analysis from Claude
            analysis = self.analysis_chain.run(
                ticker=ticker,
                company_info=company_info_str,
                financial_ratios=financial_ratios_str,
                income_statement=income_statement_str,
                balance_sheet=balance_sheet_str,
                cash_flow=cash_flow_str
            )
            
            # Get key metrics
            key_metrics = {
                "P/E Ratio": financial_ratios.get("P/E", "N/A"),
                "P/B Ratio": financial_ratios.get("P/B", "N/A"),
                "Profit Margin": financial_ratios.get("Profit Margin", "N/A"),
                "Debt to Equity": financial_ratios.get("Debt to Equity", "N/A"),
                "ROE": financial_ratios.get("ROE", "N/A"),
                "Current Price": company_info.get("currentPrice", "N/A"),
                "Market Cap": f"${company_info.get('marketCap', 0)/1e9:.2f}B"
            }
            
            # Compile results
            results = {
                "status": "success",
                "ticker": ticker,
                "company_name": company_info.get("shortName", ticker),
                "sector": company_info.get("sector", "N/A"),
                "industry": company_info.get("industry", "N/A"),
                "key_metrics": key_metrics,
                "analysis": analysis
            }
            
            return results
        except Exception as e:
            print(f"Error in fundamental analysis: {e}")
            return {
                "status": "error",
                "message": f"An error occurred during fundamental analysis: {str(e)}"
            } 