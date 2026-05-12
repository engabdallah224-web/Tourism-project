import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PageLoader } from '../components/Spinner';
import {
  GlobeAltIcon, TicketIcon, EnvelopeIcon, ChatBubbleLeftRightIcon,
  ArrowRightIcon, UserCircleIcon, ClockIcon, CheckCircleIcon,
  ExclamationCircleIcon, SparklesIcon, CalendarDaysIcon, MapPinIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const userEmail = user?.UserEmail || user?.email;
    if (!userEmail) {
      setLoading(false);
      return;
    }
    getUserDashboard(userEmail)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen"><Navbar /><PageLoader /></div>;

  const stats = data?.stats || {};
  const activities = data?.recentActivity || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* ── HERO / WELCOME ── */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-48 text-white">
        <div className="absolute inset-0 -z-10 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900" />
        </div>

        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl overflow-hidden shadow-2xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-16 h-16 text-indigo-200" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight">Welcome back, {user?.displayName || 'Traveler'}!</h1>
              <p className="text-indigo-200 mt-1.5 font-medium">{user?.email}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3 text-xs font-bold uppercase tracking-widest">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-sm">Verified Account</span>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full backdrop-blur-sm">Premium Member</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="flex-1 -mt-32 relative z-10 mx-auto max-w-7xl w-full px-6 pb-20">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.totalBookings,   icon: GlobeAltIcon, color: 'text-blue-600',   bg: 'bg-blue-50',   link: '/tour-history' },
            { label: 'Open Issues',    value: stats.openIssues,      icon: ExclamationCircleIcon, color: 'text-rose-600',   bg: 'bg-rose-50',   link: '/issue-tickets' },
            { label: 'Active Enquiries',value: stats.totalEnquiries, icon: EnvelopeIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/enquiry' },
            { label: 'Confirmed Tours', value: stats.confirmedBookings, icon: CheckCircleIcon, color: 'text-emerald-600',bg: 'bg-emerald-50',link: '/tour-history' },
          ].map((s, i) => (
            <Link to={s.link} key={i} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className="text-4xl font-black text-slate-900 mb-1">{s.value || 0}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                VIEW DETAILS <ArrowRightIcon className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
                </div>
                <Link to="/tour-history" className="text-xs font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full uppercase tracking-wider">View All</Link>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                    <SparklesIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold">No recent activities found.</p>
                  <p className="text-xs text-slate-300 mt-1">Your travel journey starts here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        a.type === 'booking' ? 'bg-blue-50' : a.type === 'issue' ? 'bg-rose-50' : 'bg-emerald-50'
                      }`}>
                        {a.type === 'booking' ? <TicketIcon className="w-6 h-6 text-blue-500" /> : 
                         a.type === 'issue'   ? <ChatBubbleLeftRightIcon className="w-6 h-6 text-rose-500" /> : 
                                                <EnvelopeIcon className="w-6 h-6 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-800 truncate">
                            {a.type === 'booking' ? `Booked ${a.PackageName}` : 
                             a.type === 'issue'   ? `Reported Issue: ${a.Subject || a.type}` : 
                                                    `Sent Enquiry`}
                          </p>
                          <span className="text-[10px] font-black text-slate-300 whitespace-nowrap uppercase">RECENT</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            a.type === 'booking' ? 'text-blue-600 bg-blue-50' : 
                            a.type === 'issue'   ? 'text-rose-600 bg-rose-50' : 
                                                   'text-emerald-600 bg-emerald-50'
                          }`}>
                            {a.type}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <CalendarDaysIcon className="w-3 h-3" /> {new Date(a.createdAt?.seconds * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link to={a.type === 'booking' ? '/tour-history' : a.type === 'issue' ? '/issue-tickets' : '/enquiry'} 
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR / QUICK LINKS */}
          <div className="space-y-6">
            
            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { to: '/packages',        label: 'Book a New Tour',   icon: GlobeAltIcon, color: 'text-blue-600',   bg: 'bg-blue-50' },
                  { to: '/issue-tickets',   label: 'Report a Problem',  icon: ChatBubbleLeftRightIcon, color: 'text-rose-600',   bg: 'bg-rose-50' },
                  { to: '/enquiry',         label: 'Ask a Question',    icon: EnvelopeIcon, color: 'text-emerald-600',bg: 'bg-emerald-50' },
                  { to: '/profile',         label: 'Update Profile',    icon: UserCircleIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((l, i) => (
                  <Link to={l.to} key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${l.bg}`}>
                      <l.icon className={`w-5 h-5 ${l.color}`} />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{l.label}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-auto text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            {/* UPCOMING TIP */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                <SparklesIcon className="w-8 h-8 text-indigo-200 mb-4 animate-float" />
                <h3 className="text-xl font-black mb-2 leading-tight">Ready for your next adventure?</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6">Check out our latest premium packages for 2026. Discover hidden gems and save more.</p>
                <Link to="/packages" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                  Browse Now <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
