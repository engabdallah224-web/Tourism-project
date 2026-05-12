import { useEffect, useState } from 'react';
import { getUserBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { PageLoader } from '../components/Spinner';
import Pagination from '../components/Pagination';

const STATUS = {
  0: { label: 'Pending',   color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400'  },
  1: { label: 'Confirmed', color: 'bg-green-100 text-green-700',    dot: 'bg-green-500'  },
  2: { label: 'Cancelled', color: 'bg-red-100 text-red-500',        dot: 'bg-red-400'    },
};

export default function TourHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [confirm, setConfirm]   = useState(null);
  const [page, setPage]         = useState(1);
  const toast = useToast();
  const PAGE_SIZE = 8;

  const userEmail = user?.UserEmail || user?.email;

  const fetchBookings = () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    getUserBookings(userEmail)
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const handleCancel = (id) => setConfirm({ message: 'Are you sure you want to cancel this booking?', id });
  const handlePrint  = () => window.print();

  const totalPages   = Math.ceil(bookings.length / PAGE_SIZE);
  const pageBookings = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const doCancel = async () => {
    try {
      await cancelBooking(confirm.id, 'u');
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking.');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />
      {confirm && <ConfirmModal message={confirm.message} onConfirm={doCancel} onCancel={() => setConfirm(null)} />}

      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your Travel Records
            </div>
            <h1 className="text-4xl font-black text-white">My Bookings</h1>
            <p className="text-blue-200 mt-1.5 text-sm">Track all your tours and travel history in one place</p>
          </div>
          {bookings.length > 0 && (
            <button onClick={handlePrint}
              className="no-print inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Summary
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        {loading ? (
          <PageLoader />
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-400 text-sm mb-6 text-center max-w-xs">You have not booked any tours yet. Start exploring our amazing packages!</p>
            <a href="/packages" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition">
              Browse Packages
            </a>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Trips',  count: bookings.length,                                        icon: '🌍', col: 'from-blue-500 to-indigo-600'    },
                { label: 'Confirmed',    count: bookings.filter(b => String(b.status) === '1').length,   icon: '✅', col: 'from-green-500 to-emerald-600'   },
                { label: 'Pending',      count: bookings.filter(b => String(b.status) === '0').length,   icon: '⏳', col: 'from-amber-400 to-orange-500'    },
                { label: 'Cancelled',    count: bookings.filter(b => String(b.status) === '2').length,   icon: '❌', col: 'from-red-400 to-rose-500'         },
              ].map((s) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.col} text-white rounded-2xl p-5 text-center shadow-lg`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className="text-3xl font-black">{s.count}</p>
                  <p className="text-xs font-semibold opacity-90 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Booking cards */}
            <div id="print-area" className="space-y-4">
              {pageBookings.map((b, i) => {
                const st = STATUS[b.status] || STATUS[0];
                return (
                  <div key={b.BookingId}
                    className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in`}
                    style={{ animationDelay: `${Math.min(i * 80, 320)}ms` }}>
                    {/* Status colour bar */}
                    <div className={`h-1.5 w-full ${
                      b.status == 1 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      b.status == 2 ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                      'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`} />
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          b.status == 1 ? 'bg-gradient-to-br from-green-100 to-emerald-100' :
                          b.status == 2 ? 'bg-gradient-to-br from-red-100 to-rose-100' :
                          'bg-gradient-to-br from-amber-100 to-orange-100'
                        }`}>
                          <svg className={`w-7 h-7 ${
                            b.status == 1 ? 'text-green-500' : b.status == 2 ? 'text-red-400' : 'text-amber-500'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="font-bold text-gray-900 text-base truncate">{b.PackageName}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {b.FromDate} → {b.ToDate}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                  🎫 #{b.BookingId}
                                </span>
                              </div>
                              {b.Comment && (
                                <p className="text-gray-400 text-xs italic mt-2 border-l-2 border-gray-200 pl-2">&ldquo;{b.Comment}&rdquo;</p>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${st.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                {st.label}
                              </span>
                              {b.status == 0 && (
                                <button onClick={() => handleCancel(b.BookingId)}
                                  className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-semibold">
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
