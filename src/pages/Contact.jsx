import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CONTACT_CARDS = [
  {
    icon: '📧',
    title: 'Email Support',
    value: 'support@wanderlust.com',
    desc: 'Send us your questions anytime.',
  },
  {
    icon: '📞',
    title: 'Phone Number',
    value: '+1 800 123 4567',
    desc: 'Speak directly with our support team.',
  },
  {
    icon: '📍',
    title: 'Office Location',
    value: 'New York, USA',
    desc: 'Visit our travel support office.',
  },
  {
    icon: '⏰',
    title: 'Working Hours',
    value: '24/7 Support',
    desc: 'We are available every day.',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden bg-[#020817] pt-28 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=85"
            alt="Contact support"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#06111f]/90 to-cyan-950/70" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-32">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">
              💬 We are here to help
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              Contact our travel support team.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              Have questions about bookings, destinations, payments, or packages? Send us a message and our team will help you as soon as possible.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-24 w-full">
            <path
              fill="white"
              d="M0 88L80 78C160 68 320 48 480 54C640 60 800 92 960 92C1120 92 1280 60 1360 44L1440 28V120H0V88Z"
            />
          </svg>
        </div>
      </section>

      <main>
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="font-black uppercase tracking-[0.25em] text-cyan-500">
                Get in touch
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-[#020817] md:text-5xl">
                Let us help you plan your next journey.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Whether you need help choosing a package, confirming your booking, or asking about a destination, our support team is ready to assist you.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {CONTACT_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-3xl">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-black text-[#020817]">{card.title}</h3>
                    <p className="mt-1 font-bold text-cyan-600">{card.value}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-cyan-100 blur-3xl" />
              <div className="absolute -bottom-8 -right-6 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

              <form className="relative rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-300/50 md:p-9">
                <div className="mb-8">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">
                    Send Message
                  </p>
                  <h3 className="mt-3 text-3xl font-black text-[#020817]">
                    Tell us what you need
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    Fill the form below and we will get back to you quickly.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Booking help, package question, payment issue..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Message
                  </label>
                  <textarea
                    placeholder="Write your message here..."
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-2xl bg-cyan-500 px-8 py-4 text-base font-black text-white shadow-2xl shadow-cyan-900/20 transition hover:-translate-y-1 hover:bg-cyan-600"
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="overflow-hidden rounded-[2.5rem] bg-[#020817] text-white shadow-2xl">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16">
                  <p className="font-black uppercase tracking-[0.25em] text-cyan-400">
                    Need quick help?
                  </p>

                  <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                    Our team is available 24/7.
                  </h2>

                  <p className="mt-5 text-lg leading-8 text-white/75">
                    For urgent booking support, payment confirmation, or destination guidance, contact us anytime through email or phone.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <p className="text-sm font-semibold text-white/60">Email</p>
                      <p className="mt-1 text-xl font-black">support@wanderlust.com</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <p className="text-sm font-semibold text-white/60">Phone</p>
                      <p className="mt-1 text-xl font-black">+1 800 123 4567</p>
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[420px]">
                  <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                    alt="Office support"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/80 to-transparent lg:bg-gradient-to-l" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
