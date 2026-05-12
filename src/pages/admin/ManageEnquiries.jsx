import { useEffect, useState } from 'react';
import { getEnquiries, deleteEnquiry, replyEnquiry } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmModal from '../../components/ConfirmModal';
import { PageLoader } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [confirm, setConfirm]     = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText]   = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const fetchEnquiries = () => {
    getEnquiries()
      .then((res) => {
        // Sort by newest first
        const data = res.data.enquiries || [];
        data.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setEnquiries(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleDelete = (id) => {
    setConfirm({ id, message: 'Ma hubtaa inaad tirtirto fariintan? Laguma soo celin karo.' });
  };

  const doDelete = async () => {
    const id = confirm.id;
    setConfirm(null);
    try {
      await deleteEnquiry(id);
      toast.success('Fariintii waa la tirtiray.');
      fetchEnquiries();
    } catch { toast.error('Tirtiristu way fashilantay.'); }
  };

  const openReplyModal = (enquiry) => {
    setReplyModal(enquiry);
    setReplyText(enquiry.AdminReply || 'Wa la xaliyay macmiil. Waad ku mahadsantahay xiriirkaaga.');
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error('Fadlan qor jawaabta.');
    setReplyLoading(true);
    try {
      await replyEnquiry(replyModal.id, replyText);
      toast.success('Jawaabtii waa la diray!');
      setReplyModal(null);
      fetchEnquiries();
    } catch {
      toast.error('Jawaabta diristu way fashilantay.');
    } finally {
      setReplyLoading(false);
    }
  };

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(enquiries.length / PAGE_SIZE);
  const pageEnquiries = enquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {confirm && <ConfirmModal message={confirm.message} onConfirm={doDelete} onCancel={() => setConfirm(null)} />}

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-reply text-lg" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">U jawaab Macmiilka</h3>
                  <p className="text-xs text-slate-500">{replyModal.FullName}</p>
                </div>
              </div>
              <button onClick={() => setReplyModal(null)} className="text-gray-400 hover:text-gray-600 transition">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fariinta Macmiilka:</p>
                <p className="text-sm text-slate-700 italic">"{replyModal.Message}"</p>
              </div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Jawaabtaada (Reply):</label>
              <textarea 
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
                placeholder="Qor jawaabta halkan..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setReplyModal(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
              >
                Ka laabo
              </button>
              <button 
                onClick={handleReply}
                disabled={replyLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                {replyLoading ? <i className="fa-solid fa-spinner animate-spin" /> : <i className="fa-solid fa-paper-plane" />}
                Dir Jawaabta
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <i className="fa-solid fa-envelope-open-text text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Enquiries</h1>
              <p className="text-slate-500 text-sm">Halkan kala soco fariimaha ka imaanaya macaamiisha.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 font-black text-lg">{enquiries.length}</span>
              <span className="text-emerald-600 text-xs font-bold ml-1 uppercase">Total</span>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
              <span className="text-amber-700 font-black text-lg">{enquiries.filter(e => !e.AdminReply).length}</span>
              <span className="text-amber-600 text-xs font-bold ml-1 uppercase">Pending</span>
            </div>
          </div>
        </div>

        {loading ? <PageLoader /> : (
          <div className="space-y-4">
            {enquiries.length === 0 && (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                <i className="fa-solid fa-inbox text-5xl text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Fariimo wali ma jiraan.</h3>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              {pageEnquiries.map((e, i) => (
                <div key={e.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    
                    {/* User Info Sidebar */}
                    <div className="lg:w-64 shrink-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xl font-bold">
                          {e.FullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 truncate">{e.FullName}</h4>
                          <p className="text-xs text-gray-400 font-bold truncate uppercase tracking-tighter">{e.status || 'Pending'}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-xl">
                          <i className="fa-solid fa-envelope text-emerald-500 w-4" />
                          <span className="truncate">{e.EmailId || e.UserEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-xl">
                          <i className="fa-solid fa-phone text-emerald-500 w-4" />
                          <span>{e.MobileNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">Subject</span>
                          <h3 className="font-bold text-slate-800">{e.Subject || 'General Inquiry'}</h3>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{e.Message}</p>
                        </div>
                      </div>

                      {e.AdminReply && (
                        <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl relative">
                          <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Jawaabta Admin
                          </div>
                          <p className="text-emerald-800 text-sm italic">"{e.AdminReply}"</p>
                          <p className="text-[10px] text-emerald-600 mt-2 font-bold uppercase">Xaalada: Resolved</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-32 flex lg:flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => openReplyModal(e)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition shadow-sm ${
                          e.AdminReply 
                            ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                        }`}
                      >
                        <i className="fa-solid fa-reply" />
                        {e.AdminReply ? 'Edit' : 'Reply'}
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-2xl text-sm font-bold transition shadow-sm"
                      >
                        <i className="fa-solid fa-trash-can" />
                        Delete
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {enquiries.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
