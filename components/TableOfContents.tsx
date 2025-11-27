'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header + some padding
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / documentHeight) * 100;
      setProgress(Math.min(scrolled, 100));

      // Find the current section based on scroll position
      let currentSectionId = '';

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);

        if (element) {
          const elementTop = element.offsetTop;

          // If we've scrolled past this heading, it's the active one
          if (scrollPosition >= elementTop) {
            currentSectionId = heading.id;
            break;
          }
        }
      }

      // Set the first section as active if we haven't scrolled to any section yet
      if (!currentSectionId && headings.length > 0) {
        currentSectionId = headings[0].id;
      }

      if (currentSectionId && currentSectionId !== activeId) {
        setActiveId(currentSectionId);
      }
    };

    // Set initial active section
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Increased offset for better visibility
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update active state immediately
      setActiveId(id);
    }
  };

  return (
    <nav className="relative">
      {/* Glassmorphism Background */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg shadow-primary-900/5 p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-accent-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-primary-800 tracking-wide uppercase">
                Contents
              </h3>
            </div>
            <span className="text-xs text-primary-500 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-primary-100 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Table of Contents Items */}
        <div className="space-y-2">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id;
            const isCompleted = headings.findIndex(h => h.id === activeId) > index;

            return (
              <div key={heading.id} className="group relative">
                {/* Connecting Line */}
                {index < headings.length - 1 && (
                  <div className={`absolute left-2 top-6 w-px h-4 transition-colors duration-300 ${
                    isActive ? 'bg-accent-300' : 'bg-primary-200'
                  }`}></div>
                )}

                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={`relative flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 cursor-pointer group-hover:translate-x-1 ${
                    isActive
                      ? 'bg-accent-50 text-accent-800 shadow-sm border border-accent-200'
                      : isCompleted
                      ? 'text-primary-600 hover:text-accent-700 hover:bg-primary-50/50'
                      : 'text-primary-500 hover:text-primary-700 hover:bg-primary-50/30'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className={`relative flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-accent-500 bg-accent-500 shadow-sm shadow-accent-500/25'
                      : isCompleted
                      ? 'border-accent-400 bg-accent-400'
                      : 'border-primary-300 group-hover:border-primary-400'
                  }`}>
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-accent-500 animate-pulse opacity-75"></div>
                    )}
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <span className={`text-sm leading-snug transition-all duration-300 ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}>
                    {heading.text}
                  </span>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isActive ? 'bg-accent-100' : 'bg-primary-50'
                  }`}></div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 pt-4 border-t border-primary-100">
          <div className="flex items-center justify-center">
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-primary-300 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

