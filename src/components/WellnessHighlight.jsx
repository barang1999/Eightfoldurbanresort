import React, { useState, useEffect } from 'react';

export default function WellnessHighlight({ items = [], onDiscover }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      setFade(true);
    }, 300);
  };

  return (
    <section className="bg-[#f9f7f3] pt-12 pb-24 px-6">
      <div className="max-w-screen-xl mx-auto relative">
        <div className="relative h-full overflow-hidden min-h-[600px] md:min-h-[300px]">
          <div
            key={currentIndex}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center px-8 md:px-16 max-w-[1200px] mx-auto">
              <div className="text-center md:text-left px-4 sm:px-6 order-2 md:order-1">
                <h3 className="text-3xl font-light text-[#4a3c2f] mb-6">{items[currentIndex].title}</h3>
                {items[currentIndex].description && (
                  <p className="text-gray-700 text-base font-light max-w-md mx-auto leading-relaxed mb-8 sm:mb-6">
                    {items[currentIndex].description}
                  </p>
                )}
                <button
                  onClick={() => onDiscover?.(currentIndex)}
                  className="border border-black px-6 py-3 text-base uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
                >
                  {items[currentIndex].buttonText}
                </button>
              </div>
              <div className="w-full flex justify-center md:justify-end order-1 md:order-2">
                <img
                  src={items[currentIndex].image}
                  alt={items[currentIndex].title}
                  className="w-full h-auto rounded-md shadow-md transition-opacity duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination & Arrows */}
        <div className="flex justify-between items-center mt-6 px-6 md:px-16">
          <button
            onClick={handlePrev}
            className="border border-black rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={handleNext}
            className="border border-black rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
