import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const MobileUserDropdown = ({ user, setShowMobileDropdown }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <>
        <motion.button
          onClick={() => setShowMobileDropdown(false)}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          aria-label="Close dropdown"
          className="fixed top-[75px] right-4 z-[9999]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[55px] left-0 right-0 md:absolute md:right-[-4px] md:top-auto mt-2 w-full h-[calc(100%-64px)] md:w-72 md:h-auto bg-white md:rounded-xl shadow-xl py-5 px-4 md:px-4 z-50 ring-1 ring-gray-100 overflow-y-auto"
        >
          {user ? (
            <>
              <div className="flex justify-between items-start px-4 pt-1 pb-4 sticky top-[10px] bg-white z-10 border-b border-gray-100 mb-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 text-left">
                    {user?.fullName?.split(" ")[0] ||
                      user?.name?.split(" ")[0] ||
                      user?.displayName?.split(" ")[0] ||
                      "Guest"}
                  </div>
                  <div className="text-sm text-gray-500 text-left">{user?.email || ""}</div>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-xl mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#9b875d]">
                    <img src="/Logo.png" alt="Status Logo" className="w-9 h-9" />
                  </div>
                  <div className="flex flex-col justify-center text-[15px] text-gray-800 leading-snug text-left">
                    <span className="font-medium">Exclusive access.</span>
                    <span className="font-medium">Elevated experience.</span>
                  </div>
                </div>
              </div>

              <ul className="text-[15px] font-light text-gray-800 text-left space-y-2">
                <motion.li
                  whileTap={{ scale: 0.97 }}
                  className="text-left hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                    window.location.href = `${bookingBaseUrl}/account/reservations`;
                  }}
                >
                  Your reservations
                </motion.li>
                <motion.li
                  whileTap={{ scale: 0.97 }}
                  className="text-left hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                    window.location.href = `${bookingBaseUrl}/account/information`;
                  }}
                >
                  Your information
                </motion.li>
                <motion.li
                  whileTap={{ scale: 0.97 }}
                  className="text-left hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                    window.location.href = `${bookingBaseUrl}/account/stay-preferences`;
                  }}
                >
                  Your stay preferences
                </motion.li>
                {/*
                <li
                  className="text-left hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    setShowMobileDropdown(true);
                  }}
                >
                  Change currency
                </li>
                */}
                <motion.li
                  whileTap={{ scale: 0.97 }}
                  className="text-left pt-2 border-t border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    navigate("/contact");
                    setShowMobileDropdown(false);
                  }}
                >
                  Help and support
                </motion.li>
                <motion.li
                  whileTap={{ scale: 0.97 }}
                  className="text-left hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  onClick={async () => {
                    setLoggingOut(true);
                    const auth = getAuth();
                    try {
                      await signOut(auth);
                      window.location.reload();
                    } catch (error) {
                      console.error("Logout error:", error);
                    } finally {
                      setLoggingOut(false);
                    }
                  }}
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </motion.li>
              </ul>
            </>
          ) : (
            <div className="text-center py-6 px-4">
              <p className="text-lg font-semibold text-gray-900 mb-2">Join us today</p>
              <p className="text-sm text-gray-500 mb-4">
              Enjoy a seamless and exclusive experience tailored to our members.
              </p>
              <button
                className="w-full bg-[#9b875d] text-white font-medium py-2 rounded-full mb-2"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign up for free
              </button>
              <button
                className="w-full border border-[#9b875d] text-[#9b875d] font-medium py-2 rounded-full"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign in
              </button>
            </div>
          )}
        </motion.div>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[9998]"
          />
        )}
      </>
    </AnimatePresence>
  );
};

export default MobileUserDropdown;