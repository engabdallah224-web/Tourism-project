import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { getEnquiries } from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [enquiryCount, setEnquiryCount]   = useState(0);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [toasts, setToasts]               = useState([]);   // slide-in popups
  const prevCountRef                      = useRef(null);
  const seenRef                           = useRef(null);   // last seen count (localStorage)

  // Load last seen from localStorage
  useEffect(() => {
    const stored = parseInt(localStorage.getItem('tms_seen_enquiries') || '0', 10);
    seenRef.current = stored;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(t => t.filter(n => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    localStorage.setItem('tms_seen_enquiries', String(enquiryCount));
    seenRef.current = enquiryCount;
    setUnreadCount(0);
  }, [enquiryCount]);

  // Poll every 15 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res  = await getEnquiries();
        const data = Array.isArray(res.data) ? res.data : [];
        const total = data.length;

        setEnquiryCount(total);

        // First load — just set baseline
        if (prevCountRef.current === null) {
          prevCountRef.current = total;
          const seen = seenRef.current ?? total;
          setUnreadCount(Math.max(0, total - seen));
          return;
        }

        // New enquiries arrived
        if (total > prevCountRef.current) {
          const diff = total - prevCountRef.current;
          prevCountRef.current = total;
          setUnreadCount(u => u + diff);

          // Get the newest enquiry for the popup
          const newest = data[data.length - 1];
          const toastId = Date.now();
          setToasts(t => [
            ...t,
            {
              id: toastId,
              name: newest?.FullName || newest?.name || 'Someone',
              subject: newest?.Subject || newest?.subject || 'New enquiry',
            },
          ]);

          // Auto-dismiss after 6 seconds
          setTimeout(() => dismissToast(toastId), 6000);
        } else {
          prevCountRef.current = total;
        }
      } catch { /* silent */ }
    };

    poll();
    const timer = setInterval(poll, 15000);
    return () => clearInterval(timer);
  }, [dismissToast]);

  return (
    <NotificationContext.Provider value={{ unreadCount, enquiryCount, markAllRead, toasts, dismissToast }}>
      {children}

      {/* ── Slide-in toast notifications (top-right) ── */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-gray-900 border border-white/10 rounded-2xl px-5 py-4 shadow-2xl shadow-black/40 min-w-[300px] max-w-sm animate-slide-in-right"
          >
            {/* Icon */}
            <div className="w-10 h-10 flex-shrink-0 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-0.5">New Enquiry</p>
              <p className="text-white font-bold text-sm truncate">{toast.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{toast.subject}</p>
            </div>
            {/* Close */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-500 hover:text-white transition ml-1 flex-shrink-0 mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
