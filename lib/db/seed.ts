/**
 * Database Seed Script
 * Populates database with initial data
 */

import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { sql, eq } from 'drizzle-orm';
import { db } from './index';
import { posts, categories, tags, settings, authors, postAuthors, adminUsers } from './schema';
import { runMigrations } from './migrate';
import bcrypt from 'bcryptjs';

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

    // 2. Create default admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(adminUsers).values({
      id: nanoid(10),
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'super_admin',
      active: true,
    }).onConflictDoNothing();
    console.log('✅ Default admin user created:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  IMPORTANT: Change this password after first login!');

    // 3. Create categories
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

    // 3. Create authors with random names
    console.log('Creating authors...');
    const authorData = [
      { 
        name: 'Sarah Mitchell', 
        title: 'Senior Software Engineer', 
        bio: 'Full-stack developer with 10+ years of experience building scalable web applications. Passionate about clean code and modern JavaScript frameworks.',
        twitter: 'sarahmitchell',
        linkedin: 'sarah-mitchell-dev',
        github: 'sarahmitchell'
      },
      { 
        name: 'Marcus Chen', 
        title: 'DevOps Architect', 
        bio: 'Cloud infrastructure specialist and automation enthusiast. Helping teams deploy faster and more reliably with modern DevOps practices.',
        twitter: 'marcuschen',
        linkedin: 'marcus-chen-devops',
        github: 'marcuschen'
      },
      { 
        name: 'Emily Rodriguez', 
        title: 'UI/UX Designer & Frontend Developer', 
        bio: 'Creating beautiful and intuitive user experiences. Specialized in React, design systems, and accessibility.',
        twitter: 'emilyrodriguez',
        linkedin: 'emily-rodriguez-design',
        github: 'emilyrodriguez'
      },
      { 
        name: 'David Kim', 
        title: 'Tech Lead & Solutions Architect', 
        bio: 'Building enterprise-grade applications with a focus on performance and scalability. Expert in Node.js, TypeScript, and microservices architecture.',
        twitter: 'davidkim',
        linkedin: 'david-kim-tech',
        github: 'davidkim'
      },
      { 
        name: 'Jennifer Taylor', 
        title: 'Data Engineer', 
        bio: 'Turning data into insights. Specialized in big data processing, machine learning pipelines, and database optimization.',
        twitter: 'jentaylor',
        linkedin: 'jennifer-taylor-data',
        github: 'jentaylor'
      },
      { 
        name: 'Alex Johnson', 
        title: 'Security Engineer', 
        bio: 'Cybersecurity specialist focused on application security, penetration testing, and secure coding practices.',
        twitter: 'alexjohnson',
        linkedin: 'alex-johnson-security',
        github: 'alexjohnson'
      },
      { 
        name: 'Priya Sharma', 
        title: 'Mobile App Developer', 
        bio: 'Building cross-platform mobile experiences with React Native and Flutter. Passionate about mobile UX and performance optimization.',
        twitter: 'priyasharma',
        linkedin: 'priya-sharma-mobile',
        github: 'priyasharma'
      },
      { 
        name: 'James Wilson', 
        title: 'Backend Developer', 
        bio: 'API design and backend architecture expert. Working with Node.js, Python, and distributed systems to build robust server-side applications.',
        twitter: 'jameswilson',
        linkedin: 'james-wilson-backend',
        github: 'jameswilson'
      },
    ];

    const createdAuthors = [];
    for (const authorInfo of authorData) {
      const id = nanoid(10);
      const slug = slugify(authorInfo.name, { lower: true, strict: true });
      await db.insert(authors).values({
        id,
        slug,
        name: authorInfo.name,
        email: `${slug}@example.com`,
        bio: authorInfo.bio,
        title: authorInfo.title,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorInfo.name)}&size=200&background=random`,
        twitter: authorInfo.twitter,
        linkedin: authorInfo.linkedin,
        github: authorInfo.github,
        website: `https://${slug}.dev`,
      }).onConflictDoNothing();
      createdAuthors.push({ id, slug, name: authorInfo.name });
    }

    // 4. Create tags
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

    // 5. Create sample posts
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

      // Assign 1-2 authors per post (realistic distribution)
      const primaryAuthor = createdAuthors[i % createdAuthors.length];
      const selectedAuthorIds = [primaryAuthor.id];
      
      // 40% chance of having a second author
      if (Math.random() < 0.4) {
        const secondaryAuthor = createdAuthors[(i + 1) % createdAuthors.length];
        if (secondaryAuthor.id !== primaryAuthor.id) {
          selectedAuthorIds.push(secondaryAuthor.id);
        }
      }

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
        author: createdAuthors[selectedAuthorIds.length > 0 ? createdAuthors.findIndex(a => a.id === selectedAuthorIds[0]) : 0].name, // Keep for backwards compatibility
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

      // Create post-author relationships
      for (let j = 0; j < selectedAuthorIds.length; j++) {
        await db.insert(postAuthors).values({
          postId: id,
          authorId: selectedAuthorIds[j],
          order: j, // 0 = primary author, 1 = secondary author
        }).onConflictDoNothing();
      }
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

    // Update author post counts
    console.log('Updating author counts...');
    for (const author of createdAuthors) {
      const count = await db.select().from(postAuthors).where(eq(postAuthors.authorId, author.id));
      await db.update(authors)
        .set({ postCount: count.length })
        .where(eq(authors.id, author.id));
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${createdCategories.length} categories created`);
    console.log(`   - ${createdAuthors.length} authors created`);
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

