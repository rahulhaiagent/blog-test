export default function CTABox() {
  return (
    <div className="bg-gradient-to-br from-accent-600 to-accent-800 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-3">Ready to get started?</h3>
      <p className="text-sm text-accent-50 mb-4">
        Subscribe to our newsletter for the latest updates and insights.
      </p>
      <button className="w-full bg-white text-accent-700 font-medium py-2 px-4 rounded-lg hover:bg-accent-50 transition-colors">
        Subscribe Now
      </button>
    </div>
  );
}

