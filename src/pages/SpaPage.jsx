import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import InfoModal from '../components/InfoModal';
import Footer from '../components/Footer';
import { ChevronDown } from "lucide-react";

export default function SpaPage() {
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
  const [showFullText, setShowFullText] = useState(false);
  const [showSpaMenu, setShowSpaMenu] = useState(false);
  const [spaMenu, setSpaMenu] = useState([]);

  // TODO: Replace with actual property ID or dynamic value
  const propertyId = '6803cba3dadf9a0d829427fe';

  // Slideshow state for spa images
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3); // change 3 to the number of slideshow images
    }, 4000); // 4 seconds interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchSpaMenu() {
      try {
        const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/spa?propertyId=${propertyId}`);
        const data = await res.json();
        console.log("✅ Spa data:", data); // Debug line to verify response
        setSpaMenu(data.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
      } catch (err) {
        console.error('Failed to fetch spa menu:', err);
      }
    }
    fetchSpaMenu();
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
        backgroundImage="/spa1.jpg"
        title="Spa & Wellness"
        subtitle="Rejuvenate your body and mind in our serene sanctuary"
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex justify-center mt-[-40px] mb-4"
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

     
      <MobileStickyCTA onClick={() => setShowRates(true)} />
    
      {/* Content Section */}
      <section className="bg-white text-center px-6 py-20">
        <div className="max-w-screen-md mx-auto space-y-6">
          <div className="flex flex-col items-center text-[#8a6b41]">
            <svg
              className="w-14 h-14"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              fill="#8a6b41"
            >
              <path d="M860.16 511.488c-7.168-85.504-55.808-305.152-351.744-491.008l-4.608-3.072-4.608 3.072c-1.024 0.512-98.816 64.512-190.976 164.864-54.272 58.88-96.256 118.784-124.416 177.664-35.328 74.24-49.152 147.456-40.96 217.6 21.504 181.248 122.88 262.144 210.432 277.504 10.752 2.048 22.016 3.072 32.256 3.072 41.472 0 78.848-14.336 103.936-39.424 4.608 108.032 51.2 178.176 53.248 181.76l13.824-9.216c-0.512-1.024-51.712-78.848-50.688-193.024v-0.512c28.16 18.432 127.488 76.288 215.552 37.888 73.216-32.256 118.272-122.368 134.144-267.776 0.512-3.584 1.024-7.68 1.536-11.264 2.048-15.872 4.096-31.744 3.072-48.128z m-360.448-165.376L394.24 124.416c44.032-39.424 82.432-67.584 101.376-80.896 1.024 42.496 3.584 167.424 4.096 302.592z m12.8-302.592c33.792 22.016 64.512 44.544 91.648 67.072l-87.552 228.864c-1.024-132.608-3.072-252.928-4.096-295.936z m2.56 601.088c12.8-25.088 161.28-317.44 219.136-399.36 53.248 71.68 80.896 138.752 95.232 192-54.784 39.936-253.952 208.384-315.904 261.12 0.512-16.896 1.024-34.816 1.536-53.76z m208.384-413.696c-48.128 66.048-163.84 289.792-207.36 374.784 1.024-66.56 1.536-144.384 1.024-220.672l100.864-263.68c42.496 36.864 77.312 73.728 105.472 109.568z m-403.456-33.792c20.48-22.528 41.472-43.008 61.44-60.928l118.784 249.856c0.512 73.728 0 148.992-1.024 214.016-49.152-100.352-195.584-315.904-221.184-353.28 14.336-17.92 28.16-34.304 41.984-49.664z m-52.736 62.976c67.584 99.328 223.232 334.848 230.912 382.976-0.512 21.504-1.024 40.96-2.048 58.88C435.712 639.488 208.384 474.112 170.496 446.976c18.944-69.12 56.32-133.12 96.768-186.88zM166.4 464.384c50.688 36.864 273.92 199.68 321.536 252.416-120.832 64-286.208-34.816-308.224-48.64-8.704-26.624-15.872-56.32-19.968-90.112-4.608-38.4-1.536-76.8 6.656-113.664z m189.952 377.344c-60.416-10.752-128.512-55.296-167.424-147.968 20.48 11.264 53.76 28.16 94.208 41.984 82.432 27.136 155.136 26.112 211.456-3.072-0.512 9.728-1.536 17.92-2.048 25.088-1.536 13.312-2.56 26.112-2.56 38.4-26.112 37.376-77.824 55.296-133.632 45.568z m358.912-18.432c-93.184 40.96-205.312-40.448-206.336-41.472l-1.536-1.024c0.512-6.656 1.024-13.824 1.536-20.992 1.024-6.656 1.536-14.848 2.048-23.552 16.896 8.704 47.104 20.48 93.184 20.48 50.176 0 118.784-13.312 207.872-57.856-21.504 63.488-53.76 105.472-96.768 124.416z m125.44-265.728c-0.512 3.584-1.024 7.68-1.536 11.264-4.608 40.448-11.264 76.288-19.968 108.032-114.688 59.392-194.048 66.56-240.128 61.952-33.28-3.584-54.272-13.312-65.024-19.456 44.544-37.888 255.488-216.576 319.488-264.192 5.12 23.552 8.192 43.008 9.216 58.88 1.536 13.824 0 28.16-2.048 43.52z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-serif text-[#8a6b41] leading-snug mt-4">
              Where indulgence is<br />the new wellness
            </h2>
          </div>
          {spaMenu.length > 0 && (
            <>
              <p className="text-gray-700 text-base font-light leading-relaxed whitespace-pre-line">
                {spaMenu[0].about.split('\n')[0]}
              </p>
              {showFullText && (
                <p className="text-gray-700 text-base font-light leading-relaxed whitespace-pre-line mt-4">
                  {spaMenu[0].about.split('\n').slice(1).join('\n')}
                </p>
              )}
            </>
          )}
          <button
            onClick={() => setShowFullText(prev => !prev)}
            className="text-[#a28e68] underline text-sm"
          >
            {showFullText ? 'See less' : 'See more'}
          </button>
        </div>
      </section>

      <section className="bg-white px-6 pb-20">
        <div className="max-w-screen-md mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="text-sm text-gray-800 space-y-1 mb-4">
              <p>Monday – Sunday: 10:00 AM – 11:00 PM</p>
            </div>
            <div className="text-sm text-gray-800 space-y-1 mb-4">
              <p>Booking: 092 500 400</p>
            </div>
            <button
              onClick={() => setShowSpaMenu(true)}
              className="border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
            >
              Spa Menu
            </button>
          </div>
          <div>
            <img src="/spa5.jpg" alt="Spa Massage" className="rounded shadow-md w-full" />
          </div>
        </div>
      </section>

      <section className="relative w-full max-h-[500px] overflow-hidden">
  <div className="w-full h-[500px] relative">
    {['/spa3.jpg', '/spa1.jpg', '/spa4.jpg'].map((src, index) => (
      <img
        key={index}
        src={src}
        alt={`Spa Slide ${index + 1}`}
        className={`absolute w-full h-full object-cover object-center transition-opacity duration-1000 ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      />
    ))}
  </div>
 
