'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

export function ImageUpload({ value, onChange, label = 'Upload Image', aspectRatio = 'square' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [optimizationInfo, setOptimizationInfo] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new window.Image();
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate optimal dimensions
          let width = img.width;
          let height = img.height;
          
          // Set max dimensions based on aspect ratio
          let maxWidth: number;
          let maxHeight: number;
          
          if (aspectRatio === 'square') {
            maxWidth = 800;
            maxHeight = 800;
          } else if (aspectRatio === 'landscape') {
            maxWidth = 1920;
            maxHeight = 1080;
          } else {
            maxWidth = 1080;
            maxHeight = 1440;
          }

          // Maintain aspect ratio while resizing
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Enable image smoothing for HD quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with high quality (0.92 = 92% quality)
          // This provides excellent quality with ~70-80% smaller file size
          const webpDataUrl = canvas.toDataURL('image/webp', 0.92);
          
          resolve(webpDataUrl);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB for original file)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Convert to WebP with HD quality and optimized size
      const webpBase64 = await convertToWebP(file);
      
      // Calculate size reduction
      const originalSizeKB = Math.round(file.size / 1024);
      const webpSizeKB = Math.round((webpBase64.length * 3) / 4 / 1024); // Approximate base64 size
      const reduction = Math.round(((originalSizeKB - webpSizeKB) / originalSizeKB) * 100);
      
      console.log(`✅ Image optimized: ${originalSizeKB}KB → ${webpSizeKB}KB (${reduction}% reduction)`);
      
      setOptimizationInfo(`Optimized: ${originalSizeKB}KB → ${webpSizeKB}KB (${reduction}% smaller)`);
      setPreview(webpBase64);
      onChange(webpBase64);
      setUploading(false);
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      setUploading(false);
      console.error('Image conversion error:', err);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    setOptimizationInfo('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-primary-900 mb-2">
        {label}
      </label>

      <div className="space-y-3">
        {/* Preview or Upload Area */}
        {preview ? (
          <div className="relative">
            <div className={`relative w-full ${getAspectRatioClass()} rounded-lg overflow-hidden border-2 border-primary-200`}>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="mt-3 space-y-2">
              {/* Optimization Info */}
              {optimizationInfo && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{optimizationInfo}</span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex-1 px-4 py-2 bg-white border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 transition-colors text-sm font-medium"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className={`w-full ${getAspectRatioClass()} border-2 border-dashed border-primary-300 rounded-lg hover:border-accent-500 hover:bg-accent-50/30 transition-all flex flex-col items-center justify-center gap-3 ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <span className="text-sm font-medium text-primary-900">Optimizing image...</span>
                  <p className="text-xs text-primary-500 mt-1">Converting to WebP HD</p>
                </div>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-center">
                  <span className="text-sm font-medium text-primary-700">Click to upload</span>
                  <p className="text-xs text-primary-500 mt-1">Any image format up to 10MB</p>
                  <p className="text-xs text-accent-600 mt-0.5">Auto-converts to WebP HD</p>
                </div>
              </>
            )}
          </button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error Message */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        {/* Help Text */}
        <div className="flex items-start gap-2 text-xs text-primary-500">
          <svg className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Images are automatically converted to <strong className="text-accent-700">WebP HD format</strong> for optimal quality and size. 
            Stored securely in the database.
          </p>
        </div>
      </div>
    </div>
  );
}

