import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🌍',
    title: 'Global Destinations',
    desc: 'Explore premium destinations and unforgettable experiences around the world.',
  },
  {
    icon: '🛡️',
    title: 'Safe & Trusted',
    desc: 'Your bookings and travel plans are protected with reliable customer support.',
  },
  {
    icon: '💎',
    title: 'Premium Experience',
    desc: 'We focus on quality travel packages designed for comfort and adventure.',
  },
  {
    icon: '🎧',
    title: '24/7 Support',
    desc: 'Our support team is always ready to help before and during your trip.',
  },
];

const STATS = [
  { value: '10K+', label: 'Happy Travelers' },
  { value: '120+', label: 'Destinations' },
  { value: '500+', label: 'Tour Packages' },
  { value: '15+', label: 'Years Experience' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden bg-slate-950 pt-28 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85"
            alt="Travel"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-emerald-950/70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              ✈️ Trusted Travel Platform
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              We create unforgettable travel experiences.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              Wanderlust helps travelers discover beautiful destinations, book premium tours, and enjoy stress-free adventures around the globe.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 text-base font-black text-white shadow-2xl shadow-emerald-900/40 transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                Explore Packages
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="white"
              d="M0 96L80 85.3C160 75 320 53 480 58.7C640 64 800 96 960 96C1120 96 1280 64 1360 48L1440 32V120H1360C1280 120 1120 120 960 120C800 120 640 120 480 120C320 120 160 120 80 120H0V96Z"
            />
          </svg>
        </div>
      </section>

      <main>
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-black uppercase tracking-[0.25em] text-emerald-600">
                About Wanderlust
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                Passionate about making travel simple and memorable.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Our mission is to connect travelers with incredible destinations and premium experiences through a platform that feels modern, safe, and easy to use.
              </p>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                From luxury escapes to adventure tours, we carefully design packages that help travelers explore the world with confidence.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-lg shadow-slate-200/60">
                  <p className="text-4xl font-black text-emerald-600">98%</p>
                  <p className="mt-2 font-semibold text-slate-700">Customer Satisfaction</p>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-lg shadow-slate-200/60">
                  <p className="text-4xl font-black text-emerald-600">24/7</p>
                  <p className="mt-2 font-semibold text-slate-700">Dedicated Support</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-emerald-100 blur-3xl" />
              <div className="absolute -bottom-8 -right-6 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-300/50">
                <img
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85"
                  alt="Travelers"
                  className="h-[560px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-14 text-center">
              <p className="font-black uppercase tracking-[0.25em] text-emerald-600">
                Why Choose Us
              </p>
              <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
                Built for modern travelers
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-16 text-white shadow-2xl md:px-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-black uppercase tracking-[0.25em] text-emerald-400">
                    Our Achievements
                  </p>

                  <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                    Trusted by travelers worldwide.
                  </h2>

                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                    Thousands of travelers choose Wanderlust every year for reliable service, premium tours, and unforgettable memories.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur"
                    >
                      <p className="text-4xl font-black text-emerald-400">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white/70">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-950" />
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
            <p className="mx-auto mb-6 inline-flex rounded-full bg-white/15 px-5 py-2 font-bold backdrop-blur">
              Start your journey today
            </p>

            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Ready to explore the world?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Join thousands of travelers and discover destinations designed to inspire unforgettable adventures.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/packages"
                className="rounded-2xl bg-white px-9 py-4 font-black text-emerald-700 shadow-2xl transition hover:-translate-y-1"
              >
                Explore Packages
              </Link>

              <Link
                to="/contact"
                className="rounded-2xl border border-white/25 bg-white/10 px-9 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
