import "./globals.css";
import { ConditionalDockNavigation } from "@/components/ConditionalDockNavigation";
import { Toaster } from "@/components/ui/toast";
import {
  generateMetadata as generateMetadataLib,
  generateStructuredData,
} from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export async function generateMetadata() {
  return generateMetadataLib({});
}

export function viewport() {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1a1a1a",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personStructuredData = generateStructuredData("person", {});
  const websiteStructuredData = generateStructuredData("website", {});
  const siteNavigationStructuredData = generateStructuredData(
    "siteNavigation",
    {},
  );

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationStructuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/images/Logo/icon0.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="BL3Y1qeH2bn5q10psOIeSw"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-bg text-text font-mono min-h-screen safe-area-inset-top safe-area-inset-bottom">
        <main className="safe-area-inset-top">{children}</main>
        <ConditionalDockNavigation />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
