const galleryData = {
  'Hotel': ['/hotel1.webp', '/hotel2.webp', '/hotel3.webp', '/hotel4.webp','/hotel5.webp', '/hotel6.webp', '/hotel7.webp', '/hotel8.webp'],
  'Swimming pool': ['/pool1.webp', '/pool2.webp', '/pool3.webp', '/pool4.webp','/pool5.webp', '/pool6.webp'],
  'Suite & Rooms': ['/room1.webp', '/room2.webp', '/room3.webp', '/room4.webp','/hotel3.webp', '/room6.webp', '/room7.webp', '/room8.webp', '/room9.webp', '/room10.webp', '/room11.webp', '/room12.webp'],
  'Restaurant': ['/restaurant1.webp', '/restaurant2.webp', '/restaurant4.webp'],
  'Cafe': ['/cafe1.webp', '/cafe2.webp', '/cafe3.webp', '/cafe4.webp'],
  'Breakfast': ['/breakfast1.webp'],
  'Spa': ['/spa1.webp','/spa2.webp', '/spa3.webp', '/spa4.webp']

};
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';

export default function GalleryPage() {
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [showPicker, setShowPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [selectedRate, setSelectedRate] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showAllImages, setShowAllImages] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  const [showDropdownOnScroll, setShowDropdownOnScroll] = useState(false);

  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

useEffect(() => {
  const handleScroll = () => {
    const section = document.querySelector('.gallery-section');
    if (!section) return;
    const top = section.getBoundingClientRect().top;
    // Show dropdown once user scrolls near (or past) the gallery section
    const isInOrBelowView = top <= 80;
    setShowDropdownOnScroll(isInOrBelowView);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  useEffect(() => {
    const handleScroll = () => {
      const tabWrapper = document.getElementById('sticky-tab-wrapper');
      if (!tabWrapper) return;
      const rect = tabWrapper.getBoundingClientRect();
      setIsSticky(rect.top <= 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let imagesToRender = [];

  if (activeTab === 'All') {
    const allImages = Object.entries(galleryData)
      .flatMap(([category, images]) =>
        images.map((src, i) => ({
          src,
          alt: `${category} ${i + 1}`,
          key: `${category}-${i}`
        }))
      );
    imagesToRender = showAllImages ? allImages : allImages.slice(0, 6);
  } else {
    const tabImages = galleryData[activeTab]?.map((src, i) => ({
      src,
      alt: `${activeTab} ${i + 1}`,
      key: `${activeTab}-${i}`
    })) || [];
    imagesToRender = showAllImages ? tabImages : tabImages.slice(0, 6);
  }

  const navigateLightbox = (direction) => {
    if (lightboxIndex == null) return;
    const nextIndex = (lightboxIndex + direction + imagesToRender.length) % imagesToRender.length;
    const nextImage = imagesToRender[nextIndex];
    setLightboxIndex(nextIndex);
    setLightboxImage(`/${nextImage.src}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, lightboxIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}  
      transition={{ duration: 0.8 }}
      className="bg-white"
    >
      <Header />

      <HeroBanner
        backgroundImage="/hotel3.jpg"
        title="Gallery"
        subtitle="Explore the beauty of Eightfold Urban Resort"
      />

      {/* Desktop Booking Box */}
            <div className="hidden md:block">
              <BookingSearchBox
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                rooms={rooms}
                setRooms={setRooms}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                showGuests={showGuests}
                setShowGuests={setShowGuests}
                onSearch={() => {
                  console.log('Search clicked', selectedDates, rooms);
                }}
              />
            </div>
      
            {/* Mobile Booking Modal */}
            <MobileBookingModal
              showRates={showRates}
              setShowRates={setShowRates}
              showMobileCalendar={showMobileCalendar}
              setShowMobileCalendar={setShowMobileCalendar}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              rooms={rooms}
              setRooms={setRooms}
              selectedRate={selectedRate}
              setSelectedRate={setSelectedRate}
            />
      
            {/* Mobile Sticky CTA */}
            <MobileStickyCTA onClick={() => setShowRates(true)} />

      <section className="bg-white px-6 py-20 gallery-section">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-serif text-[#333] text-center mb-4">Eightfold Gallery</h2>
          <div className="border-b border-gray-200 mb-10">

            {/* Mobile Dropdown */}
            <AnimatePresence>
              {showDropdownOnScroll && (
                <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -80, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`md:hidden px-4 pb-4 fixed top-0 left-0 right-0 z-30 bg-white`}
                >
                  <div id="sticky-tab-wrapper" className="sticky top-16 z-30 bg-white">
                    <button
                      className="w-full py-1 pt-4 pl-4 pr-3 bg-white text-base font-medium text-gray-800 tracking-wide flex items-center justify-between focus:outline-none transition-all"
                      onClick={() => setShowDropdown(prev => !prev)}
                    >
                      {activeTab}
                      <svg
                        className={`w-5 h-5 ml-2 transition-transform transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute left-0 right-0 z-10 bg-white mt-2 text-left text-base font-light tracking-wide space-y-3 px-6 py-4">
                        {['All', ...Object.keys(galleryData)].map((tab) => (
                          <div
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setShowDropdown(false);
                            }}
                            className={`cursor-pointer transition-colors ${
                              activeTab === tab ? 'text-[#a28e68] font-semibold' : 'text-gray-800'
                            }`}
                          >
                            {tab}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Tabs */}
            <div className="hidden md:flex justify-center space-x-6 text-sm font-medium text-gray-500 uppercase">
              {['All', ...Object.keys(galleryData)]?.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 text-base font-light transition ${
                    activeTab === tab
                      ? 'text-[#8a6b41] border-[#8a6b41] font-semibold'
                      : 'border-transparent hover:text-[#8a6b41]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imagesToRender.map(({ src, alt, key }, index) => (
                <div key={key} onClick={() => {
                  setLightboxIndex(imagesToRender.findIndex(image => image.key === key));
                  setLightboxImage(`/${src}`);
                }} className="cursor-pointer">
                  <img
                    src={`/${src}`}
                    alt={alt}
                    className="w-full h-64 object-cover rounded shadow-sm transition-transform duration-300 transform hover:scale-105 hover:brightness-110"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>

          {(galleryData[activeTab]?.length > 6 || activeTab === 'All') && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllImages(prev => !prev)}
                className="px-6 py-2 border border-gray-400 text-sm text-gray-700 hover:bg-[#8a6b41] hover:text-white transition"
              >
                {showAllImages ? 'Show Less' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="bg-white rounded-md shadow-md p-2 max-w-5xl max-h-[90vh] w-full h-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          </div>
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            &times;
          </button>
          <button
            className="absolute left-6 text-white hover:text-[#a28e68] transition"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-6 text-white hover:text-[#a28e68] transition"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

     

    </motion.div>
  );
}