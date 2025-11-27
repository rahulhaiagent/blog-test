'use client';

import { useState } from 'react';

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [options, setOptions] = useState({
    trendingNews: false,
    latestGuides: false,
    reviews: false,
    termOfTheDay: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    console.log('Subscribe:', { email, options });
  };

  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-bold text-primary-900 mb-6 text-center md:text-left">
          Get Blog's Daily Newsletter in your inbox every Weekday.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Add your email"
              className="flex-1 px-6 py-3 rounded-lg border border-primary-300 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>

          {/* Checkbox Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.trendingNews}
                onChange={(e) => setOptions({ ...options, trendingNews: e.target.checked })}
                className="w-4 h-4 text-accent-600 rounded focus:ring-accent-600"
              />
              <span className="text-sm text-primary-700">Trending News</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.latestGuides}
                onChange={(e) => setOptions({ ...options, latestGuides: e.target.checked })}
                className="w-4 h-4 text-accent-600 rounded focus:ring-accent-600"
              />
              <span className="text-sm text-primary-700">Latest Guides</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.reviews}
                onChange={(e) => setOptions({ ...options, reviews: e.target.checked })}
                className="w-4 h-4 text-accent-600 rounded focus:ring-accent-600"
              />
              <span className="text-sm text-primary-700">Reviews</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.termOfTheDay}
                onChange={(e) => setOptions({ ...options, termOfTheDay: e.target.checked })}
                className="w-4 h-4 text-accent-600 rounded focus:ring-accent-600"
              />
              <span className="text-sm text-primary-700">Term of the Day</span>
            </label>
          </div>

          <p className="text-xs text-primary-600">
            By signing up, you agree to our Terms of Use and acknowledge the data practices in our Privacy Policy. You may unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}

