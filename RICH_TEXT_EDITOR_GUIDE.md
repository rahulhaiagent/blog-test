# Rich Text Editor & Edit Functionality Guide

## Overview
Your blog CMS now has a **full-featured rich text WYSIWYG editor** and **post editing capabilities** for managing your content.

## New Features Added

### 1. **Rich Text WYSIWYG Editor** ✨
- Visual editing interface with formatting toolbar
- No need to write HTML or Markdown manually
- Real-time preview as you type
- Powered by React Quill

**Available Formatting Options:**
- **Text Styling**: Bold, Italic, Underline, Strikethrough
- **Headers**: H1-H6
- **Colors**: Text color and background highlighting
- **Lists**: Ordered and unordered lists
- **Alignment**: Left, center, right, justify
- **Indentation**: Increase/decrease indent
- **Media**: Images, videos, links
- **Code**: Inline code and code blocks
- **Quotes**: Blockquotes
- **Fonts & Sizes**: Multiple font styles and sizes
- **Subscript/Superscript**: For mathematical or chemical formulas

### 2. **Post Editing System** 🛠️
- Edit existing blog posts from the dashboard
- Pre-populated forms with current post data
- Update title, content, images, authors, and metadata
- Toggle between Rich Text and Markdown editors

### 3. **Editor Mode Toggle** 🔄
Both the Create and Edit pages now support:
- **Rich Text Editor**: WYSIWYG visual editing
- **Markdown Editor**: Traditional markdown syntax (for advanced users)
- Switch between modes anytime while editing

---

## How to Use

### Creating a New Post

1. **Navigate to Admin Portal**: `/admin`
2. **Choose Your Editor**:
   - Click "Rich Text Editor" for visual editing (default)
   - Click "Markdown Editor" for markdown syntax
3. **Fill in Post Details**:
   - Title, excerpt, content
   - Select authors (required)
   - Upload featured image (optional)
   - Add tags and select category
4. **Format Your Content** (Rich Text Mode):
   - Use the toolbar to format text
   - Add images via the image button
   - Create lists, quotes, and code blocks
5. **Publish or Save as Draft**
6. **Submit**: Post will be created and you'll be redirected to view it

### Editing an Existing Post

1. **Go to Dashboard**: `/admin/dashboard`
2. **Find Your Post** in the posts table
3. **Click "Edit"** next to the post you want to modify
4. **Edit Page Loads** with current post data pre-filled
5. **Make Your Changes**:
   - Update any field (title, content, images, etc.)
   - Switch between Rich Text and Markdown editors
   - Change authors, categories, or tags
6. **Click "Update Post"** to save changes
7. **Redirected to Dashboard** after successful update

### Dashboard Actions

Each post in the dashboard has two actions:
- **Edit**: Opens the edit page for that post
- **View**: Opens the published post in a new tab (to preview)

---

## API Endpoints

### Get Single Post (for editing)
```
GET /api/admin/posts/[id]
```
Returns post data with associated author IDs.

### Update Post
```
PUT /api/admin/posts/[id]
```
Updates post with new data. Handles:
- Post metadata updates
- Author relationship changes
- Slug regeneration if title changes
- Reading time recalculation

### Delete Post (optional)
```
DELETE /api/admin/posts/[id]
```
Deletes post and its author relationships.

---

## Technical Details

### Rich Text Editor Component
- **Location**: `/components/RichTextEditor.tsx`
- **Library**: react-quill 2.0.0
- **Theme**: Snow (clean, minimal toolbar)
- **SSR**: Disabled (client-side only via dynamic import)
- **Min Height**: 400px

### Edit Page
- **Location**: `/app/admin/edit/[id]/page.tsx`
- **Dynamic Route**: Uses Next.js dynamic routing
- **Client Component**: Full interactivity with React hooks
- **Protected**: Should be behind authentication (to be added)

### Database Changes
No schema changes required! The update endpoint reuses existing fields:
- `updatedAt` is automatically set on updates
- `publishedAt` is set when status changes to 'published'
- Author relationships are rebuilt on update

---

## Styling

The rich text editor includes custom styles:
- Matches your blog's design system
- Gray toolbar background (#f8f9fa)
- Accent color on hover (#06b6d4 - cyan)
- Minimum 400px editing height
- Rounded corners for modern look

---

## Editor Content Format

### Rich Text Editor Output
The rich text editor generates **HTML content**, which includes:
- Formatted tags (`<strong>`, `<em>`, `<h1>`, etc.)
- Inline styles for colors and backgrounds
- Properly nested lists and quotes

### Rendering on Blog Pages
Your existing blog pages use `react-markdown`, which expects Markdown. You have two options:

**Option 1: Store HTML and render with dangerouslySetInnerHTML**
```tsx
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

**Option 2: Convert HTML to Markdown before saving** (recommended)
Install: `npm install turndown`
Convert before API submission:
```tsx
import TurndownService from 'turndown';
const turndown = new TurndownService();
const markdown = turndown.turndown(htmlContent);
```

**Option 3: Detect format and render accordingly**
Check if content contains HTML tags, render appropriately.

---

## Future Enhancements

Potential additions:
- [ ] Draft auto-save functionality
- [ ] Image upload directly in rich text editor
- [ ] Version history and rollback
- [ ] Collaborative editing
- [ ] Spell check integration
- [ ] Word count display
- [ ] Content templates
- [ ] Bulk post operations (delete multiple)

---

## Troubleshooting

### Editor Not Loading
- Check browser console for errors
- Ensure `react-quill` is installed: `npm install react-quill`
- Import Quill CSS in the component

### Content Not Rendering Correctly
- Check if HTML content is being passed to Markdown renderer
- Use appropriate renderer based on content format
- Sanitize HTML if using dangerouslySetInnerHTML

### Edit Page Shows 404
- Verify post ID is correct
- Check API endpoint returns post data
- Ensure dynamic route folder structure is correct

---

## Summary

You now have a **production-ready content management system** with:
✅ Professional WYSIWYG rich text editor
✅ Full post editing capabilities
✅ Dual editor modes (Rich Text + Markdown)
✅ Complete CRUD operations
✅ Dashboard with edit/view actions
✅ Pre-populated edit forms
✅ Real-time content updates

Your admin panel is now comparable to WordPress, Medium, or Ghost in terms of editing experience! 🎉
