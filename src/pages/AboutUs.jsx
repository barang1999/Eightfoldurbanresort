import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';
import HotelFacilitySection from '../components/HotelFacilitySection';
import HotelPolicySection from '../components/HotelPolicySection';
import { ChevronDown } from "lucide-react";

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
        backgroundImage="/hotel1.jpg"
        title="About Us"
        subtitle="Discover the story behind Eightfold Urban Resort"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex justify-center mt-[-120px] mb-20 md:mt-[-40px] md:mb-8"
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

      <section className="bg-white text-center px-6 mt-0 py-20">
        <div className="max-w-screen-md mx-auto space-y-6 text-gray-700 text-base leading-relaxed font-light">
          <img
            src="/Logo.png"
            alt="Eightfold Logo"
            className="mx-auto mb-6 w-20 h-20 object-contain"
          />
         <h2 className="text-3xl font-serif text-[#8a6b41]">Our Story &amp; Philosophy</h2>
          <p>
            With over a decade of excellence in the hospitality industry, <strong>Eightfold Hospitality Group</strong> has become a symbol of heartfelt service and meaningful travel experiences. For the past 10 years, we have refined our approach with one unwavering belief — that every guest deserves our full attention, sincere care, and a stay they’ll always remember.
          </p>
          <p>
            At the core of our philosophy is the <strong>commitment to genuine hospitality</strong> — not just as a service, but as a deeply personal connection. Whether it's a warm smile at check-in or a thoughtful gesture during your stay, our team is trained to anticipate your needs and exceed your expectations.
          </p>
          <p>
            We’re also proud of our social impact. <strong>Many of our team members joined with little or no prior experience in hospitality.</strong> At Eightfold, we invest in people — providing hands-on training, mentorship, and opportunities for growth. Through this, we not only build careers but cultivate a culture where kindness, professionalism, and purpose flourish.
          </p>
          <p>
            Each visit to Eightfold is more than just a stay — it’s a story of dedication, transformation, and hospitality from the heart.
          </p>
        </div>
      </section>

      <section className="bg-[#fdfaf6] px-6 py-20 text-center">
        <h2 className="text-3xl font-serif text-[#8a6b41] mb-4">Design That Inspires Serenity</h2>
        <div className="max-w-3xl text-base font-light mx-auto text-gray-700 space-y-4">
          <p>
            At Eightfold Urban Resort, design is more than architecture—it is a philosophy of balance. Every space has been thoughtfully crafted to immerse our guests in a sense of peace and natural beauty. From the moment you step into our resort, you're surrounded by lush tropical greenery, calming water features, and modern interiors that echo traditional Cambodian aesthetics.
          </p>
          <p>
            Our <strong>pool access rooms</strong> invite you to step from your private sanctuary directly into the cooling embrace of water, while floor-to-ceiling windows frame vibrant garden views and flood each room with natural light. Locally sourced materials, minimalist lines, and subtle textures converge to create an environment of refined relaxation.
          </p>
          <p>
            Whether enjoying a morning coffee under the shade of a frangipani tree or unwinding in your room’s intimate garden lounge, every detail has been curated to elevate comfort and serenity. We believe luxury is found in simplicity, nature, and the restorative feeling of space designed for the soul.
          </p>
        </div>
      </section>

      {/* Award-Winning Hospitality Section */}
      <section className="py-16 px-6">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Top-Rated by Guests Worldwide</h2>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tripadvisor */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border-t-[3px] border-[#8a6b41]">
              <div className="text-2xl font-bold text-green-700">Tripadvisor</div>
              <div className="text-3xl font-bold text-green-600">5.0 / 5.0</div>
              <div className="flex justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.4 8.164L12 18.896l-7.334 3.866 1.4-8.164L.132 9.21l8.2-1.192z"/></svg>
                ))}
              </div>
              <p className="text-gray-600 italic">“A peaceful oasis in Siem Reap — from heartfelt welcomes to surprise gifts and lush poolside serenity, every moment at Eightfold feels personal, elegant, and unforgettable.”</p>
              <a href="https://www.tripadvisor.com/Hotel_Review-g297390-d25173268-Reviews-Eightfold_Urban_Resort-Siem_Reap_Siem_Reap_Province.html" target="_blank" rel="noopener noreferrer" className="text-green-700 underline text-sm hover:text-green-800">See all reviews on Tripadvisor →</a>
            </div>

            {/* Booking.com */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border-t-[3px] border-[#8a6b41]">
              <div className="text-2xl font-bold text-[#0064e0]">Booking.com</div>
              <div className="text-3xl font-bold text-blue-600">9.6 / 10</div>
              <div className="flex justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.4 8.164L12 18.896l-7.334 3.866 1.4-8.164L.132 9.21l8.2-1.192z"/></svg>
                ))}
              </div>
              <p className="text-gray-600 italic">“A hidden gem in Siem Reap — exceptional service, relaxing pool, and warm-hearted staff who go above and beyond. Truly unforgettable.”</p>
              <a href="https://www.booking.com/hotel/kh/eightfold-urban-resort.en-us.html?label=New_English_EN_KH_27027142105-bickLRGJk0Y6UwpZjpjGIQS637942138739%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atidsa-199482059065%3Alp9069937%3Ali%3Adec%3Adm%3Aag27027142105%3Acmp400679065&sid=5ce5c632d77df7a72930c652ce122270&aid=318615#tab-reviews" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm hover:text-blue-800">See all reviews on Booking.com →</a>
            </div>
          </div>
        </div>
      </section>


    </motion.div>
  );
}