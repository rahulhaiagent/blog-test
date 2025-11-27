'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SessionProvider } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: string;
  publishedAt: Date | null;
  views: number;
  createdAt: Date;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Error loading posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not published';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SessionProvider>
        <AdminHeader />
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <p className="text-primary-600">Loading posts...</p>
          </div>
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AdminHeader />
      <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-900 mb-2">Dashboard</h1>
          <p className="text-primary-600">Manage your blog posts</p>
        </div>
        <Link
          href="/admin"
          className="bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          + New Post
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-primary-200 rounded-lg p-6">
          <div className="text-sm text-primary-600 mb-1">Total Posts</div>
          <div className="text-3xl font-semibold text-primary-900">{posts.length}</div>
        </div>
        <div className="bg-white border border-primary-200 rounded-lg p-6">
          <div className="text-sm text-primary-600 mb-1">Published</div>
          <div className="text-3xl font-semibold text-green-600">
            {posts.filter(p => p.status === 'published').length}
          </div>
        </div>
        <div className="bg-white border border-primary-200 rounded-lg p-6">
          <div className="text-sm text-primary-600 mb-1">Drafts</div>
          <div className="text-3xl font-semibold text-yellow-600">
            {posts.filter(p => p.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white border border-primary-200 rounded-lg p-6">
          <div className="text-sm text-primary-600 mb-1">Total Views</div>
          <div className="text-3xl font-semibold text-accent-600">
            {posts.reduce((sum, p) => sum + p.views, 0)}
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-primary-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Author</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Published</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Views</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-primary-600">
                    No posts found. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-900">{post.title}</div>
                      <div className="text-sm text-primary-500">/blog/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-700">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-700">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-700">{post.views}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="text-accent-600 hover:text-accent-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <span className="text-primary-300">|</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </SessionProvider>
  );
}

