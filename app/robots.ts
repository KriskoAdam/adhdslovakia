export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: "https://www.adhdslovakia.eu/sitemap.xml",
    host: "https://www.adhdslovakia.eu",
  };
}
