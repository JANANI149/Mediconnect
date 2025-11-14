export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-background-light to-white">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Healthcare,
              <span className="gradient-text"> Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with qualified healthcare professionals from the comfort of your home. MediConnect brings telehealth to your fingertips with secure, reliable, and affordable medical consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="btn-primary">Start Your Consultation</button>
              <button className="btn-secondary">Watch Demo</button>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-500">50K+</span>
                <span className="text-gray-600 text-sm">Happy Patients</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-500">1000+</span>
                <span className="text-gray-600 text-sm">Doctors Online</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-500">4.9/5</span>
                <span className="text-gray-600 text-sm">App Rating</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-100/20 rounded-3xl blur-2xl" />
            <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" 
                alt="Professional doctor with arms crossed" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white font-semibold text-lg">24/7 Online Consultation</p>
                <p className="text-white/90 text-sm mt-1">Connect with certified doctors instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
