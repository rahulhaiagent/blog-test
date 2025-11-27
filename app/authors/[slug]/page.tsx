import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAuthorBySlug, getAllAuthorSlugs, getPostsByAuthor } from '@/lib/api';
import { BlogCard } from '@/components/BlogCard';

// Enable ISR: Revalidate every hour
export const revalidate = 3600;

// Generate static params for all authors at build time
export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${author.name} - Author Profile`,
    description: author.bio || `Articles by ${author.name}`,
    openGraph: {
      title: `${author.name} - Author Profile`,
      description: author.bio || `Articles by ${author.name}`,
      url: `${siteUrl}/authors/${author.slug}`,
      siteName: 'Blog CMS',
      images: author.avatar ? [
        {
          url: author.avatar,
          width: 200,
          height: 200,
          alt: author.name,
        },
      ] : [],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${author.name} - Author Profile`,
      description: author.bio || `Articles by ${author.name}`,
      images: author.avatar ? [author.avatar] : [],
    },
    alternates: {
      canonical: `${siteUrl}/authors/${author.slug}`,
    },
  };
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);

  // Show 404 if author not found
  if (!author) {
    notFound();
  }

  const authorPosts = await getPostsByAuthor(author.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Structured data for Google (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: author.avatar,
    url: `${siteUrl}/authors/${author.slug}`,
    jobTitle: author.title,
    sameAs: [
      author.twitter && `https://twitter.com/${author.twitter}`,
      author.linkedin && `https://linkedin.com/in/${author.linkedin}`,
      author.github && `https://github.com/${author.github}`,
      author.website,
    ].filter(Boolean),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-accent-50 to-primary-50 border-b border-primary-200">
          <div className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative w-40 h-40 flex-shrink-0">
                {author.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-xl">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-3">
                  {author.name}
                </h1>
                {author.title && (
                  <p className="text-xl text-accent-600 font-semibold mb-4">
                    {author.title}
                  </p>
                )}
                {author.bio && (
                  <p className="text-lg text-primary-700 leading-relaxed mb-6 max-w-2xl">
                    {author.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {author.twitter && (
                    <a
                      href={`https://twitter.com/${author.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white hover:bg-accent-50 text-primary-700 hover:text-accent-600 rounded-full transition-colors shadow-md hover:shadow-lg"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {author.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${author.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white hover:bg-accent-50 text-primary-700 hover:text-accent-600 rounded-full transition-colors shadow-md hover:shadow-lg"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {author.github && (
                    <a
                      href={`https://github.com/${author.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white hover:bg-accent-50 text-primary-700 hover:text-accent-600 rounded-full transition-colors shadow-md hover:shadow-lg"
                      aria-label="GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    </a>
                  )}
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white hover:bg-accent-50 text-primary-700 hover:text-accent-600 rounded-full transition-colors shadow-md hover:shadow-lg"
                      aria-label="Website"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 flex justify-center md:justify-start">
              <div className="bg-white rounded-xl shadow-md px-8 py-4 inline-flex items-center gap-2">
                <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-2xl font-bold text-primary-900">{author.postCount}</span>
                <span className="text-primary-600">Articles Published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <h2 className="text-3xl font-bold text-primary-900 mb-10">
            Articles by {author.name}
          </h2>

          {authorPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorPosts.map((post) => (
                <BlogCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto text-primary-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl text-primary-600">No articles published yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

