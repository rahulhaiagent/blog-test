import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllAuthors } from '@/lib/api';

// Enable ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet our team of expert writers and contributors',
};

export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-50 to-primary-50 border-b border-primary-200 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Our Authors
          </h1>
          <p className="text-xl text-primary-700 max-w-3xl">
            Meet our team of expert writers and contributors who bring you the latest insights, tutorials, and stories from the tech world.
          </p>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.slug}`}
                className="group"
              >
                <div className="bg-white border border-primary-200 rounded-xl p-6 hover:shadow-xl hover:border-accent-300 transition-all duration-300 h-full flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative w-24 h-24 mb-4">
                    {author.avatar ? (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover rounded-full border-4 border-accent-100 group-hover:border-accent-300 transition-colors"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-accent-100 group-hover:border-accent-300 transition-colors">
                        {author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name & Title */}
                  <h2 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                    {author.name}
                  </h2>
                  {author.title && (
                    <p className="text-sm text-accent-600 font-medium mb-3">
                      {author.title}
                    </p>
                  )}

                  {/* Bio */}
                  {author.bio && (
                    <p className="text-sm text-primary-700 leading-relaxed mb-4 line-clamp-3 flex-1">
                      {author.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mt-auto pt-4 border-t border-primary-100 w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-primary-900 font-semibold">{author.postCount}</span>
                    <span className="text-primary-600 text-sm">
                      {author.postCount === 1 ? 'Article' : 'Articles'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-primary-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-primary-600">No authors found</p>
          </div>
        )}
      </div>
    </div>
  );
}

