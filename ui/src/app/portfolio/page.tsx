import Link from "next/link";

export default function Portfolio() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-light-bg py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">EquiFolio AI</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/analysis" className="text-gray-600 hover:text-gray-800">Analysis</Link>
            <Link href="/portfolio" className="text-[#1a1f36] hover:text-gray-800 border-b-2 border-[#1a1f36]">Portfolio</Link>
            <Link href="/quant" className="text-gray-600 hover:text-gray-800">Quant</Link>
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
          <h1 className="text-2xl font-bold text-gray-800">Portfolio Management</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-light-bg py-8">
        <div className="container mx-auto px-4">
          {/* Portfolio Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">My Portfolio</h2>
                <p className="text-gray-600 text-sm mt-1">Last updated: May 20, 2023</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                  Export
                </button>
                <button className="bg-[#1a1f36] text-white px-4 py-2 rounded-lg hover:bg-[#2d3452]">
                  Create New
                </button>
              </div>
            </div>

            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-light-bg rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Value</div>
                <div className="text-xl font-semibold text-gray-800">$124,500.00</div>
              </div>
              <div className="p-4 bg-light-bg rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Daily Change</div>
                <div className="text-xl font-semibold text-green-600">+$1,245.00 (1.01%)</div>
              </div>
              <div className="p-4 bg-light-bg rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Return</div>
                <div className="text-xl font-semibold text-green-600">+$24,500.00 (24.5%)</div>
              </div>
              <div className="p-4 bg-light-bg rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                <div className="text-xl font-semibold text-gray-800">Moderate</div>
              </div>
            </div>

            {/* Asset Allocation Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
              <span className="text-gray-400">Asset Allocation Chart</span>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Holdings</h2>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 bg-white">
                  <option>Value</option>
                  <option>Performance</option>
                  <option>Name</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 text-sm font-medium">Asset</th>
                    <th className="text-left py-3 px-4 text-gray-600 text-sm font-medium">Symbol</th>
                    <th className="text-right py-3 px-4 text-gray-600 text-sm font-medium">Shares</th>
                    <th className="text-right py-3 px-4 text-gray-600 text-sm font-medium">Price</th>
                    <th className="text-right py-3 px-4 text-gray-600 text-sm font-medium">Value</th>
                    <th className="text-right py-3 px-4 text-gray-600 text-sm font-medium">24h Change</th>
                    <th className="text-center py-3 px-4 text-gray-600 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Apple Inc.', symbol: 'AAPL', shares: 50, price: 175.50, value: 8775.00, change: 1.25 },
                    { name: 'Microsoft Corporation', symbol: 'MSFT', shares: 25, price: 320.20, value: 8005.00, change: 0.75 },
                    { name: 'Amazon.com Inc.', symbol: 'AMZN', shares: 15, price: 128.25, value: 1923.75, change: -0.50 },
                    { name: 'Tesla Inc.', symbol: 'TSLA', shares: 20, price: 240.50, value: 4810.00, change: 2.10 },
                    { name: 'Google (Alphabet Inc.)', symbol: 'GOOGL', shares: 10, price: 122.75, value: 1227.50, change: 0.30 },
                  ].map((asset, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{asset.name}</td>
                      <td className="py-3 px-4 text-gray-600">{asset.symbol}</td>
                      <td className="py-3 px-4 text-right">{asset.shares}</td>
                      <td className="py-3 px-4 text-right">${asset.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-medium">${asset.value.toFixed(2)}</td>
                      <td className={`py-3 px-4 text-right ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button className="text-[#1a1f36] hover:underline">Buy</button>
                          <button className="text-[#1a1f36] hover:underline">Sell</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Diversification Opportunity</h3>
                    <p className="text-gray-600 text-sm mb-3">Your portfolio is heavily weighted in technology. Consider adding exposure to other sectors for better diversification.</p>
                    <button className="text-sm text-[#1a1f36] hover:underline">View Suggestions</button>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-amber-50 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Rebalancing Alert</h3>
                    <p className="text-gray-600 text-sm mb-3">Your portfolio has drifted from its target allocation. Consider rebalancing to maintain your desired risk profile.</p>
                    <button className="text-sm text-[#1a1f36] hover:underline">Rebalance Portfolio</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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