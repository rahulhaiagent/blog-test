'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ImageUpload } from './ImageUpload';

interface Author {
  id: string;
  name: string;
  email: string;
  slug: string;
  avatar?: string;
  title?: string;
}

interface AuthorSelectorProps {
  selectedAuthorIds: string[];
  onChange: (authorIds: string[]) => void;
}

export function AuthorSelector({ selectedAuthorIds, onChange }: AuthorSelectorProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    console.log('📥 Fetching authors from API...');
    try {
      const response = await fetch('/api/admin/authors', {
        cache: 'no-store', // Disable caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched authors:', data.length, 'authors');
        console.log('Authors:', data.map(a => a.name).join(', '));
        setAuthors(data);
      } else {
        console.error('❌ Failed to fetch authors. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthor = (authorId: string) => {
    if (selectedAuthorIds.includes(authorId)) {
      onChange(selectedAuthorIds.filter(id => id !== authorId));
    } else {
      onChange([...selectedAuthorIds, authorId]);
    }
  };

  const handleNewAuthorCreated = async (newAuthor: Author) => {
    console.log('📝 New author created:', newAuthor.name);
    
    // Refetch all authors from database to ensure we have the latest data
    console.log('🔄 Refreshing authors list from database...');
    await fetchAuthors();
    
    // Select the newly created author
    onChange([...selectedAuthorIds, newAuthor.id]);
    
    setShowAddModal(false);
    setShowDropdown(true); // Reopen dropdown to show the new author
    console.log('✅ Authors list refreshed!');
  };

  const selectedAuthors = authors.filter(a => selectedAuthorIds.includes(a.id));

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-primary-900">
          Authors *
        </label>
        <button
          type="button"
          onClick={() => {
            console.log('🔄 Manual refresh triggered');
            fetchAuthors();
          }}
          className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1"
          title="Refresh authors list"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Selected Authors Display */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedAuthors.map(author => (
          <div
            key={author.id}
            className="flex items-center gap-2 bg-accent-100 text-accent-800 px-3 py-1.5 rounded-lg border border-accent-200"
          >
            {author.avatar ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image src={author.avatar} alt={author.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs font-semibold">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">{author.name}</span>
            <button
              type="button"
              onClick={() => toggleAuthor(author.id)}
              className="ml-1 text-accent-600 hover:text-accent-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-2 border border-primary-300 rounded-md flex items-center justify-between hover:bg-primary-50 transition-colors"
      >
        <span className="text-primary-700">
          {selectedAuthorIds.length === 0 ? 'Select authors...' : `${selectedAuthorIds.length} author(s) selected`}
        </span>
        <svg className={`w-5 h-5 text-primary-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-primary-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-primary-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
                Loading authors...
              </div>
            </div>
          ) : (
            <>
              {/* Add New Author Button */}
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(true);
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent-50 transition-colors border-b border-primary-200 text-accent-600 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>Add New Author</span>
              </button>

              {/* Existing Authors */}
              {authors.length === 0 ? (
                <div className="p-4 text-center text-primary-500">
                  <p className="text-sm">No authors found</p>
                  <p className="text-xs mt-1">Click "Add New Author" to create one</p>
                </div>
              ) : (
                authors.sort((a, b) => a.name.localeCompare(b.name)).map(author => (
                <button
                  key={author.id}
                  type="button"
                  onClick={() => toggleAuthor(author.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAuthorIds.includes(author.id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-accent-600 border-primary-300 rounded focus:ring-accent-500"
                  />
                  {author.avatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-semibold">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-primary-900">{author.name}</div>
                    {author.title && <div className="text-xs text-primary-500">{author.title}</div>}
                  </div>
                </button>
              ))
              )}
            </>
          )}
        </div>
      )}

      {/* Add Author Modal */}
      {showAddModal && (
        <AddAuthorModal
          onClose={() => setShowAddModal(false)}
          onAuthorCreated={handleNewAuthorCreated}
        />
      )}
    </div>
  );
}

interface AddAuthorModalProps {
  onClose: () => void;
  onAuthorCreated: (author: Author) => void;
}

function AddAuthorModal({ onClose, onAuthorCreated }: AddAuthorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    avatar: '',
    twitter: '',
    linkedin: '',
    github: '',
    website: '',
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Form submitted! Creating author...');
    console.log('📝 Form data:', formData);
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('📤 Sending POST request to /api/admin/authors');
      const response = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        console.log('✅ Author created successfully:', data);
        setSuccess(true);
        // Show success message briefly, then close
        setTimeout(() => {
          onAuthorCreated(data);
        }, 1000);
      } else {
        console.error('❌ Failed to create author:', data.error);
        setError(data.error || 'Failed to create author');
      }
    } catch (error) {
      setError('Failed to create author. Please try again.');
      console.error('❌ Error creating author:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-900">Add New Author</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-primary-500 hover:text-primary-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Author created successfully! Adding to list...</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="john@example.com"
            />
          </div>

          {/* Title/Role */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Title/Role
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="Senior Software Engineer"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="Brief description about the author..."
            />
          </div>

          {/* Avatar Upload */}
          <ImageUpload
            value={formData.avatar}
            onChange={(base64) => setFormData({ ...formData, avatar: base64 })}
            label="Profile Image"
            aspectRatio="square"
          />

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Twitter Username
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                LinkedIn Username
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="john-doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                GitHub Username
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="https://johndoe.com"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-accent-600 hover:bg-accent-700 disabled:bg-primary-300 text-white font-medium py-2.5 px-6 rounded-md transition-colors"
            >
              {success ? '✓ Created!' : loading ? 'Creating...' : 'Create Author'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-primary-300 text-primary-700 font-medium rounded-md hover:bg-primary-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

