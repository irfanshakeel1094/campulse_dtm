import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password, role);
      navigate(user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dim rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-primary font-headline">Campulse</span>
          </Link>
          <h1 className="text-2xl font-bold text-on-surface mt-4 mb-1 font-headline">Welcome back</h1>
          <p className="text-on-surface-variant text-sm">Sign in to your account</p>
        </div>

        {/* Glass Panel */}
        <div className="glass-panel rounded-3xl p-8" style={{ background: 'rgba(25, 37, 64, 0.6)', backdropFilter: 'blur(24px)' }}>
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface-variant mb-3">Login as...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 font-headline ${
                  role === 'student'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">🎓</span>
                <span className="text-sm font-semibold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 font-headline ${
                  role === 'organizer'
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-secondary/50'
                }`}
              >
                <span className="text-2xl">📢</span>
                <span className="text-sm font-semibold">Organizer</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-error-container border border-error/30 flex items-start gap-3">
              <AlertCircle size={18} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-error-dim text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-on-surface-variant">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary-dim transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-4 rounded-full hover:shadow-[0_0_20px_rgba(186,158,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-on-surface-variant text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dim font-bold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
