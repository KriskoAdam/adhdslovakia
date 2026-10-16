import type { MetadataRoute } from "next";
import { getAllArticles, getTranslatedArticleSlug } from "./lib/articles";

const site = "https://www.adhdslovakia.eu";
const locales = ["sk", "en"] as const;
const staticRoutes = ["", "clanky", "informacie-o-adhd", "o-nas", "kontakt", "test", "ochrana-sukromia"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const route of staticRoutes) {
      const urlPath = `/${locale}${route ? `/${route}` : ""}`;
      const languages = Object.fromEntries(locales.map((language) => [language, `${site}/${language}${route ? `/${route}` : ""}`]));
      entries.push({ url: `${site}${urlPath}`, alternates: { languages }, changeFrequency: route === "" || route === "clanky" ? "weekly" : "monthly", priority: route === "" ? 1 : route === "clanky" || route === "test" ? 0.8 : 0.6 });
    }
    for (const article of getAllArticles(locale)) {
      const otherLocale = locale === "sk" ? "en" : "sk";
      const translatedSlug = getTranslatedArticleSlug(locale, article.slug, otherLocale);
      const languageUrls: Record<string, string> = { [locale]: `${site}/${locale}/clanky/${article.slug}` };
      if (translatedSlug) languageUrls[otherLocale] = `${site}/${otherLocale}/clanky/${translatedSlug}`;
      entries.push({
        url: `${site}/${locale}/clanky/${article.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languageUrls },
      });
    }
  }
  return entries;
}
