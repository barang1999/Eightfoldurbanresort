import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileBookingModal({
  showRates,
  setShowRates,
  showMobileCalendar,
  setShowMobileCalendar,
  selectedDates,
  setSelectedDates,
  rooms,
  setRooms,
  selectedRate,
  setSelectedRate
}) {
  return (
    <AnimatePresence>
      <>
        {showRates && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-y-auto p-6"
          >
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowRates(false)} className="text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="bg-white space-y-6">
                <div>
                  <label className="block text-gray-800 text-sm mb-2">When do you arrive?</label>
                  <button
                    className="w-full text-left px-4 py-3 rounded border border-gray-300 bg-white text-sm flex items-center gap-2"
                    onClick={() => {
                      setShowMobileCalendar(true);
                      setShowRates(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M18,3 C18.4142,3 18.75,3.33579 18.75,3.75L18.75,5.75H20C20.5523,5.75 21,6.19772 21,6.75V19.75C21,20.3023 20.5523,20.75 20,20.75H4C3.44772,20.75 3,20.3023 3,19.75V6.75C3,6.19772 3.44772,5.75 4,5.75H5.25V3.75C5.25,3.33579 5.58579,3 6,3C6.41421,3 6.75,3.33579 6.75,3.75V5.75H17.25V3.75C17.25,3.33579 17.5858,3 18,3Z M4.5,10H19.5V7.25H4.5V10Z M4.5,11.5V19.25H19.5V11.5H4.5Z" />
                    </svg>
                    {selectedDates.startDate.toLocaleDateString()} → {selectedDates.endDate.toLocaleDateString()}
                  </button>
                </div>

                <div>
                  <label className="block text-gray-800 text-sm mb-2">Rooms & Guests</label>
                  <div className="space-y-4">
                    {rooms.map((room, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">ROOM {index + 1}</span>
                          {rooms.length > 1 && (
                            <button
                              onClick={() => setRooms(rooms.filter((_, i) => i !== index))}
                              className="text-xs text-red-600 underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-800">Adult(s)</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setRooms((prev) => prev.map((r, i) =>
                                i === index ? { ...r, adults: Math.max(1, r.adults - 1) } : r))}
                              className="w-8 h-8 border border-gray-300 rounded text-lg text-gray-700"
                            >–</button>
                            <span>{room.adults}</span>
                            <button
                              onClick={() => setRooms((prev) => prev.map((r, i) =>
                                i === index ? { ...r, adults: r.adults + 1 } : r))}
                              className="w-8 h-8 border border-gray-300 rounded text-lg text-gray-700"
                            >+</button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-800">Child(ren)</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setRooms((prev) => prev.map((r, i) =>
                                i === index ? { ...r, children: Math.max(0, r.children - 1) } : r))}
                              className="w-8 h-8 border border-gray-300 rounded text-lg text-gray-700"
                            >–</button>
                            <span>{room.children}</span>
                            <button
                              onClick={() => setRooms((prev) => prev.map((r, i) =>
                                i === index ? { ...r, children: r.children + 1 } : r))}
                              className="w-8 h-8 border border-gray-300 rounded text-lg text-gray-700"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setRooms([...rooms, { adults: 1, children: 0 }])}
                      className="text-[#8a6b41] text-sm font-medium flex items-center gap-1"
                    >
                      <span className="text-lg">＋</span> Add a room
                    </button>
                  </div>
                </div>

                <div className="hidden md:block">
                  <label className="block text-gray-800 text-sm mb-2">Special rates</label>
                  <select
                    className="w-full border border-gray-300 rounded px-4 py-3 bg-white text-gray-800 text-sm"
                    value={selectedRate}
                    onChange={e => setSelectedRate(e.target.value)}
                  >
                    <option value="">Select a rate</option>
                    <option value="Standard Rate">Standard Rate</option>
                    <option value="Member Rate">Member Rate</option>
                    <option value="Non-refundable">Non-refundable</option>
                    <option value="Advance Purchase">Advance Purchase</option>
                  </select>
                </div>

                <button
                  className="w-full bg-[#8a6b41] text-white py-3 rounded text-lg"
                  onClick={() => {
                    try {
                      console.log("📅 Check-in (raw):", selectedDates.startDate);
                      console.log("📅 Check-out (raw):", selectedDates.endDate);

                      const checkIn = selectedDates.startDate.toLocaleDateString('sv-SE');
                      const checkOut = selectedDates.endDate.toLocaleDateString('sv-SE');
                      localStorage.setItem("debug_checkIn", checkIn);
                      localStorage.setItem("debug_checkOut", checkOut);
                      const adults = rooms.reduce((sum, r) => sum + r.adults, 0);
                      const children = rooms.reduce((sum, r) => sum + r.children, 0);
                      console.log("📅 Final URL Params:", {
                        checkIn,
                        checkOut,
                        adults,
                        children
                      });
                      const params = new URLSearchParams({
                        checkIn,
                        checkOut,
                        adults: adults.toString(),
                        children: children.toString()
                      });
                      window.location.href = `${import.meta.env.VITE_BOOKING_URL}/?${params.toString()}`;
                    } catch (err) {
                      console.error("❌ Failed to submit search:", err);
                    }
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showMobileCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white w-screen min-h-[var(--app-height)] overflow-y-auto flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">When do you arrive?</h2>
              <button
                onClick={() => {
                  setShowMobileCalendar(false);
                  setShowRates(true);
                }}
                className="text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="w-full px-4 flex-1 flex flex-col">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  const selection = item.selection;
                  setSelectedDates(selection);
                  if (selection.startDate && selection.endDate) {
                    const checkIn = selection.startDate.toLocaleDateString('sv-SE');
                    const checkOut = selection.endDate.toLocaleDateString('sv-SE');
                    localStorage.setItem("debug_checkIn", checkIn);
                    localStorage.setItem("debug_checkOut", checkOut);
                    console.log("📥 Mobile Stored:");
                    console.log("debug_checkIn:", checkIn);
                    console.log("debug_checkOut:", checkOut);
                  }
                }}
                moveRangeOnFirstSelection={false}
                ranges={[{ ...selectedDates, key: 'selection' }]}
                months={2}
                direction="vertical"
              />
            </div>

            <div className="p-4">
              <button
                className="w-full bg-[#705847] text-white py-3 rounded text-lg"
                onClick={() => {
                  const debugCheckIn = localStorage.getItem("debug_checkIn");
                  const debugCheckOut = localStorage.getItem("debug_checkOut");
                  console.log("📤 Submit clicked with localStorage values:");
                  console.log("debug_checkIn:", debugCheckIn);
                  console.log("debugCheckOut:", debugCheckOut);
                  setShowMobileCalendar(false);
                  setShowRates(true);
                }}
              >
                Submit
              </button>
            </div>
          </motion.div>
        )}
      </>
    </AnimatePresence>
  );
}