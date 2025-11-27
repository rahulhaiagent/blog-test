'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';
import RichTextEditor from '@/components/RichTextEditor';
import { AuthorSelector } from '@/components/admin/AuthorSelector';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SessionProvider } from 'next-auth/react';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: '',
    categoryId: 'general',
    status: 'published',
  });
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (selectedAuthorIds.length === 0) {
      setMessage('❌ Please select at least one author');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorIds: selectedAuthorIds,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Blog post created successfully!');
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          tags: '',
          categoryId: 'general',
          status: 'published',
        });
        setSelectedAuthorIds([]);
        
        // Redirect to the new post after 2 seconds
        setTimeout(() => {
          router.push(`/blog/${data.slug}`);
        }, 2000);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to create post. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <SessionProvider>
      <AdminHeader />
      <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-900 mb-2">Admin Portal</h1>
          <p className="text-primary-600">Create and manage blog posts</p>
        </div>
        <a
          href="/admin/dashboard"
          className="text-accent-600 hover:text-accent-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          View Dashboard
        </a>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-primary-200 rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-primary-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="Enter blog post title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-primary-900 mb-2">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="Brief description of the post"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Content *
          </label>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setEditorMode('rich')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                editorMode === 'rich'
                  ? 'bg-accent-600 text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              Rich Text Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('markdown')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                editorMode === 'markdown'
                  ? 'bg-accent-600 text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              Markdown Editor
            </button>
          </div>
          {editorMode === 'rich' ? (
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          ) : (
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          )}
        </div>

        {/* Authors */}
        <AuthorSelector
          selectedAuthorIds={selectedAuthorIds}
          onChange={setSelectedAuthorIds}
        />

        {/* Featured Image Upload */}
        <ImageUpload
          value={formData.featuredImage}
          onChange={(base64) => setFormData({ ...formData, featuredImage: base64 })}
          label="Featured Image"
          aspectRatio="landscape"
        />

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-primary-900 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="React, Next.js, JavaScript (comma-separated)"
          />
          <p className="mt-1 text-xs text-primary-500">Separate tags with commas</p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-primary-900 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="web-development">Web Development</option>
            <option value="tutorials">Tutorials</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-primary-900 mb-2">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-600 hover:bg-accent-700 disabled:bg-primary-300 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/blog')}
            className="px-6 py-3 border border-primary-300 text-primary-700 font-medium rounded-md hover:bg-primary-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </SessionProvider>
  );
}

