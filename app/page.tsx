import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getPostsByCategory, getFeaturedPosts, getAllPosts } from "@/lib/api";
import { BlogCard } from "@/components/BlogCard";
import { MostPopularCarousel } from "@/components/MostPopularCarousel";
import { HeroSection } from "@/components/HeroSection";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our SEO-optimized blog built with Next.js",
};

export default async function Home() {
  // Fetch categories and posts
  const categories = await getCategories();
  const allPosts = await getAllPosts();
  const featuredPosts = await getFeaturedPosts(8);

  // Get posts for each category (limit to 3 per category)
  const categoryPosts = await Promise.all(
    categories.slice(0, 4).map(async (category) => ({
      category,
      posts: await getPostsByCategory(category.id, 3),
    }))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Filtered Cards */}
      <HeroSection categories={categories} posts={allPosts} />

      {/* Most Popular Section */}
      {featuredPosts.length > 0 && (
        <div className="bg-primary-50/30 py-4">
          <MostPopularCarousel posts={featuredPosts} />
        </div>
      )}

      {/* Category Sections */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {categoryPosts.map(({ category, posts }) => {
          if (posts.length === 0) return null;

          return (
            <section key={category.id} className="mb-20 last:mb-0">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-primary-900 tracking-tight mb-2">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-primary-600 text-sm">
                      {category.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/blog?category=${category.slug}`}
                  className="text-accent-600 hover:text-accent-700 font-semibold text-base flex items-center gap-2 group"
                >
                  See all
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-900 via-accent-900 to-accent-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Stay Updated
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to get the latest articles and insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3.5 rounded-xl text-primary-900 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-lg"
            />
            <button className="bg-white text-accent-700 font-bold px-8 py-3.5 rounded-xl hover:bg-accent-50 transition-all hover:shadow-xl whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

