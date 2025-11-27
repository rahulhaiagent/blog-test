import Link from 'next/link';

interface Term {
  name: string;
  slug: string;
}

interface RelatedTermsProps {
  terms: Term[];
}

export function RelatedTerms({ terms }: RelatedTermsProps) {
  if (terms.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-primary-900 mb-6 border-b-4 border-accent-600 inline-block pb-2">
        Related Terms
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {terms.map((term, index) => (
          <Link
            key={index}
            href={`/blog/${term.slug}`}
            className="text-accent-600 hover:text-accent-700 font-medium hover:underline transition-colors"
          >
            {term.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

