import React, { useState, useEffect, useRef } from 'react';

const galleryData = {
  'Hotel': ['/hotel1.jpg', '/hotel2.jpg', '/hotel3.jpg', '/hotel4.jpg'],
  'Suite & Rooms': ['/room1.jpg', '/room2.jpg', '/room3.jpg', '/room4.jpg'],
  'Restaurant': ['/restaurant1.jpg', '/restaurant2.jpg', '/restaurant4.jpg','/restaurant3.jpg'],
  'Cafe': ['/cafe1.jpg', '/cafe2.jpg', '/cafe3.jpg', '/cafe4.jpg'],
  'Breakfast': ['/breakfast1.jpg'],
  'Spa': ['/spa1.jpg','/spa2.jpg', '/spa3.jpg', '/spa4.jpg'],
  'Swimming pool': ['/pool1.jpg', '/pool2.jpg', '/pool3.jpg', '/pool4.jpg']
};

const GalleryModal = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const sectionRefs = useRef({});

useEffect(() => {
  if (!isOpen) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const label = entry.target.getAttribute('data-label');
          setActiveCategory(label);
        }
      });
    },
    { rootMargin: '-30% 0px -30% 0px', threshold: 0.3 }
  );

  const reobserve = () => {
    Object.values(sectionRefs.current).forEach(section => {
      if (section) observer.observe(section);
    });
  };

  const timeoutId = setTimeout(() => {
    reobserve();

    const resizeObserver = new ResizeObserver(() => {
      observer.disconnect();
      reobserve();
    });

    Object.values(sectionRefs.current).forEach(section => {
      if (section) resizeObserver.observe(section);
    });

    observer._resizeObserver = resizeObserver;
  }, 50);

  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
    if (observer._resizeObserver) observer._resizeObserver.disconnect();
  };
}, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start overflow-y-auto pt-10">
      <div className="bg-white w-[92%] max-w-5xl rounded-lg p-8 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black border border-gray-300 rounded-full w-8 h-8 text-xl leading-[30px] text-center"
        >
          &times;
        </button>

        <div className="flex">
          <div className="w-48 pr-6 border-r">
            <ul className="space-y-3 sticky top-10">
              {Object.keys(galleryData).map(category => (
                <li key={category}>
                  <a
                    href={`#${category.replace(/\s+/g, '-')}`}
                    className={`block font-light px-2 py-1 rounded ${
                      activeCategory === category ? 'text-black font-semibold border-r-4 border-[#a28e68] bg-white' : 'text-gray-600 hover:text-black hover:bg-white'
                    }`}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <button
                className="bg-black text-white px-6 py-3 w-full font-light transition hover:bg-white hover:text-black hover:border hover:border-black"
                onClick={() => {
                  const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                  window.location.href = `${bookingBaseUrl}/`;
                }}
              >
                See rates
              </button>
            </div>
          </div>
          <div className="flex-1 pl-6 space-y-10 overflow-y-auto max-h-[80vh]">
            {Object.entries(galleryData).map(([category, images]) => (
              <div
                key={category}
                id={category.replace(/\s+/g, '-')}
                data-label={category}
                ref={el => (sectionRefs.current[category] = el)}
              >
                <h2 className="text-base font-light font-semibold mb-4">{category}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${category} ${idx + 1}`}
                      className="rounded object-cover w-full h-48"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;