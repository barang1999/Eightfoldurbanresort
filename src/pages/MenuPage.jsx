import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MENU = {
  Asian: ["/Menu/Asian1.webp", "/Menu/Asian2.webp"],
  Western: ["/Menu/Western1.webp", "/Menu/Western2.webp"], // recommend rename to Western2.webp
  Dessert: ["/Menu/Dessert1.webp", "/Menu/Dessert2.webp"],
};

const CATEGORIES = ["Asian", "Western", "Dessert"];

export default function MenuPage() {
  const [category, setCategory] = useState("Asian");
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (slide left), -1 = prev (slide right)

  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);
  const preservePageOnCategoryChangeRef = useRef(false);

  const SWIPE_THRESHOLD_PX = 60;

  const onPointerDown = (e) => {
    // Only primary button for mouse; touch/stylus are fine
    if (e.pointerType === "mouse" && e.button !== 0) return;

    pointerStartXRef.current = e.clientX;
    pointerIdRef.current = e.pointerId;

    // Capture to ensure we get the pointerup even if cursor leaves element
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;

    const startX = pointerStartXRef.current;
    pointerStartXRef.current = null;
    pointerIdRef.current = null;

    if (startX == null) return;

    const dx = e.clientX - startX;
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
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="text-sm font-semibold tracking-tight text-neutral-900">
            Menu
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
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div
            className="relative select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{ touchAction: "pan-y" }}
            aria-label="Menu page viewer (swipe left/right to change page)"
          >
            {src ? (
              <div className="relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={`${category}-${pageIndex}`}
                    src={src}
                    alt={`${category} menu page ${pageIndex + 1}`}
                    className="block h-auto w-full select-none"
                    loading="eager"
                    draggable={false}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
                  />
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex h-[70vh] items-center justify-center text-sm text-neutral-500">
                No menu image found.
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-3">
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

        <div className="mx-auto mt-4 max-w-md text-center text-xs text-neutral-500">
          Tip: swipe left/right (or use ← → keys)
        </div>
      </div>
    </div>
  );
}