import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    icon: 'fa-solid fa-calendar-check',
    title: 'Booking & Availability',
    content:
      'All tour bookings are subject to availability. A booking is only confirmed once you receive a written confirmation email from TMS. We reserve the right to cancel bookings due to unforeseen circumstances and will issue a full refund in such cases.',
  },
  {
    icon: 'fa-solid fa-calendar-xmark',
    title: 'Cancellation Policy',
    content:
      'Cancellations made more than 48 hours before departure are eligible for a full refund. Cancellations within 48 hours may incur a fee of up to 20% of the booking value. Specific cancellation terms are listed on each package page.',
  },
  {
    icon: 'fa-solid fa-credit-card',
    title: 'Payment Terms',
    content:
      'Full payment is required at the time of booking unless otherwise stated. All prices are displayed in USD and are subject to change without notice until a booking is confirmed. We accept major credit cards, debit cards, and PayPal.',
  },
  {
    icon: 'fa-solid fa-user-check',
    title: 'User Responsibilities',
    content:
      'You are responsible for ensuring all booking information is accurate, including traveler names and travel dates. TMS is not liable for losses resulting from incorrect information provided at booking.',
  },
  {
    icon: 'fa-solid fa-passport',
    title: 'Travel Requirements',
    content:
      'Travelers are responsible for ensuring they hold valid travel documents (passport, visa, etc.) for their destination. TMS is not liable for denied entry or travel disruptions due to missing documentation.',
  },
  {
    icon: 'fa-solid fa-scale-balanced',
    title: 'Liability & Disputes',
    content:
      'TMS acts as an agent for tour operators and is not liable for actions, errors, or omissions of third-party suppliers. In the event of a dispute, both parties agree to seek resolution through good-faith negotiation before any legal action.',
  },
  {
    icon: 'fa-solid fa-file-pen',
    title: 'Changes to Terms',
    content:
      'TMS reserves the right to update these Terms & Conditions at any time. Changes will be communicated via our website. Continued use of our services after such changes constitutes your acceptance of the updated terms.',
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero with Background Image */}
      <div className="relative pt-20 pb-44 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85"
          alt="Terms background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-900/80 to-emerald-950/70" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-500/10 rounded-full px-4 py-2 text-sm font-semibold text-emerald-400 mb-6">
            <i className="fa-solid fa-file-contract animate-pulse" />
            Last updated: May 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
            Terms & <span className="text-emerald-400">Conditions</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Please read these terms carefully before booking or using our services. By using TMS, you agree to be bound by these conditions.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 -mt-12 pb-20 relative z-10">

        {/* Intro info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 flex-shrink-0">
            <i className="fa-solid fa-file-contract text-emerald-600 text-xl" />
          </span>
          <div>
            <p className="font-black text-emerald-800 text-sm">Effective: May 2026 — Somalia Tourism Platform</p>
            <p className="text-emerald-700 text-xs mt-0.5">These terms apply to all tour bookings and services offered through TMS across all Somali regions.</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200 p-6 flex gap-5">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 text-emerald-600 bg-emerald-50">
                <i className={`${s.icon} text-lg`} />
              </span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-widest">{i + 1}</span>
                  <h2 className="font-black text-slate-900 text-lg">{s.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">{s.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
