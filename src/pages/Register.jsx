import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getStrength = (pwd) => {
  if (!pwd) return null;
  const has8  = pwd.length >= 8;
  const hasNum = /[0-9]/.test(pwd);
  const hasSym = /[^a-zA-Z0-9]/.test(pwd);
  const score = [has8, hasNum, hasSym].filter(Boolean).length;
  if (score <= 1) return { label: 'Weak',   color: 'bg-red-500',    w: 'w-1/3' };
  if (score === 2) return { label: 'Fair',   color: 'bg-yellow-400', w: 'w-2/3' };
  return               { label: 'Strong', color: 'bg-green-500',  w: 'w-full' };
};

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await registerUser(form);
      navigate('/login', { state: { msg: 'Registered successfully! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex">
        {/* ── Left branding panel ── */}
        <div className="hidden lg:flex flex-col justify-center items-start w-1/2 bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 text-white px-16 py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">✈</div>
              <span className="text-2xl font-black">TMS</span>
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Join thousands of<br />
              <span className="gradient-text-gold">happy travelers!</span>
            </h2>
            <p className="text-indigo-100/80 mb-10 max-w-sm leading-relaxed">
              Create your free account and start exploring the world with exclusive tour packages.
            </p>
            <ul className="space-y-3 text-sm text-indigo-100/90">
              {[
                'Browse 500+ tour packages',
                'Book & manage trips online',
                'Exclusive member deals',
                'Dedicated 24/7 support',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-purple-400/30 text-purple-200 flex items-center justify-center text-xs font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Decorative stat pills */}
            <div className="flex gap-3 mt-10">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-center">
                <p className="text-xl font-black gradient-text-gold">10K+</p>
                <p className="text-[11px] text-indigo-200/70">Members</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-center">
                <p className="text-xl font-black gradient-text-gold">500+</p>
                <p className="text-[11px] text-indigo-200/70">Packages</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-center">
                <p className="text-xl font-black gradient-text-gold">4.9★</p>
                <p className="text-[11px] text-indigo-200/70">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md animate-scale-in">
            <div className="mb-7 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details below to get started</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="tel" required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="Enter mobile number"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPwd ? 'text' : 'password'} required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    <EyeIcon open={showPwd} />
                  </button>
                </div>

                {/* Strength meter */}
                {strength && (
                  <div className="mt-2.5">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${
                      strength.label === 'Strong' ? 'text-green-600' :
                      strength.label === 'Fair'   ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {strength.label === 'Weak'   && '⚠ Weak — add numbers or symbols'}
                      {strength.label === 'Fair'   && '~ Fair — almost there!'}
                      {strength.label === 'Strong' && '✓ Strong password'}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-lg shadow-blue-200 mt-1"
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
