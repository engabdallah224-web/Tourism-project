import { useEffect, useState, useMemo } from 'react';
import { getBookings, confirmBooking, cancelBooking, updateBooking, deleteBooking } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmModal from '../../components/ConfirmModal';
import { PageLoader } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

const STATUS_MAP = {
  0: { label: 'Pending',   dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',  icon: '⏳' },
  1: { label: 'Confirmed', dot: 'bg-green-500',   badge: 'bg-green-100 text-green-700',  icon: '✅' },
  2: { label: 'Cancelled', dot: 'bg-red-400',     badge: 'bg-red-100 text-red-600',      icon: '❌' },
};

const FILTERS = ['All', 'Pending', 'Confirmed', 'Cancelled'];
const PAGE_SIZE = 8;

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ booking, onClose, onSave }) {
  const [form, setForm] = useState({
    status:   booking.status,
    UserEmail: booking.UserEmail || '',
    PackageName: booking.PackageName || '',
    FromDate: booking.FromDate || '',
    ToDate:   booking.ToDate   || '',
    Comment:  booking.Comment  || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(booking.BookingId, { ...form, status: Number(form.status) });
    setSaving(false);
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h2 className="text-xl font-black">✏️ Edit Booking</h2>
          <p className="text-blue-100 text-sm mt-0.5">Update booking details</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Status select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inp}
            >
              <option value={0}>⏳ Pending</option>
              <option value={1}>✅ Confirmed</option>
              <option value={2}>❌ Cancelled</option>
            </select>
          </div>

          {/* User Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">User Email</label>
            <input type="email" value={form.UserEmail}
              onChange={(e) => setForm({ ...form, UserEmail: e.target.value })}
              className={inp} />
          </div>

          {/* Package Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Package Name</label>
            <input type="text" value={form.PackageName}
              onChange={(e) => setForm({ ...form, PackageName: e.target.value })}
              className={inp} />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">From Date</label>
              <input type="date" value={form.FromDate}
                onChange={(e) => setForm({ ...form, FromDate: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">To Date</label>
              <input type="date" value={form.ToDate}
                onChange={(e) => setForm({ ...form, ToDate: e.target.value })}
                className={inp} />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comment</label>
            <textarea rows={2} value={form.Comment}
              onChange={(e) => setForm({ ...form, Comment: e.target.value })}
              className={inp} />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 text-sm shadow-lg shadow-blue-500/25">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ManageBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [confirm, setConfirm]     = useState(null);
  const [editItem, setEditItem]   = useState(null);
  const [filter, setFilter]       = useState('All');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const toast = useToast();

  const fetchBookings = () => {
    getBookings()
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  // Filter + search
  const displayed = useMemo(() => {
    let list = [...bookings];
    if (filter === 'Pending')   list = list.filter(b => Number(b.status) === 0);
    if (filter === 'Confirmed') list = list.filter(b => Number(b.status) === 1);
    if (filter === 'Cancelled') list = list.filter(b => Number(b.status) === 2);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        (b.UserEmail    || '').toLowerCase().includes(q) ||
        (b.PackageName  || '').toLowerCase().includes(q) ||
        (b.UserName     || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, search]);

  const totalPages   = Math.ceil(displayed.length / PAGE_SIZE);
  const pageBookings = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Counts
  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => Number(b.status) === 0).length,
    confirmed: bookings.filter(b => Number(b.status) === 1).length,
    cancelled: bookings.filter(b => Number(b.status) === 2).length,
  };

  // Actions
  const handleQuickStatus = (action, id) => {
    const msg = action === 'confirm' ? 'Confirm this booking?' : 'Cancel this booking?';
    setConfirm({ action, id, message: msg });
  };

  const doAction = async () => {
    const { action, id } = confirm;
    setConfirm(null);
    try {
      if (action === 'confirm') await confirmBooking(id);
      if (action === 'cancel')  await cancelBooking(id, 'a');
      if (action === 'delete')  await deleteBooking(id);
      toast.success(
        action === 'confirm' ? 'Booking confirmed.' :
        action === 'cancel'  ? 'Booking cancelled.' : 'Booking deleted.'
      );
      fetchBookings();
    } catch { toast.error('Action failed.'); }
  };

  const handleEdit = async (id, data) => {
    try {
      await updateBooking(id, data);
      toast.success('Booking updated.');
      setEditItem(null);
      fetchBookings();
    } catch { toast.error('Update failed.'); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      {confirm && <ConfirmModal message={confirm.message} onConfirm={doAction} onCancel={() => setConfirm(null)} />}
      {editItem && <EditModal booking={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} />}

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">📋</div>
              <div>
                <h1 className="text-2xl font-black">Manage Bookings</h1>
                <p className="text-blue-100 text-sm">{bookings.length} total bookings in Firebase</p>
              </div>
            </div>
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user or package..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 text-sm">🔍</span>
            </div>
          </div>
        </div>

        {/* Stats + Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: 'All',       label: 'All',       count: counts.all,       color: 'from-slate-600 to-slate-700' },
            { key: 'Pending',   label: '⏳ Pending',   count: counts.pending,   color: 'from-amber-500 to-orange-500' },
            { key: 'Confirmed', label: '✅ Confirmed', count: counts.confirmed, color: 'from-green-500 to-emerald-600' },
            { key: 'Cancelled', label: '❌ Cancelled', count: counts.cancelled, color: 'from-red-500 to-rose-600' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                filter === f.key
                  ? `bg-gradient-to-r ${f.color} text-white scale-105 shadow-lg`
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-200 hover:shadow-md'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                filter === f.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? <PageLoader /> : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {['#', 'User', 'Package', 'Dates', 'Comment', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageBookings.map((b, i) => {
                    const s = STATUS_MAP[Number(b.status)] || STATUS_MAP[0];
                    return (
                      <tr key={b.BookingId} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-4 py-4 text-gray-400 text-xs font-mono">{(page - 1) * PAGE_SIZE + i + 1}</td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                              {(b.UserEmail || b.UserName || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-xs truncate max-w-[150px]">{b.UserName || '—'}</p>
                              <p className="text-gray-400 text-[11px] truncate max-w-[150px]">{b.UserEmail || '—'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-bold text-gray-800 text-xs">{b.PackageName || '—'}</p>
                          {b.PackageLocation && b.PackageLocation !== '—' && (
                            <p className="text-gray-400 text-[11px]">📍 {b.PackageLocation}</p>
                          )}
                          {b.PackagePrice > 0 && (
                            <p className="text-green-600 font-bold text-[11px]">$ {Number(b.PackagePrice).toLocaleString()}</p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-xs whitespace-nowrap">
                          {b.FromDate && b.FromDate !== '—' ? (
                            <>
                              <div className="text-gray-700 font-medium">{b.FromDate}</div>
                              <div className="text-gray-400">→ {b.ToDate}</div>
                            </>
                          ) : <span className="text-gray-300">—</span>}
                        </td>

                        <td className="px-4 py-4 text-gray-500 max-w-[120px] truncate text-xs">
                          {b.Comment || <span className="text-gray-300">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {Number(b.status) === 0 && (
                              <button onClick={() => handleQuickStatus('confirm', b.BookingId)}
                                className="bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition">
                                ✅ Confirm
                              </button>
                            )}
                            {Number(b.status) !== 2 && (
                              <button onClick={() => handleQuickStatus('cancel', b.BookingId)}
                                className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition">
                                ❌ Cancel
                              </button>
                            )}
                            <button onClick={() => setEditItem(b)}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition">
                              ✏️ Edit
                            </button>
                            <button onClick={() => setConfirm({ action: 'delete', id: b.BookingId, message: 'Delete this booking permanently?' })}
                              className="bg-red-100 text-red-600 hover:bg-red-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {displayed.length === 0 && (
              <EmptyState
                title={search ? 'No results found.' : `No ${filter !== 'All' ? filter.toLowerCase() : ''} bookings.`}
                description={search ? 'Try a different search term.' : 'Bookings will appear here once users make reservations.'}
              />
            )}

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
