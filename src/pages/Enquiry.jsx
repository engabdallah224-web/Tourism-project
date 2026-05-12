import { useState } from 'react';
import { sendEnquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Enquiry() {
  const [form, setForm]       = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userEmail = user?.UserEmail || user?.email;
      await sendEnquiry({ ...form, UserEmail: userEmail || form.email });
      setSent(true);
      toast.success('Your message has been sent! We will get back to you soon.');
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-400';
  const labelCls = 'block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider';
  const iconCls  = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">

          {sent ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/60 p-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                <i className="fa-solid fa-check text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent! 🎉</h3>
              <p className="text-gray-500 mb-8">Our team will get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-500/25">
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/60 p-8 md:p-10">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <i className="fa-solid fa-headset text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  We're Here to <span className="text-emerald-600">Help You</span>
                </h1>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Planning your next Somali adventure? Our travel experts are ready to assist you — just fill in the form below.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mt-3">
                  <i className="fa-solid fa-circle text-[7px] animate-pulse" /> Responds within 24 hours
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <div className="relative">
                      <div className={iconCls}><i className="fa-solid fa-user text-sm" /></div>
                      <input type="text" required value={form.name} placeholder="Your full name"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Mobile</label>
                    <div className="relative">
                      <div className={iconCls}><i className="fa-solid fa-phone text-sm" /></div>
                      <input type="tel" required value={form.mobile} placeholder="+252 61 234 5678"
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <div className={iconCls}><i className="fa-solid fa-envelope text-sm" /></div>
                    <input type="email" required value={form.email} placeholder="you@example.com"
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Subject</label>
                  <div className="relative">
                    <div className={iconCls}><i className="fa-solid fa-tag text-sm" /></div>
                    <input type="text" required value={form.subject} placeholder="What's your inquiry about?"
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Message</label>
                  <textarea rows={5} required value={form.message}
                    placeholder="Share your travel plans, questions or any details that help us serve you better..."
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputCls} resize-none`} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-4 rounded-xl font-black transition shadow-xl shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 transform">
                  {loading ? (
                    <><i className="fa-solid fa-spinner animate-spin" /> Sending...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane" /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
