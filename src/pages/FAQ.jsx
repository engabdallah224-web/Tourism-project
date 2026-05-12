import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQS = [
  {
    category: 'Booking',
    icon: 'fa-solid fa-suitcase-rolling',
    q: 'How do I book a tour?',
    a: 'Browse our packages, select your favorite, and follow the simple booking steps. You can pay securely online and receive instant confirmation.',
  },
  {
    category: 'Booking',
    icon: 'fa-solid fa-calendar-xmark',
    q: 'Can I cancel my booking?',
    a: 'Yes! We offer free cancellation on most packages up to 48 hours before departure. See individual package details for specific cancellation policies.',
  },
  {
    category: 'Payment',
    icon: 'fa-solid fa-shield-halved',
    q: 'Is my payment secure?',
    a: 'Absolutely. All payments are processed securely using industry-standard 256-bit SSL encryption. We never store your card details.',
  },
  {
    category: 'Support',
    icon: 'fa-solid fa-headset',
    q: 'How do I contact support?',
    a: 'You can reach our support team 24/7 via the Enquiry page, by email at support@tms.com, or by calling +123 456 7890.',
  },
  {
    category: 'Booking',
    icon: 'fa-solid fa-people-group',
    q: 'Can I book for a group?',
    a: 'Yes! We offer special group rates for 10+ travelers. Contact us through the Enquiry page and our team will prepare a custom package for your group.',
  },
  {
    category: 'Payment',
    icon: 'fa-solid fa-credit-card',
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for large bookings.',
  },
  {
    category: 'Tours',
    icon: 'fa-solid fa-map-location-dot',
    q: 'What destinations do you cover?',
    a: 'We specialize in Somali regional tour packages covering all major states including Banadir, Puntland, Somaliland, Jubaland, and more.',
  },
  {
    category: 'Tours',
    icon: 'fa-solid fa-user-tie',
    q: 'Are the tours guided?',
    a: 'Most of our packages include experienced local guides. Package details will always specify whether a guide is included or optional.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero with Background Image */}
      <div className="relative pt-20 pb-44 text-white overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1800&q=85"
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-950/70" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-500/10 rounded-full px-4 py-2 text-sm font-semibold text-emerald-400 mb-6">
            <i className="fa-solid fa-circle-question text-emerald-400 animate-pulse" />
            Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
            Frequently Asked<br />
            <span className="text-emerald-400">Questions</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Everything you need to know about booking, payments, and tours. Can't find an answer?{' '}
            <a href="/enquiry" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition font-semibold">
              Contact us.
            </a>
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 -mt-12 pb-20 relative z-10">
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-300 shadow-lg shadow-emerald-100'
                    : 'border-gray-100 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                >
                  {/* Font Awesome Icon */}
                  <span className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 transition text-lg ${
                    isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-emerald-600 group-hover:bg-emerald-50'
                  }`}>
                    <i className={f.icon} />
                  </span>

                  {/* Question */}
                  <div className="flex-1 min-w-0">
                    <span className={`block text-xs font-bold uppercase tracking-widest mb-0.5 ${
                      isOpen ? 'text-emerald-500' : 'text-gray-400'
                    }`}>{f.category}</span>
                    <h2 className={`font-black text-base md:text-lg transition ${
                      isOpen ? 'text-emerald-700' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}>
                      {f.q}
                    </h2>
                  </div>

                  {/* Chevron */}
                  <i className={`fa-solid fa-chevron-down flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-300'
                  }`} />
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-0 border-t border-emerald-100">
                    <p className="text-slate-600 leading-relaxed mt-4 ml-[60px]">{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
