'use client';

import { useState } from 'react';

interface ShareArticleProps {
  title: string;
  slug: string;
}

export default function ShareArticle({ title, slug }: ShareArticleProps) {
  const [copied, setCopied] = useState(false);
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/blog/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnX = () => {
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h3 className="text-sm font-bold tracking-wide text-primary-900 mb-4 uppercase">
        Share This Article
      </h3>
      <div className="space-y-2">
        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-sm font-medium break-words">{copied ? 'Copied!' : 'Copy link'}</span>
        </button>

        <button
          onClick={shareOnLinkedIn}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="text-sm font-medium break-words">Post on LinkedIn</span>
        </button>

        <button
          onClick={shareOnX}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="text-sm font-medium break-words">Post on X</span>
        </button>
      </div>
    </div>
  );
}

