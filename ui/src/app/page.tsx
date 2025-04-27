import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-light-bg py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">EquiFolio AI</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/analysis" className="text-gray-600 hover:text-gray-800">Analysis</Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-800">Portfolio</Link>
          </nav>
          <button className="bg-[#1a1f36] text-white px-5 py-2 rounded-lg hover:bg-[#2d3452]">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center flex flex-col items-center">
        <div className="inline-block px-6 py-2 bg-gray-100 rounded-full mb-8">
          Intelligent Investing Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-10 max-w-4xl text-gray-800">
          Financial Intelligence Reimagined
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-12">
          Make smarter investment decisions with our advanced AI analysis platform. Get
          real-time insights, portfolio recommendations, and market analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#1a1f36] text-white px-6 py-3 rounded-lg hover:bg-[#2d3452] font-medium">
            Get Started Free
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Global Market Analysis */}
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h2M12 2v2M22 12h-2M12 22v-2M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Global Market Analysis</h3>
              <p className="text-gray-600">
                Access real-time market data and AI-powered insights from markets worldwide.
              </p>
            </div>

            {/* Risk Management */}
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                  <path d="M12 22V12M4 7l8 5M20 7l-8 5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Risk Management</h3>
              <p className="text-gray-600">
                Advanced risk assessment and portfolio protection strategies.
              </p>
            </div>

            {/* AI Predictions */}
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">AI Predictions</h3>
              <p className="text-gray-600">
                Machine learning algorithms predict market trends and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-800">500K+</h2>
              <p className="text-gray-600">Daily Analyses</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-800">99.9%</h2>
              <p className="text-gray-600">Uptime</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-800">24/7</h2>
              <p className="text-gray-600">Support</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-800">150+</h2>
              <p className="text-gray-600">Global Markets</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Ready to transform your investment strategy?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Join thousands of investors using our platform to make smarter, data-driven decisions.
          </p>
          <button className="bg-[#1a1f36] text-white px-6 py-3 rounded-lg hover:bg-[#2d3452] inline-flex items-center font-medium">
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="font-bold text-xl mb-12 text-gray-800">EquiFolio AI</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Overview</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Features</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Solutions</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Tutorials</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Company</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">About us</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Careers</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Press</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">News</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Resource</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Blog</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Newsletter</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Events</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-gray-800">Help center</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
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
