'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

interface AuthorHoverCardProps {
  author: Author;
  children: React.ReactNode;
}

export function AuthorHoverCard({ author, children }: AuthorHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.bottom + 8, // 8px below the element
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100); // Small delay to allow moving to the card
  };

  const handleCardMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
  };

  const hoverCardContent = isHovered && (
        <div
          className="fixed z-[999999]"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            animation: 'fadeIn 200ms ease-out forwards',
          }}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="w-[380px] bg-white rounded-lg shadow-2xl border border-primary-200 p-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {author.avatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary-200">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-xl ring-2 ring-primary-200">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-primary-900 mb-1">
                  {author.name}
                </h3>
                {author.title && (
                  <p className="text-sm text-primary-600 mb-2">
                    {author.title}
                  </p>
                )}

                {/* Social Links */}
                {(author.linkedin || author.twitter || author.github || author.website) && (
                  <div className="flex items-center gap-2">
                    {author.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${author.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-accent-600 transition-colors"
                        aria-label="LinkedIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-accent-600 transition-colors"
                        aria-label="Twitter"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                    )}
                    {author.github && (
                      <a
                        href={`https://github.com/${author.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-accent-600 transition-colors"
                        aria-label="GitHub"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                      </a>
                    )}
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-accent-600 transition-colors"
                        aria-label="Website"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {author.bio && (
              <p className="text-sm text-primary-700 leading-relaxed mb-4">
                {author.bio.length > 150 
                  ? `${author.bio.substring(0, 150)}...` 
                  : author.bio
                }
              </p>
            )}

            {/* View All Articles Link */}
            <Link
              href={`/authors/${author.slug}`}
              className="flex items-center justify-between w-full px-4 py-2.5 bg-primary-50 hover:bg-accent-50 border border-primary-200 hover:border-accent-600 rounded-lg transition-all group"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-sm font-semibold text-primary-900 group-hover:text-accent-700">
                All Articles By {author.name.split(' ')[0]}
              </span>
              <svg 
                className="w-5 h-5 text-accent-600 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
  );

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block"
      >
        {children}
      </span>

      {/* Render hover card in portal at body level */}
      {mounted && hoverCardContent && createPortal(hoverCardContent, document.body)}
    </>
  );
}

