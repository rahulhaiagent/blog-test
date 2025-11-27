/**
 * API Layer - Database-backed, optimized for Google crawling
 * 
 * Features:
 * - Fast SQLite queries with indexes
 * - Server-side only (secure)
 * - Type-safe with Drizzle ORM
 * - Optimized for ISR and static generation
 */

import { Post, PostMetadata, Author } from './types';
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
  getAllAuthors as dbGetAllAuthors,
  getAuthorBySlug as dbGetAuthorBySlug,
  getAllAuthorSlugs as dbGetAllAuthorSlugs,
  getAuthorsForPost as dbGetAuthorsForPost,
  getPostsByAuthor as dbGetPostsByAuthor,
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

/**
 * Get posts by category with optional limit
 */
export async function getPostsByCategory(categoryId: string, limit?: number): Promise<Post[]> {
  try {
    const dbPosts = await dbGetPostsByCategory(categoryId);
    const posts = dbPosts.map(post => ({
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
    
    return limit ? posts.slice(0, limit) : posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

/**
 * Get featured/popular posts
 */
export async function getFeaturedPosts(limit: number = 5): Promise<Post[]> {
  try {
    const dbPosts = await dbGetFeaturedPosts(limit);
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
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  try {
    const dbAuthors = await dbGetAllAuthors();
    return dbAuthors.map(author => ({
      id: author.id,
      slug: author.slug,
      name: author.name,
      email: author.email,
      bio: author.bio || undefined,
      avatar: author.avatar || undefined,
      title: author.title || undefined,
      twitter: author.twitter || undefined,
      linkedin: author.linkedin || undefined,
      github: author.github || undefined,
      website: author.website || undefined,
      postCount: author.postCount,
      createdAt: toISODate(author.createdAt),
      updatedAt: toISODate(author.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

/**
 * Get author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const dbAuthor = await dbGetAuthorBySlug(slug);
    
    if (!dbAuthor) {
      return null;
    }

    return {
      id: dbAuthor.id,
      slug: dbAuthor.slug,
      name: dbAuthor.name,
      email: dbAuthor.email,
      bio: dbAuthor.bio || undefined,
      avatar: dbAuthor.avatar || undefined,
      title: dbAuthor.title || undefined,
      twitter: dbAuthor.twitter || undefined,
      linkedin: dbAuthor.linkedin || undefined,
      github: dbAuthor.github || undefined,
      website: dbAuthor.website || undefined,
      postCount: dbAuthor.postCount,
      createdAt: toISODate(dbAuthor.createdAt),
      updatedAt: toISODate(dbAuthor.updatedAt),
    };
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error);
    return null;
  }
}

/**
 * Get all author slugs for static generation
 */
export async function getAllAuthorSlugs(): Promise<string[]> {
  try {
    return await dbGetAllAuthorSlugs();
  } catch (error) {
    console.error('Error fetching author slugs:', error);
    return [];
  }
}

/**
 * Get authors for a specific post
 */
export async function getAuthorsForPost(postId: string): Promise<Author[]> {
  try {
    const dbAuthors = await dbGetAuthorsForPost(postId);
    return dbAuthors.map(author => ({
      id: author.id,
      slug: author.slug,
      name: author.name,
      email: author.email,
      bio: author.bio || undefined,
      avatar: author.avatar || undefined,
      title: author.title || undefined,
      twitter: author.twitter || undefined,
      linkedin: author.linkedin || undefined,
      github: author.github || undefined,
      website: author.website || undefined,
      postCount: author.postCount,
    }));
  } catch (error) {
    console.error(`Error fetching authors for post ${postId}:`, error);
    return [];
  }
}

/**
 * Get posts by author
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const dbPosts = await dbGetPostsByAuthor(authorId);
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
    console.error(`Error fetching posts by author ${authorId}:`, error);
    return [];
  }
}

