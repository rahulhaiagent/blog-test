export default function CTABox() {
  return (
    <div className="bg-white border border-primary-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-primary-900 mb-3">Ready to get started?</h3>
      <p className="text-sm text-primary-600 mb-4 leading-relaxed">
        Subscribe to our newsletter for the latest updates and insights.
      </p>
      <button className="w-full bg-accent-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-accent-700 transition-colors">
        Subscribe Now
      </button>
    </div>
  );
}

