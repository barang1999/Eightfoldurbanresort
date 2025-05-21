export default function HeroBanner({ backgroundImage, title, subtitle, children }) {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="relative z-10 px-6 mt-60 mb--60">
        <h1 className="text-white text-4xl md:text-6xl font-heading mb-4 drop-shadow">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-lg font-light drop-shadow">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}