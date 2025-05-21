import axios from 'axios';
import React, { useState, useRef, useEffect } from "react";
import BookingSuccessModal from "./BookingSuccessModal";
import { useUserProfile } from "../hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox } from "@headlessui/react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// SkeletonBlock for loading placeholders
const SkeletonBlock = ({ className }) => (
  <motion.div
    className={`bg-gray-200 rounded ${className}`}
    initial={{ backgroundPosition: '100% 0' }}
    animate={{ backgroundPosition: '-100% 0' }}
    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
    style={{
      backgroundImage: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '200% 100%',
    }}
  />
);

export default function TourBookingModal({ tour, onClose }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .react-calendar__month-view__weekdays__weekday abbr {
        border-bottom: none !important;
        text-decoration: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const title = tour?.category || "";
  const userProfile = useUserProfile();
  const userUid = userProfile?.uid || userProfile?.user?.uid;
  const profileName = userProfile?.name;
  const profileEmail = userProfile?.email;
const containerRef = useRef();
const [loading, setLoading] = useState(true);
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transportType, setTransportType] = useState(
    tour.transportation?.defaultType || ""
  );
  const [fullName, setFullName] = useState(
    userProfile?.name === "Guest" || userProfile?.isAnonymous ? "" : profileName || ""
  );
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [email, setEmail] = useState(profileEmail || "");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today;
  });
  const [time, setTime] = useState("");
  const [addSunrise, setAddSunrise] = useState(false);
  const [addBackTown, setAddBackTown] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userUid) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, "users", userUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.fullName && !fullName) {
          setFullName(data.fullName);
        }
        if (data.email && !email) {
          setEmail(data.email);
        }
        if (data.phone && !phone) {
          setPhone(data.phone);
        }
      }

      // Always attempt to fetch contact regardless of above
      const contactRef = doc(db, "users", userUid, "profile", "contact");
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const contactData = contactSnap.data();
        if (contactData.phone && !phone) {
          setPhone(contactData.phone);
        }
      }
      setLoading(false);
    };
    // Guard clause for guest or signed-out user
    if (userProfile?.isAnonymous || userProfile?.name === "Guest") {
      setLoading(false);
      return;
    }
    fetchUserDetails();
  }, [userUid, userProfile]);

  // Build transportOptions array as per requirements
  const transportOptions = [];
  const tukTuk = tour.transportation?.tukTuk || {};
  const car = tour.transportation?.car || {};
  const van = tour.transportation?.van || {};

  if (tour.transportation?.availableTypes?.includes("Tuk-Tuk")) {
    if (typeof tukTuk.price1to2 === "number") {
      transportOptions.push({ label: "Tuk-Tuk (1–2 pax)", value: "tukTuk1to2", price: tukTuk.price1to2 });
    }
    if (typeof tukTuk.price3to4 === "number") {
      transportOptions.push({ label: "Tuk-Tuk (3–4 pax)", value: "tukTuk3to4", price: tukTuk.price3to4 });
    }
  }
  if (tour.transportation?.availableTypes?.includes("Car") && typeof car.price === "number") {
    transportOptions.push({ label: "Car (1–4 pax)", value: "car", price: car.price });
  }
  if (tour.transportation?.availableTypes?.includes("Van") && typeof van.price === "number") {
    transportOptions.push({ label: "Van (4–8 pax)", value: "van", price: van.price });
  }

  const selectedOption = transportOptions.find(opt => opt.value === transportType);
  const total =
    (selectedOption?.price || 0) +
    (addSunrise
      ? selectedOption?.value?.includes("tukTuk")
        ? tukTuk.extraSunrise || 0
        : selectedOption?.value === "car"
        ? car.extraSunrise || 0
        : selectedOption?.value === "van"
        ? van.extraSunrise || 0
        : 0
      : 0) +
    (addBackTown
      ? selectedOption?.value?.includes("tukTuk")
        ? tukTuk.extraBackTown || 0
        : selectedOption?.value === "car"
        ? car.extraBackTown || 0
        : selectedOption?.value === "van"
        ? van.extraBackTown || 0
        : 0
      : 0);

  // Debug: log the tour prop received by the modal

  const calendarRef = useRef();
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("📦 Booking Submission — tour.propertyId:", tour.propertyId);
    const basePrice = selectedOption?.price || 0;
    const sunriseFee =
      addSunrise
        ? selectedOption?.value?.includes("tukTuk")
          ? tukTuk.extraSunrise || 0
          : selectedOption?.value === "car"
          ? car.extraSunrise || 0
          : selectedOption?.value === "van"
          ? van.extraSunrise || 0
          : 0
        : 0;
    const backtownFee =
      addBackTown
        ? selectedOption?.value?.includes("tukTuk")
          ? tukTuk.extraBackTown || 0
          : selectedOption?.value === "car"
          ? car.extraBackTown || 0
          : selectedOption?.value === "van"
          ? van.extraBackTown || 0
          : 0
        : 0;

    const subtotal = basePrice + sunriseFee + backtownFee;
    const vat = parseFloat((subtotal * 0.1).toFixed(2));
    const total = parseFloat((subtotal + vat).toFixed(2));

    const payload = {
      userUid,
      propertyId: tour.propertyId,
      tourId: tour._id,
      tourType: tour.category,
      fullName,
      phone,
      email,
      date,
      time,
      transportType,
      addSunrise,
      addBackTown,
      specialRequest,
      subtotal,
      vat,
      total,
      included: tour.included || "",
      notIncluded: tour.notIncluded || ""
    };

    // Log the payload before sending
    console.log("📦 Payload being sent:", payload);

    try {
      const apiURL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7071";
      await axios.post(`${apiURL}/api/tour-booking`, payload);
      setIsSubmitting(false);
      setShowSuccess(true);
      // onClose?.(); // Only close modal if you want to hide the booking modal immediately
    } catch (err) {
      alert("❌ Failed to submit booking.");
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    fullName.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    transportType !== "" &&
    date &&
    time;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center sm:items-start sm:pt-10">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-screen sm:w-[95vw] max-w-none sm:max-w-xl py-8 px-6 rounded-none sm:rounded shadow-lg overflow-y-auto max-h-screen sm:max-h-[95vh] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-black"
        >
          &times;
        </button>

        
        {title && (
          <h3 className="text-2xl font-semibold text-[#4a3c2f] text-center tracking-wide mb-6">{title}</h3>
        )}

        {/* Transportation */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Transportation</label>
          <Listbox as={React.Fragment} value={transportType} onChange={setTransportType}>
            {({ open }) => (
              <div className="relative">
                <Listbox.Button className="w-full border px-3 py-2 rounded text-left">
                  {transportOptions.find((opt) => opt.value === transportType)
                    ? `${transportOptions.find((opt) => opt.value === transportType).label} – $${transportOptions.find((opt) => opt.value === transportType).price}`
                    : "Select Transport"}
                </Listbox.Button>
                <AnimatePresence>
                  <div className="relative">
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: "absolute", inset: "0 auto auto 0", zIndex: 20 }}
                      >
                        <Listbox.Options className="mt-1 w-full border rounded bg-white shadow-lg max-h-60 overflow-auto">
                          {transportOptions.map((opt) => (
                            <Listbox.Option
                              key={opt.value}
                              value={opt.value}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${active ? "bg-gray-100" : ""}`
                              }
                            >
                              {opt.label} – ${opt.price}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
              </div>
            )}
          </Listbox>
        </div>

        {/* Add-ons for Sunrise/Backtown */}
        {(selectedOption?.value?.includes("tukTuk") && (tukTuk.extraSunrise || tukTuk.extraBackTown)) ||
         (selectedOption?.value === "car" && (car.extraSunrise || car.extraBackTown)) ||
         (selectedOption?.value === "van" && (van.extraSunrise || van.extraBackTown)) ? (
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            {((selectedOption?.value?.includes("tukTuk") && tukTuk.extraSunrise) ||
              (selectedOption?.value === "car" && car.extraSunrise) ||
              (selectedOption?.value === "van" && van.extraSunrise)) && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={addSunrise}
                  onChange={() => setAddSunrise(!addSunrise)}
                />
                Sunrise
              </label>
            )}
            {((selectedOption?.value?.includes("tukTuk") && tukTuk.extraBackTown) ||
              (selectedOption?.value === "car" && car.extraBackTown) ||
              (selectedOption?.value === "van" && van.extraBackTown)) && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={addBackTown}
                  onChange={() => setAddBackTown(!addBackTown)}
                />
                Backtown
              </label>
            )}
          </div>
        ) : null}

    {/* Date */}
    <div className="w-full mb-4 relative">
      <label className="block font-medium mb-1">Select Date</label>
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full border px-3 py-2 rounded cursor-pointer"
      >
        {date.toLocaleDateString("en-CA")}
      </div>
      {showCalendar && (
        <motion.div
          ref={calendarRef}
          className="absolute z-20 bg-white shadow-lg rounded mt-2 w-[340px] left-0 right-0 mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Calendar
            onChange={(value) => {
              setDate(value);
              setShowCalendar(false);
            }}
            value={date}
            calendarType="iso8601"
            next2Label={null}
            prev2Label={null}
            className="!border-none !shadow-none text-base custom-calendar"
            tileClassName={({ date: d }) =>
              d.toDateString() === date.toDateString()
                ? "bg-[#A58E63] text-white rounded-full"
                : "hover:bg-gray-100 rounded-full transition-colors"
            }
          />
        </motion.div>
      )}
    </div>

    {/* Time */}
    <div className="mb-4">
      <label className="block font-medium mb-1">Preferred Departure Time</label>
      {addSunrise ? (
        <>
          <div className="text-sm text-gray-500 mb-1">Sun will rise between 5:30am – 6:00am</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {["04:30", "05:00"].map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`px-3 py-1 rounded border ${
                  time === t ? "bg-[#A58E63] text-white" : "bg-white text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-2 mb-2">
          {["07:30", "08:00", "08:30", "09:00"].map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`px-3 py-1 rounded border ${
                time === t ? "bg-[#A58E63] text-white" : "bg-white text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <div
        className="w-full border px-3 py-2 rounded cursor-pointer relative"
        onClick={() => document.getElementById("hiddenTimeInput")?.showPicker?.()}
      >
        {time || "--:--"}
        <input
          type="time"
          id="hiddenTimeInput"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>
          {loading ? (
            <SkeletonBlock className="w-full h-10 mb-2" />
          ) : (
            <input
              className="w-full border px-3 py-2 rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Phone</label>
          {loading ? (
            <SkeletonBlock className="w-full h-10 mb-2" />
          ) : (
            <input
              className="w-full border px-3 py-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          {loading ? (
            <SkeletonBlock className="w-full h-10 mb-2" />
          ) : (
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </div>

        {/* Special Request */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Special Request</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
          />
        </div>

        {/* Summary */}
        <div className="border-t pt-4 mt-4 text-sm">
          <div className="flex justify-between mb-1">
            <span>Tour ({selectedOption?.label || "N/A"})</span>
            <span>${selectedOption?.price || 0}</span>
          </div>

          {addSunrise && (
            <div className="flex justify-between mb-1">
              <span>Add-on: Sunrise</span>
              <span>
                ${
                  selectedOption?.value?.includes("tukTuk")
                    ? tukTuk.extraSunrise || 0
                    : selectedOption?.value === "car"
                    ? car.extraSunrise || 0
                    : selectedOption?.value === "van"
                    ? van.extraSunrise || 0
                    : 0
                }
              </span>
            </div>
          )}

          {addBackTown && (
            <div className="flex justify-between mb-1">
              <span>Add-on: Backtown</span>
              <span>
                ${
                  selectedOption?.value?.includes("tukTuk")
                    ? tukTuk.extraBackTown || 0
                    : selectedOption?.value === "car"
                    ? car.extraBackTown || 0
                    : selectedOption?.value === "van"
                    ? van.extraBackTown || 0
                    : 0
                }
              </span>
            </div>
          )}

          <div className="flex justify-between font-medium mt-2">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>

          <div className="flex justify-between mt-1">
            <span>VAT (10%)</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg mt-2 border-t pt-2">
            <span>Total</span>
            <span>${(total * 1.1).toFixed(2)}</span>
          </div>
        </div>

        <button
          className={`mt-4 w-full py-3 rounded border transition-all flex items-center justify-center gap-2 ${
            isFormValid && !isSubmitting
              ? "bg-black text-white border-black hover:bg-white hover:text-black"
              : "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>
        {showSuccess && (
          <BookingSuccessModal
            onClose={() => {
              setShowSuccess(false);
              onClose?.(); // Close the main TourBookingModal
              window.dispatchEvent(new CustomEvent("closeTourDetailModal")); // Let parent know to close the detail modal
            }}
            guestName={fullName}
            tourTitle={tour.category}
            date={date}
            time={time}
            included={tour.availableHours?.included}
            notIncluded={tour.availableHours?.notIncluded}
          />
        )}
      </motion.div>
    </div>
  );
}