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

const GalleryModalMobile = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const sectionRefs = useRef({});
  const tabRefs = useRef({});

  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const label = entry.target.getAttribute('data-label');
            setActiveCategory(label);
            tabRefs.current[label]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      },
      { rootMargin: '-20% 0px -30% 0px', threshold: 0.3 }
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

      // Store cleanup to outer return
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
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-2xl font-light z-50 w-8 h-8 rounded-full bg-white bg-opacity-80 border border-black flex items-center justify-center"
        aria-label="Close"
      >
        &times;
      </button>
      {/* Top Tab Nav */}
      <div className="overflow-x-auto whitespace-nowrap border-b border-gray-200 px-4 py-3">
        {Object.keys(galleryData).map(category => (
          <button
            key={category}
            ref={el => (tabRefs.current[category] = el)}
            onClick={() =>
              sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className={`inline-block mr-4 px-3 py-1 text-sm rounded-full font-light transition ${
              activeCategory === category
                ? 'bg-[#a28e68] text-white'
                : 'text-gray-600 border border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Sections */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-10">
        {Object.entries(galleryData).map(([category, images]) => {
          console.log('⛳ Category:', category, 'Images:', images);

          return (
            <div
              key={category}
              id={category.replace(/\s+/g, '-')}
              data-label={category}
              ref={el => (sectionRefs.current[category] = el)}
            >
              <h2 className="text-base font-semibold mb-3">{category}</h2>
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(images) ? (
                  images.map((img, idx) => {
                    try {
                      console.log('🖼 Rendering image:', img);
                      return (
                        <img
                          key={idx}
                          src={img}
                          alt={`${category} ${idx + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      );
                    } catch (err) {
                      console.error(`❌ Error rendering image ${img}:`, err);
                      return null;
                    }
                  })
                ) : (
                  <p className="text-red-600">⚠️ No images found for {category}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed See Rates Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => {
            const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
            window.location.href = `${bookingBaseUrl}/`;
          }}
          className="w-full bg-black text-white py-3 text-sm rounded font-light transition hover:bg-white hover:text-black hover:border-black hover:border focus:bg-white focus:text-black focus:border-black"
        >
          See rates
        </button>
      </div>
    </div>
  );
};

export default GalleryModalMobile;