import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/api';
import { PageLoader } from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading]   = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    getPackages()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setPackages(list);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let list = packages;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.PackageName?.toLowerCase().includes(q) ||
          p.PackageLocation?.toLowerCase().includes(q) ||
          p.PackageType?.toLowerCase().includes(q)
      );
    }
    if (minPrice !== '') list = list.filter((p) => Number(p.PackagePrice) >= Number(minPrice));
    if (maxPrice !== '') list = list.filter((p) => Number(p.PackagePrice) <= Number(maxPrice));
    if (typeFilter !== 'All')    list = list.filter((p) => p.PackageType === typeFilter);
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.PackagePrice - b.PackagePrice);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.PackagePrice - a.PackagePrice);
    if (sortBy === 'name')       list = [...list].sort((a, b) => a.PackageName.localeCompare(b.PackageName));
    return list;
  }, [packages, search, sortBy, minPrice, maxPrice, typeFilter]);

  const types = useMemo(() => ['All', ...new Set(packages.map((p) => p.PackageType).filter(Boolean))], [packages]);

  const clearAll = () => { setSearch(''); setSortBy('default'); setMinPrice(''); setMaxPrice(''); setTypeFilter('All'); };
  const hasFilters = search || sortBy !== 'default' || minPrice || maxPrice || typeFilter !== 'All';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-white py-14 border-b border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-green-700 text-xs font-semibold tracking-wide uppercase">{packages.length} Packages Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Explore Somali Destinations</h1>
          <p className="text-black font-medium text-lg max-w-xl mx-auto mb-8">Discover the beauty of Somalia through our curated regional tour packages</p>
          {/* Search Bar in Hero */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location or type..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">

        {/* ── Premium Filter Bar ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 mb-8 overflow-hidden">
          {/* Top row: sort + price + count */}
          <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-100">

            {/* Sort */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 12h12M10 17h4" />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="name">Name A → Z</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            <div className="w-px h-7 bg-gray-100" />

            {/* Price range */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-600">Price:</span>
              <input
                type="number" min="0" placeholder="Min $"
                value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
              <span className="text-gray-300 font-bold">—</span>
              <input
                type="number" min="0" placeholder="Max $"
                value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>

            {/* Clear + Count */}
            <div className="ml-auto flex items-center gap-3">
              {hasFilters && (
                <button onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-1.5">
                <span className="text-emerald-700 font-black text-sm">{displayed.length}</span>
                <span className="text-emerald-600 text-xs font-semibold ml-1">{displayed.length !== 1 ? 'packages' : 'package'}</span>
              </div>
            </div>
          </div>

          {/* Bottom row: type filter chips */}
          {types.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-gray-50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1">Category:</span>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    typeFilter === t
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <PageLoader />
        ) : displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700 text-xl font-bold mb-2">No packages found</p>
            <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters.</p>
            <button onClick={clearAll}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((pkg) => (
              <div key={pkg.PackageId || pkg.id}
                className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-green-200/50 hover:-translate-y-2 hover:border-green-300 transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={pkg.PackageImage?.startsWith('http') ? pkg.PackageImage : 'https://placehold.co/600x300?text=Tour'}
                    alt={pkg.PackageName}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x300?text=Tour'; }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                    {pkg.PackageType}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
                      $ {Number(pkg.PackagePrice).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 mb-1 line-clamp-1 transition-colors duration-200">{pkg.PackageName}</h3>
                  <div className="flex items-center gap-1.5 text-black font-medium text-sm mb-3">
                    <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{pkg.PackageLocation}</span>
                  </div>
                  {pkg.PackageFetures && (
                    <p className="text-black font-medium text-xs leading-relaxed line-clamp-2 mb-4">{pkg.PackageFetures}</p>
                  )}
                  <Link
                    to={`/packages/${pkg.PackageId || pkg.id}`}
                    className="block w-full text-center bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-500/25 hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    View & Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
