import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', form);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Smart Complaints</p>
              <p className="text-blue-300 text-xs">Government of India Initiative</p>
            </div>
          </div>
        </div>

        {/* Middle */}
        <div className="relative z-10">
          <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            New Registration
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join the<br/>Civic Network
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            Register once and report issues anytime, anywhere. 
            Your complaints reach the right authorities instantly.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: '01', title: 'Register your account', desc: 'Quick one-time registration' },
              { step: '02', title: 'Report any civic issue', desc: 'Garbage, potholes, water leakage' },
              { step: '03', title: 'Track resolution', desc: 'Real-time status updates' },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-blue-300 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-blue-400 text-xs">© 2026 Smart Complaints · All rights reserved</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl mb-3 shadow-lg">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Complaints</h1>
            <p className="text-gray-500 text-sm">Government Citizen Portal</p>
          </div>

          {/* Tricolor strip */}
          <div className="flex h-1.5 rounded-full overflow-hidden mb-8">
            <div className="flex-1 bg-orange-500"></div>
            <div className="flex-1 bg-white border-y border-gray-200"></div>
            <div className="flex-1 bg-green-600"></div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-500 mb-8">Register as a citizen to file complaints</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                  <input
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 text-base mt-2"
              >
                {loading ? 'Creating Account...' : 'Register as Citizen'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-gray-400 text-xs">Already registered?</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            <Link
              to="/login"
              className="block w-full text-center border-2 border-blue-900 text-blue-900 font-bold py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Sign In to Portal
            </Link>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            🔒 Secured by Government of India · ISO 27001 Certified
          </p>
        </div>
      </div>
    </div>
  );
}