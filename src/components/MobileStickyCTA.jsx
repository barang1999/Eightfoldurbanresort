export default function MobileStickyCTA({ label = "See rates", onClick }) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 md:hidden bg-black/50 backdrop-blur-md px-4 py-4 pointer-events-none">
      <div className="pointer-events-auto">
        <button
          onClick={onClick}
          className="w-full bg-[#8a6b41] text-white text-base font-sans py-4 rounded-sm tracking-wide"
        >
          {label}
        </button>
      </div>
    </div>
  );
}