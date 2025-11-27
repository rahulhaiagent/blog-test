import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

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
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white font-sans">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="border-t border-gray-200 bg-gray-50 mt-16">
          <div className="container mx-auto max-w-[1400px] px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a></li>
                  <li><a href="/advertise" className="text-gray-600 hover:text-gray-900 text-sm">Advertise</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="/blog" className="text-gray-600 hover:text-gray-900 text-sm">Blog</a></li>
                  <li><a href="/categories" className="text-gray-600 hover:text-gray-900 text-sm">Categories</a></li>
                  <li><a href="/authors" className="text-gray-600 hover:text-gray-900 text-sm">Authors</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
                  <li><a href="/sitemap.xml" className="text-gray-600 hover:text-gray-900 text-sm">Sitemap</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Twitter</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Facebook</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm text-center">
                © {new Date().getFullYear()} TechBlog. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

