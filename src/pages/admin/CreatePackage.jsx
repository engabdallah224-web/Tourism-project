import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPackage, uploadImage } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import {
  PhotoIcon, ArrowUpTrayIcon, XMarkIcon, MapPinIcon,
  CurrencyDollarIcon, TagIcon, SparklesIcon, DocumentTextIcon,
  CheckCircleIcon, PlusIcon,
} from '@heroicons/react/24/outline';

const FIELD_CONFIG = [
  { key: 'PackageName',     label: 'Package Name',    icon: SparklesIcon,      type: 'text',   placeholder: 'e.g. Paris Adventure Tour', required: true  },
  { key: 'PackageType',     label: 'Package Type',    icon: TagIcon,           type: 'text',   placeholder: 'e.g. Adventure, Cultural',  required: true  },
  { key: 'PackageLocation', label: 'Location',        icon: MapPinIcon,        type: 'text',   placeholder: 'e.g. Paris, France',        required: true  },
  { key: 'PackagePrice',    label: 'Price (USD)',      icon: CurrencyDollarIcon,type: 'number', placeholder: 'e.g. 1200',                 required: true  },
];

export default function CreatePackage() {
  const navigate = useNavigate();
  const fileRef  = useRef();
  const [form, setForm] = useState({
    PackageName: '', PackageType: '', PackageLocation: '',
    PackagePrice: '', PackageFeatures: '', PackageDescription: '', PackageImage: '',
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  // ── Image handling ─────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file?.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    setImgPreview(URL.createObjectURL(file));
    setUploadDone(false); setUploading(true); setError('');
    try {
      const res = await uploadImage(file);
      setForm(f => ({ ...f, PackageImage: res.data.url }));
      setUploadDone(true);
    } catch {
      setError('Image upload failed. Make sure the backend is running.');
      setImgPreview(null);
    } finally { setUploading(false); }
  };

  const removeImage = () => {
    setImgPreview(null); setUploadDone(false);
    setForm(f => ({ ...f, PackageImage: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.PackageImage) { setError('Please upload a package image before saving.'); return; }
    setError(''); setLoading(true);
    try {
      await createPackage({
        PackageName:        form.PackageName,
        PackageType:        form.PackageType,
        PackageLocation:    form.PackageLocation,
        PackagePrice:       Number(form.PackagePrice),
        PackageFeatures:    form.PackageFeatures.split(',').map(s => s.trim()).filter(Boolean),
        PackageDescription: form.PackageDescription,
        PackageImage:       form.PackageImage,
        isActive:           true,
      });
      navigate('/admin/manage-packages');
    } catch { setError('Failed to create package.'); }
    finally { setLoading(false); }
  };

  const progress = [
    !!form.PackageName, !!form.PackageType, !!form.PackageLocation,
    !!form.PackagePrice, !!form.PackageFeatures, uploadDone,
  ].filter(Boolean).length;
  const totalSteps = 6;

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">

        {/* ── HERO HEADER ── */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#4f46e5 50%,#7c3aed 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: '#818cf8' }} />
          <div className="relative px-8 py-7 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <PlusIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Create Package</h1>
                <p className="text-indigo-200 text-sm">Add a new tour package to the system</p>
              </div>
            </div>
            {/* Progress */}
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <p className="text-indigo-200 text-xs font-semibold">{progress} / {totalSteps} fields completed</p>
              <div className="w-40 h-2 rounded-full bg-white/20">
                <div className="h-2 rounded-full bg-white transition-all duration-500"
                  style={{ width: `${(progress / totalSteps) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 text-sm shadow-sm">
              <XMarkIcon className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── TWO COLUMN LAYOUT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* LEFT — Form fields */}
              <div className="lg:col-span-3 space-y-5">

                {/* Basic fields */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-indigo-500" /> Package Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FIELD_CONFIG.map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                            <f.icon className="w-4 h-4" />
                          </div>
                          <input
                            type={f.type} required={f.required}
                            value={form[f.key]} placeholder={f.placeholder}
                            min={f.type === 'number' ? 0 : undefined}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" /> Features & Inclusions
                  </h2>
                  <label className="block text-xs text-gray-400 mb-2">Separate each feature with a comma</label>
                  <textarea rows={3} required value={form.PackageFeatures}
                    placeholder="e.g. Hotel Stay, Airport Pickup, Guided Tour, Breakfast Included"
                    onChange={e => setForm({ ...form, PackageFeatures: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition resize-none" />
                  {/* Feature chips preview */}
                  {form.PackageFeatures && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.PackageFeatures.split(',').map((f, i) => f.trim() && (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
                          ✓ {f.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-blue-500" /> Description
                    <span className="text-gray-400 normal-case font-normal text-xs">(optional)</span>
                  </h2>
                  <textarea rows={5} value={form.PackageDescription}
                    placeholder="Describe the package experience, day-by-day itinerary, what's included and excluded..."
                    onChange={e => setForm({ ...form, PackageDescription: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition resize-none" />
                </div>
              </div>

              {/* RIGHT — Image upload panel */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-6">
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <PhotoIcon className="w-4 h-4 text-violet-500" /> Package Image
                  </h2>

                  {!imgPreview ? (
                    /* Drop zone */
                    <div
                      onClick={() => fileRef.current.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-14 px-6 text-center ${
                        dragOver
                          ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                          : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                      }`}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragOver ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <ArrowUpTrayIcon className={`w-8 h-8 transition-colors ${dragOver ? 'text-indigo-500' : 'text-gray-300'}`} />
                      </div>
                      <p className="font-bold text-gray-600 text-sm">{dragOver ? '📸 Drop image here!' : 'Click or drag & drop'}</p>
                      <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP — max 10 MB</p>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                    </div>
                  ) : (
                    /* Image preview */
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg group relative">
                      <img src={imgPreview} alt="Preview" className="w-full h-56 object-cover" />

                      {/* Upload overlay */}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                          <svg className="w-9 h-9 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          <span className="text-white font-bold text-sm">Uploading image...</span>
                        </div>
                      )}

                      {/* Hover controls */}
                      {!uploading && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 bg-black/50">
                          <button type="button" onClick={removeImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition">
                            <XMarkIcon className="w-4 h-4" /> Remove
                          </button>
                          <button type="button" onClick={() => fileRef.current.click()}
                            className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition">
                            <ArrowUpTrayIcon className="w-4 h-4" /> Change
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                        </div>
                      )}

                      {/* Uploaded badge */}
                      {uploadDone && !uploading && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Uploaded
                        </div>
                      )}
                    </div>
                  )}

                  {/* Package card preview */}
                  {(form.PackageName || form.PackageLocation || form.PackagePrice) && (
                    <div className="mt-5 p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-indigo-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Preview</p>
                      <p className="font-black text-gray-800 text-base leading-tight">{form.PackageName || '—'}</p>
                      {form.PackageLocation && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPinIcon className="w-3.5 h-3.5 text-indigo-400" /> {form.PackageLocation}
                        </p>
                      )}
                      {form.PackagePrice && (
                        <p className="text-indigo-600 font-black text-lg mt-2">
                          ${Number(form.PackagePrice).toLocaleString()}
                          <span className="text-xs font-normal text-gray-400 ml-1">/ person</span>
                        </p>
                      )}
                      {form.PackageType && (
                        <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                          {form.PackageType}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <button type="submit" disabled={loading || uploading}
                    className="w-full py-4 rounded-2xl font-black text-white text-sm shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg> Creating Package...
                      </>
                    ) : <><PlusIcon className="w-5 h-5" /> Create Package</>}
                  </button>
                  <button type="button" onClick={() => navigate('/admin/manage-packages')}
                    className="w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition">
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
