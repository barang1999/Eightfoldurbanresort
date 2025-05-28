import { useState, useRef } from 'react';
import TourDetailModal from './TourDetailModal';
import TourBookingModal from './TourBookingModal';

export default function TourShowcase({ tours = [], title }) {
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);
  const scrollContainerRef = useRef(null);

  const tagLabelMap = {
    fullday: "Full Day",
    smallgroup: "Small Group Tour",
    private: "Private",
    group: "Group Tour",
    daytour: "Day Tour"
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <section className="pt-4 px-4 md:px-10 bg-white">
      {title && (
        <h2 className="text-xl font-light text-[#4a3c2f] mb-6 text-center sm:text-left px-2 sm:px-0">
          {title}
        </h2>
      )}
      {tours.length === 0 && (
        <p className="text-center text-gray-400 py-8 italic">No tours available in this category.</p>
      )}
      <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-6 scroll-smooth snap-x snap-mandatory px-2 sm:px-0" ref={scrollContainerRef}>
        {tours.map((tour, idx) => (
          <div key={idx} className="flex-none w-[90vw] sm:w-[400px] shrink-0 space-y-4">
            {tour.imageUrls?.[0] && (
              <img
                src={tour.imageUrls[0]}
                alt={tour.category}
                className="w-full h-[200px] sm:h-[250px] object-cover rounded transition-transform duration-300 hover:scale-105"
              />
            )}
            <h3 className="text-xl font-light uppercase">{tour.category}</h3>
            {tour.tags && (
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500 font-medium tracking-wide">
                {tour.tags
                  .filter(tag =>
                    typeof tag === "string" &&
                    ["private", "fullday", "smallgroup", "group", "daytour"].includes(tag.toLowerCase())
                  )
                  .map((tag, index, arr) => (
                    <div key={index} className="flex items-center gap-x-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {tagLabelMap[tag.toLowerCase()] || tag}
                      </span>
                      {index < arr.length - 1 && (
                        <span className="text-gray-800 inline-block h-5 w-px bg-gray-400 mx-2 align-middle"></span>
                      )}
                    </div>
                  ))}
              </div>
            )}
            <p className="text-sm text-gray-700 font-light line-clamp-3">{tour.description}</p>
            <div className="text-sm text-gray-500 mt-2">Price From: ${tour.price}</div>
            {tour.duration && <div className="text-sm text-gray-500">Duration: {tour.duration}</div>}
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setBookingTour(tour)}
                className="px-4 py-2 bg-black text-white text-sm hover:bg-white hover:text-black border border-black transition"
              >
                Book this tour
              </button>
              <button
                onClick={() => setSelectedTour(tour)}
                className="text-sm text-[#0a2540] underline underline-offset-2 hover:text-black transition flex items-center gap-1"
              >
                View details →
              </button>
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

      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}
      {bookingTour && (
        <TourBookingModal
          open={!!bookingTour}
          tour={bookingTour}
          onClose={() => setBookingTour(null)}
        />
      )}
    </section>
  );
}