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

function stripPhoneNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function getWhatsAppBaseUrl(whatsappNumber: string) {
  const sanitized = stripPhoneNumber(whatsappNumber);
  return sanitized ? `https://wa.me/${sanitized}` : "https://wa.me/";
}

export function formatWhatsAppDisplay(whatsappNumber: string) {
  const sanitized = stripPhoneNumber(whatsappNumber);

  return sanitized ? `+${sanitized}` : "Not configured";
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

export function buildBookingWhatsAppUrl(details: BookingWhatsAppDetails, whatsappNumber: string) {
  const message = buildBookingWhatsAppMessage(details);
  return `${getWhatsAppBaseUrl(whatsappNumber)}?text=${encodeURIComponent(message)}`;
}

