import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug, getAllPosts, getAuthorsForPost } from '@/lib/api';
import { formatDate, extractHeadings } from '@/lib/utils';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import TableOfContents from '@/components/TableOfContents';
import ContentRenderer from '@/components/ContentRenderer';
import { KeyTakeaways } from '@/components/blog/KeyTakeaways';
import { FAQSection } from '@/components/blog/FAQSection';
import { RelatedReading } from '@/components/blog/RelatedReading';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { MostPopularNews } from '@/components/blog/MostPopularNews';
import { RelatedFeatures } from '@/components/blog/RelatedFeatures';
import { PopularCategories } from '@/components/blog/PopularCategories';
import { NewsletterSubscribe } from '@/components/blog/NewsletterSubscribe';
import { AuthorHoverCard } from '@/components/AuthorHoverCard';

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
  const allPosts = await getAllPosts();

  // Show 404 if post not found
  if (!post) {
    notFound();
  }

  // Get authors for this post
  const postAuthors = await getAuthorsForPost(post.id);

  // Extract headings for table of contents
  const headings = extractHeadings(post.content);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Get related posts from the same category
  const postCategories = post.categories || [];
  const relatedPosts = allPosts
    .filter(p => {
      // Exclude current post
      if (p.id === post.id) return false;
      
      // Check if post has any category in common with current post
      if (postCategories.length > 0 && p.categories) {
        return p.categories.some(cat => postCategories.includes(cat));
      }
      
      // If current post has no categories, include all other posts
      return true;
    })
    .slice(0, 5);
  
  // Mock data for demonstration (you can make these dynamic later)
  const keyTakeaways = [
    "AES is what most systems use to keep data safe and fast.",
    "RSA and X25519 handle key exchange and signatures, but they won't hold up forever.",
    "New post-quantum algorithms like Kyber and Dilithium are already stepping in to replace them.",
    "Encryption usually fails because someone set it up wrong, not because the math broke.",
    "Use solid libraries, rotate your keys, and keep things flexible for whatever comes next.",
  ];
  
  const faqs = [
    {
      question: "What's the difference between symmetric and asymmetric encryption in practice?",
      answer: "Symmetric encryption uses the same key for both encryption and decryption, making it fast and efficient for large amounts of data. Asymmetric encryption uses a public-private key pair, which is slower but essential for secure key exchange and digital signatures."
    },
    {
      question: "Why are quantum computers a threat to RSA and ECC encryption?",
      answer: "Quantum computers can run Shor's algorithm, which can efficiently factor large numbers and solve discrete logarithm problems - the mathematical foundations that make RSA and ECC secure. This makes current public-key cryptography vulnerable to quantum attacks."
    },
  ];
  
  const mostPopular = allPosts.slice(0, 10).map(p => ({ title: p.title, slug: p.slug }));
  
  const popularCategories = [
    { name: "AI", slug: "ai", icon: "🤖" },
    { name: "Security", slug: "security", icon: "🔒" },
    { name: "Cloud", slug: "cloud", icon: "☁️" },
    { name: "Data", slug: "data", icon: "📊" },
    { name: "Mobile", slug: "mobile", icon: "📱" },
    { name: "Web", slug: "web", icon: "🌐" },
    { name: "DevOps", slug: "devops", icon: "⚙️" },
    { name: "IoT", slug: "iot", icon: "🔌" },
  ];

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

      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Blog', href: '/blog' },
          ...(post.categories && post.categories.length > 0 
            ? [{ label: post.categories[0], href: `/categories/${post.categories[0].toLowerCase()}` }]
            : [{ label: 'Technology', href: '/categories/technology' }]
          )
        ]}
        currentPage={post.title}
      />

      <div className="bg-white">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-8 max-w-[1400px]">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

                    {/* Meta Info Bar */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      {/* Authors - Show first 2 in header */}
                      {postAuthors.length > 0 ? (
                        <>
                          {postAuthors.slice(0, 2).map((author, index) => (
                            <div key={author.id} className="flex items-center gap-3">
                              <Link href={`/authors/${author.slug}`} className="hover:opacity-80 transition-opacity">
                                {author.avatar ? (
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                      src={author.avatar}
                                      alt={author.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {author.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </Link>
                              <div>
                                <div className="text-gray-600 text-xs">{index === 0 ? 'By' : 'With'} {author.title || 'IT & Technology Expert'}</div>
                                <AuthorHoverCard author={author}>
                                  <div className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                                    {author.name}
                                  </div>
                                </AuthorHoverCard>
                              </div>
                              {index < 1 && <div className="h-8 w-px bg-gray-200 ml-3"></div>}
                            </div>
                          ))}
                          {postAuthors.length > 2 && (
                            <div className="text-gray-600 text-xs">
                              + {postAuthors.length - 2} more {postAuthors.length - 2 === 1 ? 'author' : 'authors'}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-gray-600 text-xs">By IT & Technology Expert</div>
                            <div className="font-semibold text-gray-900">{post.author}</div>
                          </div>
                        </div>
                      )}
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div>
                        <div className="text-gray-600 text-xs">Updated</div>
                        <div className="font-semibold text-gray-900">{formatDate(post.updatedAt || post.publishedAt)}</div>
                      </div>
                    </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 py-8 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                    sizes="(max-width: 1200px) 100vw, 900px"
                  />
                </div>
              )}

              {/* Content */}
              <ContentRenderer
                content={post.content}
                className="prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-h1:hidden prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-primary-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-primary-900 prose-strong:font-semibold prose-ul:my-6 prose-li:my-2 prose-code:text-accent-600 prose-code:bg-primary-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-primary-900 prose-pre:text-primary-100"
              />

              {/* Key Takeaways */}
              <KeyTakeaways items={keyTakeaways} />

              {/* FAQs */}
              <FAQSection faqs={faqs} />

              {/* Related Reading */}
              {/* <RelatedReading articles={relatedPosts.slice(0, 4).map(p => ({ title: p.title, slug: p.slug }))} /> */}

                      {/* Author Bio */}
                      {postAuthors.length > 0 ? (
                        postAuthors.map((author) => (
                          <AuthorBio 
                            key={author.id}
                            author={author}
                          />
                        ))
                      ) : (
                        <AuthorBio 
                          author={{
                            id: '0',
                            slug: 'admin',
                            name: post.author,
                            email: 'admin@example.com',
                            title: 'IT & Technology Expert',
                            bio: `${post.author} is a dedicated technology expert with extensive experience in software development, cybersecurity, and emerging technologies. Their articles provide comprehensive insights and practical guidance for technical professionals.`,
                            postCount: 0,
                          }}
                        />
                      )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-primary-200">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wide mb-4">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="px-4 py-2 border-2 border-accent-600 text-accent-600 rounded-full text-sm font-semibold hover:bg-accent-600 hover:text-white transition-colors uppercase"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <TableOfContents headings={headings} />
                
                {/* Why Trust Us Box */}
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <svg className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-primary-900 mb-2">Why Trust This Blog</h3>
                      <p className="text-sm text-primary-700 leading-relaxed">
                        We uphold a strict editorial policy. Our content, created by leading industry experts, is reviewed by a team of seasoned editors to ensure compliance with the highest standards in reporting and publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Most Popular News */}
        <MostPopularNews items={mostPopular} />

        {/* Related Features */}
        <RelatedFeatures 
          features={relatedPosts.map((p, i) => ({
            title: p.title,
            slug: p.slug,
            image: p.featuredImage,
            category: p.categories?.[0] || 'Technology',
            author: p.author,
            timeAgo: `${i + 1} week${i > 0 ? 's' : ''} ago`
          }))}
        />

        {/* Popular Categories */}
        <PopularCategories categories={popularCategories} />

        {/* Newsletter */}
        <NewsletterSubscribe />
      </div>
    </>
  );
}

