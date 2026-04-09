"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CustomDatePicker } from "./custom-date-picker";
import { BookingSuccess } from "./booking-success";

type FormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  houseNumber: string;
  address: string;
  eircode: string;
  service: string;
  carModel: string;
  preferredDate: string;
  timeSlot: string;
  notes: string;
  selectedExtras: string[];
};

const initialFormData: FormData = {
  fullName: "",
  phoneNumber: "",
  email: "",
  houseNumber: "",
  address: "",
  eircode: "",
  service: "",
  carModel: "",
  preferredDate: "",
  timeSlot: "",
  notes: "",
  selectedExtras: [],
};

const services = ["Mini Valet", "Full Valet"];
const timeSlots = ["Morning (8:00 – 13:00)", "Afternoon (13:00 – 20:00)"];

const extras = [
  { name: "Seat shampoo", price: "€20 – €40" },
  { name: "Pet hair removal", price: "€15 – €25" },
  { name: "Engine bay clean", price: "€25 – €50" },
  { name: "Hand wax/polish", price: "€30 – €60" },
];

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-8 rounded-full ${
            i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function Step1Details({ formData, setFormData }: { formData: FormData; setFormData: (data: FormData) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Full Name</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Phone Number</span>
          <input
            type="tel"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
      </div>
    </div>
  );
}

function Step2Location({ formData, setFormData }: { formData: FormData; setFormData: (data: FormData) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">House Number / Street</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.houseNumber}
            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Address</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Eircode</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.eircode}
            onChange={(e) => setFormData({ ...formData, eircode: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

function Step3Service({ formData, setFormData }: { formData: FormData; setFormData: (data: FormData) => void }) {
  const toggleExtra = (extraName: string) => {
    const newExtras = formData.selectedExtras.includes(extraName)
      ? formData.selectedExtras.filter(e => e !== extraName)
      : [...formData.selectedExtras, extraName];
    setFormData({ ...formData, selectedExtras: newExtras });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Service</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Service</span>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Car Model</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.carModel}
            onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
            required
          />
        </label>
        <div>
          <span className="text-sm font-medium text-gray-700">Optional Extras</span>
          <div className="mt-2 space-y-2">
            {extras.map((extra) => (
              <label key={extra.name} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.selectedExtras.includes(extra.name)}
                  onChange={() => toggleExtra(extra.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{extra.name} ({extra.price})</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Booking({ formData, setFormData }: { formData: FormData; setFormData: (data: FormData) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Preferred Booking</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Preferred Date</span>
          <CustomDatePicker
            value={formData.preferredDate}
            onChange={(date) => setFormData({ ...formData, preferredDate: date })}
            placeholder="Select preferred date"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Preferred Time Slot</span>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={formData.timeSlot}
            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
            required
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Notes</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any useful details about the vehicle or location"
          />
        </label>
      </div>
    </div>
  );
}

function Step5Review({ formData, onSubmit, isLoading, error }: { 
  formData: FormData;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      <div className="space-y-4 rounded-lg bg-gray-50 p-4">
        <div>
          <h3 className="font-medium text-gray-900">Your Details</h3>
          <p className="text-sm text-gray-600">{formData.fullName}</p>
          <p className="text-sm text-gray-600">{formData.phoneNumber}</p>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Location</h3>
          <p className="text-sm text-gray-600">{formData.houseNumber}, {formData.address}</p>
          <p className="text-sm text-gray-600">{formData.eircode}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Service</h3>
          <p className="text-sm text-gray-600">{formData.service} - {formData.carModel}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Optional Extras</h3>
          {formData.selectedExtras.length > 0 ? (
            <ul className="text-sm text-gray-600">
              {formData.selectedExtras.map((extra) => (
                <li key={extra}>• {extra}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No optional extras selected</p>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Booking</h3>
          <p className="text-sm text-gray-600">{formData.preferredDate} - {formData.timeSlot}</p>
          {formData.notes && <p className="text-sm text-gray-600">Notes: {formData.notes}</p>}
        </div>
      </div>
      <p className="text-sm text-gray-600">
        We will confirm your booking within 2 hours during business hours.
      </p>
      
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Submitting..." : "Send Booking Request"}
      </button>
    </div>
  );
}

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.phoneNumber && formData.email;
      case 2:
        return formData.houseNumber && formData.address;
      case 3:
        return formData.service && formData.carModel;
      case 4:
        return formData.preferredDate && formData.timeSlot;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          houseNumber: formData.houseNumber,
          address: formData.address,
          eircode: formData.eircode,
          service: formData.service,
          carModel: formData.carModel,
          selectedExtras: formData.selectedExtras,
          preferredDate: formData.preferredDate,
          timeSlot: formData.timeSlot,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit booking. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: unknown) {
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  // Show success state
  if (isSuccess) {
    return <BookingSuccess />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Details formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2Location formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Service formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4Booking formData={formData} setFormData={setFormData} />;
      case 5:
        return (
          <Step5Review
            formData={formData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <ProgressIndicator currentStep={currentStep} />
      {renderStep()}
      <div className="mt-8 flex justify-between">
        {currentStep > 1 && currentStep < 5 && (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        {currentStep < 5 && (
          <button
            onClick={nextStep}
            disabled={!validateStep()}
            className="ml-auto flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}