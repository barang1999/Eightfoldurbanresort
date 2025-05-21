import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useCurrency } from "../../contexts/CurrencyProvider";
import { formatCurrency } from "../../utils/formatCurrency";
import { generateBookingPDF } from "../../utils/generateBookingPDF";
// Skeleton shimmer block for loading state
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
import { differenceInCalendarDays } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { Hotel, Calendar, Mountain, Ticket, ChevronDown, ChevronUp, Pencil, Phone, Mail, MapPin, FileDown } from "lucide-react";
import { CheckCircle, BedDouble, Wifi, BadgeCheck, XCircle } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSelectedRooms } from "../../contexts/SelectedRoomsContext";
import axios from "axios";
import RoomDetailModal from "../../components/RoomDetailModal";
import HotelPolicyModal from "../../components/HotelPolicyModal";
import MapModal from "../../components/MapModal";
import CancelReservationModal from "../../components/CancelReservationModal";
import SupportButton from "../../components/SupportButton";

const BookingCard = ({ booking, onCancelled, propertyEmail }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showCancelToast, setShowCancelToast] = useState(false);
  const [showModifyNotice, setShowModifyNotice] = useState(false);
  // Room details map for expanded rooms
  const [roomDetailsMap, setRoomDetailsMap] = useState({});
  // Fetch and merge room details when expanded
  useEffect(() => {
    if (expanded && booking.rooms?.length > 0) {
      Promise.all(
        booking.rooms.map(room =>
          getRoomDetail(room.roomId, booking.propertyId).then(detail => ({
            roomId: room.roomId,
            detail
          }))
        )
      ).then(results => {
        const map = {};
        results.forEach(({ roomId, detail }) => {
          map[roomId] = detail;
        });
        setRoomDetailsMap(map);
      });
    }
    // Optionally clear details when collapsed
    if (!expanded) {
      setRoomDetailsMap({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, booking.rooms, booking.propertyId]);
  // Handle cancellation: close modal and update local status for immediate UI feedback
  // Recent Booking badge logic: booking created within last 4 hours
  const isRecent = new Date() - new Date(booking.createdAt) < 4 * 60 * 60 * 1000;
  // Staying badge logic: current date between check-in and check-out, and not cancelled
  const now = new Date();
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const isStaying = booking.status !== "cancelled" && now >= checkInDate && now <= checkOutDate;
  const handleCancellationConfirmed = () => {
    setIsCancelModalOpen(false);
    booking.status = "cancelled"; // immediate local update
    setShowCancelToast(true);
    onCancelled?.(booking._id);
    setTimeout(() => setShowCancelToast(false), 2000);
  };
  const { getRoomDetail } = useSelectedRooms();
  const { exchangeRate, currencyCode } = useCurrency();

  // Ref for mobile actions dropdown and button
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMobileActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("🔎 Booking object:", booking);
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/property?propertyId=${booking.propertyId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("🏨 Loaded propertyData:", data);
        setPropertyData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch property data:", err);
        setIsLoading(false);
      });
  }, [booking.propertyId]);

  const hotelName = propertyData?.name || "Hotel";

  // Fade-out animation for canceled bookings

  // Bed count formatting: distinguish between user-selected and fixed rooms
  const getFormattedBedCount = (room) => {
    const type = room.bedType?.toLowerCase() || "";
    const parts = [];

    if (room.requiresBedChoice) {
      if (type.includes("large double bed")) {
        const count = room.doubleBedCount || 1;
        return `${count} large double bed${count > 1 ? "s" : ""}`;
      }

      if (type.includes("single bed")) {
        const count = room.singleBedCount || 1;
        return `${count} single bed${count > 1 ? "s" : ""}`;
      }

      return room.bedType || "";
    }

    if (room.doubleBedCount) {
      parts.push(`${room.doubleBedCount} large double bed${room.doubleBedCount > 1 ? "s" : ""}`);
    }

    if (room.singleBedCount) {
      parts.push(`${room.singleBedCount} single bed${room.singleBedCount > 1 ? "s" : ""}`);
    }

    return parts.length > 0 ? parts.join(" + ") : room.bedType || "";
  };

  return (
    <>
      {/* Toast for cancellation */}
      {showCancelToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed top-6 inset-x-0 mx-auto w-max z-50 bg-white text-[#A58E63] border border-[#A58E63] px-5 py-3 rounded-full shadow-md font-medium text-sm"
        >
          Reservation cancelled successfully.
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 border rounded shadow-sm bg-white transition-opacity duration-300 w-full sm:w-auto"
      >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            {hotelName}
            {isStaying ? (
              <span
                className="px-2 py-0.5 text-xs border rounded-full font-semibold"
                style={{ borderColor: "#A58E63", color: "#A58E63" }}
              >
                Staying
              </span>
            ) : isRecent && (
              <span
                className="px-2 py-0.5 text-xs border rounded-full font-semibold"
                style={{ borderColor: "#A58E63", color: "#A58E63" }}
              >
                Recent Booking
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Booking ID: {booking.referenceNumber}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {new Date(booking.checkIn).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric"
            })} → {new Date(booking.checkOut).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric"
            })}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Booked for: <span className="font-semibold text-black-600">{booking.fullName || "Guest"}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 border ${
          booking.status === "confirmed"
            ? "text-green-700 border-green-600"
            : booking.status === "cancelled"
            ? "text-red-700 border-red-600"
            : "text-yellow-700 border-yellow-500 bg-yellow-50"
        }`}>
          {booking.status === "confirmed" && <CheckCircle className="w-4 h-4 text-green-600" />}
          {booking.status === "cancelled" && (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
            </>
          )}
          <span className={`${booking.status === "cancelled"
            ? "text-red-700 font-semibold bg-transparent"
            : ""}`}>
            {booking.status}
          </span>
        </span>
        <button onClick={() => setExpanded(!expanded)} className="text-sm text-theme flex items-center gap-1">
          {expanded ? "Hide Details" : "Show Details"}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>
      </div>
      <AnimatePresence>
        {expanded && booking.rooms?.map((room, index) => {
          // Merge in fetched room details if available
          const detail = roomDetailsMap[room.roomId] || {};
          const mergedRoom = { ...room, ...detail };
          // Debug log for room details
          console.log("🛏️ Rendering Room:", mergedRoom.roomType, {
            bedType: mergedRoom.bedType,
            bedCountLabel: mergedRoom.bedCountLabel,
            doubleBedCount: mergedRoom.doubleBedCount,
            singleBedCount: mergedRoom.singleBedCount,
          });

          // Use updated function for bed count formatting
          const formattedBedCount = getFormattedBedCount(mergedRoom);

          return (
            <motion.div
              key={index}
              className="overflow-hidden mt-4 grid md:grid-cols-2 gap-4 items-start border-t pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mergedRoom?.image && (
                <button onClick={async () => {
                  console.log("🛏️ Fetching room detail:", mergedRoom.roomId, "from property:", booking.propertyId);
                  const detail = await getRoomDetail(mergedRoom.roomId, booking.propertyId);
                  setSelectedRoom(detail);
                  setIsModalOpen(true);
                }}>
                  <img src={mergedRoom.image} alt={`Room ${index + 1}`} className="w-full h-auto rounded" />
                </button>
              )}
              <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                <div className="flex flex-wrap gap-2 mb-2 text-[11px] sm:text-xs font-medium text-gray-600">
                  {mergedRoom.breakfastIncluded && (
                    <span className="inline-flex items-center gap-1 bg-white text-[#A58E63] border border-[#A58E63] px-2 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-[#A58E63]" /> Free Breakfast
                    </span>
                  )}
                  {(mergedRoom.bedCountLabel || mergedRoom.bedType) && (
                    <span className="inline-flex items-center gap-1 bg-white text-[#A58E63] border border-[#A58E63] px-2 py-1 rounded-full">
                      <BedDouble className="w-4 h-4 text-[#A58E63]" /> {formattedBedCount}
                    </span>
                  )}
                  {mergedRoom.hasWifi && (
                    <span className="inline-flex items-center gap-1 bg-white text-[#A58E63] border border-[#A58E63] px-2 py-1 rounded-full">
                      <Wifi className="w-4 h-4 text-[#A58E63]" /> Free Wi-Fi
                    </span>
                  )}
                  {propertyData?.policy?.cancellationPolicy?.cancellationAllowed && (
                    <span className="inline-flex items-center gap-1 bg-white text-[#A58E63] border border-[#A58E63] px-2 py-1 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-[#A58E63]" /> Free Cancellation
                    </span>
                  )}
                </div>
                <p><strong>Room Type:</strong> {mergedRoom?.roomType}</p>
                {(mergedRoom?.bedCountLabel || mergedRoom?.bedType) && (
                  <p>
                    <strong>Bed Setup:</strong> {formattedBedCount}
                  </p>
                )}
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Breakfast Included:</strong> {mergedRoom?.breakfastIncluded ? `${mergedRoom.capacity?.maxAdults || 1} guests` : "No"}</p>
                <p>
                  <strong>Base Rate (incl. VAT):</strong> {formatCurrency(mergedRoom?.baseRate || 0, exchangeRate, currencyCode)}
                </p>
                <p>
                  <strong>Includes VAT ({mergedRoom?.vat || 10}%):</strong> {
                    formatCurrency(
                      (mergedRoom?.baseRate || 0) * (mergedRoom?.vat || 10) / (100 + (mergedRoom?.vat || 10)),
                      exchangeRate,
                      currencyCode
                    )
                  }
                </p>
                <p>
                  <strong>Per Night:</strong> {
                    formatCurrency(
                      (mergedRoom?.baseRate || 0) / (mergedRoom?.nights || 1),
                      exchangeRate,
                      currencyCode
                    )
                  }
                </p>
                <p><strong>Nights:</strong> {mergedRoom?.nights || 1}</p>
                <p><strong>Arrival Time:</strong> {booking.estimatedArrivalTime}</p>
                <p><strong>Special Request:</strong> {booking.specialRequest || "None"}</p>
                <div className="pt-2 space-y-1">
                  <div>
                    <button
                      className="text-theme text-sm underline"
                      onClick={async () => {
                        console.log("🛏️ Fetching room detail:", mergedRoom.roomId, "from property:", booking.propertyId);
                        const detail = await getRoomDetail(mergedRoom.roomId, booking.propertyId);
                        setSelectedRoom(detail);
                        setIsModalOpen(true);
                      }}
                    >
                      See room details
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-theme text-sm underline"
                      onClick={() => {
                        console.log("📜 Opening policy modal for:", propertyData?.name, propertyData?.policy);
                        setIsPolicyOpen(true);
                      }}
                    >
                      View Policies
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {isModalOpen && selectedRoom && (
        <RoomDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          room={selectedRoom}
        />
      )}
      {propertyData?.policy && (
        <HotelPolicyModal
          isOpen={isPolicyOpen}
          onClose={() => setIsPolicyOpen(false)}
          policy={propertyData.policy}
        />
      )}
      {/* Actionable Footer */}
      <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-gray-600">
        {/* Desktop action buttons */}
        {booking.status !== "cancelled" && (
          <div className="flex flex-wrap gap-2 items-center hidden sm:flex">
            <button
              className="px-3 py-1 text-sm rounded-full border border-[#A58E63] text-black hover:bg-[#A58E63]/10 transition inline-flex items-center gap-1"
              onClick={() => {
                const noticeDays = propertyData?.policy?.cancellationPolicy?.cancellationNoticeDays || 3;
                const checkIn = new Date(booking.checkIn);
                const now = new Date();
                const daysUntilCheckIn = differenceInCalendarDays(checkIn, now);
                if (daysUntilCheckIn < noticeDays) {
                  setShowModifyNotice(true);
                  return;
                }
                setShowModifyNotice(false);
                navigate(`/modify-reservation/${booking._id}`);
              }}
            >
              <Pencil size={16} className="inline mr-1" /> Modify Reservation
            </button>
            <button
              className="px-3 py-1 text-sm rounded-full border border-[#A58E63] text-black hover:bg-[#A58E63]/10 transition inline-flex items-center gap-1"
              onClick={() => setIsCancelModalOpen(true)}
            >
              <Trash2 size={16} className="inline mr-1" /> Cancel Reservation
            </button>
            <button
              className="px-3 py-1 text-sm rounded-full border border-[#A58E63] text-black hover:bg-[#A58E63]/10 transition inline-flex items-center gap-1"
              onClick={() => generateBookingPDF({
                ...booking,
                hotelName: propertyData?.name,
                mapImage: propertyData?.images?.[0] || "",
                hotelAddress: propertyData?.address || "",
                hotelPhone: propertyData?.phone || "",
                hotelWebsite: propertyData?.socialLinks?.website || "",
                policy: propertyData?.policy || {},
              })}
            >
              <FileDown size={16} className="inline mr-1" /> Download PDF
            </button>
            {propertyData?.googleMapEmbed && (
              <button
                className="hidden sm:inline-flex px-3 py-1 text-sm rounded-full border border-[#A58E63] text-black hover:bg-[#A58E63]/10 transition items-center gap-1"
                onClick={() => setIsMapOpen(true)}
              >
                <MapPin size={16} className="inline mr-1" /> View on Map
              </button>
            )}
          </div>
        )}
        
        {/* Mobile Actions Dropdown */}
        {booking.status !== "cancelled" && (
          <div className="sm:hidden relative w-full">
            <motion.button
              ref={buttonRef}
              whileTap={{ scale: 0.95, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                // Delay re-enabling click outside for a short moment to avoid immediate close
                setTimeout(() => {
                  setShowMobileActions(prev => !prev);
                }, 10);
              }}
              className="w-full border border-[#A58E63] text-[#A58E63] px-3 py-1 rounded-full flex items-center justify-center gap-2 transition-transform"
            >
              <motion.div
                animate={{ rotate: showMobileActions ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} />
              </motion.div>
              Actions
            </motion.button>
            <AnimatePresence>
              {showMobileActions && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-2 w-full bg-white border border-[#A58E63]/40 shadow-xl rounded-xl text-sm text-gray-800 ring-1 ring-[#A58E63]/10 backdrop-blur-md"
                >
                  <button
                    onClick={() => {
                      setShowMobileActions(false);
                      const noticeDays = propertyData?.policy?.cancellationPolicy?.cancellationNoticeDays || 3;
                      const checkIn = new Date(booking.checkIn);
                      const now = new Date();
                      const daysUntilCheckIn = differenceInCalendarDays(checkIn, now);
                      if (daysUntilCheckIn < noticeDays) {
                        alert(
                          `This reservation is past the modification deadline of ${noticeDays} days before check-in. Please contact ${propertyData?.email || 'the property'} to modify.`
                        );
                        return;
                      }
                      navigate(`/modify-reservation/${booking._id}`);
                    }}
                    className="block w-full px-4 py-2 hover:bg-[#FAF6F0] text-sm font-medium text-left transition-colors duration-150 rounded-md inline-flex items-center gap-2"
                  >
                    <Pencil size={16} /> Modify Reservation
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileActions(false);
                      setIsCancelModalOpen(true);
                    }}
                    className="block w-full px-4 py-2 hover:bg-[#FAF6F0] text-sm font-medium text-left transition-colors duration-150 rounded-md inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Cancel Reservation
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileActions(false);
                      alert("PDF download functionality coming soon");
                    }}
                    className="block w-full px-4 py-2 hover:bg-[#FAF6F0] text-sm font-medium text-left transition-colors duration-150 rounded-md inline-flex items-center gap-2"
                  >
                    <FileDown size={16} /> Download PDF
                  </button>
                  {propertyData?.googleMapEmbed && (
                    <button
                      onClick={() => {
                        setShowMobileActions(false);
                        setIsMapOpen(true);
                      }}
                      className="block w-full px-4 py-2 hover:bg-[#FAF6F0] text-sm font-medium text-left transition-colors duration-150 rounded-md inline-flex items-center gap-2"
                    >
                      <MapPin size={16} /> View on Map
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {/* Desktop "View on Map" button removed */}
        {/* MapModal for embedded map */}
        {propertyData?.googleMapEmbed && (
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            embedHtml={propertyData.googleMapEmbed}
          />
        )}
      </div>
        {isCancelModalOpen && (
          <CancelReservationModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            booking={booking}
            propertyEmail={propertyData?.email || ""}
            onCancelled={handleCancellationConfirmed}
          />
        )}

        {/* Show modify deadline notice for desktop */}
        {showModifyNotice && (
          <div className="w-full sm:w-auto mt-4">
            <div className=" border border-red-300  px-4 py-3 rounded-md text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span>
                This reservation is past the modification deadline of {propertyData?.policy?.cancellationPolicy?.cancellationNoticeDays || 3} days before check-in.{" "}
                Please contact{" "}
                <a
                  href={`mailto:${propertyData?.email || ""}`}
                  className="underline font-medium"
                >
                  {propertyData?.email || "the property"}
                </a>{" "}
                to modify your booking.
              </span>
              <button
                onClick={() => setShowModifyNotice(false)}
             className="text-gray-500 hover:text-black text-sm mt-4 block"
              >
                close
              </button>
            </div>
          </div>
        )}
        
      </motion.div>
    </>
  );
};

const ReservationsSection = () => {
  const { user } = useAuth();
  const displayName =
    user?.profile?.fullName?.split(" ")[0] ||
    user?.displayName?.split(" ")[0] ||
    (user?.email?.charAt(0).toUpperCase()) ||
    "Guest";
  const [activeTab, setActiveTab] = useState("stays");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BOOKING_API_URL}?firebaseUid=${user.uid}`);
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  }, [user?.uid]);

  useEffect(() => {
    setIsLoading(true);
    fetchBookings().finally(() => setIsLoading(false));
  }, [fetchBookings]);

  const now = new Date();
  const upcomingBookings = bookings
    .filter(b => new Date(b.checkOut) > now)
    .sort((a, b) => {
      if (a.status === "confirmed" && b.status !== "confirmed") return -1;
      if (a.status !== "confirmed" && b.status === "confirmed") return 1;
      return new Date(b.checkIn) - new Date(a.checkIn);
    });
  const pastBookings = bookings.filter(b => new Date(b.checkOut) <= now);

  // Handler for when a booking is cancelled, triggers re-render
  const handleBookingCancelled = (cancelledId) => {
    setBookings(prev =>
      prev.map(b => b._id === cancelledId ? { ...b, status: "cancelled" } : b)
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white px-2 sm:px-6 py-6 rounded shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Your Upcoming Stay</h1>
        <div className="space-y-4">
          {[1, 2].map(key => (
            <div key={key} className="p-4 border rounded shadow-sm bg-white">
              <SkeletonBlock className="w-1/2 h-4 mb-2" />
              <SkeletonBlock className="w-1/3 h-4 mb-2" />
              <SkeletonBlock className="w-full h-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-0 px-0 sm:mx-0 sm:px-0">
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ...tab grid removed...
      </div> */}
      <div className="hidden" />

      {activeTab === "stays" && (
        <div className="bg-white px-2 sm:px-6 py-6 rounded shadow-sm border">
          {upcomingBookings.length === 0 && pastBookings.length === 0 ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Your Upcoming Stay</h1>
              <p className="text-gray-600 mb-6">{displayName}, you have no reservations planned at the moment.</p>
            </>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <>
                  <h1 className="text-2xl font-bold mb-4">Your Upcoming Stay</h1>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancelled={handleBookingCancelled}
                        propertyEmail={booking.propertyEmail}
                      />
                    ))}
                  </div>
                </>
              )}

              {pastBookings.length > 0 && (
                <>
                  <h1 className="text-2xl font-bold mt-8 mb-4">Past Reservations</h1>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancelled={handleBookingCancelled}
                        propertyEmail={booking.propertyEmail}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {upcomingBookings.length === 0 && pastBookings.length === 0 && (
            <div className="relative w-full max-w-4xl mx-auto mt-10">
              <img
                src="/public/Angkor.webp"
                alt="No reservations"
                className="w-full h-auto rounded-md shadow-sm object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white backdrop-blur-sm rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center gap-6 max-w-xl w-full">
                  <Hotel size={48} className="text-[#1c1b4d]" />
                  <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold mb-2 text-gray-900">
                      {displayName}, you have nothing planned right now
                    </h2>
                    <p className="text-gray-600 mb-4">
                      This is the time to start to prepare your next stay.
                    </p>
                    <Link
                      to="/"
                      className="inline-block bg-[#a18a63] text-white px-6 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
                    >
                      Book your next stay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "trips" && (
        <div className="bg-white px-2 sm:px-6 py-6 rounded shadow-sm border">
          <h1 className="text-2xl font-bold mb-2">Upcoming Trips</h1>
          <p className="text-gray-600">
            {displayName}, you have no trips planned at the moment.
          </p>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="bg-white px-2 sm:px-6 py-6 rounded shadow-sm border">
          <h1 className="text-2xl font-bold mb-2">Upcoming Activities</h1>
          <p className="text-gray-600">
            {displayName}, you have no activities planned at the moment.
          </p>
        </div>
      )}
      {/* Sticky Help & Support button */}
      <div className="fixed bottom-6 right-0 z-50">
        <SupportButton />
      </div>
    </div>
  );
};

export default ReservationsSection;