import { useState, useEffect } from 'react';
import Header from './Header';
import HeroBanner from './HeroBanner';
import BookingSearchBox from './BookingSearchBox';
import MobileBookingModal from './MobileBookingModal';
import MobileStickyCTA from './MobileStickyCTA';
import InfoModal from './InfoModal';
import Footer from './Footer';
import FacilityInfoSection from './FacilityInfoSection';

export default function FacilityPage({
  title,
  subtitle,
  heroImage,
  slideshowImages = [],
  descriptionText,
  infoModalData = [],
  infoModalTitle = 'More Info',
  fetchUrl,
  ctaLabel = 'See Menu',
  dataSelector = (data, propertyId, mapFunction = null) => {
    console.log('Fetched data:', data);
    const matched = Array.isArray(data) ? data.find(r => r.propertyId === propertyId) : null;
    if (!matched) return [];

    const entries =
      matched.menu ||
      matched.services ||
      matched.events ||
      [];

    return mapFunction
      ? entries.map(mapFunction)
      : entries.map(item => ({
          label: item?.name || item?.title || item?.typeOfMassage || '',
          value: item?.price || item?.cost || item?.rate || '',
        }));
  },
  infoSectionProps = null,
  extraTopElement = null, // ✅ Add this line
}) {
  const user = JSON.parse(localStorage.getItem('user'));
  const propertyId = '6803cba3dadf9a0d829427fe';
  const [selectedDates, setSelectedDates] = useState({ startDate: new Date(), endDate: new Date() });
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [showPicker, setShowPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [selectedRate, setSelectedRate] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [items, setItems] = useState(infoModalData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  

  useEffect(() => {
    if (fetchUrl) {
      async function fetchData() {
        try {
          const urlWithProperty = fetchUrl?.includes('propertyId') ? fetchUrl : `${fetchUrl}?propertyId=${propertyId}`;
          const res = await fetch(urlWithProperty);
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            console.log('[FacilityPage] Raw fetched data:', data);
            const selected = dataSelector(data, propertyId, data.mapFunction);
            console.log('[FacilityPage] Selected data after dataSelector:', selected);
            setItems(selected);
          } else {
            const text = await res.text();
            console.error("Expected JSON, got:", text);
          }
        } catch (err) {
          console.error('Failed to fetch facility data:', err);
        }
      }
      fetchData();
    }
  }, [fetchUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideshowImages]);

  return (
    <>
      <Header />

      <HeroBanner backgroundImage={heroImage} title={title} subtitle={subtitle} />

      {extraTopElement}

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
          onSearch={() => console.log('Search', selectedDates, rooms)}
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
     


      <section className="bg-white text-center px-6 py-20">
        <div className="max-w-screen-md mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-[#8a6b41] leading-snug">
            {title}
          </h2>
          {typeof descriptionText === 'string' ? (
            <>
              <p className="text-gray-700 text-base font-light leading-relaxed whitespace-pre-line">
                {showFullText
                  ? descriptionText
                  : descriptionText.trim().split(/\s+/).slice(0, 41).join(' ') + (descriptionText.trim().split(/\s+/).length > 41 ? '...' : '')}
              </p>
              {descriptionText.trim().split(/\s+/).length > 41 && (
                <button
                  onClick={() => setShowFullText(prev => !prev)}
                  className="text-[#a28e68] underline text-sm mt-2"
                >
                  {showFullText ? 'See less' : 'See more'}
                </button>
              )}
              <div className="flex flex-col items-center gap-4 mt-4">
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
                >
                  {ctaLabel}
                </button>
              </div>
            </>
          ) : (
            <>{descriptionText}</>
          )}
        </div>
      </section>
      {infoSectionProps && (
        <>
          {console.log('[FacilityPage] infoSectionProps:', infoSectionProps)}
          <FacilityInfoSection {...infoSectionProps} />
        </>
      )}

      {slideshowImages.length > 0 && (
        <section className="relative w-full max-h-[500px] overflow-hidden">
          <div className="w-full h-[500px] relative">
            {slideshowImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Slide ${index + 1}`}
                className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      


      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} title={infoModalTitle}>
        {typeof infoModalData === 'function'
          ? infoModalData(items)
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#8a6b41] font-semibold">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {items.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium">
                        {entry.label || entry.name || entry.title || entry.typeOfMassage || ''}
                      </td>
                      <td className="px-4 py-2">
                      {entry.value || entry.price || entry.cost || entry.rate ? `$${entry.value || entry.price || entry.cost || entry.rate}` : ''}                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </InfoModal>
    </>
  );
}