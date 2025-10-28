/**
 * Type definitions for the Blog CMS
 */

/**
 * Main Post interface representing a blog post
 */
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
}

/**
 * Metadata for a post (used for listing pages)
 */
export interface PostMetadata {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  tags?: string[];
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

/**
 * Sitemap entry for XML sitemap generation
 */
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Structured data for BlogPosting schema
 */
export interface BlogPostingSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

