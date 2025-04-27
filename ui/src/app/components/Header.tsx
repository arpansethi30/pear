"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="bg-light-bg py-4 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="font-bold text-xl text-gray-800">EquiFolio AI</div>
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/analysis" 
            className={`${pathname === "/analysis" 
              ? "text-[#1a1f36] border-b-2 border-[#1a1f36]" 
              : "text-gray-600"} hover:text-gray-800`}
          >
            Analysis
          </Link>
          <Link 
            href="/portfolio" 
            className={`${pathname === "/portfolio" 
              ? "text-[#1a1f36] border-b-2 border-[#1a1f36]" 
              : "text-gray-600"} hover:text-gray-800`}
          >
            Portfolio
          </Link>
        </nav>
        <button className="bg-[#1a1f36] text-white px-5 py-2 rounded-lg hover:bg-[#2d3452]">
          Get Started
        </button>
      </div>
    </header>
  );
} 