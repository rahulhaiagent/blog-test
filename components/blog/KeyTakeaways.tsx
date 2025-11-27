interface KeyTakeawaysProps {
  items: string[];
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <div className="bg-accent-50 border-l-4 border-accent-600 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="px-3 py-1 bg-accent-600 text-white text-xs font-bold rounded-md uppercase tracking-wide">
          Key Takeaways
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-primary-700">
            <span className="text-accent-600 font-bold mt-0.5">•</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

