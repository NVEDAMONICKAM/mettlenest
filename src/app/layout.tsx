import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Young_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  siteDescription,
  siteName,
  siteTagline,
  siteUrl,
} from "@/content/site";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
});
// Variable weight (400/600/700 used) with the optical-size axis, as in the mockup.
const nunitoSans = Nunito_Sans({
  axes: ["opsz"],
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · Understand, Connect, Grow`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    locale: "en_AU",
    title: `${siteName} · ${siteTagline}`,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1726" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      suppressHydrationWarning
      className={`${youngSerif.variable} ${nunitoSans.variable}`}
    >
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only z-50 rounded-lg bg-accent px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
