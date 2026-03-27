'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi2';

const GOOGLE_CLIENT_ID = '363269910971-b5kkvgjbfqo4qajqahrch0c4leqnljjo.apps.googleusercontent.com';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push('/twin');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const handleGoogleSignup = useCallback(() => {
    if (googleLoading) return;
    setError('');
    setGoogleLoading(true);

    try {
      if (!window.google?.accounts?.id) {
        setError('Google Sign-In is loading. Please try again.');
        setGoogleLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (response.credential) {
            const result = await googleLogin(response.credential);
            if (result.success) {
              router.push('/dashboard');
            } else {
              setError(result.error || 'Google signup failed');
            }
          } else {
            setError('No credential received from Google');
          }
          setGoogleLoading(false);
        },
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn = document.createElement('div');
          btn.id = 'g_id_signin_fallback';
          btn.style.display = 'none';
          document.body.appendChild(btn);
          window.google.accounts.id.renderButton(btn, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
          });
          setTimeout(() => {
            const inner = btn.querySelector('[role="button"]') || btn.firstChild;
            if (inner) inner.click();
            setTimeout(() => btn.remove(), 1000);
          }, 100);
          setGoogleLoading(false);
        }
      });
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Failed to initialize Google Sign-In');
      setGoogleLoading(false);
    }
  }, [googleLoading, googleLogin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-1/3 -right-48 w-96 h-96 orb bg-neon-purple/15" />
      <div className="fixed bottom-1/3 -left-48 w-96 h-96 orb bg-neon-cyan/15" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg shadow-neon-cyan/20">
              <span className="text-dark-900 font-bold text-xl">NX</span>
            </div>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create Your Twin</h1>
          <p className="text-gray-500 text-sm mt-1">Start building your AI digital twin today</p>
        </div>

        <form onSubmit={handleSubmit} className="card-dark space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark pl-11"
                placeholder="Rishabh Jha"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark pl-11"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-11"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
            ) : (
              <>
                <HiOutlineSparkles className="w-4 h-4" />
                Create Account & Start Training
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="google-auth-btn w-full"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Create account with Google & Start Training
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-cyan hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-gray-600 mt-2">
          Or use demo: demo@nexus.ai / demo123
        </p>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
