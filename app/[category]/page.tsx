import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getAllPosts } from '@/lib/api';
import { BlogCard } from '@/components/BlogCard';
import type { Metadata } from 'next';

// Enable ISR
export const revalidate = 3600;

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find(c => c.slug === params.category);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Blog`,
    description: category.description || `Browse all articles in ${category.name}`,
  };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: { category: string } 
}) {
  const categories = await getCategories();
  const category = categories.find(c => c.slug === params.category);

  if (!category) {
    notFound();
  }

  // Get all posts and filter by category
  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter(post => 
    post.categories?.includes(category.id) || 
    post.categoryId === category.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-primary-200">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-primary-600 mb-6">
            <Link href="/" className="hover:text-accent-600 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/categories" className="hover:text-accent-600 transition-colors">
              Categories
            </Link>
            <span>›</span>
            <span className="text-primary-900 font-medium">{category.name}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Category Icon & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-100 to-accent-50 flex items-center justify-center">
                <span className="text-4xl">{category.icon || '📁'}</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-900">
                  {category.name}
                </h1>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <p className="text-lg text-primary-600 mb-4">
                {category.description}
              </p>
            )}

            {/* Post Count */}
            <div className="flex items-center gap-4 text-sm text-primary-600">
              <span className="font-medium">
                {categoryPosts.length} {categoryPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post}
                variant="default"
                showAuthor={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              No Articles Yet
            </h2>
            <p className="text-primary-600 mb-8">
              There are no articles in this category yet. Check back soon!
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Browse All Categories
            </Link>
          </div>
        )}
      </div>

      {/* Other Categories */}
      {categories.length > 1 && (
        <div className="bg-primary-50 border-t border-primary-200">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              Explore Other Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories
                .filter(c => c.slug !== params.category)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="group p-4 bg-white border border-primary-200 rounded-lg hover:shadow-lg hover:border-accent-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon || '📁'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-primary-900 group-hover:text-accent-700 transition-colors truncate">
                          {cat.name}
                        </div>
                        <div className="text-xs text-primary-500">
                          {cat.postCount} {cat.postCount === 1 ? 'article' : 'articles'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

