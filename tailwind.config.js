// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // ── Two-Color Brand System ────────────────────────
        primary:   '#020617', // slate-950 — dark base
        secondary: '#38bdf8', // sky-400   — luminous accent

        // Legacy
        darkblue:  '#0a174e',
        darkred:   '#7b112c',
        darkgreen: '#064e3b',
        'brand-gold':  '#f0b429',
        'brand-navy':  '#0a0f1e',
        'brand-white': '#ffffff',
      },
    },
  },
  plugins: [],
};
