export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-gray-900">Rub & Scrub Mobile Valeting</p>
        <p className="text-gray-600">Premium mobile car valeting across Dublin</p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <a href="/privacy-policy" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <span className="text-gray-300">|</span>
          <a href="/terms-and-conditions" className="hover:text-gray-700 transition-colors">
            Terms & Conditions
          </a>
        </div>
        <p className="text-sm text-gray-500">© 2026 Rub & Scrub. All rights reserved.</p>
        <p className="text-sm text-gray-500">
          Developed by{" "}
          <a
            href="https://www.ziffera.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Ziffera
          </a>
        </p>
      </div>
    </footer>
  );
}
