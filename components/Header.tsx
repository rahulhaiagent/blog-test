'use client';

import { useState } from 'react';
import { SearchModal } from './SearchModal';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <nav className="container mx-auto max-w-[1400px] px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-accent-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              TechBlog
            </span>
          </a>

          {/* Navigation Links with Dropdowns */}
          <div className="flex items-center gap-0">
            <div className="group relative">
              <button className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                Dictionary
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="group relative">
              <button className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                Technology
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="group relative">
              <button className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                Cryptocurrency
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="group relative">
              <button className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                Cybersecurity
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="group relative">
              <button className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                Categories
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <a href="/authors" className="px-4 py-6 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Authors
            </a>
            
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 ml-4 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

