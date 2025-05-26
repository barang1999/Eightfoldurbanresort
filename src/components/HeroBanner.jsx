export default function HeroBanner({ backgroundImage, title, subtitle, children }) {
  return (
    <section
      className="relative min-h-[var(--app-height)] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="relative z-10 px-6 pt-28 pb-0 text-left md:pt-60 md:text-center md:max-w-3xl md:mx-auto">
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