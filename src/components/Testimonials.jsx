export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'MediConnect saved me time and money. I got my prescription in 15 minutes without leaving home!',
      avatar: '👩‍⚕️',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Healthcare Provider',
      content: 'An excellent platform for providing remote care. My patients appreciate the convenience and reliability.',
      avatar: '👨‍💼',
    },
    {
      name: 'Emma Davis',
      role: 'Patient',
      content: 'The interface is so user-friendly. I recommended it to all my friends and family members.',
      avatar: '👩‍🔬',
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-background-light">
      <div className="section-container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Trusted by
            <span className="gradient-text"> Thousands</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from our community of patients and healthcare providers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex gap-1 mt-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-yellow">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
