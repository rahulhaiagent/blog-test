/**
 * Database Schema - SQLite with Drizzle ORM
 * Optimized for Google indexing and fast API responses
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Posts Table - Main content storage
 * Indexed for fast queries and Google crawling
 */
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  
  // Content
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  
  // Author
  author: text('author').notNull().default('Admin'),
  authorId: text('author_id'),
  
  // SEO
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'), // JSON array as string
  
  // Media
  featuredImage: text('featured_image'),
  featuredImageAlt: text('featured_image_alt'),
  
  // Categorization
  categoryId: text('category_id').notNull(),
  tags: text('tags').notNull().default('[]'), // JSON array as string
  
  // Status
  status: text('status', { enum: ['draft', 'published', 'scheduled', 'archived'] })
    .notNull()
    .default('draft'),
  
  // Dates
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  
  // Engagement
  views: integer('views').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  commentsCount: integer('comments_count').notNull().default(0),
  
  // Advanced
  readingTime: integer('reading_time'), // minutes
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  sticky: integer('sticky', { mode: 'boolean' }).notNull().default(false),
  allowComments: integer('allow_comments', { mode: 'boolean' }).notNull().default(true),
}, (table) => ({
  // Indexes for fast queries (critical for Google crawling)
  slugIdx: index('slug_idx').on(table.slug),
  statusIdx: index('status_idx').on(table.status),
  publishedAtIdx: index('published_at_idx').on(table.publishedAt),
  categoryIdx: index('category_idx').on(table.categoryId),
  featuredIdx: index('featured_idx').on(table.featured),
}));

/**
 * Categories Table
 */
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  parentId: text('parent_id'),
  postCount: integer('post_count').notNull().default(0),
  order: integer('order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  slugIdx: index('category_slug_idx').on(table.slug),
  orderIdx: index('category_order_idx').on(table.order),
}));

/**
 * Tags Table
 */
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  postCount: integer('post_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  slugIdx: index('tag_slug_idx').on(table.slug),
}));

/**
 * Comments Table
 */
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull(),
  parentId: text('parent_id'), // For nested replies
  
  // Author
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  authorWebsite: text('author_website'),
  authorAvatar: text('author_avatar'),
  
  // Content
  content: text('content').notNull(),
  
  // Moderation
  status: text('status', { enum: ['pending', 'approved', 'spam', 'trash'] })
    .notNull()
    .default('pending'),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  
  // Engagement
  likes: integer('likes').notNull().default(0),
  
  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
}, (table) => ({
  postIdx: index('comment_post_idx').on(table.postId),
  statusIdx: index('comment_status_idx').on(table.status),
  createdAtIdx: index('comment_created_at_idx').on(table.createdAt),
}));

/**
 * Settings Table
 */
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey().default('default'),
  
  // Site Info
  siteName: text('site_name').notNull().default('Blog CMS'),
  siteDescription: text('site_description').notNull(),
  siteUrl: text('site_url').notNull(),
  logo: text('logo'),
  favicon: text('favicon'),
  
  // SEO
  defaultMetaTitle: text('default_meta_title').notNull(),
  defaultMetaDescription: text('default_meta_description').notNull(),
  googleAnalyticsId: text('google_analytics_id'),
  googleSearchConsoleId: text('google_search_console_id'),
  
  // Social Media
  twitter: text('twitter'),
  facebook: text('facebook'),
  linkedin: text('linkedin'),
  instagram: text('instagram'),
  
  // Comments
  commentsEnabled: integer('comments_enabled', { mode: 'boolean' }).notNull().default(true),
  commentModeration: integer('comment_moderation', { mode: 'boolean' }).notNull().default(true),
  
  // Posts
  postsPerPage: integer('posts_per_page').notNull().default(12),
  defaultCategoryId: text('default_category_id'),
  
  // Updated
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for TypeScript
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Settings = typeof settings.$inferSelect;

