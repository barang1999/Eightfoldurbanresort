import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import BookingSearchBox from "../components/BookingSearchBox";
import TourShowcase from "../components/TourShowcase";
import TourDetailModal from "../components/TourDetailModal";
import TourBookingModal from "../components/TourBookingModal";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import MobileBookingModal from "../components/MobileBookingModal";
import MobileStickyCTA from "../components/MobileStickyCTA";

export default function TourExperiencePage() {
  const [tours, setTours] = useState([]);
  const [toursByType, setToursByType] = useState({ temple: [], attraction: [] });
  const [selectedTour, setSelectedTour] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
  });
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);
  const [showPicker, setShowPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const [showRates, setShowRates] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [selectedRate, setSelectedRate] = useState('');

  useEffect(() => {
    if (!selectedDates.startDate || !selectedDates.endDate) {
      setSelectedDates({ startDate: new Date(), endDate: addDays(new Date(), 1) });
    }
  }, []);

  useEffect(() => {
    const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";
    const propertyId = import.meta.env.VITE_DEFAULT_PROPERTY_ID;

    fetch(`${apiURL}/api/services?propertyId=${propertyId}`)
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(item => item.status === "active")
          : [];
        setTours(filtered);

        const templeTours = filtered.filter(t =>
          t.tags?.some(tag => typeof tag === "string" && tag.toLowerCase().includes("temple"))
        );
        const attractionTours = filtered.filter(t =>
          t.tags?.some(tag => typeof tag === "string" && tag.toLowerCase().includes("attraction"))
        );
        setToursByType({ temple: templeTours, attraction: attractionTours });
      })
      .catch(err => console.error("❌ Failed to fetch tours:", err));
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
        title="Tours & Experiences"
        subtitle="Discover our curated journeys and cultural encounters."
        backgroundImage="/angkorwat2.jpg"
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
  
      <main className="w-full px-0 md:px-8 xl:px-12 py-12 max-w-none">
        <h2 className="text-2xl font-light text-[#4a3c2f] text-center mb-10">
          Explore Our Tours
        </h2>
        <TourShowcase
          title="Temple Tours"
          tours={toursByType.temple}
          onTourSelect={setSelectedTour}
        />
        <TourShowcase
          title="Attractions"
          tours={toursByType.attraction}
          onTourSelect={setSelectedTour}
        />
      </main>
      
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBook={() => setIsBooking(true)}
        />
      )}
      {selectedTour && isBooking && (
        <TourBookingModal
          tour={selectedTour}
          onClose={() => setIsBooking(false)}
        />
      )}
    </motion.div>
  );
}