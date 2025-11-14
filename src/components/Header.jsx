import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="section-container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl text-gray-900">MediConnect</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 hover:text-primary-500 transition-colors duration-300 font-medium text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="btn-secondary text-sm">Sign In</button>
          <button className="btn-primary text-sm">Get Started</button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 md:hidden">
            <div className="section-container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button className="btn-secondary w-full text-sm">Sign In</button>
              <button className="btn-primary w-full text-sm">Get Started</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
