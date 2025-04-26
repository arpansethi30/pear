# EquiFolio - AI-Powered Financial Analysis

EquiFolio is an AI-powered financial analysis tool that helps users make informed investment decisions by leveraging sentiment analysis, fundamental analysis, technical analysis, and risk assessment.

## Features

- **Sentiment Analysis**: Track market sentiment from news sources
- **Fundamental Analysis**: Evaluate company financials and performance metrics
- **Technical Analysis**: Identify price patterns and technical indicators
- **Risk Assessment**: Portfolio risk evaluation and optimization

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/equifolio.git
cd equifolio
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with your API keys:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEWSAPI_KEY=your_newsapi_key_here
```

## Usage

Run the Streamlit app:
```bash
streamlit run app.py
```

The app will be available at http://localhost:8501

## Project Structure

```
equifolio/
├── agents/                  # Agent modules
│   ├── sentiment_agent.py   # Sentiment analysis agent
│   ├── fundamental_agent.py # Fundamental analysis agent
│   ├── technical_agent.py   # Technical analysis agent
│   └── risk_agent.py        # Risk analysis agent
├── utils/                   # Utility functions
│   └── common.py            # Common utility functions
├── components/              # Streamlit components (future)
├── data/                    # Data cache (future)
├── app.py                   # Main Streamlit application
└── requirements.txt         # Python dependencies
```

## API Keys Required

- **Anthropic Claude API**: For natural language processing and analysis
- **NewsAPI**: For fetching news articles for sentiment analysis

## Future Development

- Migration to Next.js frontend
- Enhanced portfolio optimization
- More customizable dashboards
- User accounts and saved portfolios
- Export reports to PDF 