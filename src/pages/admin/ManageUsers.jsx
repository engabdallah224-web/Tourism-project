import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmModal from '../../components/ConfirmModal';
import { PageLoader } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
  'from-green-500 to-emerald-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600',
];

function Avatar({ name }) {
  const initials = name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  const color = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function ManageUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const fetchUsers = () => {
    getUsers()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = (id) => {
    setConfirm({ id, message: 'This user account will be permanently deleted.' });
  };

  const doDelete = async () => {
    const id = confirm.id;
    setConfirm(null);
    try {
      await deleteUser(id);
      toast.success('User deleted.');
      fetchUsers();
    } catch { toast.error('Delete failed.'); }
  };

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const pageUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black">Manage Users</h1>
              <p className="text-blue-100 text-sm">{users.length} registered users</p>
            </div>
          </div>
        </div>

        {loading ? <PageLoader /> : (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {['#', 'User', 'Email', 'Mobile', 'Action'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.FullName} />
                          <span className="font-semibold text-gray-800">{u.FullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.EmailId}</td>
                      <td className="px-5 py-4 text-gray-500">{u.MobileNumber}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleDelete(u.id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <EmptyState title="No users found." description="No registered users yet." />}
            {users.length > 0 && <div className="p-4 border-t border-gray-100"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>}
          </div>
        )}
      </main>
    </div>
  );
}
