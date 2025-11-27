'use client';

import { Post } from '@/lib/types';
import { BlogCard } from './BlogCard';
import { useState } from 'react';

interface MostPopularCarouselProps {
  posts: Post[];
}

export function MostPopularCarousel({ posts }: MostPopularCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const postsPerView = 4; // Show 4 cards at a time on desktop

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(posts.length - postsPerView, prev + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < posts.length - postsPerView;

  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-primary-50 border-t border-primary-100">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-primary-900 tracking-tight">
            Most Popular
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                canGoPrevious
                  ? 'border-primary-300 hover:border-accent-600 hover:bg-accent-50 text-primary-700 hover:text-accent-700'
                  : 'border-primary-200 text-primary-300 cursor-not-allowed'
              }`}
              aria-label="Previous posts"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                canGoNext
                  ? 'border-primary-300 hover:border-accent-600 hover:bg-accent-50 text-primary-700 hover:text-accent-700'
                  : 'border-primary-200 text-primary-300 cursor-not-allowed'
              }`}
              aria-label="Next posts"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / postsPerView)}%)`,
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
                style={{ minWidth: '0' }}
              >
                <BlogCard post={post} variant="featured" showAuthor />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

