import Link from 'next/link';

interface NewsItem {
  title: string;
  slug: string;
}

interface MostPopularNewsProps {
  items: NewsItem[];
}

export function MostPopularNews({ items }: MostPopularNewsProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-primary-200">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-3xl font-bold text-primary-900">Most Popular News</h2>
          <svg className="w-7 h-7 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          {items.slice(0, 10).map((item, index) => (
            <Link
              key={index}
              href={`/blog/${item.slug}`}
              className="flex items-start gap-4 group"
            >
              <span className="text-3xl font-bold text-accent-600 flex-shrink-0">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-primary-900 group-hover:text-accent-600 transition-colors leading-tight">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

