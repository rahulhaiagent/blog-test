import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug } from '@/lib/api';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';
import ShareArticle from '@/components/ShareArticle';
import CTABox from '@/components/CTABox';
import BackgroundGraphics from '@/components/BackgroundGraphics';

// Enable ISR: Revalidate every hour
export const revalidate = 3600;

// Generate static params for all posts at build time
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'Blog CMS',
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  // Show 404 if post not found
  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Structured data for Google (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog CMS',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Background Graphics */}
      <BackgroundGraphics />

      <div className="container mx-auto px-4 py-12 max-w-7xl relative">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-primary-600">
          <Link href="/" className="hover:text-accent-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-accent-700">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-primary-900">{post.title}</span>
        </nav>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Header */}
            <header className="mb-8">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 bg-accent-100 text-accent-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-primary-600">
                <div className="flex items-center gap-2">
                  <span>By</span>
                  <span className="font-medium text-primary-900">{post.author}</span>
                </div>
                <span>•</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>•</span>
                <span>{calculateReadingTime(post.content)}</span>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden bg-primary-100">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-neutral max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children, ...props }) => {
                    const text = children?.toString() || '';
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    return <h2 id={id} {...props}>{children}</h2>;
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-primary-200">
              <Link
                href="/blog"
                className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium transition-colors"
              >
                ← Back to Blog
              </Link>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              <TableOfContents content={post.content} />
              <ShareArticle title={post.title} slug={post.slug} />
              <CTABox />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

