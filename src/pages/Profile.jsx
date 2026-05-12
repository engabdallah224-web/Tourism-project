import { useEffect, useState } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', oldPassword: '', newPassword: '', confirmPassword: '' });
  const [tab, setTab]             = useState('info'); // 'info' | 'password'
  const { user } = useAuth();
  const toast = useToast();

  const loadProfile = () => {
    const userEmail = user?.UserEmail || user?.email;
    if (!userEmail) return;
    getProfile(userEmail)
      .then((res) => {
        const u = res.data.user;
        setProfile(u);
        setForm(f => ({ ...f, name: u.FullName || '', email: u.EmailId || '' }));
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProfile(); }, []); // eslint-disable-line

  const name     = profile?.FullName || user?.UserName  || 'Traveler';
  const email    = profile?.EmailId  || user?.UserEmail || '—';
  const mobile   = profile?.MobileNumber || '—';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userEmail = profile?.EmailId || user?.UserEmail || user?.email;
    try {
      await updateProfile(userEmail, { FullName: form.name, MobileNumber: mobile });
      setProfile(p => ({ ...p, FullName: form.name }));
      setModal(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePwd = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setSaving(true);
    try {
      await changePassword({ email, oldPassword: form.oldPassword, newPassword: form.newPassword });
      setModal(false);
      setForm(f => ({ ...f, oldPassword: '', newPassword: '', confirmPassword: '' }));
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    setTab('info');
    setForm(f => ({ ...f, name: profile?.FullName || '', email: profile?.EmailId || '' }));
    setModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-32">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-indigo-700 opacity-20 rounded-full blur-[130px] -translate-y-1/3" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-violet-600 opacity-15 rounded-full blur-[110px] -translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Edit button — top right */}
          <div className="flex justify-end mb-6">
            <button onClick={openModal}
              className="flex items-center gap-2 bg-white/10 hover:bg-indigo-600/70 border border-white/10 hover:border-indigo-400/40 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 group">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Avatar + info */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative flex-shrink-0">
              {loading ? (
                <div className="w-32 h-32 rounded-3xl bg-white/10 animate-pulse" />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-violet-500/40 border-2 border-white/10">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 border-[3px] border-[#080d1a] rounded-full" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">✦ Verified Traveler</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">● Active Member</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-12 w-64 bg-white/10 rounded-xl animate-pulse" />
                  <div className="h-4 w-48 bg-white/10 rounded-xl animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{name}</h1>
                  <p className="text-slate-400 mt-1.5">{email}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO STRIPS ───────────────────────────────────────────── */}
      <main className="flex-1 -mt-10 relative z-10 max-w-4xl mx-auto w-full px-6 pb-24">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-3">
          {[
            {
              label: 'Full Name', value: loading ? '…' : name,
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
              grad: 'from-blue-500 to-indigo-500',
            },
            {
              label: 'Email Address', value: loading ? '…' : email,
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
              grad: 'from-violet-500 to-purple-500',
            },
            {
              label: 'Mobile Number', value: loading ? '…' : mobile,
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
              grad: 'from-emerald-500 to-teal-500',
            },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4 bg-gray-50 hover:bg-indigo-50/40 border border-gray-100 hover:border-indigo-100 rounded-2xl px-5 py-4 transition group">
              <div className={`w-11 h-11 bg-gradient-to-br ${item.grad} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-gray-800 font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── EDIT MODAL ────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#0f1629] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl shadow-indigo-500/10 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/[0.07]">
              <h2 className="text-white font-black text-xl">Edit Profile</h2>
              <button onClick={() => setModal(false)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-7 pt-5">
              {[{ id: 'info', label: 'Personal Info' }, { id: 'password', label: 'Password' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${
                    tab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="px-7 py-6">
              {tab === 'info' ? (
                <form onSubmit={handleSaveInfo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
                    <p className="text-[11px] text-amber-400/70 mt-1.5 ml-1">⚠️ Changing email will affect your login credentials.</p>
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-2xl font-black transition shadow-xl shadow-indigo-500/20 disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSavePwd} className="space-y-4">
                  {[
                    { label: 'Current Password', key: 'oldPassword' },
                    { label: 'New Password',     key: 'newPassword' },
                    { label: 'Confirm Password', key: 'confirmPassword' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{f.label}</label>
                      <input type="password" required value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition" />
                    </div>
                  ))}
                  <button type="submit" disabled={saving}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white py-3.5 rounded-2xl font-black transition shadow-xl shadow-violet-500/20 disabled:opacity-50">
                    {saving ? 'Updating…' : 'Change Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
