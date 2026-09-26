import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* sem patria prípadné tvoje existujúce nastavenia */
};

export default withNextIntl(nextConfig);