'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Insert the image URL into the markdown
        insertMarkdown(`![${file.name}](${data.url})`, '');
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const formatButtons = [
    { label: 'H1', action: () => insertMarkdown('# ', ''), icon: 'H1' },
    { label: 'H2', action: () => insertMarkdown('## ', ''), icon: 'H2' },
    { label: 'H3', action: () => insertMarkdown('### ', ''), icon: 'H3' },
    { label: 'Bold', action: () => insertMarkdown('**', '**'), icon: 'B' },
    { label: 'Italic', action: () => insertMarkdown('*', '*'), icon: 'I' },
    { label: 'Link', action: () => insertMarkdown('[', '](url)'), icon: '🔗' },
    { label: 'Code', action: () => insertMarkdown('`', '`'), icon: '</>' },
    { label: 'Quote', action: () => insertMarkdown('> ', ''), icon: '❝' },
    { label: 'List', action: () => insertMarkdown('- ', ''), icon: '•' },
    { label: 'Numbered', action: () => insertMarkdown('1. ', ''), icon: '1.' },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white border border-primary-300 rounded-t-md p-2 flex flex-wrap items-center gap-2">
        {/* Formatting Buttons */}
        {formatButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className="px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 border border-primary-300 rounded transition-colors"
            title={btn.label}
          >
            {btn.icon}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-primary-300"></div>

        {/* Image Upload */}
        <label className="px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 border border-primary-300 rounded transition-colors cursor-pointer">
          {uploading ? '⏳' : '📷'} Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Preview Toggle */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              !showPreview
                ? 'bg-accent-600 text-white'
                : 'text-primary-700 hover:bg-primary-100 border border-primary-300'
            }`}
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              showPreview
                ? 'bg-accent-600 text-white'
                : 'text-primary-700 hover:bg-primary-100 border border-primary-300'
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {!showPreview ? (
          <textarea
            id="content"
            name="content"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 border border-primary-300 rounded-b-md focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-mono text-sm resize-y"
            placeholder="Write your content in Markdown format..."
          />
        ) : (
          <div className="w-full min-h-[500px] px-4 py-3 border border-primary-300 rounded-b-md bg-primary-50">
            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-primary-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-primary-900 prose-strong:font-semibold prose-img:rounded-lg prose-img:my-6 prose-code:text-accent-600 prose-code:bg-primary-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']">
              {value ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-primary-500 italic">Preview will appear here...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-primary-500 space-y-1">
        <p>💡 <strong>Quick Tips:</strong></p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Use the toolbar buttons to format your text</li>
          <li>Click "Preview" to see how your content will look</li>
          <li>Upload images directly or paste image URLs</li>
          <li>Supports full Markdown syntax including tables and code blocks</li>
        </ul>
      </div>
    </div>
  );
}

