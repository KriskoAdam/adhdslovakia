import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
      </body>
    </html>
  );
}