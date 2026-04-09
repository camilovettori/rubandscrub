"use client";

import type { FormEvent } from "react";

const services = [
  "Mini Valet",
  "Full Valet",
];

const timeSlots = ["Morning (8:00 - 13:00)", "Afternoon (13:00 - 20:00)"];

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

export function BookingForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section id="booking" className="scroll-mt-24">
      <div className="mb-12 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Book Your Service
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Get your car sparkling clean
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-7 text-gray-600">
          Fill out the form below and we&apos;ll confirm your booking within 2 hours.
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
            <input className={fieldClassName()} name="phoneNumber" type="tel" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input className={fieldClassName()} name="email" type="email" required />
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
            <select className={fieldClassName()} name="service" defaultValue="" required>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Date
            <input className={fieldClassName()} name="preferredDate" type="date" required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Time Slot
            <select className={fieldClassName()} name="timeSlot" defaultValue="" required>
              <option value="" disabled>
                Select a time slot
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
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
            We&apos;ll confirm your booking within 2 hours during business hours.
          </p>
          <button
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            type="submit"
          >
            Send Booking Request
          </button>
        </div>
      </form>
    </section>
  );
}
