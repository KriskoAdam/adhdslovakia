import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const english = locale === "en";
  const title = english ? "ADHD Quiz – 100 questions, 5 levels" : "ADHD Quiz – 100 otázok, 5 levelov";
  const description = english
    ? "A friendly, no-pressure quiz about ADHD myths, facts and everyday strategies. Five levels, 100 questions and clear explanations."
    : "Zábavný kvíz bez časového tlaku o mýtoch, faktoch a každodenných stratégiách pri ADHD. Päť levelov, 100 otázok a jasné vysvetlenia.";
  return {
    title,
    description,
    applicationName: "ADHD Quiz",
    alternates: { canonical: `/${locale}/kviz`, languages: { sk: "/sk/kviz", en: "/en/kviz", "x-default": "/sk/kviz" } },
    manifest: `/${locale}/appky/quiz/manifest.webmanifest`,
    icons: {
      icon: [
        { url: "/apps/adhd-quiz-icon-192.png?v=1", sizes: "192x192", type: "image/png" },
        { url: "/apps/adhd-quiz-icon-512.png?v=1", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apps/adhd-quiz-icon-192.png?v=1",
    },
    appleWebApp: { capable: true, title: "ADHD Quiz", statusBarStyle: "default" },
    openGraph: { type: "website", siteName: "ADHD Slovakia", title, description, url: `https://www.adhdslovakia.eu/${locale}/kviz`, images: [{ url: "/apps/adhd-quiz-icon-512.png?v=1", width: 512, height: 512, alt: "ADHD Quiz app icon" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/apps/adhd-quiz-icon-512.png?v=1"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function QuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale === "en" ? "en" : "sk";
  const title = language === "en" ? "ADHD Quiz – 100 questions, 5 levels" : "ADHD Quiz – 100 otázok, 5 levelov";
  const description = language === "en"
    ? "A friendly, no-pressure quiz about ADHD myths, facts and everyday strategies. Five levels, 100 questions and clear explanations."
    : "Zábavný kvíz bez časového tlaku o mýtoch, faktoch a každodenných stratégiách pri ADHD. Päť levelov, 100 otázok a jasné vysvetlenia.";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: `https://www.adhdslovakia.eu/${language}/kviz`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any device with a modern web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: language,
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <QuizClient locale={language} />
  </>;
}
