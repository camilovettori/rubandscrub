export const faqEntries = [
  {
    question: "How long does a full valet take?",
    answer:
      "A Full Valet usually takes 1.5 to 3 hours depending on the size and condition of the vehicle.",
  },
  {
    question: "Do you need access to water or electricity?",
    answer:
      "We arrive fully self-sufficient. We do not require water or electricity from your property unless agreed in advance.",
  },
  {
    question: "Which areas of Dublin do you cover?",
    answer:
      "We cover all Dublin postcodes from D1 to D24 and surrounding County Dublin areas. Confirm exact location on WhatsApp.",
  },
  {
    question: "Can you remove pet hair?",
    answer:
      "Yes. Pet hair removal is available as an add-on from \u20ac15 to \u20ac25 depending on the amount.",
  },
  {
    question: "Do I need to be present during the valet?",
    answer:
      "No. As long as we have access to the vehicle and a place to work, you don't need to be there. We send updates and a final confirmation on WhatsApp.",
  },
  {
    question: "How do I book?",
    answer:
      "Fill in the booking form on our website and submit. WhatsApp opens with your details pre-filled, and we confirm a day and time.",
  },
] as const;

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutomotiveBusiness"],
  "@id": "https://www.rubandscrub.ie/#business",
  name: "Rub & Scrub Mobile Valeting",
  image: "https://www.rubandscrub.ie/images/logos.png",
  logo: "https://www.rubandscrub.ie/images/logos.png",
  url: "https://www.rubandscrub.ie",
  telephone: "+353852243913",
  priceRange: "\u20ac\u20ac",
  description:
    "Premium mobile car valeting service across Dublin. We come to your home or workplace.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dublin",
    addressRegion: "Leinster",
    addressCountry: "IE",
  },
  areaServed: [
    { "@type": "City", name: "Dublin" },
    { "@type": "AdministrativeArea", name: "County Dublin" },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.3498,
    longitude: -6.2603,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mobile Valeting Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full Valet",
          description:
            "Full exterior wash, wheels deep cleaned, wax protection, interior vacuum, seats and carpets shampooed, dashboard cleaned, door shuts, windows polished.",
        },
        priceCurrency: "EUR",
        price: "80",
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "3",
    bestRating: "5",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Sarah Murphy" },
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      reviewBody: "Amazing service. The team arrived on time and left my car looking brand new.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "John Kelly" },
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      reviewBody:
        "Convenient mobile service that fits my busy schedule. Professional work and great value for money.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Emma Byrne" },
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      reviewBody: "Outstanding attention to detail. My car has never looked this good.",
    },
  ],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.rubandscrub.ie/#website",
  url: "https://www.rubandscrub.ie",
  name: "Rub & Scrub Mobile Valeting",
  publisher: { "@id": "https://www.rubandscrub.ie/#business" },
  inLanguage: "en-IE",
} as const;

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
} as const;

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
