import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-primary-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-primary-700 mb-4">
        Blog Post Not Found
      </h2>
      <p className="text-primary-600 mb-8">
        Sorry, we couldn't find the blog post you're looking for.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-accent-600 hover:bg-accent-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  );
}

