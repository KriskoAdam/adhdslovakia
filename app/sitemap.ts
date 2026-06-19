import { MetadataRoute } from 'next';
import { getAllArticles } from "./lib/articles";

// Používame async, aby mal Next.js čas správne vygenerovať endpoint
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = getAllArticles();

  const articleUrls = articles.map((a) => {
    let finalDate = new Date(); // Fallback na dnešný dátum, ak by niečo zlyhalo

    if (a.date) {
      let dateString = a.date.trim();

      // Ak dátum obsahuje bodky (DD.MM.YYYY), prerobíme ho na ISO formát (YYYY-MM-DD)
      if (dateString.includes('.')) {
        const parts = dateString.split('.');
        if (parts.length === 3) {
          const day = parts[0].trim().padStart(2, '0');
          const month = parts[1].trim().padStart(2, '0');
          const year = parts[2].trim();
          dateString = `${year}-${month}-${day}`;
        }
      }

      const parsedDate = new Date(dateString);
      
      // Ak je dátum po úprave platný, použijeme ho
      if (!isNaN(parsedDate.getTime())) {
        finalDate = parsedDate;
      }
    }

    return {
      url: `https://adhdslovakia.eu/clanky/${a.slug}`,
      lastModified: finalDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

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
