"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappHref = getWhatsAppBaseUrl(whatsappNumber);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/images/logos.png"
            alt="Rub & Scrub"
            width={900}
            height={900}
            className="h-[72px] md:h-[88px] w-auto object-contain"
          />
          <div>
            <p className="text-base font-bold tracking-wide text-gray-900">
              {siteConfig.shortName}
            </p>
            <p className="text-sm text-gray-600">Mobile Car Valeting in Dublin</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-gray-600 transition hover:text-blue-600" href="#services">
            Services
          </Link>
          <Link className="text-sm font-medium text-gray-600 transition hover:text-blue-600" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium text-gray-600 transition hover:text-blue-600" href="#booking">
            Booking
          </Link>
          <Link className="text-sm font-medium text-gray-600 transition hover:text-blue-600" href="#contact">
            Contact
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            href="/booking"
          >
            Book Now
          </Link>
          <a
            className="inline-flex rounded-full border border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:border-blue-700"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick("header_whatsapp")}
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-4">
              <Link
                className="block text-base font-medium text-gray-600 transition hover:text-blue-600"
                href="#services"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                className="block text-base font-medium text-gray-600 transition hover:text-blue-600"
                href="#how-it-works"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                className="block text-base font-medium text-gray-600 transition hover:text-blue-600"
                href="#booking"
                onClick={() => setIsMenuOpen(false)}
              >
                Booking
              </Link>
              <Link
                className="block text-base font-medium text-gray-600 transition hover:text-blue-600"
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                href="/booking"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-white px-6 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50 hover:border-blue-700"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackWhatsAppClick("header_whatsapp");
                  setIsMenuOpen(false);
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
