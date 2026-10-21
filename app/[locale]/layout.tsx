import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { routing } from "../../i18n/routing";
import "../globals.css";
import Script from "next/script";
import SplashScreen from "../SplashScreen";
import CookieConsent from "../components/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const title = isEnglish
    ? "ADHD Slovakia – information, support and stories"
    : "ADHD Slovakia – informácie, podpora a príbehy";
  const description = isEnglish
    ? "Clear information about ADHD in Slovakia, including diagnosis, treatment, personal stories and neurodiversity support."
    : "Slovenský informačný portál o ADHD. Zrozumiteľné informácie o diagnostike, liečbe a živote s ADHD, osobné príbehy a podpora neurodiverzity.";

  return {
  metadataBase: new URL("https://www.adhdslovakia.eu"),
  title: { default: title, template: "%s | ADHD Slovakia" },
  description,
  applicationName: "ADHD Slovakia",
  keywords: ["ADHD", "ADHD Slovensko", "diagnostika ADHD", "liečba ADHD", "neurodiverzita"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    siteName: "ADHD Slovakia",
    title,
    description,
    url: `https://www.adhdslovakia.eu/${locale}`,
    locale: isEnglish ? "en_US" : "sk_SK",
    alternateLocale: [isEnglish ? "sk_SK" : "en_US"],
    images: ["/images/logo.png"],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/logo.png"] },
  };
}

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-6150590591009223"
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
        <a className="skip-link" href="#main-content">{locale === "en" ? "Skip to main content" : "Preskočiť na hlavný obsah"}</a>
        <SplashScreen />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": "https://www.adhdslovakia.eu/#organization", name: "ADHD Slovakia", url: "https://www.adhdslovakia.eu", email: "info@adhdslovakia.eu", logo: "https://www.adhdslovakia.eu/images/logo.png" },
            { "@type": "WebSite", "@id": "https://www.adhdslovakia.eu/#website", name: "ADHD Slovakia", url: "https://www.adhdslovakia.eu", inLanguage: ["sk", "en"], publisher: { "@id": "https://www.adhdslovakia.eu/#organization" } },
          ],
        }).replace(/</g, "\\u003c") }} />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        <footer className="border-t border-[var(--border-color)] px-5 py-5 text-center text-xs text-[var(--text-muted)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <a className="underline underline-offset-2 hover:text-green-500" href={`/${locale}/ochrana-sukromia`}>
              {locale === "en" ? "Privacy and cookies policy" : "Ochrana súkromia a cookies"}
            </a>
            <span aria-hidden="true">·</span>
            <a
              className="underline underline-offset-2 decoration-[var(--border-color)] hover:text-[var(--text-secondary)]"
              href={`mailto:info@adhdslovakia.eu?subject=${encodeURIComponent(locale === "en" ? "Supporting ADHD Slovakia" : "Podpora ADHD Slovakia")}`}
              title={locale === "en" ? "We are preparing a way to contribute" : "Pripravujeme spôsob príspevku"}
            >
              {locale === "en" ? "Support the project" : "Podporiť projekt"}
            </a>
          </div>
        </footer>
        <CookieConsent locale={locale === "en" ? "en" : "sk"} />
      </body>
    </html>
  );
}
