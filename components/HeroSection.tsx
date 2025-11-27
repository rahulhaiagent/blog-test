'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

interface HeroSectionProps {
  categories: Category[];
  posts: Post[];
}

export function HeroSection({ categories, posts }: HeroSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter posts based on active category
  const filteredPosts = activeFilter === 'all' 
    ? posts.slice(0, 9) 
    : posts.filter(post => post.categories?.includes(activeFilter)).slice(0, 9);

  // Ensure we have at least 9 posts to display
  const displayPosts = filteredPosts.length >= 9 ? filteredPosts : [...filteredPosts, ...posts].slice(0, 9);

  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-primary-50/50 via-white to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Hero Title */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-4 tracking-tight leading-tight">
            Discover the Best in
            <span className="block bg-gradient-to-r from-accent-600 to-accent-800 bg-clip-text text-transparent">
              Tech & Development
            </span>
          </h1>
          <p className="text-lg md:text-xl text-primary-600 max-w-3xl mx-auto leading-relaxed">
            Explore curated articles, tutorials, and insights across different technology topics
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                : 'bg-white text-primary-700 hover:bg-primary-50 border border-primary-200'
            }`}
          >
            All
          </button>
          {categories.slice(0, 8).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeFilter === category.id
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                  : 'bg-white text-primary-700 hover:bg-primary-50 border border-primary-200'
              }`}
            >
              {category.icon && <span>{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>

        {/* Cards Grid - 3 columns, 3 rows = 9 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>View All Articles</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Individual Post Card Component
function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative bg-primary-50/30 rounded-2xl border border-primary-200 p-8 hover:shadow-lg hover:border-primary-300 transition-all duration-300 h-full flex flex-col">
        {/* Image Container with border and background */}
        <div className="relative w-full h-48 bg-white rounded-xl border border-primary-200 overflow-hidden mb-6">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-6xl opacity-20">📝</div>
            </div>
          )}
          
          {/* Category Badge */}
          {post.categories?.[0] && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-lg text-xs font-medium border border-accent-200">
                {post.categories[0]}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-primary-900 group-hover:text-accent-700 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
      </article>
    </Link>
  );
}


