"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buildBookingWhatsAppUrl } from "@/lib/booking/whatsapp";
import { BookingSuccess } from "./booking-success";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  houseStreet: string;
  address: string;
  eircode: string;
  service: string;
  carModel: string;
  selectedExtras: string[];
  notes: string;
};

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  houseStreet: "",
  address: "",
  eircode: "",
  service: "",
  carModel: "",
  selectedExtras: [],
  notes: "",
};

const services = ["Mini Valet", "Full Valet"];

const extras = [
  { name: "Seat shampoo", price: "EUR20 - EUR40" },
  { name: "Pet hair removal", price: "EUR15 - EUR25" },
  { name: "Engine bay clean", price: "EUR25 - EUR50" },
  { name: "Hand wax/polish", price: "EUR30 - EUR60" },
];

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex justify-center gap-2">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className={`h-2 w-8 rounded-full transition ${
            index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function Step1Details({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Full Name</span>
          <input
            type="text"
            className={fieldClassName()}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Phone Number</span>
          <input
            type="tel"
            className={fieldClassName()}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            className={fieldClassName()}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
      </div>
    </div>
  );
}

function Step2Location({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">House / Street</span>
          <input
            type="text"
            className={fieldClassName()}
            value={formData.houseStreet}
            onChange={(e) => setFormData({ ...formData, houseStreet: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Address</span>
          <input
            type="text"
            className={fieldClassName()}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Eircode</span>
          <input
            type="text"
            className={fieldClassName()}
            value={formData.eircode}
            onChange={(e) => setFormData({ ...formData, eircode: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

function Step3Service({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  const toggleExtra = (extraName: string) => {
    const selectedExtras = formData.selectedExtras.includes(extraName)
      ? formData.selectedExtras.filter((extra) => extra !== extraName)
      : [...formData.selectedExtras, extraName];

    setFormData({ ...formData, selectedExtras });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Service</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Service</span>
          <select
            className={fieldClassName()}
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
            className={fieldClassName()}
            value={formData.carModel}
            onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
            required
          />
        </label>
        <div>
          <span className="text-sm font-medium text-gray-700">Optional Extras</span>
          <div className="mt-3 space-y-3">
            {extras.map((extra) => (
              <label key={extra.name} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.selectedExtras.includes(extra.name)}
                  onChange={() => toggleExtra(extra.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {extra.name} ({extra.price})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Review({
  formData,
  onSubmit,
  isLoading,
  error,
}: {
  formData: FormData;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review & WhatsApp</h2>
      <div className="space-y-4 rounded-2xl bg-gray-50 p-4">
        <div>
          <h3 className="font-medium text-gray-900">Your Details</h3>
          <p className="text-sm text-gray-600">{formData.fullName}</p>
          <p className="text-sm text-gray-600">{formData.phone}</p>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Location</h3>
          <p className="text-sm text-gray-600">
            {formData.houseStreet}
            {formData.address ? `, ${formData.address}` : ""}
          </p>
          <p className="text-sm text-gray-600">{formData.eircode || "No Eircode provided"}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Service</h3>
          <p className="text-sm text-gray-600">
            {formData.service} - {formData.carModel}
          </p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Optional Extras</h3>
          {formData.selectedExtras.length > 0 ? (
            <ul className="text-sm text-gray-600">
              {formData.selectedExtras.map((extra) => (
                <li key={extra}>- {extra}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No optional extras selected</p>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Notes</h3>
          <p className="text-sm text-gray-600">{formData.notes || "No notes provided."}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Your WhatsApp message will include all details so the team can arrange the day and time
        with you directly.
      </p>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Opening WhatsApp..." : "Send Booking Request"}
      </button>
    </div>
  );
}

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.fullName && formData.phone && formData.email);
      case 2:
        return Boolean(formData.houseStreet && formData.address);
      case 3:
        return Boolean(formData.service && formData.carModel);
      default:
        return true;
    }
  };

  const bookingSummary = useMemo(
    () => ({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      houseStreet: formData.houseStreet,
      address: formData.address,
      eircode: formData.eircode,
      service: formData.service,
      carModel: formData.carModel,
      extras: formData.selectedExtras,
      notes: formData.notes,
    }),
    [formData]
  );

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = buildBookingWhatsAppUrl(bookingSummary);
      setWhatsappUrl(url);

      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      if (!newWindow) {
        window.location.href = url;
      }

      setIsSuccess(true);
    } catch {
      setError("Unable to open WhatsApp right now. Please try again or use the WhatsApp button.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && whatsappUrl) {
    return <BookingSuccess whatsappUrl={whatsappUrl} />;
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
        return (
          <Step4Review
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
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <ProgressIndicator currentStep={currentStep} />
      {renderStep()}

      <div className="mt-8 flex items-center justify-between">
        {currentStep > 1 && currentStep < 4 ? (
          <button
            onClick={prevStep}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <span />
        )}

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            disabled={!validateStep()}
            className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
