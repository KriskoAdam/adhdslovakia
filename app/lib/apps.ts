import type { MetadataRoute } from "next";

export type AppListing = {
  id: string;
  name: string;
  icon: string;
  pwaIcons: { src: string; sizes: string; type: string }[];
  href: string;
  detailsHref: string;
  description: { sk: string; en: string };
  details: { sk: string; en: string };
  tags: { sk: string[]; en: string[] };
};

export type AppLocale = "sk" | "en";

export function createAppManifest(app: AppListing, locale: AppLocale, startUrl: string): MetadataRoute.Manifest {
  const english = locale === "en";
  return {
    id: startUrl,
    name: `${app.name} by ADHD Slovakia`,
    short_name: app.name,
    description: app.description[locale],
    start_url: startUrl,
    scope: `/${locale}/`,
    display: "standalone",
    background_color: "#f2f5f1",
    theme_color: "#f2f5f1",
    lang: english ? "en" : "sk",
    icons: app.pwaIcons.map(({ src, sizes, type }) => ({ src, sizes, type, purpose: "any" })),
  };
}

// Add future ADHD Slovakia tools here; the app catalogue renders each entry as a card.
export const appListings: AppListing[] = [
  {
    id: "flow",
    name: "ADHD Flow",
    icon: "/apps/adhd-flow-icon.svg?v=2",
    pwaIcons: [
      { src: "/apps/adhd-flow-icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { src: "/apps/adhd-flow-icon-512.png?v=2", sizes: "512x512", type: "image/png" },
      { src: "/apps/adhd-flow-icon.svg?v=2", sizes: "any", type: "image/svg+xml" },
    ],
    href: "/planovac",
    detailsHref: "/appky/flow",
    description: {
      sk: "Bezplatný plánovač úloh pre ADHD. Rozdeľ si úlohy na malé kroky a plánuj týždeň vlastným tempom — bez účtu a s podporou offline.",
      en: "A free ADHD-friendly task planner. Break tasks into small steps and plan your week at your own pace — no account needed, with offline support.",
    },
    details: {
      sk: "Naplánuj si úlohy po malých krokoch, sleduj svoj týždeň a dopraj si čas na sústredenie aj oddych.",
      en: "Break tasks into small steps, see your week at a glance, and make room for focus and rest.",
    },
    tags: { sk: ["Funguje offline", "Bez účtu"], en: ["Works offline", "No account"] },
  },
];

export function getAppListing(id: string) {
  return appListings.find((app) => app.id === id);
}
