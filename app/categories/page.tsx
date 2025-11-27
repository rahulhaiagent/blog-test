import { getCategories } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories | Blog',
  description: 'Browse all blog categories and discover content organized by topic.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-primary-200">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Browse by Category
            </h1>
            <p className="text-lg text-primary-600">
              Explore our content organized by topics. Find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group"
            >
              <article className="h-full bg-white border border-primary-200 rounded-xl p-8 hover:shadow-xl hover:border-accent-500 transition-all duration-300">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-accent-100 to-accent-50 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{category.icon || '📁'}</span>
                </div>

                {/* Category Name */}
                <h2 className="text-2xl font-bold text-primary-900 mb-3 group-hover:text-accent-700 transition-colors">
                  {category.name}
                </h2>

                {/* Description */}
                {category.description && (
                  <p className="text-primary-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Post Count */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-primary-100">
                  <span className="text-sm font-medium text-primary-700">
                    {category.postCount} {category.postCount === 1 ? 'Article' : 'Articles'}
                  </span>
                  <svg 
                    className="w-5 h-5 text-accent-600 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">No Categories Yet</h2>
            <p className="text-primary-600">Categories will appear here once they're created.</p>
          </div>
        )}
      </div>
    </div>
  );
}

