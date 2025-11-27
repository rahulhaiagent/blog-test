import Link from 'next/link';
import Image from 'next/image';
import { Author } from '@/lib/types';

interface AuthorBioProps {
  author: Author;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="mt-16 mb-12 bg-primary-50 border border-primary-200 rounded-lg p-8">
      <div className="flex items-start gap-6">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-2xl">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-primary-900 mb-1">{author.name}</h3>
          {author.title && <p className="text-accent-600 font-medium mb-4">{author.title}</p>}
          {author.bio && <p className="text-primary-700 leading-relaxed mb-4">{author.bio}</p>}
          
          {/* Social Links */}
          {(author.linkedin || author.twitter || author.github || author.website) && (
            <div className="flex items-center gap-3 mb-6">
              {author.linkedin && (
                <a
                  href={`https://linkedin.com/in/${author.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-primary-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-primary-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
              )}
              {author.github && (
                <a
                  href={`https://github.com/${author.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-primary-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-primary-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-colors"
                  aria-label="Website"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* All Articles Link */}
          <Link
            href={`/authors/${author.slug}`}
            className="inline-flex items-center gap-2 mt-2 text-primary-900 font-semibold hover:text-accent-600 transition-colors group"
          >
            <span>All Articles by {author.name}</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

