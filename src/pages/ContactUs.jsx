import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import BookingSearchBox from '../components/BookingSearchBox';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';
import MapEmbed from '../components/MapEmbed';
import SupportButton from '../components/SupportButton';
import { ChevronDown } from "lucide-react";

export default function ContactUsPage() {
  const PROPERTY_ID = import.meta.env.VITE_EIGHTFOLD_PROPERTY_ID;

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
  const [propertyInfo, setPropertyInfo] = useState({});

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";

    fetch(`${apiURL}/api/property?propertyId=${PROPERTY_ID}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setPropertyInfo(data);
      })
      .catch(err => console.error("❌ Failed to fetch property info:", err));
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
        backgroundImage="/Eightfold.webp"
        title="Contact Us"
        subtitle="We’re here to assist you with your stay at Eightfold Urban Resort"
      />

       <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex justify-center mt-[-120px] mb-40 md:mt-[-40px] md:mb-8"
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

      <section className="bg-white px-6 py-20">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700 text-base leading-relaxed font-light">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-[#8a6b41]">Get in Touch</h2>
            <p>We’re happy to answer your questions or assist with your reservations.</p>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>{propertyInfo.address || "St. Luke Area, Siem Reap, Cambodia"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>+855 {propertyInfo.phone || "+855 (0)12 345 678"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{propertyInfo.email || "info@eightfoldurban.com"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Send Us a Message</h3>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                  setEmailError(true);
                  return;
                }
                setEmailError(false);
                setIsSubmitting(true);
                try {
                  const response = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/contact-message`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                  });

                  const result = await response.json();
                  console.log("✅ Message sent:", result);

                  // Reset form on success
                  if (response.ok) {
                    setFormData({ name: '', email: '', message: '' });
                  }
                } catch (error) {
                  console.error("❌ Failed to send message:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 px-4 py-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                className={`w-full border px-4 py-2 rounded ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
              )}
              <textarea
                placeholder="Your Message"
                className="w-full border border-gray-300 px-4 py-2 rounded h-32"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <div className="flex justify-start mt-8">
                <button
                  type="submit"
                  className="bg-[#8a6b41] hover:bg-[#7a5f35] text-white text-lg font-medium px-10 py-3 rounded-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    

    <MapEmbed id="location" propertyId={PROPERTY_ID} />
      
    <SupportButton
          propertyId={PROPERTY_ID}
          className="fixed bottom-4 right-0 md:bottom-12 md:right-6 z-40"
        />

    </motion.div>
  );
}