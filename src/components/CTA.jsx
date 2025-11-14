export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of patients already using MediConnect for convenient, quality healthcare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-4 bg-white text-primary-500 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          <p className="text-sm text-blue-100">
            No credit card required. Start your first consultation today.
          </p>
        </div>
      </div>
    </section>
  );
}
