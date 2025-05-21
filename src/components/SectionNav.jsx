import React, { useRef, useEffect, useState } from 'react';

const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rooms', label: 'Suites & Rooms' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'dining', label: 'Restaurants & Bars' },
    { id: 'tour', label: 'Tour' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'location', label: 'Location' },
  ];

export default function SectionNav() {
  const navRef = useRef(null);
  const [activeId, setActiveId] = useState('');
  const linkRefs = useRef({});
  const underlineRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const detailsRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      console.log("📱 Mobile view detected:", window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Sticky state for mobile nav
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const introSection = document.getElementById('introduction');
      if (!introSection) return;
      // Trigger when top of introduction section is at or above viewport top
      const rect = introSection.getBoundingClientRect();
      setIsSticky(rect.top <= 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // trigger on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Collapse dropdown when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        detailsRef.current.removeAttribute('open');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleEntry = null;

        entries.forEach((entry) => {
          console.log('👁️ Observed section:', entry.target.id, '— isIntersecting:', entry.isIntersecting, 'Ratio:', entry.intersectionRatio);
          if (entry.isIntersecting && (!visibleEntry || entry.intersectionRatio > visibleEntry.intersectionRatio)) {
            visibleEntry = entry;
          }
        });

        if (visibleEntry) {
          const id = visibleEntry.target.id;
          console.log('✅ Set activeId:', id);
          setActiveId(id);
          const link = linkRefs.current[id];
          if (link && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            const scrollLeft = navRef.current.scrollLeft;
            const offset =
              linkRect.left - navRect.left + scrollLeft - (navRect.width / 2 - linkRect.width / 2);
            navRef.current.scrollTo({ left: offset, behavior: 'smooth' });
          }
        }
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateUnderline = () => {
      const activeLink = linkRefs.current[activeId];
      const underline = underlineRef.current;
      const nav = navRef.current;

      if (activeLink && underline && nav) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        const offset = linkRect.left - navRect.left + nav.scrollLeft;

        underline.style.left = `${offset}px`;
        underline.style.width = `${linkRect.width}px`;
      }
    };

    setTimeout(() => requestAnimationFrame(updateUnderline), 0);

    const scrollHandler = () => requestAnimationFrame(updateUnderline);
    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateUnderline));

    window.addEventListener('scroll', scrollHandler);
    if (navRef.current) resizeObserver.observe(navRef.current);

    // Also trigger an initial update with slight delay
    setTimeout(updateUnderline, 0);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      resizeObserver.disconnect();
    };
  }, [activeId]);

  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.setProperty('scrollbar-width', 'none');
      navRef.current.style.setProperty('ms-overflow-style', 'none');
    }
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`hidden md:flex sticky top-[7.5rem] z-10 bg-[#f8f6f2] border-b border-gray-200 px-6 py-3 overflow-x-auto whitespace-nowrap justify-start md:justify-center space-x-6 text-gray-800 text-sm md:text-base font-light tracking-wide touch-auto scrollbar-none`}
        style={{ scrollbarWidth: 'none' }}
      >
        <span
          ref={underlineRef}
          className="pointer-events-none absolute bottom-0 z-0 h-[2px] bg-[#a28e68] transition-all duration-300 left-0"
          style={{ left: 0, width: 0 }}
        />
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`hover:text-[#a28e68] transition-colors ${
              activeId === section.id ? 'text-[#a28e68] font-medium' : ''
            }`}
            ref={(el) => {
              if (el) linkRefs.current[section.id] = el;
            }}
          >
            {section.label}
          </a>
        ))}
      </nav>
      {/* Mobile menu */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out transform ${
            isSticky ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="bg-white shadow-md border-b border-gray-200">
            <details ref={detailsRef} className="w-full">
              <summary className="py-4 px-6 flex items-center justify-between gap-2 text-base font-normal text-gray-900 list-none appearance-none">
                <div className="flex-1 text-center">{sections.find(sec => sec.id === activeId)?.label || 'Sections'}</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <style jsx>{`
                summary::-webkit-details-marker {
                  display: none;
                }
              `}</style>
              <ul className="flex flex-col px-6 pb-4 space-y-3 text-base font-light">
                {sections.map(section => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => detailsRef.current?.removeAttribute('open')}
                      className={`block py-1 ${
                        activeId === section.id ? 'text-[#a28e68] font-semibold' : 'text-gray-800'
                      }`}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      )}
      <style jsx global>{`
        nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}