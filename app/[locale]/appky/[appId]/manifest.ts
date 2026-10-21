import type { MetadataRoute } from "next";
import { appListings, getAppListing } from "../../../lib/apps";

export function generateStaticParams() {
  return appListings.map((app) => ({ appId: app.id }));
}

export default async function manifest({
  params,
}: {
  params: Promise<{ locale: string; appId: string }>;
}): Promise<MetadataRoute.Manifest> {
  const { locale: rawLocale, appId } = await params;
  const locale = rawLocale === "en" ? "en" : "sk";
  const app = getAppListing(appId) ?? getAppListing("flow")!;
  const startUrl = `/${locale}${app.href}`;

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
    lang: locale,
    icons: app.pwaIcons.map((icon) => ({ ...icon, purpose: "any" })),
  };
}
