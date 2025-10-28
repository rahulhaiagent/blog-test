/**
 * Database Migration Script
 * Creates tables and indexes
 */

import { sql } from 'drizzle-orm';
import { db, sqlite } from './index';

export function runMigrations() {
  console.log('🔄 Running database migrations...');

  try {
    // Create posts table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL DEFAULT 'Admin',
        author_id TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        featured_image TEXT,
        featured_image_alt TEXT,
        category_id TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'draft',
        published_at INTEGER,
        scheduled_for INTEGER,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        views INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        reading_time INTEGER,
        featured INTEGER NOT NULL DEFAULT 0,
        sticky INTEGER NOT NULL DEFAULT 0,
        allow_comments INTEGER NOT NULL DEFAULT 1
      );

      CREATE INDEX IF NOT EXISTS slug_idx ON posts(slug);
      CREATE INDEX IF NOT EXISTS status_idx ON posts(status);
      CREATE INDEX IF NOT EXISTS published_at_idx ON posts(published_at);
      CREATE INDEX IF NOT EXISTS category_idx ON posts(category_id);
      CREATE INDEX IF NOT EXISTS featured_idx ON posts(featured);
    `);

    // Create categories table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT,
        parent_id TEXT,
        post_count INTEGER NOT NULL DEFAULT 0,
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS category_slug_idx ON categories(slug);
      CREATE INDEX IF NOT EXISTS category_order_idx ON categories("order");
    `);

    // Create tags table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        post_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS tag_slug_idx ON tags(slug);
    `);

    // Create comments table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        parent_id TEXT,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        author_website TEXT,
        author_avatar TEXT,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        is_admin INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at INTEGER,
        ip_address TEXT,
        user_agent TEXT
      );

      CREATE INDEX IF NOT EXISTS comment_post_idx ON comments(post_id);
      CREATE INDEX IF NOT EXISTS comment_status_idx ON comments(status);
      CREATE INDEX IF NOT EXISTS comment_created_at_idx ON comments(created_at);
    `);

    // Create settings table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        site_name TEXT NOT NULL DEFAULT 'Blog CMS',
        site_description TEXT NOT NULL,
        site_url TEXT NOT NULL,
        logo TEXT,
        favicon TEXT,
        default_meta_title TEXT NOT NULL,
        default_meta_description TEXT NOT NULL,
        google_analytics_id TEXT,
        google_search_console_id TEXT,
        twitter TEXT,
        facebook TEXT,
        linkedin TEXT,
        instagram TEXT,
        comments_enabled INTEGER NOT NULL DEFAULT 1,
        comment_moderation INTEGER NOT NULL DEFAULT 1,
        posts_per_page INTEGER NOT NULL DEFAULT 12,
        default_category_id TEXT,
        updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
  console.log('✅ Database initialized!');
  process.exit(0);
}

