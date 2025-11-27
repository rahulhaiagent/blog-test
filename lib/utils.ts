/**
 * Utility Functions - Simple, reusable helpers
 */

/**
 * Format date to readable string
 * Example: "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format date to ISO string for datetime attributes
 * Example: "2024-01-15"
 */
export function formatDateISO(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return dateString;
  }
}

/**
 * Truncate text to specified length
 * Example: truncateText("Long text here", 10) => "Long text..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Sanitize slug for URL
 * Example: "Hello World!" => "hello-world"
 */
export function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Combine class names (useful with Tailwind)
 * Example: cn("text-lg", condition && "font-bold")
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate excerpt from content
 * Example: generateExcerpt("Long content...", 100)
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags if any
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings from markdown or HTML content
 * Example: extractHeadings("## Heading 1\n## Heading 2")
 */
export function extractHeadings(content: string): Heading[] {
  // Check if content is HTML or Markdown
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  if (isHTML) {
    // Extract H2 and H3 headings from HTML content
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi;

    const h2Matches = Array.from(content.matchAll(h2Regex));
    const h3Matches = Array.from(content.matchAll(h3Regex));

    const headings: Heading[] = [];

    h2Matches.forEach((match) => {
      const text = match[1].replace(/<[^>]*>/g, '').trim(); // Remove any inner HTML tags
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 2 });
    });

    h3Matches.forEach((match) => {
      const text = match[1].replace(/<[^>]*>/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 3 });
    });

    return headings;
  } else {
    // Extract H2 headings from markdown content
    const h2Regex = /^##\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(h2Regex));

    return matches.map((match) => {
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return { id, text, level: 2 };
    });
  }
}

