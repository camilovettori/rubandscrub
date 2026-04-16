import Image from "next/image";
import Link from "next/link";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";

export function PromotionalSection() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to Book Your Mobile Valet?
            </h2>
            <p className="text-lg text-gray-600">
              Get your car professionally cleaned at your home or workplace.
              Quick booking, reliable service, premium results.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
                href="/booking"
              >
                Book via WhatsApp
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
                href={getWhatsAppBaseUrl()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/callus.jpeg"
              alt="Call us for mobile car valeting"
              width={500}
              height={300}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
