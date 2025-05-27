import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useClickOutside } from "../hooks/useClickOutside";

const DesktopUserDropdown = ({ user, setIsModalOpen, setIsDropdownOpen }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  if (!user) {
    return (
      <AnimatePresence>
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-80 bg-white border border-gray-200 rounded-xl shadow-xl py-6 px-6 z-50 ring-1 ring-gray-100 space-y-4"
        >

<div className="flex items-center justify-between text-sm text-gray-800 mt-2">
            <span>Language</span>
            <select
              className="text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1 bg-white ml-2"
              onChange={(e) => {
                import("i18next").then((i18n) => {
                  i18n.default.changeLanguage(e.target.value);
                  localStorage.setItem("language", e.target.value);
                  console.log("🔁 Language switched to:", e.target.value);
                });
              }}
              defaultValue={localStorage.getItem("language") || "en"}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ch">中文</option>
            </select>
          </div>
          <div className="text-xl font-semibold text-gray-900">Join us today</div>
          <p className="text-sm text-gray-500 leading-snug">
          Enjoy a seamless and exclusive experience tailored to our members.
          </p>
          <button
            onClick={() => {
              navigate('/register');
              setIsDropdownOpen(false);
            }}
            className="w-full py-2 rounded-full bg-[#9b875d] text-white font-semibold hover:bg-[#8b7a50] transition"
          >
            Sign up for free
          </button>
         
          <button
            onClick={() => {
              navigate('/login');
              setIsDropdownOpen(false);
            }}
            className="w-full py-2 rounded-full border border-[#9b875d] text-[#9b875d] font-semibold hover:bg-gray-50 transition"
          >
            Sign in
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-80 bg-white border border-gray-200 rounded-xl shadow-xl py-5 px-6 z-50 ring-1 ring-gray-100"
      >
        {/* Name & Email */}
        <div className="font-semibold text-[18px] text-gray-800 mb-1 text-left">
          {user?.fullName?.trim() || user?.displayName || "User"}
        </div>
        <div className="text-sm text-gray-400 mb-4 text-left">{user?.email || ""}</div>

        {/* Status card */}
        <div className="bg-gray-100 p-4 rounded-xl mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border-[1px] border-[#9b875d]">
              <img src="/Logo.png" alt="Status Logo" className="w-9 h-9" />
            </div>
            <div className="text-sm text-gray-800 leading-snug font-medium text-left">
              Exclusive access.<br />
              Elevated experience.
            </div>
          </div>
        </div>

        {/* Menu */}
        <ul className="text-sm space-y-2 font-medium text-gray-800 text-left">
         <li
              className="hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
              onClick={() => {
                const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                window.location.href = `${bookingBaseUrl}/account/reservations`;
                setIsDropdownOpen(false);
              }}
            >
              Your reservations
            </li>
          <li
            className="hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
              window.location.href = `${bookingBaseUrl}/account/information`;
              setIsDropdownOpen(false);
            }}
          >
            Your information
          </li>
          <li
            className="hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
              window.location.href = `${bookingBaseUrl}/account/stay-preferences`;
              setIsDropdownOpen(false);
            }}
          >
            Your stay preferences
          </li>
          {/*}
          <li
            className="hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            Change currency
          </li>
          */}
          {/*
          <li className="flex items-center justify-between px-2 py-1 rounded-md">
            <span>Language</span>
            <select
              className="text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1 bg-white ml-2"
              onChange={(e) => {
                import("i18next").then((i18n) => {
                  i18n.default.changeLanguage(e.target.value);
                  localStorage.setItem("language", e.target.value);
                  console.log("🔁 Language switched to:", e.target.value);
                });
              }}
              defaultValue={localStorage.getItem("language") || "en"}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ch">中文</option>
            </select>
          </li>
          */}
          
          <li
            className="pt-2 border-t border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              navigate("/contact");
              setIsDropdownOpen(false);
            }}
          >
            Help and support
          </li>
          <li
            className="hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              const auth = getAuth();
              signOut(auth)
                .then(() => {
                  setIsDropdownOpen(false);
                  window.location.reload();
                })
                .catch((error) => {
                  console.error("Logout error:", error);
                });
            }}
          >
            Logout
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default DesktopUserDropdown;