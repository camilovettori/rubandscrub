import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rubandscrub.ie"),
  title: {
    default: "Mobile Car Valeting Dublin | Rub & Scrub — We Come To You",
    template: "%s | Rub & Scrub Mobile Valeting Dublin",
  },
  description:
    "Premium mobile car valeting in Dublin. We come to your home or workplace. Book on WhatsApp in minutes — Full Valet from €80.",
  applicationName: "Rub & Scrub",
  authors: [{ name: "Rub & Scrub Mobile Valeting" }],
  generator: "Next.js",
  keywords: [
    "mobile car valeting Dublin",
    "car valeting Dublin",
    "mobile car wash Dublin",
    "car detailing Dublin",
    "mobile valet Dublin",
    "car valet at home Dublin",
  ],
  formatDetection: { email: false, address: false, telephone: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://www.rubandscrub.ie",
    siteName: "Rub & Scrub Mobile Valeting",
    title: "Mobile Car Valeting Dublin | Rub & Scrub",
    description:
      "Premium mobile car valeting across Dublin. Book on WhatsApp — Full Valet from €80.",
    images: [
      {
        url: "/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Rub & Scrub Mobile Car Valeting Dublin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Car Valeting Dublin | Rub & Scrub",
    description: "Premium mobile car valeting across Dublin. Book on WhatsApp.",
    images: ["/og/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "automotive",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en-IE" className={inter.className}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5HNGQWYCZ6"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-5HNGQWYCZ6');`}
        </Script>
        <SiteHeader whatsappNumber={siteSettings.whatsapp_number} />
        {children}
      </body>
    </html>
  );
}
