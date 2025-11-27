import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, postAuthors, authors } from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      title,
      excerpt,
      content,
      authorIds,
      featuredImage,
      tags,
      categoryId,
      status,
    } = body;

    // Validation
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Title, excerpt, and content are required' },
        { status: 400 }
      );
    }

    if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one author is required' },
        { status: 400 }
      );
    }

    // Generate unique ID and slug
    const id = nanoid(10);
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    const now = new Date();

    // Prepare tags as JSON string
    const tagsJson = JSON.stringify(tags || []);

    // Get first author's name for backward compatibility
    const firstAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.id, authorIds[0]))
      .limit(1);

    const authorName = firstAuthor.length > 0 ? firstAuthor[0].name : 'Admin';

    // Insert into database
    await db.insert(posts).values({
      id,
      slug,
      title,
      excerpt,
      content,
      author: authorName, // Keep for backward compatibility
      authorId: null,
      metaTitle: title,
      metaDescription: excerpt,
      metaKeywords: tagsJson,
      featuredImage: featuredImage || null,
      featuredImageAlt: title,
      categoryId: categoryId || 'general',
      tags: tagsJson,
      status: status || 'published',
      publishedAt: status === 'published' ? now : null,
      scheduledFor: null,
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
      commentsCount: 0,
      readingTime,
      featured: false,
      sticky: false,
      allowComments: true,
    });

    // Create post-author relationships
    for (let i = 0; i < authorIds.length; i++) {
      await db.insert(postAuthors).values({
        postId: id,
        authorId: authorIds[i],
        order: i, // 0 = primary author, 1+ = additional authors
      });
    }

    // Update author post counts
    for (const authorId of authorIds) {
      const authorPosts = await db
        .select()
        .from(postAuthors)
        .where(eq(postAuthors.authorId, authorId));
      
      await db
        .update(authors)
        .set({ postCount: authorPosts.length })
        .where(eq(authors.id, authorId));
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        id,
        slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// GET route to fetch all posts (for admin dashboard)
export async function GET() {
  try {
    const allPosts = await db.select().from(posts).all();
    
    return NextResponse.json({
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

