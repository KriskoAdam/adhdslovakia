import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';

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
  // Hovoríme prehliadaču (Safari/Chrome), nech sám nenavrhuje natívnu
  // prekladovú lištu na vrchu obrazovky. O preklad sa staráme my sami
  // cez vlastný google.translate.TranslateElement widget nižšie.
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <head> 
        <meta name="google-adsense-account" content="ca-pub-6150590591009223"></meta>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6150590591009223"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
       </head>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        {children}

        {/* 1. Definícia funkcie – bezpečne priradená na globálny objekt window */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'sk',
                includedLanguages: 'en,de,cs,pl,hu',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `}
        </Script>

        {/* 2. Načítanie skriptu s lazyOnload – počká, kým React kompletne vykreslí Nav lištu */}
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload"
        />

        <Analytics />
      </body>
    </html>
  );
}
