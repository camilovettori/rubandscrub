"use client";

import { FormEvent, useState } from "react";
import { buildBookingWhatsAppUrl } from "@/lib/booking/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

const extras = [
  "Seat shampoo",
  "Pet hair removal",
  "Engine bay clean",
  "Hand wax/polish",
];

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

export function BookingForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const whatsappUrl = buildBookingWhatsAppUrl({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      houseStreet: String(formData.get("houseStreet") ?? ""),
      address: String(formData.get("address") ?? ""),
      eircode: String(formData.get("eircode") ?? ""),
      service: String(formData.get("service") ?? ""),
      carModel: String(formData.get("carModel") ?? ""),
      extras: selectedExtras,
      notes: String(formData.get("notes") ?? ""),
    }, whatsappNumber);

    trackWhatsAppClick("booking_whatsapp");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="booking" className="scroll-mt-24">
      <div className="mb-12 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Book Your Service</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Get your car sparkling clean
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-7 text-gray-600">
          Fill out the form below and WhatsApp opens with your request ready to send.
        </p>
      </div>

      <form
        className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
            <input className={fieldClassName()} name="fullName" type="text" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
            <input className={fieldClassName()} name="phone" type="tel" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input className={fieldClassName()} name="email" type="email" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            House / Street
            <input className={fieldClassName()} name="houseStreet" type="text" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Address
            <input className={fieldClassName()} name="address" type="text" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Eircode
            <input className={fieldClassName()} name="eircode" type="text" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Service
            <div className="mt-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Full Valet
            </div>
            <input type="hidden" name="service" value="Full Valet" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Car Model
            <input className={fieldClassName()} name="carModel" type="text" required />
          </label>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Optional Extras</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {extras.map((extra) => (
                <label key={extra} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(extra)}
                    onChange={() =>
                      setSelectedExtras((current) =>
                        current.includes(extra)
                          ? current.filter((item) => item !== extra)
                          : [...current, extra]
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{extra}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium text-gray-700 md:col-span-2">
            Notes
            <textarea
              className={fieldClassName()}
              name="notes"
              rows={4}
              placeholder="Add any useful details about the vehicle or location"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            We will send your request to WhatsApp so the team can arrange a time with you.
          </p>
          <button
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            type="submit"
          >
            Open WhatsApp
          </button>
        </div>
      </form>
    </section>
  );
}

