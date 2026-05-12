import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackage, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PackageDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fromdate: '', todate: '', comment: '' });
  const [booking, setBooking] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getPackage(id)
      .then((res) => setPkg(res.data.package))
      .catch(() => toast.error('Package not found'))
      .finally(() => setLoading(false));
  }, [id]);  // eslint-disable-line

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    try {
      await createBooking({
        packageId:       id,
        PackageName:     pkg.PackageName     || '',
        PackageLocation: pkg.PackageLocation || '',
        PackagePrice:    pkg.PackagePrice    || 0,
        PackageType:     pkg.PackageType     || '',
        UserEmail:       user.UserEmail      || user.email || '',
        UserName:        user.UserName       || user.name  || '',
        FromDate:        form.fromdate,
        ToDate:          form.todate,
        Comment:         form.comment,
      });
      toast.success('Booked successfully! We will confirm your booking soon.');
      setForm({ fromdate: '', todate: '', comment: '' });
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-white text-xl">
      Package not found
    </div>
  );

  const inputCls = 'w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      {/* Hero image + overlay */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={pkg.PackageImage?.startsWith('http') ? pkg.PackageImage : `http://localhost/tms/admin/pacakgeimages/${pkg.PackageImage}`}
          alt={pkg.PackageName}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/1200x400/1e3a5f/white?text=Tour+Package'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm mb-3 inline-block">
                {pkg.PackageType}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{pkg.PackageName}</h1>
              <p className="text-white font-bold mt-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {pkg.PackageLocation}
              </p>
            </div>
            <div className="bg-green-500 text-white px-6 py-2 rounded-2xl shadow-xl text-xl font-black">
              $ {pkg.PackagePrice?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Package Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Quick info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pkg.PackageDays && (
                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.93 5.93m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414m12.728 0l-1.414-1.414" />
                    </svg>
                  </div>
                  <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Duration</p><p className="font-black text-gray-900 text-sm">{pkg.PackageDays} Days</p></div>
                </div>
              )}
              {pkg.PackageNights && (
                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Nights</p><p className="font-black text-gray-900 text-sm">{pkg.PackageNights} Nights</p></div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Type</p><p className="font-black text-gray-900 text-sm truncate">{pkg.PackageType}</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-yellow-500/25 shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div><p className="text-[10px] text-gray-400 font-semibold uppercase">Rating</p><p className="font-black text-gray-900 text-sm">4.9 / 5.0</p></div>
              </div>
            </div>

            {/* Features */}
            {pkg.PackageFetures && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pkg.PackageFetures.split(',').map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-4 py-3 hover:shadow-sm transition">
                      <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/25">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{f.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {pkg.PackageDescription && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-3">About this Package</h3>
                <p className="text-black font-medium text-sm leading-relaxed">{pkg.PackageDescription}</p>
              </div>
            )}

            {/* Itinerary */}
            {pkg.PackageDetails && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-3">Itinerary & Details</h3>
                <p className="text-black font-medium text-sm leading-relaxed">{pkg.PackageDetails}</p>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-7 sticky top-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Book Now</h2>
                  <p className="text-xs text-gray-400">Secure your spot today</p>
                </div>
              </div>

              {/* Price display */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-5 text-center">
                <p className="text-xs text-black font-bold">Package Price</p>
                <p className="text-3xl font-black text-green-600">$ {pkg.PackagePrice?.toLocaleString()}</p>
                <p className="text-xs text-gray-400">per person</p>
              </div>

              {!user ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-black text-sm mb-4 font-bold">Sign in to book this package</p>
                  <button onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/25">
                    Login to Book
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">From Date</label>
                    <input type="date" required value={form.fromdate}
                      onChange={(e) => setForm({ ...form, fromdate: e.target.value })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">To Date</label>
                    <input type="date" required value={form.todate}
                      onChange={(e) => setForm({ ...form, todate: e.target.value })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Special Requests</label>
                    <textarea rows={3} value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Any dietary needs, accessibility, etc."
                      className={inputCls} />
                  </div>
                  <button type="submit" disabled={booking}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                    {booking ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Booking...</>
                    ) : 'Confirm Booking →'}
                  </button>
                  <p className="text-center text-xs text-gray-400">Free cancellation within 24 hours</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}