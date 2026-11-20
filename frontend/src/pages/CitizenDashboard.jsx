import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  pending:     { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500', label: 'Pending' },
  assigned:    { color: 'bg-blue-100 text-blue-800 border-blue-200',       dot: 'bg-blue-500',   label: 'Assigned' },
  in_progress: { color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', label: 'In Progress' },
  resolved:    { color: 'bg-green-100 text-green-800 border-green-200',    dot: 'bg-green-500',  label: 'Resolved' },
  rejected:    { color: 'bg-red-100 text-red-800 border-red-200',          dot: 'bg-red-500',    label: 'Rejected' },
};

const categoryConfig = {
  garbage:       { icon: '🗑️', label: 'Garbage Management',  bg: 'bg-orange-50 border-orange-100' },
  pothole:       { icon: '🕳️', label: 'Pothole',             bg: 'bg-gray-50 border-gray-100' },
  water_leakage: { icon: '💧', label: 'Water Leakage',       bg: 'bg-blue-50 border-blue-100' },
};
function Chatbot({ userId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am your Smart Complaints assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post('/ai/chatbot', { message: userMsg, userId });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I am unable to respond right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition z-50 border-4 border-white"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm">🤖</div>
            <div>
              <p className="text-white font-bold text-sm">Smart Assistant</p>
              <p className="text-blue-300 text-xs">Powered by Gemini AI</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">🤖</div>
                )}
                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                  msg.from === 'user'
                    ? 'bg-blue-900 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-xs mr-2">🤖</div>
                <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {['My complaint status', 'How long does it take?', 'File new complaint'].map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap border border-blue-100 hover:bg-blue-100 transition flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-xl transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/complaints/my')
      .then(res => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'pending').length,
    resolved:   complaints.filter(c => c.status === 'resolved').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top government strip */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-orange-500"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-green-600"></div>
      </div>

      {/* Navbar */}
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Smart Complaints</h1>
              <p className="text-blue-300 text-xs">Government Citizen Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-semibold">{user?.name}</p>
              <p className="text-blue-300 text-xs">Citizen</p>
            </div>
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition border border-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sub header */}
      <div className="bg-blue-800 border-b border-blue-700">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2">
          <span className="text-blue-300 text-xs">🏠 Home</span>
          <span className="text-blue-500 text-xs">›</span>
          <span className="text-white text-xs font-medium">My Complaints</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 mb-6 flex justify-between items-center shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-full opacity-10">
            <div className="w-40 h-40 bg-white rounded-full absolute -right-10 -top-10"></div>
            <div className="w-24 h-24 bg-orange-400 rounded-full absolute right-10 bottom-0"></div>
          </div>
          <div className="relative z-10">
            <p className="text-blue-300 text-sm font-medium mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold text-white">{user?.name} 👋</h2>
            <p className="text-blue-300 text-sm mt-1">Track and manage your civic complaints</p>
          </div>
          <button
            onClick={() => navigate('/file-complaint')}
            className="relative z-10 bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">New Complaint</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Filed',  value: stats.total,      icon: '📋', border: 'border-blue-200',   iconBg: 'bg-blue-50',   text: 'text-blue-700' },
            { label: 'Pending',      value: stats.pending,    icon: '⏳', border: 'border-yellow-200', iconBg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'In Progress',  value: stats.inProgress, icon: '🔧', border: 'border-purple-200', iconBg: 'bg-purple-50', text: 'text-purple-700' },
            { label: 'Resolved',     value: stats.resolved,   icon: '✅', border: 'border-green-200',  iconBg: 'bg-green-50',  text: 'text-green-700' },
          ].map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl p-4 shadow-sm border-2 ${stat.border}`}>
              <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center text-xl mb-3`}>
                {stat.icon}
              </div>
              <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Complaints list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Table header */}
          <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">My Complaint History</h3>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              {complaints.length} record{complaints.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-400">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl block mb-4">📭</span>
              <p className="text-gray-600 font-semibold text-lg">No complaints filed yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-6">File your first complaint to get started</p>
              <button
                onClick={() => navigate('/file-complaint')}
                className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition"
              >
                + File First Complaint
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {complaints.map((c, idx) => {
                const status = statusConfig[c.status] || statusConfig.pending;
                const cat = categoryConfig[c.category] || { icon: '📌', label: c.category, bg: 'bg-gray-50 border-gray-100' };
                return (
                  <div key={c.id} className="p-5 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">

                      {/* Index + icon */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">#{String(idx + 1).padStart(2, '0')}</span>
                        <div className={`w-12 h-12 ${cat.bg} border rounded-xl flex items-center justify-center text-2xl`}>
                          {cat.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-800 text-base">{c.title}</h4>
                          <span className={`${status.color} border text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            📍 {c.location}
                          </span>
                          <span className="text-gray-300 text-xs">|</span>
                          <span className="text-xs text-gray-500">{cat.label}</span>
                          <span className="text-gray-300 text-xs">|</span>
                          <span className="text-xs text-gray-400">
                            Filed: {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>

                        {c.status === 'resolved' && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1 rounded-full">
                            ✅ Issue resolved by authorities
                          </div>
                        )}
                        {c.status === 'rejected' && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1 rounded-full">
                            ❌ Complaint was rejected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {/* AI Chatbot */}
        <div className="mt-6">
          <Chatbot userId={user?.id} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">🔒 Smart Complaints · Government of India · All data is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}
