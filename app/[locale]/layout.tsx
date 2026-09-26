import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { routing } from "../../i18n/routing";
import "../globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import SplashScreen from "../SplashScreen";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ADHD Slovakia",
  description: "Neurodiverzita, osveta, Slovensko",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-6150590591009223"
        />

        {/* Google AdSense */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6150590591009223"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Dark mode */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`
          (function() {
            try {
              var theme = localStorage.getItem('theme');

              if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            } catch (e) {}
          })();
        `}</Script>
      </head>

      <body className={`${syne.variable} ${dmSans.variable}`}>
        <SplashScreen />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  );
}