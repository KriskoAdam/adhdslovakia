import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../../components/Nav";
import SiteIcon from "../../../components/SiteIcon";
import AppsClient from "../AppsClient";
import { appListings, getAppListing } from "../../../lib/apps";
import styles from "./AppDetailPage.module.css";

export function generateStaticParams() {
  return appListings.map((app) => ({ appId: app.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; appId: string }>;
}): Promise<Metadata> {
  const { locale, appId } = await params;
  const app = getAppListing(appId);
  if (!app) return {};
  const language = locale === "en" ? "en" : "sk";
  const alternateLanguage = language === "en" ? "sk" : "en";
  const title = app.id === "flow"
    ? (language === "en" ? `${app.name} – ADHD-friendly task planner` : `${app.name} – plánovač úloh pre ADHD`)
    : (language === "en" ? `${app.name} – a friendly ADHD knowledge quiz` : `${app.name} – zábavný kvíz o ADHD`);
  const description = app.description[language];
  const image = app.pwaIcons.find((icon) => icon.type === "image/png" && icon.sizes === "512x512")?.src ?? app.icon;
  return {
    title,
    description,
    applicationName: app.name,
    category: app.id === "flow" ? (language === "en" ? "Productivity" : "Produktivita") : (language === "en" ? "Education" : "Vzdelávanie"),
    alternates: {
      canonical: `/${language}/appky/${app.id}`,
      languages: {
        sk: `/sk/appky/${app.id}`,
        en: `/en/appky/${app.id}`,
        "x-default": `/sk/appky/${app.id}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "ADHD Slovakia",
      title,
      description,
      url: `https://www.adhdslovakia.eu/${language}/appky/${app.id}`,
      locale: language === "en" ? "en_US" : "sk_SK",
      alternateLocale: [alternateLanguage === "en" ? "en_US" : "sk_SK"],
      images: [{ url: image, width: 512, height: 512, alt: `${app.name} app icon` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    manifest: `/${language}/appky/${app.id}/manifest.webmanifest`,
    icons: {
      icon: app.pwaIcons.map(({ src, sizes, type }) => ({ url: src, sizes, type })),
      apple: app.pwaIcons
        .filter((icon) => icon.type === "image/png" && icon.sizes === "192x192")
        .map(({ src, sizes, type }) => ({ url: src, sizes, type })),
    },
    appleWebApp: { capable: true, title: app.name, statusBarStyle: "default" },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ locale: string; appId: string }>;
}) {
  const { locale: rawLocale, appId } = await params;
  const app = getAppListing(appId);
  if (!app) notFound();
  const locale = rawLocale === "en" ? "en" : "sk";
  const english = locale === "en";
  const title = app.id === "flow"
    ? (english ? `${app.name} – ADHD-friendly task planner` : `${app.name} – plánovač úloh pre ADHD`)
    : (english ? `${app.name} – a friendly ADHD knowledge quiz` : `${app.name} – zábavný kvíz o ADHD`);
  const pageUrl = `https://www.adhdslovakia.eu/${locale}/appky/${app.id}`;
  const storeUrl = `https://www.adhdslovakia.eu/${locale}/appky`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description: app.description[locale],
        url: pageUrl,
        inLanguage: locale,
        isPartOf: { "@id": "https://www.adhdslovakia.eu/#website" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#application`,
        name: app.name,
        description: app.description[locale],
        url: pageUrl,
        image: `https://www.adhdslovakia.eu${app.icon}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: english ? "Any device with a modern web browser" : "Zariadenie s moderným webovým prehliadačom",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          url: pageUrl,
        },
        featureList: app.id === "flow"
          ? (english
              ? ["Progressive web app", "Works offline", "No account required", "Tasks stay on your device"]
              : ["Progresívna webová aplikácia", "Funguje offline", "Bez potreby účtu", "Úlohy zostávajú v zariadení"])
          : (english
              ? ["Progressive web app", "100 ADHD knowledge questions", "Five levels", "Progress stays on your device"]
              : ["Progresívna webová aplikácia", "100 otázok o ADHD", "Päť levelov", "Postup zostáva v zariadení"]),
        publisher: { "@id": "https://www.adhdslovakia.eu/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: english ? "Home" : "Domov", item: `https://www.adhdslovakia.eu/${locale}` },
          { "@type": "ListItem", position: 2, name: english ? "Apps" : "Appky", item: storeUrl },
          { "@type": "ListItem", position: 3, name: app.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <a className={styles.backLink} href={`/${locale}/appky`}>
              <SiteIcon name="arrowLeft" className={styles.actionIcon} /> {english ? "Back to all apps" : "Späť na všetky appky"}
            </a>
          </header>

        <section className={styles.detail}>
          <Image className={styles.icon} src={app.icon} alt={`${app.name} icon`} width={112} height={112} priority />
          <p className={styles.publisher}>ADHD SLOVAKIA</p>
          <h1>{app.name}</h1>
          <p className={styles.summary}>{app.description[locale]}</p>
          <p className={styles.description}>{app.details[locale]}</p>
          <p className={styles.installIntro}>
            {english ? "Choose Install and follow the short steps for your device." : "Ťukni na Nainštalovať a postupuj podľa krátkeho návodu pre svoje zariadenie."}
          </p>
          <div className={styles.tags}>
            {app.tags[locale].map((tag) => <span key={tag}>{tag}</span>)}
            <span>PWA</span>
          </div>
          <div className={styles.actions}>
            <a className={styles.openButton} href={`/${locale}${app.href}`}>
              {english ? "Open app" : "Otvoriť appku"}<SiteIcon name="arrowUpRight" className={styles.actionIcon} />
            </a>
            <AppsClient locale={locale} appName={app.name} />
          </div>
          <p className={styles.privacy}>
            {app.id === "flow"
              ? (english ? "No account needed. Your planner stays on this device." : "Bez účtu. Tvoje úlohy zostávajú uložené iba v tomto zariadení.")
              : (english ? "No account needed. Your quiz progress stays on this device." : "Bez účtu. Tvoj postup v kvíze zostáva iba v tomto zariadení.")}
          </p>
        </section>
        </div>
      </main>
    </>
  );
}
