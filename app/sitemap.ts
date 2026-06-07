import { getAllArticles } from "./lib/articles";

export default function sitemap() {
  const articles = getAllArticles();

  const articleUrls = articles.map((a) => ({
    url: `https://adhdslovakia.eu/clanky/${a.slug}`,
    lastModified: new Date(a.date),
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
      url: "https://adhdslovakia.eu/o-nas",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...articleUrls,
  ];
}