import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';
import HotelFacilitySection from '../components/HotelFacilitySection';
import HotelPolicySection from '../components/HotelPolicySection';
import { ChevronDown, Droplet, TreePalm, GlassWater } from "lucide-react";

export default function HotelPool() {
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

  // Slideshow state for Evening Vibes
  const slideshowImages = ['/pool1.webp', '/pool2.webp', '/pool3.webp','/pool4.webp','/pool5.webp','/hotel4.webp','/hotel1.webp'];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}  
      transition={{ duration: 0.8 }}
      className="bg-white"
    >
      <Header />

      <HeroBanner
        backgroundImage="/hotel1.jpg"
        title="The Pool"
        subtitle="Relax and unwind at our luxurious pool area"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex justify-center mt-[-120px] mb-20 md:mt-[-40px] md:mb-0"
      >
        <ChevronDown className="w-6 h-6 text-white animate-bounce-slow" />
      </motion.div>

      {/* Desktop Booking Box 
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
      
            {/* Mobile Booking Modal 
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
      
            {/* Mobile Sticky CTA 
            <MobileStickyCTA onClick={() => setShowRates(true)} />

            */}

      <section className="bg-[#fdfaf6] px-6 py-20 text-center">
        <h2 className="text-3xl font-serif text-[#8a6b41] mb-4">A Sanctuary of Refreshment</h2>
        <p className="max-w-3xl text-base font-light mx-auto text-gray-700">
          Dive into tranquility at Eightfold’s signature pool. Surrounded by lush gardens and designed with a natural stone layout, our serene pool offers a luxurious escape from the bustle of the city.
        </p>
         <p className="max-w-3xl mt-10 mb-0 pb-0 text-base font-light mx-auto text-gray-700">
          8:00 AM – 10:00 PM
        </p>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <Droplet strokeWidth={1} className="w-10 h-10 text-[#8a6b41] mx-auto mb-4 opacity-80" />
          <h4 className="text-xl font-serif text-[#8a6b41] mb-2">Crystal Clear Water</h4>
          <p className="text-gray-600 font-light">Enjoy pristine, filtered water maintained to the highest standards for your safety and comfort.</p>
        </div>
        <div>
          <TreePalm strokeWidth={1} className="w-10 h-10 text-[#8a6b41] mx-auto mb-4 opacity-80" />
          <h4 className="text-xl font-serif text-[#8a6b41] mb-2">Lush Surroundings</h4>
          <p className="text-gray-600 font-light">Relax amidst tropical greenery and natural stone pathways that create a serene atmosphere.</p>
        </div>
        <div>
          <GlassWater strokeWidth={1} className="w-10 h-10 text-[#8a6b41] mx-auto mb-4 opacity-80" />
          <h4 className="text-xl font-serif text-[#8a6b41] mb-2">Poolside Service</h4>
          <p className="text-gray-600 font-light">Savor refreshing drinks and light bites delivered right to your lounger by our attentive staff.</p>
        </div>
      </section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/pool3.webp" alt="Pool view 1" className="w-full h-48 object-cover rounded-lg" />
          <img src="/hotel5.webp" alt="Pool view 2" className="w-full h-48 object-cover rounded-lg" />
          <img src="/pool1.webp" alt="Pool view 3" className="w-full h-48 object-cover rounded-lg" />
          <img src="/pool4.webp" alt="Pool view 4" className="w-full h-48 object-cover rounded-lg" />
          <img src="/hotel1.webp" alt="Pool view 5" className="w-full h-48 object-cover rounded-lg" />
          <img src="/pool5.webp" alt="Pool view 6" className="w-full h-48 object-cover rounded-lg" />
        </div>
      </section>

      {/* Elegant Evening Vibes Section with slideshow background only */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative py-80 px-6 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background slideshow */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {slideshowImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentSlide === index ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/10 z-5"></div>
        {/* Minimalist centered text overlay 
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-white text-xl font-light px-4 py-2 rounded-full tracking-widest">
            8:00 am – 10:00 pm
          </p>
        </div>
        */}
      </motion.section>

    

    </motion.div>
  );
}