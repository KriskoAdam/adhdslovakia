import type { Metadata } from "next";
import PlannerClient from "./PlannerClient";
import { getAppListing } from "../../lib/apps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const app = getAppListing("flow");
  const appPath = `/${locale}/appky/flow`;
  const title = isEnglish ? "ADHD Flow – ADHD-friendly task planner" : "ADHD Flow – plánovač úloh pre ADHD";
  const description = app?.description[isEnglish ? "en" : "sk"];

  return {
    title,
    description,
    alternates: {
      canonical: appPath,
      languages: { sk: "/sk/appky/flow", en: "/en/appky/flow", "x-default": "/sk/appky/flow" },
    },
    openGraph: {
      type: "website",
      siteName: "ADHD Slovakia",
      title,
      description,
      url: `https://www.adhdslovakia.eu${appPath}`,
      images: [{ url: "/apps/adhd-flow-icon-512.png", width: 512, height: 512, alt: "ADHD Flow app icon" }],
    },
    robots: { index: true, follow: true },
    manifest: `/${locale}/planovac/manifest.webmanifest`,
    icons: {
      icon: [
        { url: "/apps/adhd-flow-icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/apps/adhd-flow-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apps/adhd-flow-icon-192.png", sizes: "192x192", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: "ADHD Flow",
      statusBarStyle: "default",
    },
  };
}

export default async function PlannerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PlannerClient locale={locale === "en" ? "en" : "sk"} />;
}
