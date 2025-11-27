import { getAllPosts } from '@/lib/api';
import { BlogCard } from '@/components/BlogCard';
import BackgroundGraphics from '@/components/BackgroundGraphics';
import type { Metadata } from 'next';

// Enable ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights on web development, technology, and more.',
  openGraph: {
    title: 'Blog - Latest Articles',
    description: 'Read our latest articles and insights on web development, technology, and more.',
  },
};

export default async function BlogPage() {
  // Fetch posts on the server side
  const posts = await getAllPosts();

  return (
    <>
      {/* Background Graphics */}
      <BackgroundGraphics />
      
      <div className="container mx-auto max-w-7xl px-4 py-12 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-primary-900 mb-4 tracking-tight">
          Blog
        </h1>
        <p className="text-base text-primary-600 max-w-2xl mx-auto leading-relaxed">
          Discover articles, tutorials, and insights about web development, 
          technology, and best practices.
        </p>
      </div>

      {/* Blog Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-primary-600 text-base">No blog posts found.</p>
        </div>
      )}

      {/* Posts Count */}
      <div className="text-center mt-12">
        <p className="text-sm text-primary-500">
          Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>
      </div>
    </>
  );
}

