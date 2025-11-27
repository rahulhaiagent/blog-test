# 🎨 Enhanced Admin Editor Guide

## ✨ New Features Added!

Your admin portal now has a **professional rich-text markdown editor** with:
- ✅ Formatting toolbar with one-click buttons
- ✅ Image upload with preview
- ✅ Live preview mode
- ✅ Split view (Edit/Preview toggle)
- ✅ All markdown formatting options

---

## 📝 Using the Editor

### Toolbar Buttons

The editor toolbar provides quick access to all formatting options:

| Button | Function | Markdown Syntax |
|--------|----------|----------------|
| **H1** | Heading 1 | `# Heading` |
| **H2** | Heading 2 | `## Heading` |
| **H3** | Heading 3 | `### Heading` |
| **B** | Bold text | `**bold**` |
| **I** | Italic text | `*italic*` |
| **🔗** | Insert link | `[text](url)` |
| **</>** | Inline code | `` `code` `` |
| **❝** | Quote block | `> quote` |
| **•** | Bullet list | `- item` |
| **1.** | Numbered list | `1. item` |
| **📷** | Upload image | Uploads and inserts |

---

## 📷 Image Upload

### How to Upload Images:

1. **Click the "📷 Image" button** in the toolbar
2. **Select an image** from your computer
3. The image will be **automatically uploaded** to `/public/uploads/`
4. The markdown code will be **inserted at your cursor position**

### Supported Formats:
- ✅ JPEG/JPG
- ✅ PNG
- ✅ GIF
- ✅ WEBP
- ✅ SVG

### Example:
After uploading, you'll see:
```markdown
![image-name.jpg](/uploads/abc123.jpg)
```

---

## 👁️ Preview Mode

### Toggle Between Edit and Preview:

- **✏️ Edit Mode**: Write and format your content
- **👁️ Preview Mode**: See exactly how it will look on your blog

### How to Use:
1. Click **"👁️ Preview"** button to see formatted content
2. Click **"✏️ Edit"** to go back to editing
3. Toggle as many times as needed

The preview shows:
- ✅ Formatted headings
- ✅ Styled lists and quotes
- ✅ Working links
- ✅ Rendered images
- ✅ Code blocks with syntax
- ✅ All typography as it will appear on the blog

---

## 🎯 Quick Formatting Examples

### Headings
```markdown
# Main Heading
## Section Heading
### Subsection Heading
```

### Text Formatting
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
***Bold and italic*** for both
`inline code` for code snippets
```

### Links
```markdown
[Click here](https://example.com)
[Visit our blog](/blog)
```

### Lists

**Bullet List:**
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

**Numbered List:**
```markdown
1. First step
2. Second step
3. Third step
```

### Images
```markdown
![Alt text](/uploads/image.jpg)
![Product Screenshot](https://example.com/image.png)
```

### Quotes
```markdown
> This is a quote
> It can span multiple lines
```

### Code Blocks
````markdown
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
````

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Horizontal Rule
```markdown
---
```

---

## 📋 Complete Workflow Example

### Step 1: Start Writing
1. Go to `/admin`
2. Fill in title and excerpt
3. Start writing in the editor

### Step 2: Format Your Content
```markdown
## Introduction

Welcome to this **comprehensive guide** on Next.js!

![Hero Image](/uploads/hero.jpg)

In this article, you'll learn:
- How to set up Next.js
- Best practices
- Advanced techniques

## Getting Started

First, install Next.js:

```bash
npx create-next-app@latest
```

> **Note**: Make sure you have Node.js installed!

For more information, visit [Next.js docs](https://nextjs.org).
```

### Step 3: Upload Images
1. Click **📷 Image** button
2. Select your image
3. Wait for upload (button shows ⏳)
4. Image URL is automatically inserted

### Step 4: Preview
1. Click **👁️ Preview** to see formatted content
2. Check images, links, formatting
3. Toggle back to **✏️ Edit** if needed

### Step 5: Publish
1. Select category and tags
2. Choose status (Published/Draft)
3. Click "Create Blog Post"
4. Redirected to your published post!

---

## 💡 Pro Tips

### 1. **Use Keyboard Shortcuts**
- Select text and click formatting buttons to wrap selection
- Click without selection to insert at cursor position

### 2. **Image Best Practices**
- Use descriptive alt text: `![User dashboard screenshot](/uploads/dashboard.jpg)`
- Optimize images before uploading (recommended: 1200px wide)
- Use meaningful filenames

### 3. **Preview Often**
- Check preview regularly while writing
- Ensures formatting looks correct
- Catches markdown syntax errors early

### 4. **Structure Your Content**
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- H1 is reserved for the post title

### 5. **Make It Readable**
- Break up long paragraphs
- Use lists for easy scanning
- Add images to illustrate points
- Use quotes for important callouts

---

## 🎨 Advanced Formatting

### Code Blocks with Syntax Highlighting
````markdown
```javascript
// JavaScript code
const add = (a, b) => a + b;
```

```python
# Python code
def add(a, b):
    return a + b
```

```css
/* CSS code */
.button {
  background: blue;
  color: white;
}
```
````

### Task Lists
```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

### Nested Lists
```markdown
1. Main item
   - Sub-item A
   - Sub-item B
     - Nested deeper
2. Next main item
   1. Numbered sub-item
   2. Another numbered sub-item
```

### Combining Elements
```markdown
## Tutorial

> **Prerequisites**: Basic HTML, CSS, JavaScript

Follow these steps:

1. **Setup your project**
   ```bash
   npm install
   ```

2. **Create your first component**
   ```jsx
   const MyComponent = () => {
     return <div>Hello!</div>;
   };
   ```

3. **Preview your work**
   - Run `npm run dev`
   - Open browser to `localhost:3000`

![Preview](uploads/preview.jpg)

For questions, visit [our docs](/docs).
```

---

## 🔧 Troubleshooting

### Image Not Uploading?
- Check file size (keep under 5MB)
- Ensure it's a valid image format
- Check browser console for errors

### Preview Not Showing Images?
- Make sure image was uploaded successfully
- Check the URL in the markdown
- Verify `/public/uploads/` directory exists

### Formatting Not Working?
- Check markdown syntax
- Toggle to preview to see rendering
- Ensure proper spacing around syntax

### Editor Slow?
- Clear browser cache
- Reduce image file sizes
- Write in shorter sessions

---

## 📚 Markdown Quick Reference

### Text
- `**bold**` → **bold**
- `*italic*` → *italic*
- `~~strikethrough~~` → ~~strikethrough~~
- `` `code` `` → `code`

### Headings
- `# H1` → Large heading
- `## H2` → Medium heading  
- `### H3` → Small heading

### Links & Images
- `[text](url)` → Clickable link
- `![alt](url)` → Embedded image

### Lists
- `- item` → Bullet point
- `1. item` → Numbered item

### Blocks
- `> quote` → Quote block
- ` ```code``` ` → Code block
- `---` → Horizontal line

---

## 🎉 You're All Set!

Your enhanced admin portal is ready to create beautiful, well-formatted blog posts with ease!

**Happy Writing! 📝**


