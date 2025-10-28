import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
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
            <span>{calculateReadingTime(post.content)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

