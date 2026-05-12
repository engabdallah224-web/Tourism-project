import { useEffect, useState } from 'react';
import { getIssues, updateIssue, deleteIssue } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmModal from '../../components/ConfirmModal';
import { PageLoader } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

export default function ManageIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const fetchIssues = () => {
    getIssues()
      .then((res) => setIssues(res.data.issues || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleResolve = async (id) => {
    try {
      await updateIssue(id, { status: 1, remarks: remarks[id] || '' });
      toast.success('Issue marked as resolved.');
      fetchIssues();
    } catch { toast.error('Action failed.'); }
  };

  const handleDelete = (id) => {
    setConfirm({ id, message: 'This issue will be permanently deleted.' });
  };

  const doDelete = async () => {
    const id = confirm.id;
    setConfirm(null);
    try {
      await deleteIssue(id);
      toast.success('Issue deleted.');
      fetchIssues();
    } catch { toast.error('Delete failed.'); }
  };

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(issues.length / PAGE_SIZE);
  const pageIssues = issues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <AdminSidebar />
      {confirm && <ConfirmModal message={confirm.message} onConfirm={doDelete} onCancel={() => setConfirm(null)} />}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black">Manage Issues</h1>
              <p className="text-blue-100 text-sm">{issues.length} total support tickets</p>
            </div>
          </div>
        </div>

        {loading ? <PageLoader /> : (
          <div className="space-y-4">
            {issues.length === 0 && <EmptyState title="No issues found." description="No support tickets have been raised." />}
            {pageIssues.map((issue, i) => (
              <div key={issue.id} className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400 font-medium">#{(page - 1) * PAGE_SIZE + i + 1}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        issue.Status == 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${issue.Status == 1 ? 'bg-green-500' : 'bg-yellow-400'}`} />
                        {issue.Status == 1 ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800 text-base mb-1">{issue.Subject}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{issue.IssueDesc}</p>
                    <p className="text-xs text-gray-400 mt-2">Submitted by: <span className="text-gray-600">{issue.UserEmail}</span></p>
                    {issue.AdminRemarks && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                        <p className="text-xs font-bold text-blue-700 mb-0.5 uppercase tracking-wide">Admin Response</p>
                        <p className="text-sm text-blue-600">{issue.AdminRemarks}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="shrink-0 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
                {issue.Status == 0 && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder="Type admin remarks (optional)..."
                      value={remarks[issue.id] || ''}
                      onChange={(e) => setRemarks({ ...remarks, [issue.id]: e.target.value })}
                      className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                    />
                    <button
                      onClick={() => handleResolve(issue.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-green-500/25 hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all whitespace-nowrap"
                    >
                      ✓ Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
            {issues.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
          </div>
        )}
      </main>
    </div>
  );
}
