'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentRendererProps {
  content: string;
  className?: string;
}

/**
 * ContentRenderer - Intelligently renders content as HTML or Markdown
 * Detects format and renders appropriately
 */
export default function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect if content is HTML (from rich text editor) or Markdown
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  // Add IDs to HTML headings for table of contents navigation
  useEffect(() => {
    if (isHTML && contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        heading.id = id;
      });
    }
  }, [isHTML, content]);

  if (isHTML) {
    // Render HTML content
    return (
      <div
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Render Markdown content
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: () => null, // Skip h1 as it's already in the page header
          h2: ({ children, ...props }) => {
            const text = children?.toString() || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const text = children?.toString() || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h3 id={id} {...props}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
