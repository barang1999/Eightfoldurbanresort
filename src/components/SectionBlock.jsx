export default function SectionBlock({ id, title, background = 'white', children }) {
  const bgClass = background === 'gray' ? 'bg-gray-100' : 'bg-white';

  return (
    <section id={id} className={`py-12 px-6 ${bgClass}`}>
      <div className="max-w-screen-lg mx-auto">
        {title && <h2 className="text-3xl font-semibold text-gray-800 mb-6">{title}</h2>}
        <div className="text-gray-600">{children}</div>
      </div>
    </section>
  );
}