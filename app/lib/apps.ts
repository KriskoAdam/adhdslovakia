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

// Add future ADHD Slovakia tools here; the app catalogue renders each entry as a card.
export const appListings: AppListing[] = [
  {
    id: "flow",
    name: "ADHD Flow",
    icon: "/apps/adhd-flow-icon.svg",
    pwaIcons: [
      { src: "/apps/adhd-flow-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/apps/adhd-flow-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apps/adhd-flow-icon.svg", sizes: "any", type: "image/svg+xml" },
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
