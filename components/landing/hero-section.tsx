"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Car, Clock, MapPin, Star } from "lucide-react";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { fadeInUp, staggerContainer } from "./motion-presets";

const highlights = ["We Come To You", "Dublin Coverage", "Premium Finish"];

const features = [
  {
    icon: Car,
    title: "Mobile Service",
    description: "We bring professional car care directly to your location",
  },
  {
    icon: Clock,
    title: "WhatsApp Booking",
    description: "We arrange your visit directly in chat for a simpler handoff",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Professional finish that makes your car shine like new",
  },
];

const slides = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg",
  "/images/slide4.jpg",
];

export function HeroSection({ whatsappNumber }: { whatsappNumber: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const whatsappHref = getWhatsAppBaseUrl(whatsappNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Faster rotation for a more dynamic premium feel

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate py-6 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 shadow-[0_32px_100px_-40px_rgba(15,23,42,0.8)]">
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <Image
                key={slide}
                src={slide}
                alt="Professional mobile car valeting in Dublin"
                fill
                priority={index === 0}
                sizes="100vw"
                className={`absolute inset-0 object-cover transition-[opacity,transform] duration-[900ms] ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transform: index === currentSlide ? "scale(1.08)" : "scale(1)",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/94 via-slate-950/70 to-slate-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_left_bottom,_rgba(59,130,246,0.14),_transparent_40%)]" />
            <div className="absolute inset-0 bg-slate-950/10" />
          </div>

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-12 lg:py-14">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex h-full flex-col justify-center space-y-7 lg:pr-6"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/20 backdrop-blur-xl"
              >
                Premium mobile car valeting across Dublin
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(15,23,42,0.5)] sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                  Mobile Car Valeting in Dublin
                </h1>
                <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/90">
                  Serving homes and workplaces across Dublin, Ireland
                </p>
                <p className="max-w-xl text-lg leading-8 text-slate-100/95 drop-shadow-[0_1px_8px_rgba(15,23,42,0.35)]">
                  Professional, reliable car cleaning at your home or workplace, with bookings arranged
                  directly on WhatsApp.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/15 backdrop-blur-xl"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_45px_-18px_rgba(37,99,235,0.8)] transition duration-200 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-[0_22px_58px_-18px_rgba(37,99,235,0.95)]"
                  href="/booking"
                >
                  Book via WhatsApp
                </Link>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition duration-200 hover:bg-white/20 hover:shadow-lg hover:shadow-slate-950/20"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick("hero_whatsapp")}
                >
                  WhatsApp Us
                </a>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-4 text-sm text-white/90 sm:grid-cols-3"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/15 backdrop-blur-xl">
                  <MapPin className="h-4 w-4 text-sky-300" />
                  <span>Home visits</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/15 backdrop-blur-xl">
                  <Car className="h-4 w-4 text-sky-300" />
                  <span>Workplace service</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/15 backdrop-blur-xl">
                  <Clock className="h-4 w-4 text-sky-300" />
                  <span>Dublin coverage</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="relative flex h-full items-center">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid w-full gap-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-sky-400/12 via-white/10 to-blue-950/20 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-2xl sm:p-5"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={fadeInUp}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[24px] border border-white/10 bg-slate-950/20 p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-shadow duration-200 hover:shadow-[0_20px_48px_-26px_rgba(15,23,42,0.95)] sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                        <feature.icon className="h-6 w-6 text-sky-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                        <p className="mt-1 text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
