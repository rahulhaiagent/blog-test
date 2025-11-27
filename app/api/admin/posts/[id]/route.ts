import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, postAuthors, authors } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

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

// GET /api/admin/posts/[id] - Fetch single post by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Fetch post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Fetch associated authors
    const postAuthorRecords = await db
      .select({
        authorId: authors.id,
        authorName: authors.name,
        order: postAuthors.order,
      })
      .from(postAuthors)
      .innerJoin(authors, eq(postAuthors.authorId, authors.id))
      .where(eq(postAuthors.postId, postId))
      .orderBy(postAuthors.order);

    // Extract author IDs
    const authorIds = postAuthorRecords.map(pa => pa.authorId);

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        authorIds,
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/[id] - Update post
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();

    const {
      title,
      excerpt,
      content,
      authorIds,
      featuredImage,
      featuredImageAlt,
      tags,
      categoryId,
      status,
    } = body;

    // Validation
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, excerpt, and content are required' },
        { status: 400 }
      );
    }

    if (!authorIds || authorIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one author is required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    const slug = title !== existingPost.title
      ? generateSlug(title)
      : existingPost.slug;

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    // Get first author for backward compatibility
    const [firstAuthor] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, authorIds[0]))
      .limit(1);

    // Update post
    const updateData: any = {
      title,
      slug,
      excerpt,
      content,
      author: firstAuthor?.name || 'Unknown',
      authorId: authorIds[0],
      featuredImage: featuredImage || null,
      featuredImageAlt: featuredImageAlt || null,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : tags,
      categoryId: categoryId || 'general',
      status: status || 'published',
      readingTime,
      updatedAt: new Date(),
    };

    // Only update publishedAt if status is changing to published and it wasn't published before
    if (status === 'published' && existingPost.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId));

    // Update post-author relationships
    // Delete existing relationships
    await db.delete(postAuthors).where(eq(postAuthors.postId, postId));

    // Insert new relationships
    for (let i = 0; i < authorIds.length; i++) {
      await db.insert(postAuthors).values({
        postId,
        authorId: authorIds[i],
        order: i,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      post: {
        id: postId,
        slug,
      },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete post (optional future feature)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Check if post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete post-author relationships first
    await db.delete(postAuthors).where(eq(postAuthors.postId, postId));

    // Delete post
    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
