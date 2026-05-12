import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, deletePackage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmModal from '../../components/ConfirmModal';
import { PageLoader } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import { 
  BriefcaseIcon, PlusIcon, MagnifyingGlassIcon, 
  MapPinIcon, PencilSquareIcon, TrashIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80';

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [confirm, setConfirm]   = useState(null);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const toast = useToast();

  const fetchPackages = () => {
    getPackages()
      .then((res) => {
        // Handle both formats (firebase returns .packages or the array directly)
        const data = Array.isArray(res.data) ? res.data : (res.data.packages || []);
        setPackages(data);
      })
      .catch(() => toast.error('Failed to load packages.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPackages(); }, []);

  const filtered = packages.filter(p => 
    p.PackageName?.toLowerCase().includes(search.toLowerCase()) ||
    p.PackageLocation?.toLowerCase().includes(search.toLowerCase()) ||
    p.PackageType?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setConfirm({ id, message: 'This package and all its details will be permanently removed from the system.' });
  };

  const doDelete = async () => {
    const id = confirm.id;
    setConfirm(null);
    try {
      await deletePackage(id);
      toast.success('Package deleted successfully.');
      fetchPackages();
    } catch { toast.error('Delete failed. Please try again.'); }
  };

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagePackages = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)' }}>
      <AdminSidebar />
      {confirm && <ConfirmModal message={confirm.message} onConfirm={doDelete} onCancel={() => setConfirm(null)} />}
      
      <main className="flex-1 overflow-y-auto">
        {/* ── HERO HEADER ── */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#3b82f6 0%,#4f46e5 50%,#6366f1 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: '#fff' }} />
          
          <div className="relative px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <BriefcaseIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Manage Packages</h1>
                <p className="text-indigo-100 text-sm">{packages.length} active tour packages</p>
              </div>
            </div>

            <Link to="/admin/create-package"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <PlusIcon className="w-5 h-5" /> Create New Package
            </Link>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* ── FILTERS ── */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search packages, locations, types..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-gray-100">
              Showing {pagePackages.length} of {filtered.length} results
            </div>
          </div>

          {loading ? (
            <div className="py-20"><PageLoader /></div>
          ) : filtered.length === 0 ? (
            <EmptyState 
              icon={BriefcaseIcon}
              title="No packages found" 
              description={search ? `We couldn't find any results for "${search}"` : "You haven't added any tour packages yet."} 
            />
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      {['Package Info', 'Location & Type', 'Pricing', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pagePackages.map((pkg) => (
                      <tr key={pkg.PackageId || pkg.id} className="hover:bg-blue-50/20 transition-colors group">
                        {/* Info */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-12 rounded-xl overflow-hidden shadow-md shrink-0 border border-gray-100">
                              <img
                                src={pkg.PackageImage?.startsWith('http') ? pkg.PackageImage : fallbackImage}
                                alt={pkg.PackageName}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                              />
                            </div>
                            <div>
                              <p className="font-black text-gray-800 leading-tight line-clamp-1">{pkg.PackageName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">ID: {pkg.PackageId || pkg.id}</p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Location */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-sm">
                            <MapPinIcon className="w-4 h-4 text-indigo-400" />
                            {pkg.PackageLocation}
                          </div>
                          <span className="inline-block mt-1 text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {pkg.PackageType || 'Tour'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-emerald-600">${Number(pkg.PackagePrice).toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Per Person</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-xs font-black text-gray-700 uppercase tracking-wide">Active</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-5">
                          <div className="flex gap-2">
                            <Link to={`/admin/update-package/${pkg.PackageId || pkg.id}`}
                              className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 hover:scale-105 transition-all shadow-sm">
                              <PencilSquareIcon className="w-5 h-5" />
                            </Link>
                            <button onClick={() => handleDelete(pkg.PackageId || pkg.id)}
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:scale-105 transition-all shadow-sm">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-100">
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
