/**
 * Database Seed Script
 * Populates database with initial data
 */

import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { sql, eq } from 'drizzle-orm';
import { db } from './index';
import { posts, categories, tags, settings } from './schema';
import { runMigrations } from './migrate';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Run migrations first
    runMigrations();

    // 1. Create default settings
    console.log('Creating settings...');
    await db.insert(settings).values({
      id: 'default',
      siteName: 'Blog CMS',
      siteDescription: 'A high-performance, SEO-optimized blog built with Next.js',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      defaultMetaTitle: 'Blog CMS - SEO Optimized Blog',
      defaultMetaDescription: 'A high-performance, SEO-optimized blog built with Next.js and React',
      postsPerPage: 12,
      commentsEnabled: true,
      commentModeration: true,
    }).onConflictDoNothing();

    // 2. Create categories
    console.log('Creating categories...');
    const categoryData = [
      { name: 'Technology', icon: '💻', color: '#3b82f6', description: 'Tech news and tutorials' },
      { name: 'Web Development', icon: '🌐', color: '#10b981', description: 'Web dev tips and tricks' },
      { name: 'Design', icon: '🎨', color: '#8b5cf6', description: 'Design principles and UI/UX' },
      { name: 'Business', icon: '💼', color: '#f59e0b', description: 'Business and entrepreneurship' },
      { name: 'Lifestyle', icon: '✨', color: '#ec4899', description: 'Life, travel, and more' },
    ];

    const createdCategories = [];
    for (const cat of categoryData) {
      const id = nanoid(10);
      const slug = slugify(cat.name, { lower: true, strict: true });
      await db.insert(categories).values({
        id,
        name: cat.name,
        slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        order: createdCategories.length,
      }).onConflictDoNothing();
      createdCategories.push({ id, slug, name: cat.name });
    }

    // 3. Create tags
    console.log('Creating tags...');
    const tagData = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
      'CSS', 'Tailwind', 'UI/UX', 'SEO', 'Performance',
      'Tutorial', 'Guide', 'Tips', 'Best Practices', 'Tools'
    ];

    const createdTags = [];
    for (const tagName of tagData) {
      const id = nanoid(10);
      const slug = slugify(tagName, { lower: true, strict: true });
      await db.insert(tags).values({
        id,
        name: tagName,
        slug,
      }).onConflictDoNothing();
      createdTags.push({ id, slug, name: tagName });
    }

    // 4. Create sample posts
    console.log('Creating sample posts...');
    const postTitles = [
      'Getting Started with Next.js 14: A Complete Guide',
      'Building Fast and SEO-Friendly Websites',
      'The Ultimate Guide to TypeScript',
      'Modern CSS Techniques for 2024',
      'React Server Components Explained',
      'Optimizing Web Performance: Best Practices',
      'Introduction to Tailwind CSS',
      'Building Scalable APIs with Node.js',
      'UI/UX Design Principles Every Developer Should Know',
      'The Future of Web Development',
    ];

    for (let i = 0; i < postTitles.length; i++) {
      const title = postTitles[i];
      const id = nanoid(10);
      const slug = slugify(title, { lower: true, strict: true });
      const category = createdCategories[i % createdCategories.length];
      const postTags = [
        createdTags[i % createdTags.length].id,
        createdTags[(i + 1) % createdTags.length].id,
        createdTags[(i + 2) % createdTags.length].id,
      ];

      const content = `# ${title}

## Introduction

This is a comprehensive guide about ${title.toLowerCase()}. In this article, we'll explore the key concepts, best practices, and practical examples to help you master this topic.

## What You'll Learn

- Understanding the fundamentals
- Best practices and patterns
- Real-world examples
- Common pitfalls to avoid
- Advanced techniques

## Getting Started

Let's dive into the details and explore everything you need to know about this topic.

### Key Concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Best Practices

1. **Follow industry standards**: Always adhere to established best practices
2. **Write clean code**: Keep your code readable and maintainable
3. **Test thoroughly**: Ensure your code works as expected
4. **Document well**: Write clear documentation for future reference
5. **Optimize performance**: Make your applications fast and efficient

## Practical Examples

Here are some practical examples to help you understand the concepts better:

\`\`\`javascript
// Example code
const example = () => {
  console.log('Hello, World!');
};
\`\`\`

## Advanced Techniques

Once you've mastered the basics, you can explore more advanced techniques to take your skills to the next level.

### Performance Optimization

- Minimize bundle size
- Implement lazy loading
- Use caching strategies
- Optimize images
- Reduce network requests

### Security Considerations

Always keep security in mind when building applications. Follow these guidelines:

- Validate user input
- Sanitize data
- Use HTTPS
- Implement authentication
- Keep dependencies updated

## Conclusion

We've covered a lot of ground in this guide. By following these principles and practices, you'll be well on your way to mastering ${title.toLowerCase()}.

Remember to keep learning, experimenting, and building amazing things!

## Resources

- Official documentation
- Community forums
- Video tutorials
- GitHub repositories
- Online courses

Happy coding! 🚀`;

      const excerpt = `A comprehensive guide to ${title.toLowerCase()}. Learn the fundamentals, best practices, and advanced techniques in this detailed tutorial.`;

      await db.insert(posts).values({
        id,
        slug,
        title,
        excerpt,
        content,
        author: 'Admin',
        categoryId: category.id,
        tags: JSON.stringify(postTags),
        status: 'published',
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Stagger dates
        featuredImage: `https://placehold.co/1200x630/e9ecef/495057?text=${encodeURIComponent(title.substring(0, 30))}`,
        featuredImageAlt: title,
        readingTime: 5 + Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        featured: i < 3, // First 3 posts are featured
        allowComments: true,
      }).onConflictDoNothing();
    }

    // Update category post counts
    console.log('Updating category counts...');
    for (const category of createdCategories) {
      const count = await db.select().from(posts).where(eq(posts.categoryId, category.id));
      await db.update(categories)
        .set({ postCount: count.length })
        .where(eq(categories.id, category.id));
    }

    // Update tag post counts
    console.log('Updating tag counts...');
    for (const tag of createdTags) {
      const allPosts = await db.select().from(posts);
      const count = allPosts.filter(post => {
        const postTags = JSON.parse(post.tags);
        return postTags.includes(tag.id);
      }).length;
      await db.update(tags)
        .set({ postCount: count })
        .where(eq(tags.id, tag.id));
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${createdCategories.length} categories created`);
    console.log(`   - ${createdTags.length} tags created`);
    console.log(`   - ${postTitles.length} posts created`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

