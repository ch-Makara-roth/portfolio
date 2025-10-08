import "./globals.css";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/QueryProvider";
import { ConditionalDockNavigation } from "@/components/ConditionalDockNavigation";
import { generateMetadata, generateStructuredData } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = generateMetadata({});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personStructuredData = generateStructuredData("person", {});
  const websiteStructuredData = generateStructuredData("website", {});

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
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/images/Logo/icon0.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="ahrefs-site-verification" content="f43fe6af70c9d1572d89e0196a750c104ea2d87416d7ec4a5c88fbdb4f4667de" />
        <script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="BL3Y1qeH2bn5q10psOIeSw" 
          async
        />
      </head>
      <body
        className={`${inter.className} bg-bg text-text font-fira min-h-screen safe-area-inset-top safe-area-inset-bottom`}
      >
        <QueryProvider>
          <main className="safe-area-inset-top">
            {children}
          </main>
          <ConditionalDockNavigation />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
