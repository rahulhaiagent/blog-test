/**
 * Database Queries - Optimized for Google Crawling
 * Fast, cached, and secure queries
 */

import { eq, desc, and, like, inArray, sql } from 'drizzle-orm';
import { db } from './index';
import { posts, categories, tags, Post } from './schema';

/**
 * Get all published posts
 * Optimized with indexes for fast retrieval
 */
export async function getAllPublishedPosts() {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .all();
}

/**
 * Get post by slug
 * Critical for Google crawling - must be fast!
 */
export async function getPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.slug, slug),
      eq(posts.status, 'published')
    ))
    .limit(1)
    .all();

  return result[0] || null;
}

/**
 * Get all slugs for static generation
 * Used by generateStaticParams()
 */
export async function getAllPostSlugs() {
  const result = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, 'published'))
    .all();

  return result.map(r => r.slug);
}

/**
 * Search posts by title or content
 */
export async function searchPosts(query: string) {
  const searchTerm = `%${query}%`;
  return await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.status, 'published'),
      sql`(${posts.title} LIKE ${searchTerm} OR ${posts.content} LIKE ${searchTerm})`
    ))
    .orderBy(desc(posts.publishedAt))
    .all();
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(categoryId: string) {
  return await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.categoryId, categoryId),
      eq(posts.status, 'published')
    ))
    .orderBy(desc(posts.publishedAt))
    .all();
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tagId: string) {
  const allPosts = await getAllPublishedPosts();
  return allPosts.filter(post => {
    const postTags = JSON.parse(post.tags);
    return postTags.includes(tagId);
  });
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3) {
  return await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.featured, true),
      eq(posts.status, 'published')
    ))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .all();
}

/**
 * Get related posts by category and tags
 */
export async function getRelatedPosts(postId: string, limit: number = 3) {
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)
    .all();

  if (!post[0]) return [];

  const currentPost = post[0];
  const postTags = JSON.parse(currentPost.tags);

  // Get posts from same category
  const related = await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.categoryId, currentPost.categoryId),
      eq(posts.status, 'published'),
      sql`${posts.id} != ${postId}`
    ))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .all();

  return related;
}

/**
 * Increment post view count
 */
export async function incrementPostViews(postId: string) {
  await db
    .update(posts)
    .set({ views: sql`${posts.views} + 1` })
    .where(eq(posts.id, postId));
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  return await db
    .select()
    .from(categories)
    .orderBy(categories.order)
    .all();
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)
    .all();

  return result[0] || null;
}

/**
 * Get all tags
 */
export async function getAllTags() {
  return await db
    .select()
    .from(tags)
    .orderBy(desc(tags.postCount))
    .all();
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1)
    .all();

  return result[0] || null;
}

/**
 * Get popular posts (by views)
 */
export async function getPopularPosts(limit: number = 5) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.views))
    .limit(limit)
    .all();
}

/**
 * Get recent posts
 */
export async function getRecentPosts(limit: number = 5) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .all();
}