</section>


      <InfoModal
        isOpen={showSpaMenu}
        onClose={() => setShowSpaMenu(false)}
        icon={
          <div className="flex justify-center mb-2">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-10 h-10"
            >
              <path
                stroke="#8a6b41"
                strokeWidth="1.5"
                d="M12,22 C13.5,22 16,21 16,16.5 C16,12 12,6 12,6 C12,6 8,12 8,16.5 C8,21 10.5,22 12,22 Z M12,22 C10.5,22 9.04678627,21.7792414 7,20.5 C3,18 2.5,10 2.5,10 C2.5,10 7,10.5 9,12 M12,22 C13.5,22 14.9532137,21.7792414 17,20.5 C21,18 21.5,10 21.5,10 C21.5,10 17,10.5 15,12"
              />
            </svg>
          </div>
        }
        title="Spa Menu"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[#8a6b41] font-semibold">
                <th className="px-4 py-2">Treatment Type</th>
                <th className="px-4 py-2">60 min</th>
                <th className="px-4 py-2">90 min</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {spaMenu.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 font-medium">{item.typeOfMassage}</td>
                  <td className="px-4 py-2">${item.prices?.['60']}</td>
                  <td className="px-4 py-2">${item.prices?.['90']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoModal>
     
    </motion.div>
  );
}