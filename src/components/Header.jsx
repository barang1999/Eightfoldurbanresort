import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DesktopUserDropdown from '../components/DesktopUserDropdown';
import MobileUserDropdown from '../components/MobileUserDropdown';
import { useUserProfile } from '../hooks/useUserProfile';

export default function Header({ hideMenu = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const { name, email, loading } = useUserProfile();
  const dropdownRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full z-50 transition-all duration-300 ${scrolled || hovered ? 'bg-white shadow-sm text-gray-800' : 'bg-white/2 backdrop-blur-sm text-white'} md:fixed md:top-0`}
    >
      <div className="relative flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto" sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: 64 }}>
        {/* Left Section - Empty spacer */}
        <div className="flex-1"></div>

        {/* Hamburger Menu Button - Mobile Only */}
        <div className="md:hidden absolute left-4 top-4 flex items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-6 h-6 flex items-center justify-center focus:outline-none"
            >
              <span
                className={`absolute w-6 h-[2px] bg-gray-800 transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              ></span>
              <span
                className={`absolute w-6 h-[2px] bg-gray-800 transition-opacity duration-300 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`absolute w-6 h-[2px] bg-gray-800 transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
              ></span>
            </button>
            <span className="text-sm text-gray-800 transition-colors duration-300">Menu</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-center items-center relative">
          <div sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <motion.a
              href="/"
              whileTap={{ scale: 0.94, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`text-xl md:text-2xl font-heading tracking-wide hover:opacity-80 transition-colors duration-300
  text-gray-800 ${scrolled || hovered ? 'md:text-gray-800' : 'md:text-white'}`}
            >
              EIGHTFOLD
            </motion.a>
          </div>
        </div>

        {/* Right Section - Language/Account Placeholder */}
        <div className={`flex-1 text-right text-sm space-x-4`}>
          <div className="flex justify-end items-center space-x-4">
            <div className="hidden md:inline relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center space-x-2 font-medium hover:opacity-80 transition-colors duration-300"
              >
                {email ? (
                  <div className="w-8 h-8 rounded-full bg-[#B59B61] flex items-center justify-center">
                    {/* signed-in white icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="22" fill="white" className="inline-block">
                      <g>
                        <path d="M22 5.88281C22 7.53967 20.6569 8.88281 19 8.88281C17.3431 8.88281 16 7.53967 16 5.88281C16 4.22596 17.3431 2.88281 19 2.88281C20.6569 2.88281 22 4.22596 22 5.88281Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.7788 4.31999C13.9036 4.03618 12.9697 3.88281 12 3.88281C7.02944 3.88281 3 7.91225 3 12.8828C3 17.8534 7.02944 21.8828 12 21.8828C16.9706 21.8828 21 17.8534 21 12.8828C21 11.9131 20.8466 10.9792 20.5628 10.104C20.0976 10.2763 19.5962 10.3739 19.073 10.3822C19.3495 11.1643 19.5 12.006 19.5 12.8828C19.5 15.0502 18.5807 17.0028 17.1107 18.372C16.9844 17.9563 16.8658 17.6124 16.7416 17.3353C16.5892 16.9955 16.3957 16.6796 16.0951 16.456C15.7807 16.2221 15.4425 16.1582 15.1515 16.1377C14.97 16.125 14.7454 16.1278 14.5262 16.1305C14.4355 16.1317 14.3455 16.1328 14.26 16.1328H9.74002C9.65456 16.1328 9.56477 16.1317 9.47407 16.1305C9.25483 16.1278 9.03005 16.125 8.84849 16.1377C8.55751 16.1582 8.21936 16.2221 7.90491 16.456C7.60432 16.6796 7.41084 16.9955 7.25848 17.3353C7.13421 17.6124 7.01567 17.9563 6.88933 18.372C5.41934 17.0028 4.5 15.0502 4.5 12.8828C4.5 8.74068 7.85786 5.38281 12 5.38281C12.8768 5.38281 13.7185 5.53327 14.5006 5.80978C14.5089 5.28664 14.6065 4.78519 14.7788 4.31999ZM15.8298 19.3326C14.7088 19.9997 13.3991 20.3828 12 20.3828C10.6009 20.3828 9.29122 19.9997 8.17024 19.3326L8.24017 19.0923C8.39911 18.5459 8.51968 18.1888 8.62719 17.949C8.73537 17.7077 8.79814 17.6611 8.80013 17.6596L8.80107 17.659C8.80107 17.659 8.80539 17.6569 8.8143 17.6542C8.83412 17.6483 8.87462 17.6396 8.95342 17.6341C9.07262 17.6257 9.19616 17.6274 9.37109 17.6298C9.47336 17.6312 9.5932 17.6328 9.74002 17.6328H14.26C14.4068 17.6328 14.5267 17.6312 14.629 17.6298C14.8039 17.6274 14.9274 17.6257 15.0466 17.6341C15.1254 17.6396 15.1659 17.6483 15.1857 17.6542C15.1946 17.6569 15.199 17.659 15.199 17.659L15.1999 17.6596C15.2019 17.6611 15.2647 17.7077 15.3729 17.949C15.4804 18.1888 15.6009 18.5459 15.7599 19.0923L15.8298 19.3326Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 7.13281C9.92893 7.13281 8.25 8.81174 8.25 10.8828C8.25 12.9539 9.92893 14.6328 12 14.6328C14.0711 14.6328 15.75 12.9539 15.75 10.8828C15.75 8.81174 14.0711 7.13281 12 7.13281ZM9.75 10.8828C9.75 9.64017 10.7574 8.63281 12 8.63281C13.2426 8.63281 14.25 9.64017 14.25 10.8828C14.25 12.1255 13.2426 13.1328 12 13.1328C10.7574 13.1328 9.75 12.1255 9.75 10.8828Z"></path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 24 24" width="25" fill="#A58E63" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 20.3828C13.3991 20.3828 14.7088 19.9997 15.8298 19.3326L15.7599 19.0923C15.6009 18.5459 15.4804 18.1888 15.3729 17.949C15.2647 17.7077 15.2019 17.6611 15.1999 17.6596L15.199 17.659C15.1984 17.6587 15.1946 17.6569 15.1857 17.6542C15.1659 17.6483 15.1254 17.6396 15.0466 17.6341C14.9274 17.6257 14.8039 17.6274 14.629 17.6298C14.5267 17.6312 14.4068 17.6328 14.26 17.6328H9.74002C9.5932 17.6328 9.47336 17.6312 9.37109 17.6298C9.19616 17.6274 9.07262 17.6257 8.95342 17.6341C8.87462 17.6396 8.83412 17.6483 8.8143 17.6542C8.80539 17.6569 8.80162 17.6587 8.80107 17.659L8.80013 17.6596C8.79814 17.6611 8.73537 17.7077 8.62719 17.949C8.51968 18.1888 8.39911 18.5459 8.24017 19.0923L8.17024 19.3326C9.29122 19.9997 10.6009 20.3828 12 20.3828ZM16.7416 17.3353C16.8658 17.6124 16.9844 17.9563 17.1107 18.372C18.5807 17.0028 19.5 15.0502 19.5 12.8828C19.5 8.74068 16.1421 5.38281 12 5.38281C7.85786 5.38281 4.5 8.74068 4.5 12.8828C4.5 15.0502 5.41934 17.0028 6.88933 18.372C7.01567 17.9563 7.13421 17.6124 7.25848 17.3353C7.41084 16.9955 7.60432 16.6796 7.90491 16.456C8.21936 16.2221 8.55751 16.1582 8.84849 16.1377C9.03005 16.125 9.25461 16.1278 9.47385 16.1305L9.47407 16.1305C9.56477 16.1317 9.65456 16.1328 9.74002 16.1328H14.26C14.3455 16.1328 14.4353 16.1317 14.526 16.1305L14.5262 16.1305C14.7454 16.1278 14.97 16.125 15.1515 16.1377C15.4425 16.1582 15.7807 16.2221 16.0951 16.456C16.3957 16.6796 16.5892 16.9955 16.7416 17.3353ZM21 12.8828C21 17.8534 16.9706 21.8828 12 21.8828C7.02944 21.8828 3 17.8534 3 12.8828C3 7.91225 7.02944 3.88281 12 3.88281C16.9706 3.88281 21 7.91225 21 12.8828ZM9.75 10.8828C9.75 9.64017 10.7574 8.63281 12 8.63281C13.2426 8.63281 14.25 9.64017 14.25 10.8828C14.25 12.1255 13.2426 13.1328 12 13.1328C10.7574 13.1328 9.75 12.1255 9.75 10.8828ZM12 7.13281C9.92893 7.13281 8.25 8.81174 8.25 10.8828C8.25 12.9539 9.92893 14.6328 12 14.6328C14.0711 14.6328 15.75 12.9539 15.75 10.8828C15.75 8.81174 14.0711 7.13281 12 7.13281Z" />
                  </svg>
                )}
                <div className="h-5 flex items-center justify-start">
                  {loading ? (
                    <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
                  ) : (
                    <span className="inline-block transition-opacity duration-300 ease-in-out opacity-100 transition-colors">
                      {email ? name?.split(' ')[0] : 'Sign in / Sign up'}
                    </span>
                  )}
                </div>
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className="absolute right-[-32px] mt-2 z-50">
                  <DesktopUserDropdown
                    user={email ? { fullName: name, email } : null}
                    setIsDropdownOpen={setShowDropdown}
                    dropdownRef={dropdownRef}
                  />
                </div>
              )}
            </div>
            <div className="md:hidden relative">
              <button
                onClick={() => {
                  console.log("Toggling MobileUserDropdown");
                  setShowMobileDropdown((prev) => !prev);
                }}
                className="w-8 h-8 flex items-center justify-center"
              >
                {email ? (
                  <div className="w-8 h-8 rounded-full bg-[#B59B61] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="22" fill="white">
                      <g>
                        <path d="M22 5.88281C22 7.53967 20.6569 8.88281 19 8.88281C17.3431 8.88281 16 7.53967 16 5.88281C16 4.22596 17.3431 2.88281 19 2.88281C20.6569 2.88281 22 4.22596 22 5.88281Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.7788 4.31999C13.9036 4.03618 12.9697 3.88281 12 3.88281C7.02944 3.88281 3 7.91225 3 12.8828C3 17.8534 7.02944 21.8828 12 21.8828C16.9706 21.8828 21 17.8534 21 12.8828C21 11.9131 20.8466 10.9792 20.5628 10.104C20.0976 10.2763 19.5962 10.3739 19.073 10.3822C19.3495 11.1643 19.5 12.006 19.5 12.8828C19.5 15.0502 18.5807 17.0028 17.1107 18.372C16.9844 17.9563 16.8658 17.6124 16.7416 17.3353C16.5892 16.9955 16.3957 16.6796 16.0951 16.456C15.7807 16.2221 15.4425 16.1582 15.1515 16.1377C14.97 16.125 14.7454 16.1278 14.5262 16.1305C14.4355 16.1317 14.3455 16.1328 14.26 16.1328H9.74002C9.65456 16.1328 9.56477 16.1317 9.47407 16.1305C9.25483 16.1278 9.03005 16.125 8.84849 16.1377C8.55751 16.1582 8.21936 16.2221 7.90491 16.456C7.60432 16.6796 7.41084 16.9955 7.25848 17.3353C7.13421 17.6124 7.01567 17.9563 6.88933 18.372C5.41934 17.0028 4.5 15.0502 4.5 12.8828C4.5 8.74068 7.85786 5.38281 12 5.38281C12.8768 5.38281 13.7185 5.53327 14.5006 5.80978C14.5089 5.28664 14.6065 4.78519 14.7788 4.31999ZM15.8298 19.3326C14.7088 19.9997 13.3991 20.3828 12 20.3828C10.6009 20.3828 9.29122 19.9997 8.17024 19.3326L8.24017 19.0923C8.39911 18.5459 8.51968 18.1888 8.62719 17.949C8.73537 17.7077 8.79814 17.6611 8.80013 17.6596L8.80107 17.659C8.80107 17.659 8.80539 17.6569 8.8143 17.6542C8.83412 17.6483 8.87462 17.6396 8.95342 17.6341C9.07262 17.6257 9.19616 17.6274 9.37109 17.6298C9.47336 17.6312 9.5932 17.6328 9.74002 17.6328H14.26C14.4068 17.6328 14.5267 17.6312 14.629 17.6298C14.8039 17.6274 14.9274 17.6257 15.0466 17.6341C15.1254 17.6396 15.1659 17.6483 15.1857 17.6542C15.1946 17.6569 15.199 17.659 15.199 17.659L15.1999 17.6596C15.2019 17.6611 15.2647 17.7077 15.3729 17.949C15.4804 18.1888 15.6009 18.5459 15.7599 19.0923L15.8298 19.3326Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 7.13281C9.92893 7.13281 8.25 8.81174 8.25 10.8828C8.25 12.9539 9.92893 14.6328 12 14.6328C14.0711 14.6328 15.75 12.9539 15.75 10.8828C15.75 8.81174 14.0711 7.13281 12 7.13281ZM9.75 10.8828C9.75 9.64017 10.7574 8.63281 12 8.63281C13.2426 8.63281 14.25 9.64017 14.25 10.8828C14.25 12.1255 13.2426 13.1328 12 13.1328C10.7574 13.1328 9.75 12.1255 9.75 10.8828Z"></path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <svg data-v-8d265134="" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 24 24" width="25" focusable="false" aria-hidden="true"><path data-v-8d265134="" fill-rule="evenodd" clip-rule="evenodd" d="M12 20.3828C13.3991 20.3828 14.7088 19.9997 15.8298 19.3326L15.7599 19.0923C15.6009 18.5459 15.4804 18.1888 15.3729 17.949C15.2647 17.7077 15.2019 17.6611 15.1999 17.6596L15.199 17.659C15.1984 17.6587 15.1946 17.6569 15.1857 17.6542C15.1659 17.6483 15.1254 17.6396 15.0466 17.6341C14.9274 17.6257 14.8039 17.6274 14.629 17.6298C14.5267 17.6312 14.4068 17.6328 14.26 17.6328H9.74002C9.5932 17.6328 9.47336 17.6312 9.37109 17.6298C9.19616 17.6274 9.07262 17.6257 8.95342 17.6341C8.87462 17.6396 8.83412 17.6483 8.8143 17.6542C8.80539 17.6569 8.80162 17.6587 8.80107 17.659L8.80013 17.6596C8.79814 17.6611 8.73537 17.7077 8.62719 17.949C8.51968 18.1888 8.39911 18.5459 8.24017 19.0923L8.17024 19.3326C9.29122 19.9997 10.6009 20.3828 12 20.3828ZM16.7416 17.3353C16.8658 17.6124 16.9844 17.9563 17.1107 18.372C18.5807 17.0028 19.5 15.0502 19.5 12.8828C19.5 8.74068 16.1421 5.38281 12 5.38281C7.85786 5.38281 4.5 8.74068 4.5 12.8828C4.5 15.0502 5.41934 17.0028 6.88933 18.372C7.01567 17.9563 7.13421 17.6124 7.25848 17.3353C7.41084 16.9955 7.60432 16.6796 7.90491 16.456C8.21936 16.2221 8.55751 16.1582 8.84849 16.1377C9.03005 16.125 9.25461 16.1278 9.47385 16.1305L9.47407 16.1305C9.56477 16.1317 9.65456 16.1328 9.74002 16.1328H14.26C14.3455 16.1328 14.4353 16.1317 14.526 16.1305L14.5262 16.1305C14.7454 16.1278 14.97 16.125 15.1515 16.1377C15.4425 16.1582 15.7807 16.2221 16.0951 16.456C16.3957 16.6796 16.5892 16.9955 16.7416 17.3353ZM21 12.8828C21 17.8534 16.9706 21.8828 12 21.8828C7.02944 21.8828 3 17.8534 3 12.8828C3 7.91225 7.02944 3.88281 12 3.88281C16.9706 3.88281 21 7.91225 21 12.8828ZM9.75 10.8828C9.75 9.64017 10.7574 8.63281 12 8.63281C13.2426 8.63281 14.25 9.64017 14.25 10.8828C14.25 12.1255 13.2426 13.1328 12 13.1328C10.7574 13.1328 9.75 12.1255 9.75 10.8828ZM12 7.13281C9.92893 7.13281 8.25 8.81174 8.25 10.8828C8.25 12.9539 9.92893 14.6328 12 14.6328C14.0711 14.6328 15.75 12.9539 15.75 10.8828C15.75 8.81174 14.0711 7.13281 12 7.13281Z"></path></svg>
                )}
              </button>
              {console.log("showMobileDropdown state:", showMobileDropdown)}
              {showMobileDropdown && (
                <div className="absolute right-0 mt-2 z-50">
                  <MobileUserDropdown user={email ? { fullName: name, email } : null} setShowMobileDropdown={setShowMobileDropdown} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!hideMenu && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`hidden md:block ${(scrolled || hovered) ? 'bg-white text-gray-800' : 'bg-white/10 backdrop-blur-md text-white'} text-sm font-light border-t transition-colors duration-300`}
          >
            <ul className="flex justify-center space-x-6 py-2 uppercase tracking-wide">
              <li><a href="/gallery" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Gallery</a></li>
              <li><a href="/tours" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Tour & Experiences</a></li>
              <li><a href="/sankya" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Restaurant & Bar</a></li>
              <li><a href="/spa" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Wellness & Spa</a></li>
              <li><a href="/facilities" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Facilities</a></li>
              <li><a href="/about" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">About Us</a></li>
              <li><a href="/contact" className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">Contact Us</a></li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                    window.location.href = `${bookingBaseUrl}/`;
                  }}
                  className="relative px-3 py-1 rounded hover:bg-white transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-4/5 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
                >
                  Booking
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="md:hidden fixed top-[60px] left-0 right-0 bottom-0 bg-white text-gray-800 text-base font-light z-50 flex flex-col shadow-none"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-40">

              <motion.a whileTap={{ scale: 0.97 }} href="/gallery" className="block border-b pb-2">Gallery</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/tours" className="block border-b pb-2">Tour & Experiences</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/sankya" className="block border-b pb-2">Restaurant & Bar</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/spa" className="block border-b pb-2">Wellness & Spa</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/facilities" className="block border-b pb-2">Facilities</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/about" className="block border-b pb-2">About Us</motion.a>
              <motion.a whileTap={{ scale: 0.97 }} href="/contact" className="block border-b pb-2">Contact Us</motion.a>
              <motion.a
                whileTap={{ scale: 0.97 }}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const bookingBaseUrl = import.meta.env.VITE_BOOKING_URL;
                  window.location.href = `${bookingBaseUrl}/`;
                }}
                className="block border-b pb-2"
              >
                Booking
              </motion.a>

            </div>
            <div className="px-6 py-4 border-t text-sm text-gray-500 bg-white">
              ENGLISH (CAMBODIA)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}