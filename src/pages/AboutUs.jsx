import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';

export default function AboutUsPage() {
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}  
      transition={{ duration: 0.8 }}
      className="bg-white"
    >
      <Header />

      <HeroBanner
        backgroundImage="/public/hotel1.jpg"
        title="About Us"
        subtitle="Discover the story behind Eightfold Urban Resort"
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

      <section className="bg-white text-center px-6 py-20">
        <div className="max-w-screen-md mx-auto space-y-6 text-gray-700 text-base leading-relaxed font-light">
          <img
            src="/Logo.png"
            alt="Eightfold Logo"
            className="mx-auto mb-6 w-20 h-20 object-contain"
          />
          <h2 className="text-3xl font-serif text-[#8a6b41]">Welcome to Eightfold</h2>
          <p>
            Nestled in the heart of Siem Reap, Eightfold Urban Resort blends timeless Khmer heritage with contemporary luxury.
            Our vision is to create a tranquil retreat where culture, comfort, and service harmonize.
          </p>
          <p>
            From our eco-conscious design to our heartfelt hospitality, every element of Eightfold tells a story rooted in elegance and purpose.
            We invite you to experience a sanctuary that feels both distinctly Cambodian and refreshingly modern.
          </p>
        </div>
      </section>

    </motion.div>
  );
}