import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  { id: 1, value: 'garbage',       label: 'Garbage Management', icon: '🗑️', desc: 'Waste collection & disposal', color: 'border-orange-300 bg-orange-50', active: 'border-orange-500 bg-orange-100 ring-2 ring-orange-300' },
  { id: 2, value: 'pothole',       label: 'Pothole',            icon: '🕳️', desc: 'Road damage & surface issues', color: 'border-gray-300 bg-gray-50',     active: 'border-gray-500 bg-gray-100 ring-2 ring-gray-300' },
  { id: 3, value: 'water_leakage', label: 'Water Leakage',      icon: '💧', desc: 'Pipe leakage & supply issues', color: 'border-blue-300 bg-blue-50',     active: 'border-blue-500 bg-blue-100 ring-2 ring-blue-300' },
];

const urgencyConfig = {
  Low:      { color: 'bg-green-100 text-green-800 border-green-300',   icon: '🟢' },
  Medium:   { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🟡' },
  High:     { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🟠' },
  Critical: { color: 'bg-red-100 text-red-800 border-red-300',          icon: '🔴' },
};


export default function FileComplaint() {
  const [form, setForm] = useState({ title: '', description: '', location: '', category_id: 1 });
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

  const handleCategory = (id) => {
    setSelected(id);
    setForm({...form, category_id: id});
  };
  const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

  const handleAnalyze = async () => {
    if (!form.description || form.description.length < 20) {
      alert('Please write at least 20 characters in the description first!');
      return;
    }
    setAnalyzing(true);
    setAiResult(null);
    try {
      const res = await axios.post('/ai/analyze', { description: form.description });
      setAiResult(res.data);
      // Auto-select the AI suggested category
      const catMap = { garbage: 1, pothole: 2, water_leakage: 3 };
      if (catMap[res.data.category]) {
        setSelected(catMap[res.data.category]);
        setForm(f => ({ ...f, category_id: catMap[res.data.category] }));
      }
    } catch (err) {
      alert('AI analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('category_id', form.category_id);
    if (image) formData.append('image', image);

    await axios.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Complaint filed successfully!');
    navigate('/dashboard');
  } catch (err) {
    alert('Error filing complaint');
  } finally {
    setLoading(false);
  }
}; 

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
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10 p-2 rounded-lg transition">← Back</button>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><span className="text-sm">🏛️</span></div>
          <div>
            <p className="text-white font-semibold text-sm">File a Complaint</p>
            <p className="text-blue-300 text-xs">Smart Complaints Portal</p>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-blue-800 border-b border-blue-700">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-2">
          <span className="text-blue-300 text-xs">🏠 Home</span>
          <span className="text-blue-500 text-xs">›</span>
          <span className="text-blue-300 text-xs cursor-pointer hover:text-white" onClick={() => navigate('/dashboard')}>My Complaints</span>
          <span className="text-blue-500 text-xs">›</span>
          <span className="text-white text-xs font-medium">New Complaint</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Report a Civic Issue</h2>
          <p className="text-gray-500 mt-1">Your complaint will be forwarded to the concerned department immediately</p>
        </div>

        {/* AI Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">AI-Powered Smart Filing</p>
            <p className="text-purple-200 text-xs mt-0.5">Describe your issue and let AI auto-categorize, prioritize and summarize it for you!</p>
          </div>
          <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30 flex-shrink-0">
            Gemini AI
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Description first for AI */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Step 1 — Describe Your Issue</h3>
              <span className="text-blue-300 text-xs">AI will analyze this</span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complaint Title <span className="text-red-500">*</span></label>
                <input
                  placeholder="e.g. Garbage not collected for 3 days near bus stop"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Detailed Description <span className="text-red-500">*</span>
                  <span className="text-purple-600 ml-2 font-normal text-xs">← AI reads this</span>
                </label>
                <textarea
                  placeholder="Describe the issue in detail — duration, severity, impact, location specifics, safety concerns..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{form.description.length} characters (min 20)</p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing || form.description.length < 20}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>🤖 Analyze with AI</>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Result */}
              {aiResult && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-600 text-lg">✨</span>
                    <p className="text-purple-800 font-bold text-sm">AI Analysis Complete</p>
                    <span className="bg-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded-full ml-auto">Gemini AI</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-xs text-gray-500 mb-1">Suggested Category</p>
                      <p className="font-bold text-gray-800 text-sm">
                        {aiResult.category === 'garbage' ? '🗑️ Garbage' :
                         aiResult.category === 'pothole' ? '🕳️ Pothole' : '💧 Water Leakage'}
                      </p>
                      <p className="text-xs text-purple-600 mt-0.5">✓ Auto-selected</p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-xs text-gray-500 mb-1">Priority Score</p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-2xl text-gray-800">{aiResult.priority}</p>
                        <p className="text-gray-400 text-sm">/10</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">Urgency Level</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${urgencyConfig[aiResult.urgency]?.color}`}>
                      {urgencyConfig[aiResult.urgency]?.icon} {aiResult.urgency} Priority
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">AI Summary</p>
                    <p className="text-sm text-gray-800 font-medium">{aiResult.summary}</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">Admin Suggestion</p>
                    <p className="text-sm text-gray-700">💡 {aiResult.suggestion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Step 2 — Issue Category</h3>
              {aiResult && <span className="text-green-400 text-xs">✓ AI auto-selected</span>}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 text-left transition ${selected === cat.id ? cat.active : cat.color}`}
                  >
                    <span className="text-4xl block mb-3">{cat.icon}</span>
                    <p className="font-bold text-gray-800 text-sm">{cat.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                    {selected === cat.id && (
                      <div className="mt-2 inline-block bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-3">
              <h3 className="text-white font-semibold text-sm">Step 3 — Location Details</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">📍</span>
                <input
                  placeholder="Street, landmark, area, city..."
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                />
              </div>
            </div>
          </div>
          {/* Image Upload */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
  <div className="bg-blue-900 px-6 py-3">
    <h3 className="text-white font-semibold text-sm">Step 4 — Attach Photo <span className="text-blue-300 font-normal">(Optional)</span></h3>
  </div>
  <div className="p-6">
    {!imagePreview ? (
      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
        <span className="text-4xl mb-2">📷</span>
        <p className="text-gray-600 font-semibold text-sm">Click to upload photo</p>
        <p className="text-gray-400 text-xs mt-1">JPG, PNG or WebP · Max 5MB</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
      </label>
    ) : (
      <div className="relative">
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-48 object-cover rounded-xl border border-gray-200"
        />
        <button
          type="button"
          onClick={() => { setImage(null); setImagePreview(null); }}
          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg"
        >
          ✕
        </button>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-green-600 text-sm">✅ Photo attached</span>
          <span className="text-gray-400 text-xs">{image?.name}</span>
        </div>
      </div>
    )}
  </div>
</div>

          {/* Declaration */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-yellow-600 text-xl flex-shrink-0">⚠️</span>
            <p className="text-yellow-800 text-xs">By submitting, I declare the information is true and accurate. Filing false complaints is a punishable offense.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition text-base disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Submitting...</>
            ) : (
              <>📤 Submit Complaint to Authority</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}