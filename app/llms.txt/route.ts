import { getAllArticles } from "../lib/articles";

export function GET() {
  const lines = [
    "# ADHD Slovakia",
    "> Slovak and English educational resource about ADHD, neurodiversity, diagnosis, treatment and lived experience in Slovakia.",
    "",
    "The site publishes public educational information and personal stories. It is not a substitute for professional diagnosis or medical care.",
    "",
    "## Main pages",
    "- [Slovak home](https://www.adhdslovakia.eu/sk)",
    "- [English home](https://www.adhdslovakia.eu/en)",
    "- [Articles in Slovak](https://www.adhdslovakia.eu/sk/clanky)",
    "- [Articles in English](https://www.adhdslovakia.eu/en/clanky)",
    "- [About](https://www.adhdslovakia.eu/sk/o-nas)",
    "- [About in English](https://www.adhdslovakia.eu/en/o-nas)",
    "- [Privacy and cookies](https://www.adhdslovakia.eu/sk/ochrana-sukromia)",
    "- [Privacy and cookies in English](https://www.adhdslovakia.eu/en/ochrana-sukromia)",
    "",
    "## Articles",
  ];
  for (const locale of ["sk", "en"] as const) {
    for (const article of getAllArticles(locale)) {
      lines.push(`- [${article.title}](https://www.adhdslovakia.eu/${locale}/clanky/${encodeURIComponent(article.slug)}): ${article.excerpt}`);
    }
  }
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
