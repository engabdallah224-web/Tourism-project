import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    icon: 'fa-solid fa-lock',
    color: 'text-emerald-600 bg-emerald-50',
    title: 'Data Collection',
    content:
      'We collect only the information necessary to provide our services — such as your name, email address, and booking details. We never collect data beyond what is required.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    color: 'text-blue-600 bg-blue-50',
    title: 'Data Protection',
    content:
      'All your data is encrypted using industry-standard 256-bit SSL technology and stored on secure servers. We apply strict access controls to protect your information at all times.',
  },
  {
    icon: 'fa-solid fa-ban',
    color: 'text-red-500 bg-red-50',
    title: 'No Data Selling',
    content:
      'We will never sell, rent, or trade your personal information to third parties for marketing purposes. Your data belongs to you.',
  },
  {
    icon: 'fa-solid fa-handshake',
    color: 'text-purple-600 bg-purple-50',
    title: 'Third-Party Sharing',
    content:
      'Your data may be shared only with trusted service providers (e.g. payment processors) strictly necessary to complete your booking, and only under confidentiality agreements.',
  },
  {
    icon: 'fa-solid fa-cookie-bite',
    color: 'text-amber-600 bg-amber-50',
    title: 'Cookies',
    content:
      'We use essential cookies to keep you logged in and remember your preferences. We do not use invasive tracking cookies. You can manage cookie settings in your browser at any time.',
  },
  {
    icon: 'fa-solid fa-user-shield',
    color: 'text-emerald-600 bg-emerald-50',
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data at any time. To submit a data request, contact us at privacy@tms.com and we will respond within 5 business days.',
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero with Background Image */}
      <div className="relative pt-20 pb-44 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1800&q=85"
          alt="Privacy background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-900/80 to-emerald-950/70" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-500/10 rounded-full px-4 py-2 text-sm font-semibold text-emerald-400 mb-6">
            <i className="fa-solid fa-shield-halved animate-pulse" />
            Last updated: May 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
            Privacy <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            We are committed to protecting your personal information and your right to privacy. Here's exactly how we handle your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 -mt-12 pb-20 relative z-10">

        {/* Intro card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 flex-shrink-0">
            <i className="fa-solid fa-circle-check text-emerald-600 text-xl" />
          </span>
          <div>
            <p className="font-black text-emerald-800 mb-1">Our Privacy Commitment</p>
            <p className="text-emerald-700 text-sm leading-relaxed">
              We value your privacy. Your data is protected and never shared with third parties except as required to provide our services or by law. By using TMS, you agree to the practices described below.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200 p-6 flex gap-5">
              <span className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${s.color}`}>
                <i className={`${s.icon} text-lg`} />
              </span>
              <div>
                <h2 className="font-black text-slate-900 text-lg mb-2">{s.title}</h2>
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
