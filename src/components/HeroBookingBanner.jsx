import { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function HeroBookingBanner({ backgroundImage, title, subtitle, onSearch }) {
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [showPicker, setShowPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 text-center px-6 mt-60 mb--60">
        <h1 className="text-white text-4xl md:text-6xl font-heading mb-4 drop-shadow">{title}</h1>
        <p className="text-white text-lg font-light drop-shadow">{subtitle}</p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 z-10">
        <div className="backdrop-blur bg-white/50 p-4 rounded-md shadow-md w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Date Range Picker */}
            <div className="relative">
              <label className="block text-white text-sm mb-2 text-center md:text-left">When do you arrive?</label>
              <button
                className="w-full text-left px-4 py-3 rounded border bg-white text-sm flex items-center gap-2"
                onClick={() => setShowPicker(!showPicker)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" />
                </svg>
                {selectedDates.startDate.toLocaleDateString()} → {selectedDates.endDate.toLocaleDateString()}
              </button>
              {showPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="bg-white p-4 rounded shadow-lg" ref={pickerRef}>
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => {
                        setSelectedDates(item.selection);
                        setShowPicker(false);
                      }}
                      moveRangeOnFirstSelection={false}
                      ranges={[{ ...selectedDates, key: 'selection' }]}
                      months={2}
                      direction="horizontal"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Room & Guest Selector */}
            <div className="relative">
              <label className="block text-white text-sm mb-2 text-center md:text-left">Rooms & Guests</label>
              <button
                className="rounded px-4 py-3 border w-full text-sm bg-white flex justify-between items-center"
                onClick={() => setShowGuests(!showGuests)}
              >
                {`${rooms.reduce((sum, r) => sum + r.adults + r.children, 0)} Guest${rooms.reduce((sum, r) => sum + r.adults + r.children, 0) > 1 ? 's' : ''}`} ▾
              </button>
              {showGuests && (
                <div ref={guestRef} className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-lg p-4">
                  {rooms.map((room, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">ROOM {index + 1}</span>
                        {rooms.length > 1 && (
                          <button
                            onClick={() => setRooms((prev) => prev.filter((_, i) => i !== index))}
                            className="text-xs text-red-600 underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Adults</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setRooms((prev) => prev.map((r, i) => i === index ? { ...r, adults: Math.max(1, r.adults - 1) } : r))} className="w-8 h-8 bg-gray-400 text-white rounded">–</button>
                          <span>{room.adults}</span>
                          <button onClick={() => setRooms((prev) => prev.map((r, i) => i === index ? { ...r, adults: r.adults + 1 } : r))} className="w-8 h-8 border border-gray-600 rounded">+</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Children</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setRooms((prev) => prev.map((r, i) => i === index ? { ...r, children: Math.max(0, r.children - 1) } : r))} className="w-8 h-8 bg-gray-400 text-white rounded">–</button>
                          <span>{room.children}</span>
                          <button onClick={() => setRooms((prev) => prev.map((r, i) => i === index ? { ...r, children: r.children + 1 } : r))} className="w-8 h-8 border border-gray-600 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setRooms([...rooms, { adults: 1, children: 0 }])} className="text-sm text-[#705847] font-medium mt-2">
                    + Add a room
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-end">
              <button
                className="w-full bg-[#a28e68] text-white px-6 py-3 rounded hover:bg-white hover:text-[#a28e68] border border-[#a28e68] transition"
                onClick={() => onSearch?.(selectedDates, rooms)}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}