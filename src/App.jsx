import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LoginPage from './pages/Login';
import AdminApp from './admin/AdminApp';
import HospitalApp from './hospital/HospitalApp';
import PatientApp from './patient/PatientApp';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/';
  const isAdminRoute = pathname.startsWith('/admin');
  const isHospitalRoute = pathname.startsWith('/hospital');
  const isPatientRoute = pathname.startsWith('/patient');

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);
  const goToAdmin = () => {
    window.location.href = '/admin';
  };
  const goToHospital = () => {
    window.location.href = '/hospital';
  };
  const goToPatient = () => {
    window.location.href = '/patient';
  };

  if (isAdminRoute) {
    return <AdminApp role="admin" adminName="Platform Super Admin" />;
  }

  if (isHospitalRoute) {
    return <HospitalApp role="hospital" hospitalName="Lotus Care Hospital" />;
  }

  if (isPatientRoute) {
    return <PatientApp role="patient" />;
  }

  if (showLogin) {
    return <LoginPage onBack={closeLogin} />;
  }

  return (
    <div className="app-container">
      <Header onSignIn={openLogin} onGetStarted={goToAdmin} />
      <Hero onStart={goToPatient} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={goToHospital} />
      <Footer />
    </div>
  );
}