import Link from 'next/link';
import Image from 'next/image';

interface Feature {
  title: string;
  slug: string;
  image?: string;
  category: string;
  author: string;
  timeAgo: string;
}

interface RelatedFeaturesProps {
  features: Feature[];
}

export function RelatedFeatures({ features }: RelatedFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <section className="py-16 bg-primary-50/30">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-primary-900 mb-10 border-b-4 border-accent-600 inline-block pb-2">
          Related Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={`/blog/${feature.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50">
                  {feature.image ? (
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">📰</div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">
                    {feature.category}
                  </span>
                  <h3 className="text-base font-semibold text-primary-900 group-hover:text-accent-600 transition-colors line-clamp-2 mt-2 mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-primary-500">
                    <span className="font-medium">{feature.author}</span>
                    <span>•</span>
                    <span>{feature.timeAgo}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

