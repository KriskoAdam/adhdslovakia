import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { routing } from "../../i18n/routing";
import "../globals.css";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';
import SplashScreen from "../SplashScreen";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";

// Ak máš navigáciu ako samostatný komponent, odkomentuj riadok nižšie a uprav cestu:
// import Navbar from "@/components/Navbar"; 

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-6150590591009223"></meta>
        
        {/* OPRAVA: Klasický HTML script tag namiesto Next.js komponentu pre AdSense v <head> */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6150590591009223"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <SplashScreen />
        
        {/* 
          SEM PATRÍ NAVIGÁCIA (Header/Navbar):
          Ak ju vložíš sem, bude spoločná pre celý web, ušetríš re-rendre 
          a prechody medzi stránkami budú bleskurýchle.
          Napríklad: <Navbar />
        */}

        <NextIntlClientProvider messages={messages}>
  {children}
</NextIntlClientProvider>

        {/* 1. Definícia funkcie pre Google Translate */}
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

        {/* 2. Načítanie skriptu s lazyOnload */}
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload"
        />

        <Analytics />
      </body>
    </html>
  );
}
