import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Keep legacy Slovak article links working after locale prefixes were added.
        source: "/clanky/:slug",
        destination: "/sk/clanky/:slug",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
