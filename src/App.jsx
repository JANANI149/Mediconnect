import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LoginPage from './pages/Login';
import Console from './Hospital/Console';

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/hospital')) {
      return 'console';
    }
    return 'landing';
  }); // landing | login | console

  const openLogin = () => {
    setView('login');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/login');
    }
  };

  const openConsole = () => {
    setView('console');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/hospital');
    }
  };

  const goHome = () => {
    setView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  if (view === 'login') {
    return <LoginPage onBack={goHome} />;
  }

  if (view === 'console') {
    return <Console onExit={goHome} />;
  }

  return (
    <div className="app-container">
      <Header
        onSignIn={openLogin}
        onGetStarted={openLogin}
        onOpenDashboard={openConsole}
      />
      <Hero onStart={openLogin} onOpenDashboard={openConsole} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={openLogin} onOpenDashboard={openConsole} />
      <Footer />
    </div>
  );
}