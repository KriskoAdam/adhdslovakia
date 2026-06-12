import { MetadataRoute } from 'next';
import { getAllArticles } from "./lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleUrls = articles.map((a) => ({
    url: `https://adhdslovakia.eu/clanky/${a.slug}`,
    // Ošetrenie dátumu, aby bol vždy vo validnom ISO formáte, ktorý Google vyžaduje
    lastModified: a.date ? new Date(a.date).toISOString() : new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://adhdslovakia.eu",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://adhdslovakia.eu/clanky",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      // PRIDANÁ STRÁNKA S TESTOM – pre ľudí s ADHD je to kľúčová vec, preto vysoká priorita
      url: "https://adhdslovakia.eu/test", 
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: "https://adhdslovakia.eu/o-nas",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...articleUrls,
  ];
}
