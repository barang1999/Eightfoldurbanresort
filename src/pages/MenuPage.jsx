import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { UtensilsCrossed, X } from "lucide-react";

const MENU = {
  Asian: ["/Menu/Asian1.webp", "/Menu/Asian2.webp"],
  Western: ["/Menu/Western1.webp", "/Menu/Western2.webp"], // recommend rename to Western2.webp
  Dessert: ["/Menu/Dessert1.webp", "/Menu/Dessert2.webp"],
};

const CATEGORIES = ["Asian", "Western", "Dessert"];

export default function MenuPage() {
  const [category, setCategory] = useState("Asian");
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pointerMovedRef = useRef(false);

  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);
  const preservePageOnCategoryChangeRef = useRef(false);

  // Lightbox pan/zoom
  const lbX = useMotionValue(0);
  const lbY = useMotionValue(0);
  const lbScale = useMotionValue(1);
  const lbScaleClamped = useTransform(lbScale, (v) => Math.min(3, Math.max(1, v)));

  const pinchRef = useRef({
    pointers: new Map(),
    startDist: null,
    startScale: 1,
  });

  const SWIPE_THRESHOLD_PX = 60;

  const onPointerDown = (e) => {
    // Only primary button for mouse; touch/stylus are fine
    if (e.pointerType === "mouse" && e.button !== 0) return;

    pointerMovedRef.current = false;

    pointerStartXRef.current = e.clientX;
    pointerIdRef.current = e.pointerId;

    // Capture to ensure we get the pointerup even if cursor leaves element
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerMove = (e) => {
    const startX = pointerStartXRef.current;
    if (startX == null) return;
    if (Math.abs(e.clientX - startX) > 10) {
      pointerMovedRef.current = true;
    }
  };
  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isLightboxOpen]);
  const openLightbox = () => {
    console.debug("[Lightbox] openLightbox click", {
      src,
      pointerMoved: pointerMovedRef.current,
    });
    if (!src) return;
    if (pointerMovedRef.current) return; // don’t open after swipe
    setIsLightboxOpen(true);
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const zoomTo = (nextScale) => {
    const s = clamp(nextScale, 1, 3);
    animate(lbScale, s, { duration: 0.18, ease: "easeOut" });
    if (s === 1) {
      // snap back to center when fully zoomed out
      animate(lbX, 0, { duration: 0.18, ease: "easeOut" });
      animate(lbY, 0, { duration: 0.18, ease: "easeOut" });
    }
  };

  const handleLightboxWheel = (e) => {
    // Trackpad / mouse wheel zoom
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.08 : 0.92;
    const current = lbScale.get();
    zoomTo(current * factor);
  };

  const handleLightboxDoubleClick = () => {
    const current = lbScale.get();
    zoomTo(current > 1.01 ? 1 : 2);
  };

  const getDist = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  const onLightboxPointerDown = (e) => {
    if (e.pointerType === "mouse") return; // pinch is for touch/stylus
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchRef.current.pointers.size === 2) {
      const pts = Array.from(pinchRef.current.pointers.values());
      pinchRef.current.startDist = getDist(pts[0], pts[1]);
      pinchRef.current.startScale = lbScale.get();
    }
  };

  const onLightboxPointerMove = (e) => {
    if (!pinchRef.current.pointers.has(e.pointerId)) return;
    pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchRef.current.pointers.size === 2 && pinchRef.current.startDist) {
      const pts = Array.from(pinchRef.current.pointers.values());
      const dist = getDist(pts[0], pts[1]);
      const ratio = dist / pinchRef.current.startDist;
      const next = pinchRef.current.startScale * ratio;
      lbScale.set(clamp(next, 1, 3));
    }
  };

  const onLightboxPointerUp = (e) => {
    pinchRef.current.pointers.delete(e.pointerId);
    if (pinchRef.current.pointers.size < 2) {
      pinchRef.current.startDist = null;
    }

    // If user pinched down close to 1, snap to 1 and re-center
    const s = lbScale.get();
    if (s < 1.02) zoomTo(1);
  };

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;

    const startX = pointerStartXRef.current;
    pointerStartXRef.current = null;
    pointerIdRef.current = null;

    if (startX == null) return;

    const dx = e.clientX - startX;
    console.debug("[Swipe] detected", { dx });
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;

    // Swipe left -> next page, swipe right -> previous page
    if (dx < 0) {
      setDirection(1);
      next();
    } else {
      setDirection(-1);
      prev();
    }
  };

  const onPointerCancel = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerStartXRef.current = null;
    pointerIdRef.current = null;
  };

  const pages = useMemo(() => MENU[category] ?? [], [category]);
  const total = pages.length;

  const categoryIndex = useMemo(() => CATEGORIES.indexOf(category), [category]);

  const goToNextCategory = () => {
    if (categoryIndex < 0) return;
    const nextIndex = Math.min(CATEGORIES.length - 1, categoryIndex + 1);
    if (nextIndex === categoryIndex) return;

    preservePageOnCategoryChangeRef.current = false;
    setDirection(1);
    setCategory(CATEGORIES[nextIndex]);
  };

  const goToPrevCategory = () => {
    if (categoryIndex < 0) return;
    const prevIndex = Math.max(0, categoryIndex - 1);
    if (prevIndex === categoryIndex) return;

    const prevCategory = CATEGORIES[prevIndex];
    const prevTotal = (MENU[prevCategory] ?? []).length;

    // Jump to last page of previous category for a natural back-swipe feel
    preservePageOnCategoryChangeRef.current = true;
    setDirection(-1);
    setPageIndex(Math.max(0, prevTotal - 1));
    setCategory(prevCategory);
  };

  useEffect(() => {
    // Default behavior: land on first page when category changes.
    // Exception: when going to previous category, we preserve pageIndex (last page) for a natural back-swipe.
    if (preservePageOnCategoryChangeRef.current) {
      preservePageOnCategoryChangeRef.current = false;
      return;
    }

    setDirection(1);
    setPageIndex(0);
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroVisible(false);
    }, 900); // duration of welcome screen

    return () => clearTimeout(timer);
  }, []);

  const prev = () => {
    // If we're at the first page, go to previous category (landing on its last page).
    if (pageIndex <= 0) {
      goToPrevCategory();
      return;
    }

    setDirection(-1);
    setPageIndex(pageIndex - 1);
  };

  const next = () => {
    // If we're at the last page, go to next category (landing on its first page).
    if (total > 0 && pageIndex >= total - 1) {
      goToNextCategory();
      return;
    }

    setDirection(1);
    setPageIndex(Math.min(total - 1, pageIndex + 1));
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageIndex, total]);

  const src = pages[pageIndex] || "";
  useEffect(() => {
    setIsImageLoaded(false);
  }, [src]);

  useEffect(() => {
    // Reset pan/zoom for new image
    lbX.set(0);
    lbY.set(0);
    lbScale.set(1);
    pinchRef.current.startDist = null;
    pinchRef.current.pointers.clear();
  }, [src, isLightboxOpen]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      filter: "blur(2px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      filter: "blur(2px)",
    }),
  };

  return (
    <div className="relative min-h-screen bg-neutral-50 overflow-hidden">
      <AnimatePresence>
        {isIntroVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl font-medium tracking-tight text-[#A58E63]"
            >
              Welcome to Sankya
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Lightbox overlay */}
      <AnimatePresence>
        {isLightboxOpen && src && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onWheel={(e) => {
              console.debug("[Lightbox] wheel");
              e.preventDefault();
            }}
            onClick={(e) => {
              console.debug("[Lightbox] backdrop click", {
                targetIsCurrent: e.target === e.currentTarget,
              });
              e.stopPropagation();
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            <motion.button
              onClick={(e) => {
                console.debug("[Lightbox] close button click");
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="fixed top-3 right-3 z-50 rounded-full bg-white/20 p-2 backdrop-blur-md border border-white/30 shadow-sm transition hover:bg-white/30 focus:outline-none"
              aria-label="Close"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
            >
              <X size={18} className="text-[#A58E63]" />
            </motion.button>

            <div className="flex h-full w-full items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-5xl"
                onClick={(e) => {
                  console.debug("[Lightbox] inner container click (stop)");
                  e.stopPropagation();
                }}
              >
                <motion.img
                  src={src}
                  alt={`${category} menu page ${pageIndex + 1} (full screen)`}
                  className="max-h-[90vh] w-full rounded-2xl bg-white object-contain cursor-grab active:cursor-grabbing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  draggable={false}
                  style={{ x: lbX, y: lbY, scale: lbScaleClamped }}
                  drag={lbScale.get() > 1.01}
                  dragMomentum={false}
                  onWheel={handleLightboxWheel}
                  onDoubleClick={handleLightboxDoubleClick}
                  onPointerDown={onLightboxPointerDown}
                  onPointerMove={onLightboxPointerMove}
                  onPointerUp={onLightboxPointerUp}
                  onPointerCancel={onLightboxPointerUp}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#A58E63]">
            <UtensilsCrossed size={18} strokeWidth={1.8} className="text-[#A58E63]" />
            <span>Menu</span>
          </div>

          <div className="ml-auto flex items-center rounded-full bg-neutral-100 p-1">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setDirection(1);
                    setPageIndex(0);
                    setCategory(c);
                  }}
                  className={[
                    "px-3 py-1.5 text-xs font-medium rounded-full transition",
                    active
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="ml-2 text-xs tabular-nums text-neutral-600">
            {total ? `${pageIndex + 1} / ${total}` : "—"}
          </div>
        </div>
      </div>

      {/* Viewer */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div
            className="relative select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={openLightbox}
            style={{ touchAction: "pan-y" }}
            aria-label="Menu page viewer (swipe left/right to change page)"
            role="button"
            tabIndex={0}
          >
            <div className="relative w-full aspect-[3/4] bg-white">
              {/* Subtle placeholder to avoid layout jump */}
              <AnimatePresence>
                {!isImageLoaded && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center bg-neutral-50"
                  >
                    <div className="h-5 w-5 rounded-full border-2 border-[#A58E63]/30 border-t-[#A58E63] animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {src ? (
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={`${category}-${pageIndex}`}
                    src={src}
                    alt={`${category} menu page ${pageIndex + 1}`}
                    className="absolute inset-0 h-full w-full select-none object-contain"
                    loading="eager"
                    draggable={false}
                    onLoad={() => setIsImageLoaded(true)}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                  No menu image found.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > pageIndex ? 1 : -1);
                  setPageIndex(i);
                }}
                className={[
                  "h-2 w-2 rounded-full transition",
                  i === pageIndex ? "bg-neutral-900" : "bg-neutral-300",
                ].join(" ")}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-4 md:mt-6 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center text-xs text-neutral-500">
          Tip: swipe left/right (or use ← → keys)
        </div>
      </div>
    </div>
  );
}