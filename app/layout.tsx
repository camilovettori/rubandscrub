import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/config/site";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en">
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
