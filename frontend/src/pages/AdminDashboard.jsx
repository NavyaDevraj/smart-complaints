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
  garbage:       { icon: '🗑️', label: 'Garbage Management' },
  pothole:       { icon: '🕳️', label: 'Pothole' },
  water_leakage: { icon: '💧', label: 'Water Leakage' },
};

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [c, w] = await Promise.all([
        axios.get('/complaints/all'),
        axios.get('/workers/available')
      ]);
      setComplaints(c.data);
      setWorkers(w.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (complaint_id, worker_id) => {
    if (!worker_id) return;
    await axios.post('/complaints/assign', { complaint_id, worker_id });
    fetchData();
  };

  const handleStatus = async (complaint_id, status) => {
    await axios.post('/complaints/status', { complaint_id, status, remarks: 'Updated by admin' });
    fetchData();
  };

  const counts = {
    total:       complaints.length,
    pending:     complaints.filter(c => c.status === 'pending').length,
    assigned:    complaints.filter(c => c.status === 'assigned').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved:    complaints.filter(c => c.status === 'resolved').length,
    rejected:    complaints.filter(c => c.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const statCards = [
    { label: 'Total',       value: counts.total,       status: 'all',         color: 'border-gray-300',   dot: 'bg-gray-500',    text: 'text-gray-700' },
    { label: 'Pending',     value: counts.pending,     status: 'pending',     color: 'border-yellow-300', dot: 'bg-yellow-500',  text: 'text-yellow-700' },
    { label: 'Assigned',    value: counts.assigned,    status: 'assigned',    color: 'border-blue-300',   dot: 'bg-blue-500',    text: 'text-blue-700' },
    { label: 'In Progress', value: counts.in_progress, status: 'in_progress', color: 'border-purple-300', dot: 'bg-purple-500',  text: 'text-purple-700' },
    { label: 'Resolved',    value: counts.resolved,    status: 'resolved',    color: 'border-green-300',  dot: 'bg-green-500',   text: 'text-green-700' },
    { label: 'Rejected',    value: counts.rejected,    status: 'rejected',    color: 'border-red-300',    dot: 'bg-red-500',     text: 'text-red-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Tricolor strip */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-orange-500"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-green-600"></div>
      </div>

      {/* Navbar */}
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Smart Complaints</h1>
              <p className="text-orange-400 text-xs font-semibold">⚙️ Admin Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">System Online</span>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sub header */}
      <div className="bg-blue-800 border-b border-blue-700">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          <span className="text-blue-300 text-xs">🏠 Admin</span>
          <span className="text-blue-500 text-xs">›</span>
          <span className="text-white text-xs font-medium">Complaint Management</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-full opacity-10">
            <div className="w-48 h-48 bg-white rounded-full absolute -right-16 -top-16"></div>
            <div className="w-32 h-32 bg-orange-400 rounded-full absolute right-8 bottom-0"></div>
          </div>
          <div className="relative z-10">
            <p className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-1">Admin Dashboard</p>
            <h2 className="text-2xl font-bold text-white">Complaint Management System</h2>
            <p className="text-blue-300 text-sm mt-1">Review, assign and resolve citizen complaints</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {statCards.map(stat => (
            <button
              key={stat.label}
              onClick={() => setFilter(stat.status)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 text-left transition hover:shadow-md ${
                filter === stat.status ? `${stat.color} shadow-md` : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stat.dot}`}></span>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${filter === stat.status ? stat.text : 'text-gray-800'}`}>
                {stat.value}
              </p>
            </button>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Table header */}
          <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">
                {filter === 'all' ? 'All Complaints' : `${filter.replace('_', ' ')} Complaints`}
              </h3>
              <p className="text-blue-300 text-xs mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="flex items-center gap-2">
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-xs text-blue-300 hover:text-white bg-white/10 px-3 py-1 rounded-lg transition"
                >
                  Clear filter ×
                </button>
              )}
              <div className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg border border-white/20">
                👷 {workers.length} workers available
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-400">Loading complaints...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl block mb-4">📭</span>
              <p className="text-gray-600 font-semibold">No complaints found</p>
              <p className="text-gray-400 text-sm mt-1">Try selecting a different filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((c, idx) => {
                const status = statusConfig[c.status] || statusConfig.pending;
                const cat = categoryConfig[c.category] || { icon: '📌', label: c.category };
                return (
                  <div key={c.id} className="p-5 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">

                      {/* Number + Icon */}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-gray-400 font-mono">#{String(idx + 1).padStart(2, '0')}</span>
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl border border-gray-200">
                          {cat.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h4 className="font-bold text-gray-800">{c.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">👤 {c.citizen_name}</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">📍 {c.location}</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-500">{cat.label}</span>
                            </div>
                          </div>
                          <span className={`${status.color} border text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {c.status === 'pending' && (
                            <>
                              <select
                                onChange={e => handleAssign(c.id, e.target.value)}
                                defaultValue=""
                                className="text-sm px-3 py-1.5 rounded-lg border-2 border-blue-200 focus:outline-none focus:border-blue-900 bg-white text-gray-700 font-medium"
                              >
                                <option value="">👷 Assign Worker...</option>
                                {workers.map(w => (
                                  <option key={w.id} value={w.id}>
                                    {w.name} — {w.department}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleStatus(c.id, 'rejected')}
                                className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold border border-red-200 transition"
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}
                          {c.status === 'assigned' && (
                            <button
                              onClick={() => handleStatus(c.id, 'in_progress')}
                              className="text-sm px-4 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold border border-purple-200 transition"
                            >
                              🔧 Mark In Progress
                            </button>
                          )}
                          {c.status === 'in_progress' && (
                            <button
                              onClick={() => handleStatus(c.id, 'resolved')}
                              className="text-sm px-4 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold border border-green-200 transition"
                            >
                              ✅ Mark Resolved
                            </button>
                          )}
                          {c.worker_name && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                              👷 {c.worker_name}
                            </span>
                          )}
                          {(c.status === 'resolved' || c.status === 'rejected') && (
                            <span className="text-xs text-gray-400 italic">No further actions</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">🔒 Smart Complaints Admin Portal · Government of India · Secure & Encrypted</p>
        </div>
      </div>
    </div>
  );
}