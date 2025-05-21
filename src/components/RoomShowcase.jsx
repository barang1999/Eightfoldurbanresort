import { useEffect, useState, useRef } from 'react';
import RoomDetailModal from './RoomDetailModal';

export default function RoomShowcase({ category, propertyId }) {
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    console.log("🏷️ Filtering by category:", selectedCategory);
    const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";
    fetch(`${apiURL}/api/rooms?propertyId=${propertyId}`)
      .then(res => res.json())
      .then(data => {
        console.log("🧪 Loaded rooms:", data);
        const suiteRoomTypes = [
          "Suite Pool Access",
          "Suite with Private Pool",
          "Deluxe Family Suite"
        ];
        const standardRoomTypes = [
          "Deluxe Pool Access",
          "Deluxe Double or Twin Room with Pool View",
          "Deluxe Triple Room"
        ];

        const filtered = data.filter(room => {
          const match = selectedCategory === "Suite"
            ? suiteRoomTypes.includes(room.roomType)
            : selectedCategory === "Room"
            ? standardRoomTypes.includes(room.roomType)
            : false;

          if (match) console.log("✅ Match found:", room.roomType);
          return match;
        });
        setRooms(filtered);
      })
      .catch(err => console.error("❌ Failed to fetch rooms:", err));
  }, [selectedCategory, propertyId]);

  // Scrollable container ref and handlers
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <section className="pt-4 px-4 md:px-10 bg-white">
      <div className="flex space-x-6 mb-6 border-b">
        {['Suite', 'Room'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedCategory(type)}
            className={`pb-2 text-m font-light ${
              selectedCategory === type
                ? 'text-[#94784b] border-b-[4px] border-[#94784b]'
                : 'text-gray-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth snap-x snap-mandatory"
      >
        {rooms.map((room, idx) => (
          <div key={idx} className="flex-none w-[400px] shrink-0 space-y-4">
            <img
              src={room.images?.[0]}
              alt={room.roomType}
              className="w-full h-[200px] sm:h-[250px] object-cover rounded transition-transform duration-300 hover:scale-105"
            />
            <h3 className="text-xl font-light">{room.roomType?.toUpperCase()}</h3>
            <div className="text-sm text-gray-600 font-light space-x-4">
              {room.doubleBedCount > 0 && <span>• {room.doubleBedCount} large double bed{room.doubleBedCount > 1 ? 's' : ''}</span>}
              {room.singleBedCount > 0 && <span>• {room.singleBedCount} single bed{room.singleBedCount > 1 ? 's' : ''}</span>}
              {room.surface && <span>• {room.surface} m<sup>2</sup></span>}
            </div>
            <div className="text-gray-700 text-sm font-light space-y-1">
              {room.roomFeatures?.length > 0 && (
                <div className="block sm:hidden">
                  <strong>Features:</strong> {room.roomFeatures.slice(0, 8).join(', ')}
                </div>
              )}
              {room.roomFeatures?.length > 0 && (
                <div className="hidden sm:block">
                  <strong>Features:</strong> {room.roomFeatures.slice(0, 12).join(', ')}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-black text-white px-4 py-2 font-light hover:bg-white hover:text-black border hover:border-black transition"
                onClick={() => {
                  const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                  window.location.href = `${bookingBaseUrl}/`;
                }}
              >
                See rates
              </button>
              <button
                className="text-gray-800 underline font-light"
                onClick={() => setSelectedRoom(room)}
              >
                View details →
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination & arrows - mobile-friendly styles */}
      <div className="flex items-center justify-center gap-4 mt-[-15px] sm:mt-0">
      <button
        onClick={scrollLeft}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition"
        aria-label="Previous"
        >
        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition"
        aria-label="Next"
        >
        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      </div>
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </section>
  );
}