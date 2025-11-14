export default function Features() {
  const features = [
    {
      icon: '🏥',
      title: 'Licensed Doctors',
      description: 'Consult with board-certified healthcare professionals available 24/7',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'End-to-end encryption ensures your medical data stays confidential',
    },
    {
      icon: '⏱️',
      title: 'Quick Appointments',
      description: 'Get connected with a doctor in minutes, not days',
    },
    {
      icon: '💊',
      title: 'Prescriptions',
      description: 'Receive digital prescriptions directly to your pharmacy',
    },
    {
      icon: '📱',
      title: 'Easy Access',
      description: 'Access from any device, anytime, anywhere',
    },
    {
      icon: '💰',
      title: 'Affordable',
      description: 'Quality healthcare at a fraction of traditional costs',
    },
  ];

  return (
    <section id="features" className="py-20 bg-background-light">
      <div className="section-container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose <span className="gradient-text">MediConnect?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with compassionate healthcare to deliver the best telemedicine experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
