import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { db } from '@/lib/db';
import { authors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET all authors
export async function GET() {
  try {
    const allAuthors = await db.select().from(authors).orderBy(authors.name);
    
    return NextResponse.json(allAuthors, { status: 200 });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST create new author
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, title, bio, avatar, twitter, linkedin, github, website } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.email, email))
      .limit(1);

    if (existingAuthor.length > 0) {
      return NextResponse.json(
        { error: 'An author with this email already exists' },
        { status: 400 }
      );
    }

    // Generate ID and slug
    const id = nanoid(10);
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug exists and make it unique if needed
    const existingSlug = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug))
      .limit(1);

    const finalSlug = existingSlug.length > 0 ? `${slug}-${nanoid(5)}` : slug;

    // Create author
    await db.insert(authors).values({
      id,
      slug: finalSlug,
      name,
      email,
      title: title || null,
      bio: bio || null,
      avatar: avatar || null,
      twitter: twitter || null,
      linkedin: linkedin || null,
      github: github || null,
      website: website || null,
      postCount: 0,
    });

    // Fetch the created author
    const createdAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    return NextResponse.json(createdAuthor[0], { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}

