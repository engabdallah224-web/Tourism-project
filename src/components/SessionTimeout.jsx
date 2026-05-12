import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IDLE_MINUTES = 30;
const WARN_SECONDS = 60; // warn 60s before logout

export default function SessionTimeout() {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null); // null = no warning
  const timerRef  = useRef(null);
  const countRef  = useRef(null);

  const isLoggedIn = !!(user || admin);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    clearInterval(countRef.current);
    setCountdown(null);

    if (!isLoggedIn) return;

    timerRef.current = setTimeout(() => {
      // Start countdown warning
      setCountdown(WARN_SECONDS);
      countRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countRef.current);
            // Auto logout
            if (user)  { logoutUser();  navigate('/login'); }
            if (admin) { logoutAdmin(); navigate('/admin'); }
            return null;
          }
          return c - 1;
        });
      }, 1000);
    }, (IDLE_MINUTES * 60 - WARN_SECONDS) * 1000);
  };

  useEffect(() => {
    if (!isLoggedIn) { clearTimeout(timerRef.current); clearInterval(countRef.current); setCountdown(null); return; }
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearInterval(countRef.current);
    };
  }, [isLoggedIn]); // eslint-disable-line

  if (countdown === null) return null;

  const handleStay = () => {
    clearInterval(countRef.current);
    setCountdown(null);
    resetTimer();
  };

  const handleLogout = () => {
    clearInterval(countRef.current);
    setCountdown(null);
    if (user)  { logoutUser();  navigate('/login'); }
    if (admin) { logoutAdmin(); navigate('/admin'); }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-fade-in">
        <div className="text-5xl mb-3">⏱</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Still there?</h2>
        <p className="text-gray-500 text-sm mb-1">Your session will expire due to inactivity.</p>
        <p className="text-3xl font-bold text-red-500 my-4">{countdown}s</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleStay}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Stay Logged In
          </button>
          <button
            onClick={handleLogout}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
