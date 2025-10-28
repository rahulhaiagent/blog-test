import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Blog CMS - SEO Optimized Blog",
    template: "%s | Blog CMS",
  },
  description: "A high-performance, SEO-optimized blog built with Next.js and React",
  keywords: ["blog", "next.js", "react", "SEO", "web development"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Blog CMS",
    title: "Blog CMS - SEO Optimized Blog",
    description: "A high-performance, SEO-optimized blog built with Next.js and React",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blog CMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog CMS - SEO Optimized Blog",
    description: "A high-performance, SEO-optimized blog built with Next.js and React",
    images: ["/og-image.jpg"],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <header className="border-b border-primary-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-primary-900 hover:text-accent-700 transition-colors">
              Blog CMS
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-primary-700 hover:text-accent-700 transition-colors">
                Home
              </a>
              <a href="/blog" className="text-primary-700 hover:text-accent-700 transition-colors">
                Blog
              </a>
            </div>
          </nav>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="border-t border-primary-200 bg-primary-50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-primary-600 text-sm">
                © {new Date().getFullYear()} Blog CMS. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="/blog" className="text-primary-600 hover:text-accent-700 text-sm transition-colors">
                  Blog
                </a>
                <a href="/sitemap.xml" className="text-primary-600 hover:text-accent-700 text-sm transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

