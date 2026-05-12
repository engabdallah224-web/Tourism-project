export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="text-4xl text-center mb-3">⚠️</div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Are you sure?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-2 rounded-xl hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
