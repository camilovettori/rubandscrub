import { faqEntries } from "@/lib/jsonLd";

export function FAQSection() {
  return (
    <section id="faq" className="rounded-[32px] border border-gray-200 bg-white px-6 py-10 shadow-xl sm:px-8">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">FAQ</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {faqEntries.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-sm"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold text-gray-900">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
