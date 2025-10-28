/**
 * API Layer - Database-backed, optimized for Google crawling
 * 
 * Features:
 * - Fast SQLite queries with indexes
 * - Server-side only (secure)
 * - Type-safe with Drizzle ORM
 * - Optimized for ISR and static generation
 */

import { Post, PostMetadata } from './types';
import {
  getAllPublishedPosts,
  getPostBySlug as dbGetPostBySlug,
  getAllPostSlugs,
  searchPosts as dbSearchPosts,
  getPostsByCategory as dbGetPostsByCategory,
  getPostsByTag as dbGetPostsByTag,
  getFeaturedPosts as dbGetFeaturedPosts,
  getAllCategories,
  getAllTags,
} from './db/queries';

// Safely convert various date representations to ISO string
function toISODate(value: unknown): string | undefined {
  try {
    if (!value) return undefined;
    const d = value instanceof Date ? value : new Date(value as any);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Fetch all blog posts from database
 * Used for: Blog listing page, sitemap generation
 * Optimized with indexes for fast queries
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const dbPosts = await getAllPublishedPosts();
    
    // Transform database posts to API format
    return dbPosts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publishedAt: toISODate(post.publishedAt) || new Date().toISOString(),
      updatedAt: toISODate(post.updatedAt),
      featuredImage: post.featuredImage || undefined,
      tags: JSON.parse(post.tags),
      categories: [post.categoryId],
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch single post by slug from database
 * Used for: Individual blog post pages
 * Critical for Google crawling - optimized with index
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const dbPost = await dbGetPostBySlug(slug);
    
    if (!dbPost) {
      return null;
    }

    // Transform to API format
    return {
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      author: dbPost.author,
      publishedAt: toISODate(dbPost.publishedAt) || new Date().toISOString(),
      updatedAt: toISODate(dbPost.updatedAt),
      featuredImage: dbPost.featuredImage || undefined,
      tags: JSON.parse(dbPost.tags),
      categories: [dbPost.categoryId],
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all post slugs from database
 * Used for: generateStaticParams() in dynamic routes
 * Fast query - only fetches slug field
 */
export async function getAllSlugs(): Promise<string[]> {
  try {
    return await getAllPostSlugs();
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}

/**
 * Get post metadata (lighter than full post)
 * Used for: Listing pages where full content isn't needed
 */
export async function getAllPostsMetadata(): Promise<PostMetadata[]> {
  try {
    const posts = await getAllPosts();
    return posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishedAt: post.publishedAt,
      featuredImage: post.featuredImage,
      tags: post.tags,
    }));
  } catch (error) {
    console.error('Error fetching post metadata:', error);
    return [];
  }
}

/**
 * Search posts
 */
export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const dbPosts = await dbSearchPosts(query);
    return dbPosts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publishedAt: toISODate(post.publishedAt) || new Date().toISOString(),
      updatedAt: toISODate(post.updatedAt),
      featuredImage: post.featuredImage || undefined,
      tags: JSON.parse(post.tags),
      categories: [post.categoryId],
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

/**
 * Get categories
 */
export async function getCategories() {
  try {
    return await getAllCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get tags
 */
export async function getTags() {
  try {
    return await getAllTags();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

