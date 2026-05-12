import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { PageLoader } from '../../components/Spinner';
import {
  UsersIcon, BriefcaseIcon, ClipboardDocumentListIcon,
  EnvelopeIcon, TicketIcon, ClockIcon, CheckCircleIcon,
  XCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon,
  PlusCircleIcon, ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / 30);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <span>{val}</span>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, gradient, glowColor, link, delay = 0 }) {
  return (
    <Link to={link}
      className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-400"
      style={{ background: gradient, animationDelay: `${delay}ms` }}>

      {/* Large bg icon watermark */}
      <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Icon className="w-32 h-32 text-white" />
      </div>

      {/* Top glow blob */}
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-40"
        style={{ background: glowColor }} />

      {/* Shine sweep on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)' }} />

      <div className="relative z-10">
        {/* Icon box */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <Icon className="w-7 h-7 text-white drop-shadow" />
        </div>

        {/* Value */}
        <p className="text-5xl font-black tabular-nums leading-none mb-2 drop-shadow">
          <Counter target={value ?? 0} />
        </p>

        {/* Label */}
        <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mt-1">{label}</p>

        {/* Bottom bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-white/20">
            <div className="h-1 rounded-full bg-white/60 transition-all duration-1000 group-hover:w-full"
              style={{ width: value > 0 ? '60%' : '10%' }} />
          </div>
          <ArrowTrendingUpIcon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
}

// ── Mini Stat ─────────────────────────────────────────────────────────────────
function MiniStat({ icon: Icon, label, value, iconColor, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-5 hover:shadow-md transition-shadow duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className={`text-3xl font-black ${iconColor}`}>
          <Counter target={value ?? 0} />
        </span>
      </div>
      <p className={`text-xs font-bold ${iconColor} uppercase tracking-wide opacity-80`}>{label}</p>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3">
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-black" style={{ color: p.color }}>{p.value}</p>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [time, setTime]       = useState(new Date());

  useEffect(() => {
    getDashboard()
      .then(r => setStats(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const areaData = stats ? [
    { name: 'Users',     val: stats.users },
    { name: 'Packages',  val: stats.packages },
    { name: 'Bookings',  val: stats.bookings },
    { name: 'Enquiries', val: stats.enquiries },
    { name: 'Issues',    val: stats.issues },
  ] : [];

  const pieData = stats ? [
    { name: 'Pending',   value: stats.pendingBookings,   color: '#f59e0b' },
    { name: 'Confirmed', value: stats.confirmedBookings, color: '#22c55e' },
    { name: 'Cancelled', value: stats.cancelledBookings, color: '#ef4444' },
  ].filter(d => d.value > 0) : [];

  const mainStats = stats ? [
    { icon: UsersIcon,                 label: 'Registered Users',  value: stats.users,     gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', glowColor: '#60a5fa', link: '/admin/manage-users',     delay: 0   },
    { icon: BriefcaseIcon,             label: 'Tour Packages',     value: stats.packages,  gradient: 'linear-gradient(135deg,#6366f1,#4338ca)', glowColor: '#a5b4fc', link: '/admin/manage-packages',  delay: 80  },
    { icon: ClipboardDocumentListIcon, label: 'Total Bookings',    value: stats.bookings,  gradient: 'linear-gradient(135deg,#059669,#047857)', glowColor: '#6ee7b7', link: '/admin/manage-bookings',  delay: 160 },
    { icon: EnvelopeIcon,              label: 'Enquiries',         value: stats.enquiries, gradient: 'linear-gradient(135deg,#9333ea,#7c3aed)', glowColor: '#d8b4fe', link: '/admin/manage-enquiries', delay: 240 },
    { icon: TicketIcon,                label: 'Support Issues',    value: stats.issues,    gradient: 'linear-gradient(135deg,#d97706,#b45309)', glowColor: '#fcd34d', link: '/admin/manage-issues',    delay: 320 },
  ] : [];

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">

        {/* ── HERO HEADER ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#4f46e5 50%,#7c3aed 100%)' }}>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)', backgroundSize: '28px 28px' }} />
          {/* Blobs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: '#818cf8' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: '#60a5fa' }} />

          <div className="relative px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs font-semibold">Live Firebase Connection</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-indigo-200 text-sm mt-1">Tourism Management System</p>
            </div>
            <div className="text-right animate-fade-in-right">
              <p className="text-white font-black text-3xl tabular-nums tracking-tight">
                {time.toLocaleTimeString()}
              </p>
              <p className="text-indigo-200 text-sm mt-0.5">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-16"><PageLoader /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-36 text-center px-6">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-2xl font-black text-red-500 mb-2">Cannot connect to Firebase</h2>
            <p className="text-gray-400 text-sm">Make sure the backend is running on port 5050, then refresh.</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">

            {/* ── ROW 1: MAIN STAT CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mainStats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* ── ROW 2: MINI STATUS CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MiniStat icon={ClockIcon}          label="Pending Bookings"   value={stats.pendingBookings}   iconColor="text-amber-600"  bg="bg-amber-50"   border="border-amber-200" />
              <MiniStat icon={CheckCircleIcon}    label="Confirmed Bookings" value={stats.confirmedBookings} iconColor="text-green-600"  bg="bg-green-50"   border="border-green-200" />
              <MiniStat icon={XCircleIcon}        label="Cancelled Bookings" value={stats.cancelledBookings} iconColor="text-red-500"    bg="bg-red-50"     border="border-red-200"   />
              <MiniStat icon={ExclamationTriangleIcon} label="Open Issues"   value={stats.openIssues}        iconColor="text-rose-600"   bg="bg-rose-50"    border="border-rose-200"  />
              <MiniStat icon={ShieldCheckIcon}    label="Resolved Issues"    value={stats.resolvedIssues}    iconColor="text-teal-600"   bg="bg-teal-50"    border="border-teal-200"  />
            </div>

            {/* ── ROW 3: CHARTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Area Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-800">System Overview</h2>
                    <p className="text-xs text-gray-400">All collections at a glance</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="val" name="Count"
                      stroke="#6366f1" strokeWidth={3}
                      fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-800">Booking Status</h2>
                    <p className="text-xs text-gray-400">{stats.bookings} total bookings</p>
                  </div>
                </div>
                {stats.bookings === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-300 py-8">
                    <ClipboardDocumentListIcon className="w-14 h-14 mb-3 opacity-30" />
                    <p className="text-sm font-semibold">No bookings yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%"
                        innerRadius={52} outerRadius={78} paddingAngle={5} dataKey="value">
                        {pieData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11, color: '#6b7280' }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ── ROW 4: QUICK ACTIONS ── */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <PlusCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-base font-black text-gray-800">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { to: '/admin/create-package',   icon: BriefcaseIcon,             label: 'Add Package',     grad: 'linear-gradient(135deg,#3b82f6,#4f46e5)', shadow: 'rgba(79,70,229,0.3)' },
                  { to: '/admin/manage-bookings',  icon: ClipboardDocumentListIcon, label: 'Bookings',        grad: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.3)' },
                  { to: '/admin/manage-enquiries', icon: EnvelopeIcon,              label: 'Enquiries',       grad: 'linear-gradient(135deg,#a855f7,#7c3aed)', shadow: 'rgba(168,85,247,0.3)' },
                  { to: '/admin/manage-issues',    icon: TicketIcon,                label: 'Support Issues',  grad: 'linear-gradient(135deg,#f59e0b,#ef4444)', shadow: 'rgba(245,158,11,0.3)' },
                ].map(a => (
                  <Link key={a.label} to={a.to}
                    className="group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{ background: a.grad, boxShadow: `0 8px 24px ${a.shadow}` }}>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <a.icon className="w-6 h-6 text-white" />
                    </div>
                    <span>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
