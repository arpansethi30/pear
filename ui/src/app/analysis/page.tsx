"use client";

import { useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";

// Function to render markdown text with proper styling
const renderMarkdown = (text: string) => {
  if (!text) return null;
  
  // Process the text line by line
  return text.split('\n').map((line, index) => {
    // Handle headings
    if (line.startsWith('# ')) {
      return (
        <h2 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          {line.replace('# ', '')}
        </h2>
      );
    }
    
    if (line.startsWith('## ')) {
      return (
        <h3 key={index} className="text-xl font-semibold text-gray-800 mt-5 mb-3">
          {line.replace('## ', '')}
        </h3>
      );
    }

    if (line.startsWith('### ')) {
      return (
        <h4 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
          {line.replace('### ', '')}
        </h4>
      );
    }

    // Handle bold text
    if (line.includes('**')) {
      const parts = [];
      let currentText = line;
      let key = 0;
      
      while (currentText.includes('**')) {
        const startIdx = currentText.indexOf('**');
        const endIdx = currentText.indexOf('**', startIdx + 2);
        
        if (startIdx !== -1 && endIdx !== -1) {
          // Text before the bold part
          if (startIdx > 0) {
            parts.push(<span key={key++}>{currentText.substring(0, startIdx)}</span>);
          }
          
          // Bold part
          parts.push(
            <span key={key++} className="font-bold">
              {currentText.substring(startIdx + 2, endIdx)}
            </span>
          );
          
          // Update current text to remaining text
          currentText = currentText.substring(endIdx + 2);
        } else {
          break;
        }
      }
      
      // Add remaining text
      if (currentText) {
        parts.push(<span key={key++}>{currentText}</span>);
      }
      
      return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{parts}</p>;
    }

    // Handle list items
    if (line.trim().startsWith('- ')) {
      return (
        <li key={index} className="text-gray-700 ml-6 mb-1 leading-relaxed list-disc">
          {line.replace(/^-\s+/, '')}
        </li>
      );
    }

    if (line.trim().match(/^\d+\.\s/)) {
      return (
        <li key={index} className="text-gray-700 ml-6 mb-1 leading-relaxed list-decimal">
          {line.replace(/^\d+\.\s+/, '')}
        </li>
      );
    }

    // Empty lines become spacing
    if (line.trim() === '') {
      return <div key={index} className="h-2"></div>;
    }

    // Default paragraph formatting
    return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
  });
};

// Type definitions for API responses
interface SentimentResponse {
  status: string;
  ticker: string;
  average_sentiment: number;
  articles_analyzed: number;
  summary: string;
  detailed_analyses: DetailedAnalysis[];
  company_name?: string;
  sector?: string;
  industry?: string;
  analysis?: string;
  charts?: {
    price_chart?: string;
    rsi_chart?: string;
    macd_chart?: string;
  };
  period?: string;
  key_metrics?: Record<string, ReactNode>;
}

interface FundamentalResponse {
  status: string;
  ticker: string;
  company_name: string;
  sector: string;
  industry: string;
  key_metrics: Record<string, ReactNode>;
  analysis: string;
  detailed_analyses?: DetailedAnalysis[];
  average_sentiment?: number;
  articles_analyzed?: number;
  summary?: string;
  period?: string;
  charts?: {
    price_chart?: string;
    rsi_chart?: string;
    macd_chart?: string;
  };
}

interface TechnicalResponse {
  status: string;
  ticker: string;
  period: string;
  key_metrics: Record<string, ReactNode>;
  analysis: string;
  charts: {
    price_chart?: string;
    rsi_chart?: string;
    macd_chart?: string;
  };
  company_name?: string;
  sector?: string;
  industry?: string;
  detailed_analyses?: DetailedAnalysis[];
  average_sentiment?: number;
  articles_analyzed?: number;
  summary?: string;
}

type AnalysisType = "sentiment" | "fundamental" | "technical";
type AnalysisResult = SentimentResponse | FundamentalResponse | TechnicalResponse | null;

// Type for the detailed analysis in sentiment response
interface DetailedAnalysis {
  sentiment_score: number;
  confidence: number;
  key_drivers: string;
  market_impact: string;
  source: string;
  title: string;
  url: string;
  published_at: string;
}

export default function Analysis() {
  const [ticker, setTicker] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("fundamental");
  const [period, setPeriod] = useState("1y");
  const [daysBack, setDaysBack] = useState(7);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    setError("");
    setResults(null);

    let endpoint = "";
    let payload = {};

    switch (analysisType) {
      case "sentiment":
        endpoint = "sentiment";
        payload = { ticker: ticker.toUpperCase(), days_back: daysBack };
        break;
      case "fundamental":
        endpoint = "fundamental";
        payload = { ticker: ticker.toUpperCase() };
        break;
      case "technical":
        endpoint = "technical";
        payload = { ticker: ticker.toUpperCase(), period };
        break;
    }

    try {
      const response = await fetch(`http://localhost:8000/${endpoint}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `${analysisType} analysis failed`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error(`Error analyzing ${analysisType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get sentiment color
  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return "text-green-600";
    if (score >= 0.4) return "text-blue-600";
    if (score > 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-light-bg py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">EquiFolio AI</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/analysis" className="text-[#1a1f36] hover:text-gray-800 border-b-2 border-[#1a1f36]">Analysis</Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-800">Portfolio</Link>
          </nav>
          <button className="bg-[#1a1f36] text-white px-5 py-2 rounded-lg hover:bg-[#2d3452]">
            Get Started
          </button>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Market Analysis</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-light-bg py-8">
        <div className="container mx-auto px-4">
          {/* Analysis Type Selector */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Analysis Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAnalysisType("fundamental")}
                className={`p-4 rounded-lg border ${
                  analysisType === "fundamental" ? "border-[#1a1f36] bg-[#1a1f36]/5" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    analysisType === "fundamental" ? "bg-[#1a1f36] text-white" : "bg-gray-100"
                  }`}>
                    <span className="text-lg">📊</span>
                  </div>
                  <span className={`font-medium ${
                    analysisType === "fundamental" ? "text-[#1a1f36]" : "text-gray-800"
                  }`}>Fundamental Analysis</span>
                </div>
              </button>
              <button
                onClick={() => setAnalysisType("technical")}
                className={`p-4 rounded-lg border ${
                  analysisType === "technical" ? "border-[#1a1f36] bg-[#1a1f36]/5" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    analysisType === "technical" ? "bg-[#1a1f36] text-white" : "bg-gray-100"
                  }`}>
                    <span className="text-lg">📈</span>
                  </div>
                  <span className={`font-medium ${
                    analysisType === "technical" ? "text-[#1a1f36]" : "text-gray-800"
                  }`}>Technical Analysis</span>
                </div>
              </button>
              <button
                onClick={() => setAnalysisType("sentiment")}
                className={`p-4 rounded-lg border ${
                  analysisType === "sentiment" ? "border-[#1a1f36] bg-[#1a1f36]/5" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    analysisType === "sentiment" ? "bg-[#1a1f36] text-white" : "bg-gray-100"
                  }`}>
                    <span className="text-lg">📰</span>
                  </div>
                  <span className={`font-medium ${
                    analysisType === "sentiment" ? "text-[#1a1f36]" : "text-gray-800"
                  }`}>Sentiment Analysis</span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow">
                  <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Ticker
                  </label>
                  <input
                    type="text"
                    id="ticker"
                    placeholder="Enter a ticker symbol (e.g. AAPL)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a1f36] focus:border-[#1a1f36] outline-none"
                    required
                  />
                </div>
                
                {/* Conditional form fields based on analysis type */}
                {analysisType === "technical" && (
                  <div className="w-full md:w-48">
                    <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                      Time Period
                    </label>
                    <select
                      id="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a1f36] focus:border-[#1a1f36] outline-none"
                    >
                      <option value="1mo">1 Month</option>
                      <option value="3mo">3 Months</option>
                      <option value="6mo">6 Months</option>
                      <option value="1y">1 Year</option>
                      <option value="2y">2 Years</option>
                      <option value="5y">5 Years</option>
                    </select>
                  </div>
                )}

                {analysisType === "sentiment" && (
                  <div className="w-full md:w-48">
                    <label htmlFor="daysBack" className="block text-sm font-medium text-gray-700 mb-2">
                      Days of News
                    </label>
                    <select
                      id="daysBack"
                      value={daysBack}
                      onChange={(e) => setDaysBack(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a1f36] focus:border-[#1a1f36] outline-none"
                    >
                      <option value={3}>3 days</option>
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                    </select>
                  </div>
                )}

                <div className="w-full md:w-auto">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-[#1a1f36] text-white px-6 py-2 rounded-lg hover:bg-[#2d3452] disabled:opacity-50"
                    disabled={loading || !ticker}
                  >
                    {loading ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a1f36]"></div>
              </div>
            </div>
          )}

          {/* Render results based on analysis type */}
          {results && (
            <div className="space-y-8">
              {/* Sentiment Analysis Results */}
              {analysisType === "sentiment" && results && (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📊</span> {results.ticker} Sentiment Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-light-bg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-600 mb-1">Average Sentiment</div>
                        <div className={`text-xl font-bold ${getSentimentColor(results.average_sentiment || 0)}`}>
                          {(results.average_sentiment ? results.average_sentiment * 100 : 0).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 bg-light-bg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-600 mb-1">Articles Analyzed</div>
                        <div className="text-xl font-bold text-gray-800">{results.articles_analyzed || 0}</div>
                      </div>
                      <div className="p-4 bg-light-bg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-600 mb-1">Time Period</div>
                        <div className="text-xl font-bold text-gray-800">Last {daysBack} days</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 rounded-lg p-5 border-l-4 border-[#1a1f36]">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
                      {typeof results.summary === 'string' ? (
                        <div className="text-gray-700 leading-relaxed">
                          {renderMarkdown(results.summary)}
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {results.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Analyses */}
                  {results.detailed_analyses && results.detailed_analyses.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="text-xl mr-2">📰</span> Detailed Article Analysis
                      </h3>
                      <div className="space-y-5">
                        {results.detailed_analyses.map((analysis: DetailedAnalysis, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                              <h4 className="font-medium text-gray-800 text-base">{analysis.title}</h4>
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(analysis.sentiment_score)} bg-opacity-10 bg-current`}>
                                {(analysis.sentiment_score * 100).toFixed(0)}% sentiment
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 flex items-center">
                              <span className="font-medium">{analysis.source}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(analysis.published_at).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</span>
                            </p>
                            {analysis.key_drivers && (
                              <div className="mb-3 bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-1">Key Drivers:</div>
                                <p className="text-sm text-gray-600">{analysis.key_drivers}</p>
                              </div>
                            )}
                            {analysis.market_impact && (
                              <div className="mb-3 bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-1">Market Impact:</div>
                                <p className="text-sm text-gray-600">{analysis.market_impact}</p>
                              </div>
                            )}
                            <div className="mt-3">
                              <a 
                                href={analysis.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-[#1a1f36] hover:underline inline-flex items-center"
                              >
                                Read full article
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fundamental Analysis Results */}
              {analysisType === "fundamental" && results && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📈</span> {results.ticker} - {results.company_name} Fundamental Analysis
                  </h2>
                  
                  <div className="p-5 bg-light-bg rounded-lg mb-6 shadow-sm border-l-4 border-[#1a1f36]">
                    <div className="text-sm font-medium text-gray-600 mb-1">Sector / Industry</div>
                    <div className="text-lg font-bold text-gray-800">{results.sector || 'N/A'} / {results.industry || 'N/A'}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries((results as FundamentalResponse)?.key_metrics || {}).map(([key, value]) => (
                      <div key={key} className="p-5 bg-light-bg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-600 mb-1 capitalize">{key.replace(/_/g, " ")}</div>
                        <div className="text-lg font-bold text-gray-800">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-lg p-5 border-l-4 border-[#1a1f36]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis</h3>
                    {typeof results.analysis === 'string' ? (
                      <div className="text-gray-700 leading-relaxed">
                        {renderMarkdown(results.analysis)}
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {results.analysis || 'No analysis available'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Analysis Results */}
              {analysisType === "technical" && results && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span> {results.ticker} - Technical Analysis ({results.period || 'Default Period'})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries((results as TechnicalResponse)?.key_metrics || {}).map(([key, value]) => (
                      <div key={key} className="p-5 bg-light-bg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-600 mb-1 capitalize">{key.replace(/_/g, " ")}</div>
                        <div className="text-lg font-bold text-gray-800">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-lg p-5 border-l-4 border-[#1a1f36]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis</h3>
                    {typeof results.analysis === 'string' ? (
                      <div className="text-gray-700 leading-relaxed">
                        {renderMarkdown(results.analysis)}
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {results.analysis || 'No analysis available'}
                      </p>
                    )}
                  </div>
                  
                  {results.charts && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="text-xl mr-2">📈</span> Charts
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        {results.charts.price_chart && (
                          <div className="bg-gray-50 p-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <img 
                              src={`data:image/png;base64,${results.charts.price_chart}`} 
                              alt="Price Chart" 
                              className="max-w-full rounded"
                            />
                          </div>
                        )}
                        
                        {results.charts.rsi_chart && (
                          <div className="bg-gray-50 p-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <img 
                              src={`data:image/png;base64,${results.charts.rsi_chart}`} 
                              alt="RSI Chart" 
                              className="max-w-full rounded"
                            />
                          </div>
                        )}
                        
                        {results.charts.macd_chart && (
                          <div className="bg-gray-50 p-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <img 
                              src={`data:image/png;base64,${results.charts.macd_chart}`} 
                              alt="MACD Chart" 
                              className="max-w-full rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!loading && !results && !error && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-600 text-center max-w-md">
                  Select your analysis type, enter a stock ticker, and click Analyze to get insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">© 2025 EquiFolio AI. All Rights Reserved.</div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 