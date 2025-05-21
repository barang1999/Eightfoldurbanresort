import ReactDOM from 'react-dom';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { DateRange } from 'react-date-range';
import { useClickOutside } from '../hooks/useClickOutside';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function BookingSearchBox({
  selectedDates,
  setSelectedDates,
  rooms,
  setRooms,
  showPicker,
  setShowPicker,
  showGuests,
  setShowGuests,
  onSearch,
}) {
  const pickerRef = useRef(null);
  const guestRef = useRef(null);

  useClickOutside(pickerRef, () => setShowPicker(false));
  useClickOutside(guestRef, () => setShowGuests(false));

  const totalGuests = rooms.reduce((sum, r) => sum + r.adults + r.children, 0);

  return (
    <div className="absolute top-[80vh] left-1/2 transform -translate-x-1/2 z-10 w-full max-w-5xl px-4">
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-md shadow-md w-full max-w-6xl mx-auto min-h-[140px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* Date Picker */}
          <div className="relative">
            <label className="block text-white text-base md:text-base font-light mb-2 text-center md:text-left">
              When do you arrive?
            </label>
            <button
              className="w-full text-left px-4 py-3 rounded border bg-white text-base font-light flex items-center gap-2"
              onClick={() => setShowPicker(!showPicker)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" width="1em" height="1em">
                <path fillRule="evenodd" d="M18,3 C18.4142,3 18.75,3.33579 18.75,3.75 L18.75,5.75..." />
              </svg>
              {selectedDates.startDate.toLocaleDateString()} → {selectedDates.endDate.toLocaleDateString()}
            </button>
            {showPicker &&
              ReactDOM.createPortal(
                <motion.div
                  ref={pickerRef}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowPicker(false);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    zIndex: '9999'
                  }}
                >
                  <div
                    className="bg-white p-8 rounded shadow-lg"
                    style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: '10000',
                      backgroundColor: 'white',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      maxWidth: '90vw',
                      width: 'fit-content',
                      overflow: 'auto'
                    }}
                  >
                    <DateRange
                      editableDateInputs
                      moveRangeOnFirstSelection={false}
                      ranges={[{ ...selectedDates, key: 'selection' }]}
                      onChange={(item) => {
                        const selection = item.selection;
                        setSelectedDates(selection);
                        if (selection.startDate && selection.endDate) {
                          const checkIn = selection.startDate.toLocaleDateString('sv-SE');
                          const checkOut = selection.endDate.toLocaleDateString('sv-SE');
                          localStorage.setItem("debug_checkIn", checkIn);
                          localStorage.setItem("debug_checkOut", checkOut);
                          console.log("📥 Stored in localStorage:");
                          console.log("debug_checkIn:", checkIn);
                          console.log("debug_checkOut:", checkOut);
                        }
                        if (
                          selection.startDate &&
                          selection.endDate &&
                          selection.startDate.getTime() !== selection.endDate.getTime()
                        ) {
                          setShowPicker(false);
                        }
                      }}
                      months={2}
                      direction="horizontal"
                      showDateDisplay={false}
                      showSelectionPreview={true}
                      retainEndDateOnFirstSelection={false}
                      showPreview={true}
                      rangeColors={["#3b82f6"]}
                    />
                  </div>
                </motion.div>,
                document.body
              )}
          </div>

          {/* Guest Selector */}
          <div className="relative">
            <label className="block text-white text-base md:text-base font-light mb-2 text-center md:text-left">
              Rooms & Guests
            </label>
            <button
              className="rounded px-4 py-3 border w-full text-base font-light bg-white flex justify-between items-center"
              onClick={() => setShowGuests(!showGuests)}
            >
              {`${totalGuests} Guest${totalGuests > 1 ? 's' : ''}`} <span>▾</span>
            </button>
            {showGuests &&
              ReactDOM.createPortal(
                <motion.div
                  ref={guestRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999
                  }}
                >
                  <div className="bg-white w-[320px] md:w-[420px] max-h-[80vh] overflow-y-auto border border-[#705847] rounded shadow-lg p-4">
                    {rooms.map((room, index) => (
                      <div key={index} className="mb-4">
                        <span className="block text-xs text-gray-500 mb-2">ROOM {index + 1}</span>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-800">Adult(s)</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setRooms((prev) =>
                                  prev.map((r, i) =>
                                    i === index ? { ...r, adults: Math.max(1, r.adults - 1) } : r
                                  )
                                )
                              }
                              className="w-8 h-8 bg-gray-400 text-white rounded"
                            >
                              –
                            </button>
                            <span>{room.adults}</span>
                            <button
                              onClick={() =>
                                setRooms((prev) =>
                                  prev.map((r, i) =>
                                    i === index ? { ...r, adults: r.adults + 1 } : r
                                  )
                                )
                              }
                              className="w-8 h-8 border border-gray-600 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-800">Child(ren)</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setRooms((prev) =>
                                  prev.map((r, i) =>
                                    i === index ? { ...r, children: Math.max(0, r.children - 1) } : r
                                  )
                                )
                              }
                              className="w-8 h-8 bg-gray-400 text-white rounded"
                            >
                              –
                            </button>
                            <span>{room.children}</span>
                            <button
                              onClick={() =>
                                setRooms((prev) =>
                                  prev.map((r, i) =>
                                    i === index ? { ...r, children: r.children + 1 } : r
                                  )
                                )
                              }
                              className="w-8 h-8 border border-gray-600 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        {index < rooms.length - 1 && <hr className="my-4" />}
                        {rooms.length > 1 && (
                          <div className="text-right">
                            <button
                              onClick={() => setRooms((prev) => prev.filter((_, i) => i !== index))}
                              className="text-sm text-gray-700 underline hover:text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setRooms([...rooms, { adults: 1, children: 0 }])}
                      className="text-[#705847] text-sm font-medium flex items-center gap-1 mt-2"
                    >
                      <span className="text-lg">＋</span> Add a room
                    </button>
                  </div>
                </motion.div>,
                document.body
              )}
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              className="w-full bg-[#a28e68] text-white px-6 py-3 rounded hover:bg-white hover:text-[#a28e68] transition text-base border border-[#a28e68]"
              onClick={() => {
                // Debugging output for date formatting
                console.log("📅 Check-in (raw):", selectedDates.startDate);
                console.log("📅 Check-out (raw):", selectedDates.endDate);

                const checkIn = selectedDates.startDate.toLocaleDateString('sv-SE');
                const checkOut = selectedDates.endDate.toLocaleDateString('sv-SE'); // gives yyyy-mm-dd in local time
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
                const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;

                window.location.href = `${bookingBaseUrl}/?${params.toString()}`;
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}