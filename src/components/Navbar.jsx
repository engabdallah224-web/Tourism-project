
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const { user, logoutUser } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLink = (to, label) => (
    <Link
      key={to}
      to={to}
      onClick={() => setOpen(false)}
      className={`relative pb-0.5 px-1.5 transition-all duration-200 font-semibold ${
        pathname === to
          ? 'text-yellow-300 border-b-2 border-yellow-300'
          : 'text-gray-200 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-40 ${dark ? 'bg-gray-900 text-white' : 'text-white'} border-b border-white/10 shadow-lg transition-colors`}
      style={!dark ? { backgroundColor: '#064e3b' } : {}}
    >
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <span className="text-2xl font-black tracking-tight text-yellow-300">TMS</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-7 text-base font-semibold">
          {navLink('/', t.home)}
          {navLink('/packages', t.tours)}
          {navLink('/about', t.about)}
          {navLink('/faq', t.faq)}
          {navLink('/enquiry', t.enquiry)}
          {navLink('/privacy', t.privacy)}
          {navLink('/terms', t.terms)}
        </div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          {/* Language */}
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="border border-emerald-700 text-emerald-700 px-4 py-1.5 rounded-lg font-bold bg-white hover:bg-emerald-50 transition text-sm"
          >
            <option value="en">English</option>
            <option value="so">Somali</option>
            <option value="ar">عربي</option>
          </select>
          {/* Dark/Light toggle */}
          <button
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => setDark((d) => !d)}
            title={dark ? 'Light Mode' : 'Dark Mode'}
          >
            {dark ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-white" />}
          </button>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen((v) => !v)} className="focus:outline-none">
              <UserCircleIcon className="w-8 h-8 text-white hover:text-white transition" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-lg z-20 border border-gray-100">
                {user ? (
                  <>
                    <Link to="/profile"      onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.profile}</Link>
                    <Link to="/tour-history" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.myBookings}</Link>
                    <div className="border-t border-gray-100" />
                    <button onClick={() => { logoutUser(); navigate('/login'); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm font-semibold">{t.logout}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login"    onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.signIn}</Link>
                    <Link to="/register" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.signUp}</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/20"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block w-full h-0.5 bg-white rounded transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-full h-0.5 bg-white rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-full h-0.5 bg-white rounded transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className={`md:hidden border-t border-white/10 px-5 pb-5 pt-2 flex flex-col gap-3 text-base font-semibold transition-colors`}
          style={{ backgroundColor: '#064e3b' }}
        >
          {navLink('/', t.home)}
          {navLink('/packages', t.tours)}
          {navLink('/about', t.about)}
          {navLink('/faq', t.faq)}
          {navLink('/enquiry', t.enquiry)}
          {navLink('/privacy', t.privacy)}
          {navLink('/terms', t.terms)}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="border border-emerald-700 text-emerald-700 px-4 py-1.5 rounded-lg font-bold bg-white hover:bg-emerald-50 transition text-sm"
            >
              <option value="en">English</option>
              <option value="so">Somali</option>
              <option value="ar">عربي</option>
            </select>
            <button
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-white" />}
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen((v) => !v)}>
                <UserCircleIcon className="w-8 h-8 text-white" />
              </button>
              {profileOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-lg z-20 border border-gray-100">
                  {user ? (
                    <>
                      <Link to="/profile"      onClick={() => { setProfileOpen(false); setOpen(false); }} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.profile}</Link>
                      <Link to="/tour-history" onClick={() => { setProfileOpen(false); setOpen(false); }} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.myBookings}</Link>
                      <div className="border-t border-gray-100" />
                      <button onClick={() => { logoutUser(); navigate('/login'); setOpen(false); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm font-semibold">{t.logout}</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"    onClick={() => { setProfileOpen(false); setOpen(false); }} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.signIn}</Link>
                      <Link to="/register" onClick={() => { setProfileOpen(false); setOpen(false); }} className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-semibold">{t.signUp}</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
