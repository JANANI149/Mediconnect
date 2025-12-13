import { useState } from 'react';
import { auth, db } from '../../backend/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './login.css';

export default function LoginPage({ onBack }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('admin@gmail.com'); // default admin email
  const [password, setPassword] = useState('medi@123'); // default admin password
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      if (mode === 'signin') {
        const normalizedEmail = email.trim().toLowerCase();
        console.group('Hospital/Admin login');
        console.log('Attempting sign-in for', normalizedEmail);
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Firebase auth successful for', normalizedEmail);

        if (normalizedEmail === 'admin@gmail.com') {
          setStatus({ loading: false, error: '', success: 'Signed in successfully. Redirecting to admin...' });
          window.location.href = '/admin';
          console.groupEnd();
          return;
        }

        const hospitalsRef = collection(db, 'adminHospitals');
        const hospitalQuery = query(hospitalsRef, where('email', '==', normalizedEmail));
        const hospitalSnapshot = await getDocs(hospitalQuery);

        if (hospitalSnapshot.empty) {
          setStatus({
            loading: false,
            error: 'No hospital workspace found for this email. Please contact your platform admin.',
            success: '',
          });
          return;
        }

        const hospitalDoc = hospitalSnapshot.docs[0];
        sessionStorage.setItem(
          'hospitalSession',
          JSON.stringify({
            hospitalId: hospitalDoc.id,
            email: normalizedEmail,
          })
        );

        setStatus({ loading: false, error: '', success: 'Signed in successfully. Redirecting to hospital dashboard...' });
        console.log('Hospital workspace found for', normalizedEmail, '→', hospitalDoc.id);
        console.groupEnd();
        window.location.href = '/hospital';
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setStatus({ loading: false, error: '', success: 'Account created and signed in.' });
      }
    } catch (error) {
      console.error('Authentication flow failed', error);
      console.groupEnd?.();
      let message = error?.message || 'Something went wrong. Please try again.';
      
      // Provide more specific error messages for common authentication issues
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please check your email or contact your administrator.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again or reset your password.';
      }
      
      setStatus({ loading: false, error: message, success: '' });
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setStatus({ loading: false, error: '', success: '' });
  };

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="logo-container">
          <div className="logo-box">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="logo-text">MediConnect</span>
        </div>
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
      </header>

      <main className="login-content">
        <div className="login-card">
          <p className="auth-kicker">Secure access</p>
          <h1 className="auth-title">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth-subtitle">
            Sign in with your email to continue to MediConnect.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </label>

            {status.error && <p className="auth-alert error">{status.error}</p>}
            {status.success && <p className="auth-alert success">{status.success}</p>}

            <button className="auth-submit" type="submit" disabled={status.loading}>
              {status.loading
                ? 'Please wait...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <span>{mode === 'signin' ? 'New here?' : 'Already have an account?'}</span>
            <button className="auth-switch" type="button" onClick={switchMode}>
              {mode === 'signin' ? 'Create one' : 'Sign in instead'}
            </button>
          </div>
        </div>
        <div className="login-illustration">
          <div className="login-illustration-card">
            <p className="login-pill">Telehealth</p>
            <h3>Healthcare, reimagined.</h3>
            <p>
              Connect with certified doctors 24/7, book consultations, and manage
              your health records securely.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

