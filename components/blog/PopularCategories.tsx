import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
  icon: string;
}

interface PopularCategoriesProps {
  categories: Category[];
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-primary-900 border-b-4 border-accent-600 inline-block pb-2">
            Popular Categories
          </h2>
          <Link
            href="/blog"
            className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2 group"
          >
            <span>Show All</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/blog?category=${category.slug}`}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-accent-600 transition-colors">
                <span className="text-4xl">{category.icon}</span>
              </div>
              <span className="text-sm font-medium text-primary-900 group-hover:text-accent-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

