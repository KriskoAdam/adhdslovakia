import type { MetadataRoute } from "next";

export default async function manifest({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Manifest> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const startUrl = `/${isEnglish ? "en" : "sk"}/planovac`;

  return {
    id: startUrl,
    name: "ADHD Flow by ADHD Slovakia",
    short_name: "ADHD Flow",
    description: isEnglish
      ? "A calmer way to shape your day, at your own pace."
      : "Pokojnejší spôsob, ako si usporiadať deň vlastným tempom.",
    start_url: startUrl,
    scope: `/${isEnglish ? "en" : "sk"}/`,
    display: "standalone",
    background_color: "#f2f5f1",
    theme_color: "#f2f5f1",
    lang: isEnglish ? "en" : "sk",
    icons: [
      { src: "/apps/adhd-flow-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/apps/adhd-flow-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apps/adhd-flow-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
