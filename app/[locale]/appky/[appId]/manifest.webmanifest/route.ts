import { createAppManifest, getAppListing } from "../../../../lib/apps";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; appId: string }> }) {
  const { locale: rawLocale, appId } = await params;
  const locale = rawLocale === "en" ? "en" : "sk";
  const app = getAppListing(appId);
  if (!app) return new Response(null, { status: 404 });

  return new Response(JSON.stringify(createAppManifest(app, locale, `/${locale}${app.href}`)), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
