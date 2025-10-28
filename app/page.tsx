import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our SEO-optimized blog built with Next.js",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6">
          Welcome to Blog CMS
        </h1>
        <p className="text-xl text-primary-600 mb-8 leading-relaxed">
          A high-performance, SEO-optimized blog built with Next.js 14, featuring 
          Incremental Static Regeneration for lightning-fast page loads and perfect 
          Google indexing.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-accent-600 hover:bg-accent-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Read Our Blog
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg border border-primary-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-accent-600 text-3xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-3">
            Lightning Fast
          </h2>
          <p className="text-primary-600">
            ISR pre-renders pages at build time for instant loading. 
            Optimized images and code splitting ensure maximum performance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-primary-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-accent-600 text-3xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-3">
            SEO Optimized
          </h2>
          <p className="text-primary-600">
            Complete meta tags, structured data, dynamic sitemap, and 
            server-side rendering ensure perfect Google indexing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-primary-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-accent-600 text-3xl mb-4">🔄</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-3">
            Auto-Updates
          </h2>
          <p className="text-primary-600">
            Content updates automatically without rebuilds. New posts 
            are indexed by Google within 24-48 hours.
          </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="mt-16 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary-900 mb-6">
          Built With Modern Technology
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "ISR"].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

