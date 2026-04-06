import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INTERESTS = ['Hackathon', 'Workshop', 'Coding Contest', 'Symposium', 'Summit', 'Seminar', 'Competition', 'AI/ML', 'Web Dev', 'Cybersecurity', 'Data Science', 'Robotics'];

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [interests, setInterests] = useState([]);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleInterest = (i) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (role === 'organizer' && !college.trim()) { setError('Please enter your college name'); return; }

    setLoading(true);
    try {
      const user = await register({
        name, email, password, role,
        college: role === 'student' ? 'SRMIST RAMAPURAM' : college.trim(),
        interests
      });
      navigate(user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dim rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-primary font-headline">Campulse</span>
          </Link>
          <h1 className="text-2xl font-bold text-on-surface mt-4 mb-1 font-headline">Create your account</h1>
          <p className="text-on-surface-variant text-sm">Join thousands of students & organizers</p>
        </div>

        <div className="glass-panel rounded-3xl p-8" style={{ background: 'rgba(25, 37, 64, 0.6)', backdropFilter: 'blur(24px)' }}>
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface-variant mb-3">I want to...</label>
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
                <span className="text-sm font-semibold">Discover Events</span>
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
                <span className="text-sm font-semibold">Host Events</span>
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
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Your name"
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Password</label>
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

            {/* College (for organizers) */}
            {role === 'organizer' && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">College/Organization</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="Your college name"
                  required
                />
              </div>
            )}

            {/* Interests (for students) */}
            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-3">Interests (pick a few for recommendations)</label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 font-label ${
                        interests.includes(i)
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/30'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-4 rounded-full hover:shadow-[0_0_20px_rgba(186,158,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : `Create ${role === 'student' ? 'Student' : 'Organizer'} Account`}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-on-surface-variant text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dim font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
