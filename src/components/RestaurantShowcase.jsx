import { useEffect, useState, useRef } from 'react';

export default function RestaurantShowcase({ category = 'Restaurant', propertyId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Restaurant');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";
    fetch(`${apiURL}/api/restaurants?propertyId=${propertyId}`)
      .then(res => res.json())
      .then(data => {
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("❌ Failed to fetch restaurants:", err));
  }, [selectedCategory, propertyId]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <section className="pt-4 px-4 md:px-10 bg-white">
      <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-6 scroll-smooth snap-x snap-mandatory px-2 sm:px-0" ref={scrollContainerRef}>
        {restaurants.map((res, idx) => (
          <div key={idx} className="flex-none w-[90vw] sm:w-[400px] shrink-0 space-y-4">
            <img
              src={res.photos?.[0]}
              alt={res.name}
              className="w-full h-[200px] sm:h-[250px] object-cover rounded transition-transform duration-300 hover:scale-105"
            />
            <h3 className="text-xl font-light uppercase">{res.name}</h3>
            <h3 className="text-sm text-gray-500 font-light tracking-wide mt-1">
            {res.subtitle}
            </h3>
            <div className="text-sm text-gray-500">{res.cuisineType}</div>
            <p className="text-sm text-gray-700 font-light line-clamp-3">{res.about}</p>
            <div>
              <a
                href={`/${res.name.toLowerCase().replace(/\s+/g, '')}`}
                className="inline-block px-4 py-2 mt-1 bg-black text-white text-sm hover:bg-white hover:text-black border hover:border-black transition"
              >
                View details
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-[-10px] sm:mt-2">
        <button
          onClick={scrollLeft}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition"
          aria-label="Previous"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition"
          aria-label="Next"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}