import { BookingWizard } from "@/components/booking/booking-wizard";
import { getSiteSettings } from "@/lib/site-settings";

export default async function BookingPage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Request Your Mobile Valet
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your request in just a few steps and we&apos;ll open WhatsApp with everything
            ready to send.
          </p>
        </div>
        <BookingWizard whatsappNumber={siteSettings.whatsapp_number} />
      </div>
    </main>
  );
}
