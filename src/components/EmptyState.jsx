export default function EmptyState({ title = 'Nothing here yet', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      <svg className="w-40 h-40 text-gray-200 dark:text-gray-700 mb-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="currentColor" />
        {/* Box */}
        <rect x="60" y="80" width="80" height="60" rx="6" fill="#bfdbfe" />
        <rect x="60" y="80" width="80" height="20" rx="6" fill="#93c5fd" />
        {/* Flap */}
        <path d="M60 90 Q100 115 140 90" stroke="#3b82f6" strokeWidth="2" fill="none" />
        {/* Dots */}
        <circle cx="85" cy="125" r="4" fill="#3b82f6" />
        <circle cx="100" cy="125" r="4" fill="#3b82f6" />
        <circle cx="115" cy="125" r="4" fill="#3b82f6" />
      </svg>
      <p className="text-lg font-semibold text-gray-400">{title}</p>
      {description && <p className="text-sm text-gray-300 mt-1">{description}</p>}
    </div>
  );
}
