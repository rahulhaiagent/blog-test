# 📸 Image Upload System

## Overview

The blog now supports **direct image uploads** instead of requiring external image URLs. Images are converted to base64 format and stored directly in the SQLite database.

## Features

### ✨ For Authors
- **Drag & drop** or click to upload
- **Real-time preview** of uploaded images
- **File validation**: 
  - Accepted formats: JPG, PNG, GIF, WebP
  - Maximum size: 5MB
- **Change or remove** images anytime
- Images are stored securely in the database

### ✨ For Blog Posts
- Upload **featured images** with landscape aspect ratio
- Stored as base64 in the database
- No external hosting needed
- Instant preview before publishing

## How It Works

### Technical Details

1. **File Selection**: User selects an image file through the browser
2. **Validation**: 
   - File type check (must be an image)
   - Size check (max 5MB)
3. **Conversion**: Image is converted to base64 using FileReader API
4. **Preview**: Base64 string is displayed as a preview
5. **Storage**: Base64 string is saved to SQLite database
6. **Display**: Images are rendered using Next.js Image component with base64 src

### Database Storage

Images are stored in the following fields:
- **Authors**: `avatar` field (TEXT type)
- **Posts**: `featuredImage` field (TEXT type)

SQLite's TEXT type can store up to 2GB, which is more than enough for base64-encoded images.

## Usage

### In Admin Panel - Add New Author

1. Click on the **Authors** dropdown
2. Click **"Add New Author"**
3. In the modal, find the **"Profile Image"** section
4. Click the upload area or drag an image
5. Preview appears instantly
6. Click **"Create Author"** to save

### In Admin Panel - Create Blog Post

1. Go to `/admin`
2. Fill in post details
3. Find the **"Featured Image"** section
4. Click the upload area or drag an image
5. Preview appears instantly
6. Publish your post!

## Component API

### ImageUpload Component

```tsx
<ImageUpload
  value={string}              // Current base64 value
  onChange={(base64) => {}}   // Callback when image changes
  label="Upload Image"        // Label text
  aspectRatio="square"        // "square" | "landscape" | "portrait"
/>
```

### Aspect Ratios

- **square**: 1:1 ratio (perfect for avatars)
- **landscape**: 16:9 ratio (perfect for blog featured images)
- **portrait**: 3:4 ratio (perfect for vertical images)

## Benefits

✅ **No external hosting needed** - Everything is self-contained
✅ **No broken image links** - Images are always available
✅ **Instant upload** - No server-side processing delay
✅ **Easy backups** - Images are backed up with database
✅ **Better security** - No exposure to external CDN issues
✅ **Great UX** - Drag & drop, instant preview

## Limitations

⚠️ **File size limit**: 5MB per image (configurable)
⚠️ **Database size**: Large numbers of high-res images will increase DB size
⚠️ **Performance**: Very large databases may need optimization

## Best Practices

1. **Optimize images** before upload (compress, resize)
2. **Use appropriate formats**: 
   - JPG for photos
   - PNG for graphics with transparency
   - WebP for best compression
3. **Keep under 1-2MB** for optimal performance
4. **Use landscape ratio** (16:9) for blog featured images
5. **Use square ratio** (1:1) for author avatars

## Future Enhancements

Potential improvements:
- Client-side image compression before upload
- Image cropping tool
- Multiple image upload for galleries
- Image optimization/resizing
- CDN option for high-traffic sites

---

**Created**: November 2025
**Status**: ✅ Active and Working

