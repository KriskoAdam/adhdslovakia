import { MetadataRoute } from 'next';
import { getAllArticles } from "./lib/articles";

// Používame async, aby mal Next.js čas správne vygenerovať endpoint
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = getAllArticles();

  const articleUrls = articles.map((a) => ({
    url: `https://adhdslovakia.eu/clanky/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://adhdslovakia.eu",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://adhdslovakia.eu/clanky",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: "https://adhdslovakia.eu/test", 
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: "https://adhdslovakia.eu/o-nas",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...articleUrls,
  ];
}
