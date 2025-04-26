import os
import anthropic
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import pandas as pd
from utils.common import fetch_news_articles

class SentimentAnalysisAgent:
    def __init__(self):
        """Initialize the sentiment analysis agent with Claude and NewsAPI"""
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        
        # Initialize direct Anthropic client
        self.client = anthropic.Anthropic(api_key=self.api_key)
        
        # Initialize LangChain components for structured sentiment analysis
        self.llm = ChatAnthropic(model_name="claude-3-7-sonnet-20250219", anthropic_api_key=self.api_key)
        
        # Prompt for detailed sentiment analysis
        self.sentiment_prompt = PromptTemplate(
            input_variables=["article_title", "article_description", "article_content"],
            template="""
            You are a financial sentiment analyst. Analyze the following news article about a company and provide sentiment analysis:
            
            Article Title: {article_title}
            
            Article Description: {article_description}
            
            Article Content (if available): {article_content}
            
            Please analyze this article and provide:
            1. Sentiment score: A numerical score from -1.0 (extremely negative) to 1.0 (extremely positive)
            2. Confidence: A numerical score from 0.0 to 1.0 indicating how confident you are in your assessment
            3. Key sentiment drivers: What specific information led to this sentiment assessment?
            4. Potential market impact: How might this news affect the company's stock price?
            
            Format your response as a JSON object with the following structure:
            {{
              "sentiment_score": <score>,
              "confidence": <confidence>,
              "key_drivers": "<key drivers>",
              "market_impact": "<potential market impact>"
            }}
            """
        )
        
        self.sentiment_chain = LLMChain(llm=self.llm, prompt=self.sentiment_prompt)
        
        # Prompt for overall sentiment summary
        self.summary_prompt = PromptTemplate(
            input_variables=["ticker", "sentiment_analyses"],
            template="""
            You are a financial advisor analyzing market sentiment for {ticker} based on recent news.
            
            Here are the sentiment analyses of recent news articles:
            
            {sentiment_analyses}
            
            Based on these sentiment analyses, provide:
            1. Overall sentiment: An aggregate view of the sentiment toward this company
            2. Sentiment trend: Whether sentiment appears to be improving, worsening, or stable
            3. Key themes: Common themes mentioned across multiple articles
            4. Investment recommendation: Based purely on sentiment (not financial data), would you suggest investors should be bullish, bearish, or neutral on this stock?
            
            Format your response as a summary report that an investor could quickly read to understand the current sentiment landscape.
            """
        )
        
        self.summary_chain = LLMChain(llm=self.llm, prompt=self.summary_prompt)
    
    def analyze_article(self, article):
        """
        Analyze the sentiment of a single news article
        
        Args:
            article (dict): News article data
            
        Returns:
            dict: Sentiment analysis results
        """
        try:
            title = article.get('title', '')
            description = article.get('description', '')
            content = article.get('content', '')
            
            # Get sentiment analysis from Claude
            result = self.sentiment_chain.run(
                article_title=title,
                article_description=description,
                article_content=content
            )
            
            # Parse JSON response more safely
            try:
                # First try using json.loads if it looks like JSON
                import json
                import re
                
                # Try to extract JSON if it's embedded in text
                json_match = re.search(r'({.*})', result, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1)
                    analysis = json.loads(json_str)
                else:
                    # Fallback to default values if JSON can't be parsed
                    analysis = {
                        "sentiment_score": 0,
                        "confidence": 0.5,
                        "key_drivers": "Could not parse from model output",
                        "market_impact": "Could not parse from model output"
                    }
            except Exception as e:
                print(f"Error parsing JSON response: {e}")
                # Fallback to default values
                analysis = {
                    "sentiment_score": 0,
                    "confidence": 0.5,
                    "key_drivers": "Could not parse from model output",
                    "market_impact": "Could not parse from model output"
                }
            
            # Add metadata
            analysis['source'] = article.get('source', {}).get('name', 'Unknown')
            analysis['title'] = title
            analysis['url'] = article.get('url', '')
            analysis['published_at'] = article.get('publishedAt', '')
            
            return analysis
        except Exception as e:
            print(f"Error analyzing article: {e}")
            return None
    
    def analyze(self, ticker, days_back=7):
        """
        Perform sentiment analysis on news articles related to a ticker
        
        Args:
            ticker (str): Stock ticker symbol
            days_back (int): Number of days to look back for news
            
        Returns:
            dict: Sentiment analysis results
        """
        # Get news articles
        articles = fetch_news_articles(ticker, days_back)
        
        if not articles:
            return {
                "status": "error",
                "message": f"No news articles found for {ticker} in the past {days_back} days."
            }
        
        # Analyze each article
        analyses = []
        for article in articles[:10]:  # Limit to 10 articles to save API calls
            analysis = self.analyze_article(article)
            if analysis:
                analyses.append(analysis)
        
        if not analyses:
            return {
                "status": "error",
                "message": "Failed to analyze any articles."
            }
        
        # Calculate summary metrics - safely filtering out None values and using defaults
        sentiment_scores = [a.get('sentiment_score', 0) for a in analyses]
        # Filter out None values
        sentiment_scores = [score for score in sentiment_scores if score is not None]
        
        if sentiment_scores:
            avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
        else:
            avg_sentiment = 0  # Default if no valid scores
        
        # Get summary from Claude
        sentiment_analyses_text = "\n\n".join([
            f"Article: {a.get('title', 'Unknown')}\nSource: {a.get('source', 'Unknown')}\nSentiment Score: {a.get('sentiment_score', 'N/A')}\nKey Drivers: {a.get('key_drivers', 'N/A')}"
            for a in analyses
        ])
        
        try:
            summary = self.summary_chain.run(
                ticker=ticker,
                sentiment_analyses=sentiment_analyses_text
            )
        except Exception as e:
            print(f"Error generating summary: {e}")
            summary = f"Could not generate summary. Error: {str(e)}"
        
        # Compile results
        results = {
            "status": "success",
            "ticker": ticker,
            "average_sentiment": avg_sentiment,
            "articles_analyzed": len(analyses),
            "summary": summary,
            "detailed_analyses": analyses
        }
        
        return results 