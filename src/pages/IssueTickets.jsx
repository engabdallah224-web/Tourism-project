import { useEffect, useState } from 'react';
import { getIssues, createIssue } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function IssueTickets() {
  const [issues, setIssues] = useState([]);
  const [form, setForm]     = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchIssues = () => {
    const userEmail = user?.UserEmail || user?.email;
    getIssues()
      .then((res) => {
        const all = res.data.issues || [];
        const filtered = userEmail ? all.filter(i => i.UserEmail === userEmail || i.email === userEmail) : all;
        setIssues(filtered);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchIssues(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userEmail = user?.UserEmail || user?.email;
      await createIssue({ ...form, UserEmail: userEmail });
      toast.success('Ticket submitted successfully!');
      setForm({ subject: '', message: '' });
      fetchIssues();
    } catch {
      toast.error('Failed to submit ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500 rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            24/7 Support Available
          </div>
          <h1 className="text-4xl font-black text-white mb-1">Support Tickets</h1>
          <p className="text-blue-200 text-sm">Raise a ticket and our support team will assist you promptly.</p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* New ticket form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-7 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-black text-gray-900">New Ticket</h2>
                  <p className="text-xs text-gray-400">We reply within 4 hours</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-amber-600">{issues.filter((i) => i.Status != 1).length}</p>
                  <p className="text-xs text-amber-600 font-semibold">Pending</p>
                </div>
                <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-green-600">{issues.filter((i) => i.Status == 1).length}</p>
                  <p className="text-xs text-green-600 font-semibold">Resolved</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Subject</label>
                  <input type="text" required value={form.subject}
                    placeholder="Brief description of your issue..."
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Description</label>
                  <textarea rows={5} required value={form.message}
                    placeholder="Provide detailed information about your issue..."
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Submitting...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Submit Ticket</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tickets list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900 text-lg">
                My Tickets
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{issues.length}</span>
              </h2>
            </div>

            {issues.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-14 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-700 font-bold mb-1">No Support Tickets</p>
                <p className="text-gray-400 text-sm">All good! Submit a ticket if you need help.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue, idx) => (
                  <div key={issue.id || idx}
                    className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    {/* Status bar */}
                    <div className={`h-1 w-full ${issue.Status == 1 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${issue.Status == 1 ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {issue.Status == 1 ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm">{issue.Subject}</p>
                            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${issue.Status == 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {issue.Status == 1 ? '✓ Resolved' : '⏳ Pending'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{issue.IssueDesc}</p>

                          {issue.AdminRemarks && (
                            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                                  </svg>
                                </div>
                                <p className="text-xs text-blue-700 font-bold">Admin Response</p>
                              </div>
                              <p className="text-xs text-blue-600 leading-relaxed">{issue.AdminRemarks}</p>
                            </div>
                          )}
                          <p className="text-gray-300 text-[10px] mt-2">Ticket # {String(issue.id || idx + 1).padStart(3, '0')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
