export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and complete your medical history in just 2 minutes',
    },
    {
      number: '02',
      title: 'Choose Your Doctor',
      description: 'Browse and select from our network of qualified healthcare professionals',
    },
    {
      number: '03',
      title: 'Video Consultation',
      description: 'Connect via secure video call at your scheduled time',
    },
    {
      number: '04',
      title: 'Get Prescription',
      description: 'Receive treatment plans and prescriptions digitally',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple Process,
            <span className="gradient-text"> Better Results</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get quality healthcare in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-primary-500/10 to-secondary-100/20 rounded-2xl p-8 text-center h-full">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg className="w-12 h-12 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
