import type { Metadata } from "next";
import type { ReactNode } from "react";
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
        <SiteHeader whatsappNumber={siteSettings.whatsapp_number} />
        {children}
      </body>
    </html>
  );
}
