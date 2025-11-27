'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your blog content here...'
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .quill {
          background: white;
          border-radius: 8px;
        }

        .rich-text-editor .ql-container {
          font-size: 16px;
          min-height: 400px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .rich-text-editor .ql-editor {
          min-height: 400px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
        }

        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8f9fa;
          border-color: #e0e0e0;
        }

        .rich-text-editor .ql-container {
          border-color: #e0e0e0;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
        }

        /* Custom styles for better UX */
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: #444;
        }

        .rich-text-editor .ql-snow .ql-fill {
          fill: #444;
        }

        .rich-text-editor .ql-snow .ql-picker-label {
          color: #444;
        }

        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus {
          color: #06b6d4;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke {
          stroke: #06b6d4;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill {
          fill: #06b6d4;
        }
      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
