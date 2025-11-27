'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { AuthorSelector } from '@/components/admin/AuthorSelector';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SessionProvider } from 'next-auth/react';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    tags: '',
    categoryId: 'general',
    status: 'published',
  });
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);

  // Fetch post data
  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`);
      const data = await response.json();

      if (data.success && data.post) {
        const post = data.post;
        setFormData({
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || '',
          featuredImageAlt: post.featuredImageAlt || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          categoryId: post.categoryId || 'general',
          status: post.status || 'published',
        });

        // Set author IDs
        if (data.post.authorIds && data.post.authorIds.length > 0) {
          setSelectedAuthorIds(data.post.authorIds);
        }
      } else {
        setMessage('❌ Failed to load post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setMessage('❌ Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    // Validation
    if (selectedAuthorIds.length === 0) {
      setMessage('❌ Please select at least one author');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
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

      if (data.success) {
        setMessage('✅ Post updated successfully!');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Failed to update post'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setMessage('❌ An error occurred while updating the post');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (value: string) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  if (loading) {
    return (
      <SessionProvider>
        <AdminHeader />
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="text-center">
            <p className="text-primary-600">Loading post...</p>
          </div>
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AdminHeader />
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-primary-900 mb-2">Edit Blog Post</h1>
          <p className="text-primary-600">Update your blog post content and settings</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('✅')
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primary-900 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Enter your blog post title"
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
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Brief summary of your post (shown in previews)"
            />
          </div>

          {/* Author Selection */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Authors *
            </label>
            <AuthorSelector
              selectedAuthorIds={selectedAuthorIds}
              onChange={setSelectedAuthorIds}
            />
          </div>

          {/* Editor Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Content Editor *
            </label>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setEditorMode('rich')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
              />
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={20}
                className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 font-mono text-sm"
                placeholder="Write your blog content in Markdown..."
              />
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Featured Image
            </label>
            <ImageUpload
              currentImage={formData.featuredImage}
              onImageUploaded={(url) => setFormData({ ...formData, featuredImage: url })}
            />
            {formData.featuredImage && (
              <div className="mt-4">
                <label htmlFor="featuredImageAlt" className="block text-sm font-medium text-primary-700 mb-2">
                  Image Alt Text (for SEO)
                </label>
                <input
                  type="text"
                  id="featuredImageAlt"
                  name="featuredImageAlt"
                  value={formData.featuredImageAlt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Describe the image for accessibility"
                />
              </div>
            )}
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-primary-900 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="productivity">Productivity</option>
              </select>
            </div>

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
                className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="tag1, tag2, tag3"
              />
              <p className="mt-1 text-sm text-primary-500">Separate tags with commas</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-primary-900 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent-600 hover:bg-accent-700 disabled:bg-primary-300 text-white font-medium py-4 rounded-lg transition-colors"
            >
              {saving ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-8 bg-primary-200 hover:bg-primary-300 text-primary-900 font-medium py-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </SessionProvider>
  );
}
