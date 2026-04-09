"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Car, Clock, MapPin, Star } from "lucide-react";

const highlights = ["We Come To You", "Dublin Coverage", "Premium Finish"];

const features = [
  {
    icon: Car,
    title: "Mobile Service",
    description: "We bring professional car care directly to your location",
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description: "Choose your preferred time window for maximum convenience",
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

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Faster rotation for a more dynamic premium feel

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-32">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            {/* Enhanced zoom animation */}
            <div
              className={`absolute inset-0 transition-transform duration-[9000ms] ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              style={{
                backgroundImage: `url(${slide})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }}
            />
          </div>
        ))}
        {/* Premium gradient overlay with left-right opacity variation */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-blue-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/15 via-transparent to-blue-500/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
              Premium mobile car valeting across Dublin
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)] sm:text-5xl lg:text-6xl">
                Mobile Car Valeting in Dublin
              </h1>
              <p className="max-w-xl text-lg leading-7 text-slate-100 drop-shadow-[0_1px_8px_rgba(15,23,42,0.35)]">
                Professional, reliable car cleaning at your home or workplace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30"
                href="/booking"
              >
                Book Your Valet
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
                href="https://wa.me/353000000000"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Us
              </a>
            </div>

            <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Home visits</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <Car className="h-4 w-4 text-blue-600" />
                <span>Workplace service</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Dublin coverage</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-gray-900/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
