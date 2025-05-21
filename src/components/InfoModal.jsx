export default function InfoModal({ isOpen, onClose, title, children, icon }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 opacity-100 animate-fade-in">
          <div className="bg-white/90 rounded-lg shadow-lg w-full max-w-2xl p-6 relative transform transition-transform duration-300 scale-100">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={onClose}
            >
              ✕
            </button>
            {icon && (
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10">{icon}</div>
              </div>
            )}
            {title && (
              <h3 className="text-2xl font-semibold text-center mb-4 text-[#8a6b41]">{title}</h3>
            )}
            <div className="text-sm text-gray-700 space-y-2 max-h-[75vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}