import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/api';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const STATS = (t) => [
  { value: '500+', label: t.statTours || 'Tour Packages', target: 500, icon: '🧳' },
  { value: '120+', label: t.statDestinations || 'Destinations', target: 120, icon: '🌍' },
  { value: '10K+', label: t.statTravelers || 'Happy Travelers', target: 10000, icon: '😊' },
  { value: '15+', label: t.statExperience || 'Years Experience', target: 15, icon: '⭐' },
];

const FEATURES = (t) => [
  {
    icon: '🌍',
    title: t.globalDestinations || 'Global Destinations',
    desc: t.globalDestinationsDesc || 'Explore breathtaking destinations with carefully planned experiences.',
  },
  {
    icon: '💰',
    title: t.bestValue || 'Best Value',
    desc: t.bestValueDesc || 'Transparent prices, strong deals, and packages for every budget.',
  },
  {
    icon: '🛡️',
    title: t.safeBooking || 'Safe Booking',
    desc: t.safeBookingDesc || 'Your booking, payment, and personal information stay protected.',
  },
  {
    icon: '🎧',
    title: t.support247 || '24/7 Support',
    desc: t.support247Desc || 'Friendly support before, during, and after your trip.',
  },
];

const STEPS = (t) => [
  { n: '01', title: t.choosePackage || 'Choose Package', desc: t.choosePackageDesc || 'Browse destinations and select the tour that fits your dream trip.', icon: '🔎' },
  { n: '02', title: t.bookOnline || 'Book Online', desc: t.bookOnlineDesc || 'Reserve your trip quickly and receive confirmation without stress.', icon: '✅' },
  { n: '03', title: t.enjoyTravel || 'Enjoy Travel', desc: t.enjoyTravelDesc || 'Relax and enjoy a well-organized travel experience.', icon: '✈️' },
];

const TESTIMONIALS = [
  {
    name: 'Abdullahi Hassan Musse',
    loc: 'Mogadishu, Somalia',
    text: 'Everything was organized perfectly. The trip felt premium, smooth, and unforgettable.',
    initials: 'AH',
  },
  {
    name: 'Ikra Mohamed Gedi',
    loc: 'Hargeisa, Somaliland',
    text: 'Great value, clear communication, and beautiful hotels. I would book again.',
    initials: 'IM',
  },
  {
    name: 'Esmaou Vall',
    loc: 'Nouakchott, Mauritania',
    text: 'The support team was always available and made the whole journey easy.',
    initials: 'EV',
  },
];

const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

function packageImage(src) {
  if (!src) return fallbackImage;
  if (src.startsWith('http')) return src;
  return `http://localhost/tms/admin/pacakgeimages/${src}`;
}

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);
  const [counts, setCounts] = useState(STATS(t).map(() => 0));

  useEffect(() => {
    getPackages()
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setPackages(all.slice(0, 6)); // Show first 6 as featured
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1600;
        const start = performance.now();
        const targets = STATS(t).map((s) => s.target);

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts(targets.map((target) => Math.round(target * ease)));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const packageList = useMemo(() => packages, [packages]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-slate-950 pt-24 text-white">
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85"
            className="h-full w-full object-cover opacity-80"
          >
            <source src="/WhatsApp Video 2026-05-13 at 2.57.22 AM.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-emerald-950/30" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-28 pt-16 text-center">
          <div className="animate-fade-in-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.hero_badge}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              {t.hero_title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              {t.hero_sub}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row justify-center">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 text-base font-black text-white shadow-2xl shadow-emerald-900/40 transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                {t.explore}
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
                >
                  {t.createAccount}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">
        <section ref={statsRef} className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STATS(t).map((stat, i) => (
                <div key={stat.label} className="rounded-[1.75rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-black text-slate-900">
                    {i === 2 ? `${counts[i].toLocaleString()}+` : `${counts[i]}+`}
                  </p>
                  <p className="mt-1 font-bold text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="font-black uppercase tracking-[0.25em] text-emerald-600">{t.allPackages}</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{t.packageList}</h2>
                <p className="mt-4 max-w-2xl text-lg text-slate-600">{t.packageListDesc || 'Browse all available travel packages and find your perfect trip.'}</p>
              </div>
              <Link to="/packages" className="font-black text-emerald-600 hover:text-emerald-700">
                {t.viewAll}
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : packageList.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <p className="text-lg font-bold text-slate-600">No packages found yet.</p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
                {packageList.map((pkg) => (
                  <article key={pkg.PackageId || pkg.id} className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={pkg.PackageImage?.startsWith('http') ? pkg.PackageImage : fallbackImage}
                        alt={pkg.PackageName}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-emerald-700 shadow">
                        {pkg.PackageType || 'Tour'}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm font-semibold text-white/75">{t.startFrom}</p>
                        <p className="text-2xl font-black text-white">$ {Number(pkg.PackagePrice || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="line-clamp-1 text-lg font-black text-slate-950">{pkg.PackageName}</h3>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">📍 {pkg.PackageLocation || 'Destination'}</p>
                      <Link
                        to={`/packages/${pkg.PackageId || pkg.id}`}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-emerald-600"
                      >
                        {t.viewDetails}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="font-black uppercase tracking-[0.25em] text-emerald-600">{t.simpleProcess}</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">{t.howItWorks}</h2>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {STEPS(t).map((step) => (
                <div key={step.n} className="relative rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/70">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">{step.icon}</span>
                    <span className="text-5xl font-black text-emerald-400/80">{step.n}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="font-black uppercase tracking-[0.25em] text-emerald-600">{t.whyUs}</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">{t.travelEasier}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{t.travelEasierDesc || 'We combine beautiful destinations, fair pricing, and reliable support into one smooth booking experience.'}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES(t).map((feature) => (
                <div key={feature.title} className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-3xl text-white">{feature.icon}</div>
                  <h3 className="text-xl font-black text-slate-950">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="font-black uppercase tracking-[0.25em] text-emerald-400">{t.testimonials}</p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">{t.lovedBy}</h2>
            </div>
            <div className="grid gap-7 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <div key={item.name} className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur">
                  <div className="mb-5 text-lg text-amber-300">★★★★★</div>
                  <p className="leading-8 text-white/80">“{item.text}”</p>
                  <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 font-black text-white">{item.initials}</div>
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm text-white/55">{item.loc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-950" />
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
            <p className="mx-auto mb-6 inline-flex rounded-full bg-white/15 px-5 py-2 font-bold backdrop-blur">{t.ctaBadge || 'Start your next adventure today'}</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">{t.ctaTitle || 'Ready to book your dream destination?'}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">{t.ctaSub || 'Create an account, browse packages, and plan your journey with a platform built for modern travelers.'}</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/register" className="rounded-2xl bg-white px-9 py-4 font-black text-emerald-700 shadow-2xl transition hover:-translate-y-1">
                {t.getStarted}
              </Link>
              <Link to="/packages" className="rounded-2xl border border-white/25 bg-white/10 px-9 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                {t.browsePackages}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
