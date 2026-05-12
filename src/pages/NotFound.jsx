import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white px-4 overflow-hidden relative">
      {/* Blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Grid dots */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,.4) 1px,transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative text-center max-w-lg">
        {/* Plane icon */}
        <div className="text-8xl mb-2 animate-float inline-block">✈️</div>

        {/* 404 text */}
        <h1 className="text-[10rem] font-black leading-none bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-3 -mt-4">Lost in the Skies?</h2>
        <p className="text-blue-200/80 text-base mb-10 leading-relaxed">
          Looks like this page took off without us.<br />
          It doesn't exist or may have moved to a new destination.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition shadow-xl shadow-blue-500/30 hover:-translate-y-0.5 transform duration-200">
            🏠 Go Home
          </Link>
          <Link to="/packages"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition backdrop-blur-sm">
            Browse Packages
          </Link>
          <button onClick={() => navigate(-1)}
            className="text-blue-300 text-sm font-medium hover:text-white transition underline underline-offset-4">
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
