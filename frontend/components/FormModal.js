"use client";

export default function FormModal({
  isOpen,
  title,
  children,
  onSubmit,
  onClose,
  loading,
  error,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {title}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              ✖ Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}