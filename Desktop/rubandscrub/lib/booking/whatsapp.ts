import { contactConfig } from "@/lib/config/contact";

export type BookingWhatsAppDetails = {
  fullName: string;
  phone: string;
  email: string;
  houseStreet: string;
  address: string;
  eircode: string;
  service: string;
  carModel: string;
  extras: string[];
  notes: string;
};

function joinValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "None";
  }

  return value?.trim() ? value.trim() : "None";
}

export function getWhatsAppBaseUrl() {
  return `https://wa.me/${contactConfig.whatsappNumber}`;
}

export function buildBookingWhatsAppMessage(details: BookingWhatsAppDetails) {
  const lines = [
    "New booking request",
    "",
    `Name: ${details.fullName}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Address: ${details.houseStreet}, ${details.address}`,
    `Eircode: ${details.eircode || "None"}`,
    `Service: ${details.service}`,
    `Car model: ${details.carModel}`,
    `Extras: ${joinValue(details.extras)}`,
    `Notes: ${joinValue(details.notes)}`,
    "",
    "Please contact the customer to arrange date and time.",
  ];

  return lines.join("\n");
}

export function buildBookingWhatsAppUrl(details: BookingWhatsAppDetails) {
  const message = buildBookingWhatsAppMessage(details);
  return `${getWhatsAppBaseUrl()}?text=${encodeURIComponent(message)}`;
}

