import { SiteFooter } from "@/components/landing/site-footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-gray mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <p className="text-gray-600 mb-6">
            This privacy policy outlines how Rub & Scrub Mobile Valeting collects, uses, and protects your personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, such as when you book a service or contact us for inquiries.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information to provide our services, communicate with you, and improve our offerings.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}