import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Header from '../components/Header';
import RoomShowcase from '../components/RoomShowcase';
import BookingSearchBox from '../components/BookingSearchBox';
import RestaurantShowcase from '../components/RestaurantShowcase';
import TourShowcase from '../components/TourShowcase';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../pages/home.css';
import SectionNav from '../components/SectionNav';
import GallerySlider from '../components/GallerySlider';
import WellnessHighlight from '../components/WellnessHighlight';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MapEmbed from '../components/MapEmbed';
import MobileBookingModal from '../components/MobileBookingModal';
import MobileStickyCTA from '../components/MobileStickyCTA';
import HeroBanner from '../components/HeroBanner';

export default function Home() {
  // BookingSearchBox local state for controlled props
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  // Modal and rate selection state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  // Modal and rate selection state
  const [showRates, setShowRates] = useState(false);
  const [selectedRate, setSelectedRate] = useState('');
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [googleMapEmbed, setGoogleMapEmbed] = useState('');
  const [hideMainMenu, setHideMainMenu] = useState(false);
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  // Page loading state for branding experience
  const [isLoading, setIsLoading] = useState(true);
  // Scroll-to-top button state
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const pickerRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuests(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ADMIN_API_URL}/api/property?propertyId=6803cba3dadf9a0d829427fe`)
      .then(res => {
        const embedHTML = res.data.googleMapEmbed || '';
        const match = embedHTML.match(/src="([^"]+)"/);
        const extractedSrc = match ? match[1] : '';
        console.log('📍 Extracted Map src:', extractedSrc);
        setGoogleMapEmbed(extractedSrc);
      })
      .catch(err => {
        console.error('❌ Failed to fetch property embed map:', err);
      });
  }, []);

  useEffect(() => {
    const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";
    fetch(`${apiURL}/api/services?propertyId=6803cba3dadf9a0d829427fe`)
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(item => item.status === "active")
          : [];
        setTours(filtered);
      })
      .catch(err => console.error("❌ Failed to fetch tours:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const trigger = document.getElementById('introduction');
      if (trigger) {
        const triggerTop = trigger.getBoundingClientRect().top + window.scrollY;
        setHideMainMenu(scrollY >= triggerTop - 130);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 bg-white flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl font-heading text-[#8a6b41]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            Eightfold Urban Resort
          </motion.h1>
        </motion.div>
      ) : (
        <>
          <Header hideMenu={hideMainMenu} />
          <HeroBanner
            backgroundImage="/hero-pool.webp"
            title="Eightfold Urban Resort"
            subtitle="By Eightfold Hospitality Group" 
          />
          <div className="hidden md:block">
            <BookingSearchBox
              rooms={rooms}
              setRooms={setRooms}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              showGuests={showGuests}
              setShowGuests={setShowGuests}
              onSearch={() => console.log('Search triggered')}
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

          <motion.div
            initial={false}
            animate={{ top: hideMainMenu ? '4rem' : '4.5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="sticky z-20 bg-white shadow-sm"
            style={{ position: 'sticky' }}
          >
            <SectionNav />
          </motion.div>

          <div className="block md:hidden">
            <SectionNav />
          </div>

          <section id="introduction" className="scroll-mt-32 py-10 px-6 bg-white text-center">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-4xl font-serif text-[#a28e68] mb-4">Bonjour, ជំរាបសួរ</h2>
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-4 font-light tracking-wide">
                Welcome to Eightfold Urban Resort — a modern 5-star retreat in Siem Reap blending Khmer charm and contemporary design. Located in the peaceful Sala Kamreuk commune, just minutes from Angkor Wat, our boutique hotel offers 46 stylish rooms, a serene pool, spa, and exceptional service. Whether you’re here for leisure or business, enjoy a tranquil escape in the heart of Cambodia.
              </p>
              <div className="mt-6 text-sm text-gray-600 font-light space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Sala Kamreuk, 171204, SIEM REAP, Cambodia</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.13A19.5 19.5 0 0 1 4.21 10.8a19.86 19.86 0 0 1-3.13-8.63A2 2 0 0 1 3.07 0h3a2 2 0 0 1 2 1.72c.12.83.3 1.65.54 2.45a2 2 0 0 1-.45 2.11L6.1 8.13a16 16 0 0 0 9.76 9.76l1.85-.73a2 2 0 0 1 2.11.45c.8.24 1.62.42 2.45.54A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+855 92 500 400</span>
                </div>
              </div>
            </div>
          </section>

          <section id="gallery" className="scroll-mt-32 py-10 px-6 bg-white">
            <GallerySlider />
          </section>

          <section id="rooms" className="scroll-mt-32 py-6 px-2 bg-white-50">
            <h2 className="text-2xl font-light mb-4 px-6 md:px-10">Suites & Rooms</h2>
            <RoomShowcase
              category="Suite"
              propertyId="6803cba3dadf9a0d829427fe"
              apiURL={import.meta.env.VITE_API_URL || "http://localhost:7071"}
            />
          </section>

          <section id="wellness" className="text-center scroll-mt-32 py-10 px-6 bg-white">
            <div className="flex justify-center mb-4">
              <svg className="w-14 h-14" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#8a6b41">
                <path d="M860.16 511.488c-7.168-85.504-55.808-305.152-351.744-491.008l-4.608-3.072-4.608 3.072c-1.024 0.512-98.816 64.512-190.976 164.864-54.272 58.88-96.256 118.784-124.416 177.664-35.328 74.24-49.152 147.456-40.96 217.6 21.504 181.248 122.88 262.144 210.432 277.504 10.752 2.048 22.016 3.072 32.256 3.072 41.472 0 78.848-14.336 103.936-39.424 4.608 108.032 51.2 178.176 53.248 181.76l13.824-9.216c-0.512-1.024-51.712-78.848-50.688-193.024v-0.512c28.16 18.432 127.488 76.288 215.552 37.888 73.216-32.256 118.272-122.368 134.144-267.776 0.512-3.584 1.024-7.68 1.536-11.264 2.048-15.872 4.096-31.744 3.072-48.128z m-360.448-165.376L394.24 124.416c44.032-39.424 82.432-67.584 101.376-80.896 1.024 42.496 3.584 167.424 4.096 302.592z m12.8-302.592c33.792 22.016 64.512 44.544 91.648 67.072l-87.552 228.864c-1.024-132.608-3.072-252.928-4.096-295.936z m2.56 601.088c12.8-25.088 161.28-317.44 219.136-399.36 53.248 71.68 80.896 138.752 95.232 192-54.784 39.936-253.952 208.384-315.904 261.12 0.512-16.896 1.024-34.816 1.536-53.76z m208.384-413.696c-48.128 66.048-163.84 289.792-207.36 374.784 1.024-66.56 1.536-144.384 1.024-220.672l100.864-263.68c42.496 36.864 77.312 73.728 105.472 109.568z m-403.456-33.792c20.48-22.528 41.472-43.008 61.44-60.928l118.784 249.856c0.512 73.728 0 148.992-1.024 214.016-49.152-100.352-195.584-315.904-221.184-353.28 14.336-17.92 28.16-34.304 41.984-49.664z m-52.736 62.976c67.584 99.328 223.232 334.848 230.912 382.976-0.512 21.504-1.024 40.96-2.048 58.88C435.712 639.488 208.384 474.112 170.496 446.976c18.944-69.12 56.32-133.12 96.768-186.88zM166.4 464.384c50.688 36.864 273.92 199.68 321.536 252.416-120.832 64-286.208-34.816-308.224-48.64-8.704-26.624-15.872-56.32-19.968-90.112-4.608-38.4-1.536-76.8 6.656-113.664z m189.952 377.344c-60.416-10.752-128.512-55.296-167.424-147.968 20.48 11.264 53.76 28.16 94.208 41.984 82.432 27.136 155.136 26.112 211.456-3.072-0.512 9.728-1.536 17.92-2.048 25.088-1.536 13.312-2.56 26.112-2.56 38.4-26.112 37.376-77.824 55.296-133.632 45.568z m358.912-18.432c-93.184 40.96-205.312-40.448-206.336-41.472l-1.536-1.024c0.512-6.656 1.024-13.824 1.536-20.992 1.024-6.656 1.536-14.848 2.048-23.552 16.896 8.704 47.104 20.48 93.184 20.48 50.176 0 118.784-13.312 207.872-57.856-21.504 63.488-53.76 105.472-96.768 124.416z m125.44-265.728c-0.512 3.584-1.024 7.68-1.536 11.264-4.608 40.448-11.264 76.288-19.968 108.032-114.688 59.392-194.048 66.56-240.128 61.952-33.28-3.584-54.272-13.312-65.024-19.456 44.544-37.888 255.488-216.576 319.488-264.192 5.12 23.552 8.192 43.008 9.216 58.88 1.536 13.824 0 28.16-2.048 43.52z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-4">Wellness</h2>
          </section>

          <WellnessHighlight
            items={[
              {
                title: "Spa",
                description: "Our spa suites offer a tranquil escape after a day at Angkor. Rejuvenate with traditional Khmer massages, soothing aromatherapy, and revitalizing herbal compress treatments — all thoughtfully crafted to restore balance and wellbeing.",
                image: "/spa5.webp",
                buttonText: "Discover More"
              },
              {
                title: "Eightfold Swimming Pool",
                description: "Our tranquil pool area invites you to relax and refresh under the Siem Reap sun. Choose between our lush poolside sun loungers or elevated upper-deck loungers for a quiet escape. Enjoy full poolside service as you unwind, sip, and soak in the serene atmosphere of Eightfold Urban Resort.",
                image: "/pool1.webp",
                buttonText: "Discover More"
              }
            ]}
            onDiscover={(index) => {
              if (index === 0) navigate('/spa');
              if (index === 1) navigate('/pool');
            }}
          />

          <section id="dining" className="scroll-mt-32 py-10 px-1 md:px-10 bg-white">
            <h2 className="text-2xl font-light mb-4 px-4 md:px-10">Restaurants & Bars</h2>
            <RestaurantShowcase propertyId="6803cba3dadf9a0d829427fe" />
          </section>

          <section id="tour" className="scroll-mt-32 py-10 px-1 md:px-10 bg-white">
            <TourShowcase
              title="Tours & Experiences"
              tours={tours
                .filter(t => t.tags?.includes('temple'))
                .sort((a, b) => (a.priority ?? 9999) - (b.priority ?? 9999))}
            />
          </section>
          <section id="sustainability" className="bg-[#f9f7f3] py-16 md:py-20 px-6 scroll-mt-32">
            <div className="max-w-screen-xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 items-center px-8 md:px-16 max-w-[1200px]">
              <div className="text-center md:text-left px-4 sm:px-6 order-2 md:order-1">
                <h3 className="text-3xl font-light text-[#4a3c2f] mb-6 text-center md:text-center">Sustainability</h3>
                <p className="text-gray-700 text-base font-light max-w-md mx-auto leading-relaxed mb-8 sm:mb-6">
                  At Eightfold Urban Resort, sustainability is our way of life — where green spaces, mindful architecture, and community values come together to protect the beauty of Siem Reap for generations to come.
                </p>
                {/*
                <button className="border border-black px-6 py-3 text-base uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200">
                  Discover More
                </button>
                */}
              </div>
              <div className="w-full flex justify-center md:justify-end order-1 md:order-2">
                <img
                  src="/hotel1.jpg"
                  alt="Sustainability at Eightfold Urban Resort"
                  className="w-full h-auto rounded-md shadow-md transition-opacity duration-700"
                />
              </div>
            </div>
          </section>

          <MapEmbed id="location" propertyId="6803cba3dadf9a0d829427fe" />

          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-20 right-1 md:right-5 z-50 p-2 rounded-full transition-all duration-300
                bg-white/90 text-[#8a6b41] shadow-md hover:bg-white
                md:p-3 md:bg-white md:shadow-md md:block
                sm:p-1 sm:bg-transparent sm:shadow-none sm:text-[#8a6b41]"
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}

        </>
      )}
    </AnimatePresence>
  );
}

