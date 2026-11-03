import type { MetadataRoute } from "next";
import sitemap from "../../sitemap";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function renderUrl(entry: MetadataRoute.Sitemap[number]) {
  const lines = ["  <url>", `    <loc>${escapeXml(entry.url)}</loc>`];

  if (entry.lastModified) {
    const lastModified = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
    lines.push(`    <lastmod>${escapeXml(lastModified)}</lastmod>`);
  }

  for (const [language, href] of Object.entries(entry.alternates?.languages ?? {})) {
    if (typeof href !== "string") continue;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(href)}" />`);
  }

  for (const image of entry.images ?? []) {
    lines.push("    <image:image>", `      <image:loc>${escapeXml(image)}</image:loc>`, "    </image:image>");
  }

  if (entry.changeFrequency) lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
  if (entry.priority !== undefined) lines.push(`    <priority>${entry.priority}</priority>`);
  lines.push("  </url>");
  return lines.join("\n");
}

export async function GET() {
  const entries = sitemap();
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(renderUrl),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
