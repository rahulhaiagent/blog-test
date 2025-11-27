import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface BlogCardProps {
  post: Post;
  variant?: 'default' | 'horizontal' | 'featured' | 'compact';
  showAuthor?: boolean;
}

export function BlogCard({ post, variant = 'default', showAuthor = false }: BlogCardProps) {
  const readingTime = calculateReadingTime(post.content);

  // Horizontal variant (for featured/hero posts)
  if (variant === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-white rounded-xl border border-primary-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col md:flex-row">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-accent-100 to-accent-50 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 flex-1 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4 group-hover:text-accent-600 transition-colors line-clamp-2">
              {post.title}
            </h2>

            <p className="text-primary-600 text-lg mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-primary-500">
              <span className="font-medium">{readingTime}</span>
              {showAuthor && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Compact variant (for category sections)
  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-44 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden rounded-xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="py-5 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>

            <div className="mt-auto">
              <span className="text-sm text-primary-500 font-medium">{readingTime}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Featured variant (large card with author)
  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-56 bg-gradient-to-br from-accent-100 to-accent-50 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>

            <p className="text-primary-600 text-sm mb-4 line-clamp-2 flex-1">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-primary-100">
              <div className="flex-1">
                <span className="text-sm font-medium text-primary-900 block">{post.author}</span>
                <span className="text-xs text-primary-500">{readingTime}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant (standard grid card)
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-lg border border-primary-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-48 bg-primary-100 overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold text-primary-900 mb-3 group-hover:text-accent-700 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-primary-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-primary-500 pt-4 border-t border-primary-100">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

