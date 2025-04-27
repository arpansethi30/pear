"use client";

import { useState } from "react";
import Link from "next/link";

interface ChartData {
  price_chart?: string;
  rsi_chart?: string;
  macd_chart?: string;
}

interface TechnicalResponse {
  status: string;
  ticker: string;
  period: string;
  key_metrics: Record<string, string>;
  analysis: string;
  charts: ChartData;
}

export default function Quant() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TechnicalResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("http://localhost:8000/technical/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          period: period,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Technical analysis failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error analyzing technicals:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-light-bg py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">EquiFolio AI</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/analysis" className="text-gray-600 hover:text-gray-800">Analysis</Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-800">Portfolio</Link>
            <Link href="/quant" className="text-[#1a1f36] hover:text-gray-800 border-b-2 border-[#1a1f36]">Quant</Link>
            <Link href="/sentiment" className="text-gray-600 hover:text-gray-800">Sentiment</Link>
          </nav>
          <button className="bg-[#1a1f36] text-white px-5 py-2 rounded-lg hover:bg-[#2d3452]">
            Get Started
          </button>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Technical Analysis</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-light-bg py-8">
        <div className="container mx-auto px-4">
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

          {results && (
            <div className="space-y-8">
              {/* Technical Metrics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {results.ticker} Technical Analysis ({results.period})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(results.key_metrics || {}).map(([key, value]) => (
                    <div key={key} className="p-4 bg-light-bg rounded-lg">
                      <div className="text-sm text-gray-600 mb-1 capitalize">{key.replace(/_/g, " ")}</div>
                      <div className="text-lg font-semibold text-gray-800">{value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Analysis Summary */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Summary</h3>
                  <p className="text-gray-700 whitespace-pre-line">{results.analysis}</p>
                </div>
                
                {/* Charts */}
                {results.charts && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Charts</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {results.charts.price_chart && (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                          <img 
                            src={`data:image/png;base64,${results.charts.price_chart}`} 
                            alt="Price Chart" 
                            className="max-w-full"
                          />
                        </div>
                      )}
                      
                      {results.charts.rsi_chart && (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                          <img 
                            src={`data:image/png;base64,${results.charts.rsi_chart}`} 
                            alt="RSI Chart" 
                            className="max-w-full"
                          />
                        </div>
                      )}
                      
                      {results.charts.macd_chart && (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                          <img 
                            src={`data:image/png;base64,${results.charts.macd_chart}`} 
                            alt="MACD Chart" 
                            className="max-w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !results && !error && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-600 text-center max-w-md">
                  Enter a stock ticker and select a time period to perform technical analysis.
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