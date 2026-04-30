"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

type GalleryTile = {
  src: string;
  alt: string;
  label: string;
  className: string;
  sizes: string;
  featured?: boolean;
};

const galleryTiles: GalleryTile[] = [
  {
    src: "/images/1.jpeg",
    alt: "Exterior wash on a customer car in Dublin",
    label: "Exterior wash",
    className: "lg:col-span-6 lg:row-span-2",
    sizes: "(max-width: 1024px) 100vw, 50vw",
    featured: true,
  },
  {
    src: "/images/2.jpeg",
    alt: "Wheel detail on a customer car in Dublin",
    label: "Wheel detail",
    className: "lg:col-span-3 lg:row-span-1",
    sizes: "(max-width: 1024px) 100vw, 25vw",
  },
  {
    src: "/images/3.jpeg",
    alt: "Interior clean during a mobile valet in Dublin",
    label: "Interior clean",
    className: "lg:col-span-3 lg:row-span-1",
    sizes: "(max-width: 1024px) 100vw, 25vw",
  },
  {
    src: "/images/4.jpeg",
    alt: "Mobile valet service at a customer home in Dublin",
    label: "Mobile valet",
    className: "lg:col-span-4 lg:row-span-1",
    sizes: "(max-width: 1024px) 100vw, 33vw",
  },
  {
    src: "/images/5.jpeg",
    alt: "On-site service for a customer car in Dublin",
    label: "On-site service",
    className: "lg:col-span-4 lg:row-span-1",
    sizes: "(max-width: 1024px) 100vw, 33vw",
  },
  {
    src: "/images/6.jpeg",
    alt: "Finished result after professional mobile valeting in Dublin",
    label: "Finished result",
    className: "lg:col-span-4 lg:row-span-1",
    sizes: "(max-width: 1024px) 100vw, 33vw",
  },
];

function GalleryCard({
  tile,
  index,
  onOpen,
}: {
  tile: GalleryTile;
  index: number;
  onOpen: (index: number) => void;
}) {
  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45 }}
      onClick={() => onOpen(index)}
      aria-label={`Open gallery image: ${tile.label}`}
      className={`group relative overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.45)] transition duration-300 hover:shadow-[0_26px_64px_-30px_rgba(15,23,42,0.52)] ${tile.className}`}
    >
      <div className={`relative h-full min-h-[220px] ${tile.featured ? "lg:min-h-[460px]" : "lg:min-h-[220px]"}`}>
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes={tile.sizes}
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={tile.featured}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/82 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.16em] text-white shadow-lg shadow-slate-950/20">
          {tile.label}
        </div>
      </div>
    </motion.button>
  );
}

export function RealResultsGallerySection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const showPrevious = () => {
    setCurrentIndex((current) => (current - 1 + galleryTiles.length) % galleryTiles.length);
  };

  const showNext = () => {
    setCurrentIndex((current) => (current + 1) % galleryTiles.length);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentTile = galleryTiles[currentIndex];

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      showNext();
    } else if (deltaX < -swipeThreshold) {
      showPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <SectionShell
        id="real-results"
        eyebrow="REAL RESULTS"
        title="Real Results Gallery"
        description="Recent mobile valeting work from real customer cars across Dublin."
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="grid gap-4 lg:grid-flow-dense lg:grid-cols-12 lg:auto-rows-[220px]"
        >
          {galleryTiles.map((tile, index) => (
            <GalleryCard key={tile.src} tile={tile} index={index} onOpen={openLightbox} />
          ))}
        </motion.div>
      </SectionShell>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-md sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery lightbox"
          >
            <motion.div
              className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_32px_100px_-40px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    Real Results Gallery
                  </p>
                  <p className="truncate text-sm text-white/80">{currentTile.label}</p>
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label="Close gallery"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex min-h-[55vh] items-center justify-center bg-black/20 px-3 py-4 sm:min-h-[70vh] sm:px-4">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white shadow-lg shadow-black/30 transition hover:bg-slate-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="relative w-full max-w-5xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-slate-900 sm:aspect-[16/10] lg:aspect-[16/9]">
                    <Image
                      src={currentTile.src}
                      alt={currentTile.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 90vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-slate-950/75 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.16em] text-white">
                      {currentIndex + 1} / {galleryTiles.length}
                    </span>
                    <span className="rounded-full border border-white/15 bg-slate-950/75 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.16em] text-white">
                      Swipe or use arrows
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white shadow-lg shadow-black/30 transition hover:bg-slate-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
