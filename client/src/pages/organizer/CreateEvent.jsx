import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

const CATEGORIES = ['Hackathon', 'Workshop', 'Coding Contest', 'Symposium', 'Summit', 'Seminar', 'Competition', 'General'];
const MODES = ['Offline', 'Online', 'Hybrid'];

export default function CreateEvent({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    registrationFee: 'Free',
    contactNumber: '',
    googleFormLink: '',
    category: 'Hackathon',
    mode: 'Offline',
  });
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/events/${id}`).then(res => {
        const e = res.data;
        setForm({
          title: e.title || '',
          description: e.description || '',
          date: e.date || '',
          time: e.time || '',
          venue: e.location || '',
          registrationFee: e.registrationFee || 'Free',
          contactNumber: e.contactNumber || '',
          googleFormLink: e.registrationUrl || '',
          category: e.category || 'Hackathon',
          mode: e.mode || 'Offline',
        });
        if (e.posterUrl) setPosterPreview(`http://localhost:5000${e.posterUrl}`);
      }).catch(() => navigate('/organizer/events'));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return; }
    setPoster(file);
    setPosterPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.googleFormLink.startsWith('http')) {
      setError('Please enter a valid Google Form URL (must start with http)');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (poster) data.append('poster', poster);

      if (isEdit) {
        await api.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setSuccess(true);
      setTimeout(() => navigate('/organizer/events'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center">
        <div className="text-center animate-slide-up">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {isEdit ? 'Event Updated!' : 'Event Posted!'}
          </h2>
          <p className="text-slate-500">Students will be notified about your event.</p>
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background transition-colors">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {isEdit ? 'Edit Event' : 'Post New Event'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in the details below. Students will be notified automatically.</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 mb-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/50 rounded-2xl">
          <Info size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Provide a Google Form link for registration. Students will be directed to your form when they click "Register Now".
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Event Poster <span className="text-slate-400 font-normal">(optional)</span></label>
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                ${posterPreview ? 'border-primary-300 dark:border-primary-700' : 'border-slate-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-700'}`}
            >
              {posterPreview ? (
                <div className="relative">
                  <img src={posterPreview} alt="Poster preview" className="w-full h-48 object-cover rounded-2xl" />
                  <button
                    type="button"
                    onClick={() => { setPoster(null); setPosterPreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-surface-container rounded-xl flex items-center justify-center mb-3 text-slate-400">
                    <Upload size={22} />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Click to upload poster</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handlePoster} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="input"
              placeholder="e.g. HackSRM 2025"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Event Description</label>
            <textarea
              name="description"
              className="input min-h-[120px] resize-none"
              placeholder="Describe your event — what it's about, what participants can expect, prizes, etc."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Date + Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                className="input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Event Time</label>
              <input
                type="text"
                name="time"
                className="input"
                placeholder="e.g. 09:00 AM"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Venue / Place</label>
            <input
              type="text"
              name="venue"
              className="input"
              placeholder="e.g. Seminar Hall A, SRM IST Ramapuram (or Online - Zoom)"
              value={form.venue}
              onChange={handleChange}
            />
          </div>

          {/* Category + Mode */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select name="category" className="input" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mode</label>
              <select name="mode" className="input" value={form.mode} onChange={handleChange}>
                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Registration Fee + Contact */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Registration Fee</label>
              <input
                type="text"
                name="registrationFee"
                className="input"
                placeholder="Free / ₹200 / etc."
                value={form.registrationFee}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                className="input"
                placeholder="e.g. 9876543210"
                value={form.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Google Form Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Google Form Registration Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="googleFormLink"
              className="input"
              placeholder="https://forms.gle/yourformlink"
              value={form.googleFormLink}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-slate-400 mt-1.5">Students will be redirected here when they click "Register Now"</p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary !py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isEdit ? 'Save Changes' : '🚀 Post Event'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-container transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
