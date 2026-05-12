import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { BellIcon, SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const links = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/admin/manage-bookings',
    label: 'Manage Bookings',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/admin/manage-packages',
    label: 'Manage Packages',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    to: '/admin/create-package',
    label: 'Create Package',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/admin/manage-users',
    label: 'Manage Users',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/manage-enquiries',
    label: 'Manage Enquiries',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/manage-issues',
    label: 'Manage Issues',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/profile',
    label: 'Profile',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    to: '/admin/change-password',
    label: 'Change Password',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { unreadCount, markAllRead } = useNotifications();

  const handleBell = () => {
    markAllRead();
    navigate('/admin/manage-enquiries');
  };

  return (
    <aside className={`w-64 min-h-screen ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex flex-col transition-colors`}>
      {/* Header */}
      <div className={`bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-5 flex items-center gap-3 ${dark ? '' : 'text-white'}`}>
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner">✈</div>
        <div>
          <p className="font-black text-white text-base leading-none">TMS Admin</p>
          <p className="text-blue-200/70 text-xs mt-0.5">Management Panel</p>
        </div>
        <button
          className="ml-auto p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          onClick={() => setDark((d) => !d)}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-blue-900" />}
        </button>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="relative">
          <button onClick={() => setProfileOpen((v) => !v)} className="focus:outline-none">
            <UserCircleIcon className="w-9 h-9 text-blue-200" />
          </button>
          {profileOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-xl shadow-lg z-20">
              <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link to="/admin/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
              <button onClick={() => { logoutAdmin(); navigate('/admin'); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
        <div className="ml-auto relative">
          <button onClick={handleBell} className="relative" title="New Enquiries">
            <BellIcon className="w-6 h-6 text-blue-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map((l) => {
          const active = pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                active
                  ? 'bg-blue-600/30 text-blue-200 border-l-2 border-blue-400 pl-2.5 font-semibold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
              }`}
            >
              <span className={active ? 'text-blue-300' : 'text-gray-500'}>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => { logoutAdmin(); navigate('/admin'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
