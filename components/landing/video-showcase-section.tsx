"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

const trustPoints = ["Real footage", "Professional finish", "Mobile service"];

const showcaseItems = [
  {
    label: "MOBILE VALETING",
    title: "On-site valeting",
    description: "A real look at the cleaning process at the customer's location.",
    videoSrc: "/videos/video2.mp4",
    thumbnailSrc: "/videos/thumbvideo2.png",
    tint: "from-sky-500/28 via-slate-900/20 to-slate-950/80",
    accent: "bg-sky-500",
  },
  {
    label: "PROFESSIONAL FINISH",
    title: "Quality on every job",
    description: "Another example of the finish and presentation we deliver on site.",
    videoSrc: "/videos/video1.mp4",
    thumbnailSrc: "/videos/thumbvideo1.png",
    tint: "from-emerald-500/22 via-slate-900/18 to-slate-950/80",
    accent: "bg-emerald-500",
  },
] as const;

type ShowcaseItem = {
  label: string;
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
  tint: string;
  accent: string;
};

function ModalVideoTile({
  item,
  side,
  isActive,
  onActivate,
  onPlay,
  onPause,
  onEnded,
  videoRef,
}: {
  item: ShowcaseItem;
  side: "left" | "right";
  isActive: boolean;
  onActivate: (side: "left" | "right") => void;
  onPlay: (side: "left" | "right") => void;
  onPause: (side: "left" | "right") => void;
  onEnded: (side: "left" | "right") => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.9)]">
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={item.videoSrc}
          poster={item.thumbnailSrc}
          preload="none"
          controls={isActive}
          playsInline
          onPlay={() => {
            setIsPlaying(true);
            onPlay(side);
          }}
          onPause={() => {
            setIsPlaying(false);
            onPause(side);
          }}
          onEnded={() => {
            setIsPlaying(false);
            onEnded(side);
          }}
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={() => onActivate(side)}
            className="group absolute inset-0 z-10 block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label={`Play ${item.title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition duration-500 group-hover:from-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/80 text-slate-950 shadow-[0_14px_40px_-18px_rgba(15,23,42,0.65)] backdrop-blur-xl transition duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_18px_52px_-18px_rgba(15,23,42,0.75)]">
                <Play className="h-6 w-6 fill-current" />
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">{item.label}</p>
          <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

function ShowcaseTile({
  item,
  onOpen,
}: {
  item: ShowcaseItem;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 text-left shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.52)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label={`Open video showcase for ${item.label.toLowerCase()}`}
    >
      <div className="relative min-h-[240px] overflow-hidden sm:min-h-[300px]">
        <Image
          src={item.thumbnailSrc}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          priority={false}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${item.tint}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition duration-500 group-hover:from-black/50" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/12 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/70 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl">
          <span className={`h-2 w-2 rounded-full ${item.accent}`} />
          {item.label}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/80 text-slate-950 shadow-[0_14px_40px_-18px_rgba(15,23,42,0.65)] backdrop-blur-xl transition duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_18px_52px_-18px_rgba(15,23,42,0.75)]">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-2 text-white">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</h3>
          <p className="max-w-sm text-sm leading-6 text-white/78">{item.description}</p>
        </div>
      </div>
    </button>
  );
}

export function VideoShowcaseSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState<"left" | "right" | null>(null);
  const modalTitleId = useId();
  const modalDescriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const previousOverflowRef = useRef<string | null>(null);
  const leftVideoRef = useRef<HTMLVideoElement | null>(null);
  const rightVideoRef = useRef<HTMLVideoElement | null>(null);

  const pauseAllPlayers = () => {
    leftVideoRef.current?.pause();
    rightVideoRef.current?.pause();
  };

  useEffect(() => {
    if (!isOpen) {
      setActivePlayer(null);
      pauseAllPlayers();
      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }
      lastTriggerRef.current?.focus();
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (activePlayer === "left") {
      rightVideoRef.current?.pause();
    }

    if (activePlayer === "right") {
      leftVideoRef.current?.pause();
    }
  }, [activePlayer]);

  const handleActivate = (side: "left" | "right") => {
    setActivePlayer(side);

    const currentVideo = side === "left" ? leftVideoRef.current : rightVideoRef.current;
    const otherVideo = side === "left" ? rightVideoRef.current : leftVideoRef.current;

    otherVideo?.pause();
    if (currentVideo) {
      currentVideo.muted = false;
      currentVideo.volume = 1;
    }
    void currentVideo?.play().catch(() => {
      setActivePlayer(null);
    });
  };

  const handlePlay = (side: "left" | "right") => {
    setActivePlayer(side);
    const otherVideo = side === "left" ? rightVideoRef.current : leftVideoRef.current;
    otherVideo?.pause();

    const currentVideo = side === "left" ? leftVideoRef.current : rightVideoRef.current;
    if (currentVideo) {
      currentVideo.muted = false;
      currentVideo.volume = 1;
    }
  };

  const handlePause = (side: "left" | "right") => {
    const currentVideo = side === "left" ? leftVideoRef.current : rightVideoRef.current;
    const otherVideo = side === "left" ? rightVideoRef.current : leftVideoRef.current;

    if (activePlayer === side && currentVideo?.paused && otherVideo?.paused) {
      setActivePlayer(null);
    }
  };

  const handleEnded = (side: "left" | "right") => {
    if (activePlayer === side) {
      setActivePlayer(null);
    }
  };

  return (
    <>
      <SectionShell
        id="video-showcase"
        eyebrow="Video"
        title="See Rub & Scrub in action"
        description="Real footage from our mobile valeting service across Dublin."
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="space-y-5"
        >
          <motion.div
            variants={fadeInUp}
            className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.5)] sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {showcaseItems.map((item) => (
                <ShowcaseTile
                  key={item.label}
                  item={item}
                  onOpen={(trigger) => {
                    lastTriggerRef.current = trigger;
                    setIsOpen(true);
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
            {trustPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                {point}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </SectionShell>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 py-6 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={modalDescriptionId}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 shadow-[0_32px_100px_-36px_rgba(15,23,42,0.9)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Video showcase</p>
                <h2 id={modalTitleId} className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                  Real footage from our work
                </h2>
                <p id={modalDescriptionId} className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                  Two local clips showing mobile valeting in action at different customer locations.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Close video showcase"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:gap-5">
              {showcaseItems.map((item) => (
                <ModalVideoTile
                  key={`modal-${item.label}`}
                  item={item}
                  side={item.label === "MOBILE VALETING" ? "left" : "right"}
                  isActive={
                    (item.label === "MOBILE VALETING" && activePlayer === "left") ||
                    (item.label === "PROFESSIONAL FINISH" && activePlayer === "right")
                  }
                  videoRef={item.label === "MOBILE VALETING" ? leftVideoRef : rightVideoRef}
                  onActivate={handleActivate}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
