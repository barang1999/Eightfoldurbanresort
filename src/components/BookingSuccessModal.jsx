import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BookingSuccessModal({ onClose, guestName, tourTitle, date, time }) {
  const handleClose = () => {
    onClose();
    window.dispatchEvent(new Event('closeAllModals'));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-xl relative text-center"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>

          {/* Icon */}
          <CheckCircleIcon className="h-14 w-14 mx-auto mb-4" style={{ color: '#A58E63' }} />

          {/* Message */}
          <h2 className="text-2xl font-semibold text-[#4a3c2f] mb-2">Booking Confirmed</h2>
          <p className="text-gray-700 mb-4">
            {guestName ? `${guestName}, ` : "Your"} tour to <strong>{tourTitle}</strong> has been confirmed
            {date && time && ` for ${new Date(date).toLocaleDateString("en-GB")} at ${new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
            .
          </p>

          {/* Button */}
          <button
            onClick={handleClose}
            className="mt-4 px-5 py-2 bg-[#A58E63] text-white rounded hover:bg-[#927b58] transition"
          >
            Close
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}