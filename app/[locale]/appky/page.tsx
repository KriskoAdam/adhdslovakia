import Image from "next/image";
import type { Metadata } from "next";
import Nav from "../../components/Nav";
import SiteIcon from "../../components/SiteIcon";
import { appListings } from "../../lib/apps";
import styles from "./AppsPage.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const title = isEnglish ? "ADHD Apps and Tools" : "Aplikácie pre ADHD";
  const description = isEnglish
    ? "Explore practical, free ADHD-friendly web apps from ADHD Slovakia, including ADHD Flow, a gentle task planner for everyday life."
    : "Objav bezplatné webové aplikácie pre ľudí s ADHD od ADHD Slovakia. Vyskúšaj ADHD Flow, jemný plánovač úloh pre každý deň.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/appky`,
      languages: { sk: "/sk/appky", en: "/en/appky", "x-default": "/sk/appky" },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `https://www.adhdslovakia.eu/${locale}/appky`,
      images: ["/images/logo.png"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/logo.png"] },
    robots: { index: true, follow: true },
  };
}

export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "en" ? "en" : "sk";
  const english = locale === "en";
  const pageUrl = `https://www.adhdslovakia.eu/${locale}/appky`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: english ? "ADHD Apps and Tools" : "Aplikácie pre ADHD",
    description: english
      ? "Practical, free web apps from ADHD Slovakia."
      : "Praktické bezplatné webové aplikácie od ADHD Slovakia.",
    url: pageUrl,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: appListings.map((app, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: app.name,
        url: `https://www.adhdslovakia.eu/${locale}${app.detailsHref}`,
        description: app.description[locale],
      })),
    },
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <span className={styles.headerLabel}>{english ? "ADHD SLOVAKIA · DIGITAL TOOLS" : "ADHD SLOVAKIA · DIGITÁLNE NÁSTROJE"}</span>
          </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{english ? "THE ADHD SLOVAKIA APP COLLECTION" : "KOLEKCIA APLIKÁCIÍ ADHD SLOVAKIA"}</p>
            <h1>{english ? "Apps for your everyday." : "Appky pre každý deň."}</h1>
            <p className={styles.intro}>
              {english
                ? "Thoughtful little tools to make everyday life with ADHD feel a bit easier."
                : "Premyslené malé nástroje, ktoré spríjemnia každodennosť s ADHD."}
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.collectionCount}>
                <span className={styles.countDot} />
                {english ? `${appListings.length} app${appListings.length === 1 ? "" : "s"} available` : `${appListings.length} ${appListings.length === 1 ? "aplikácia" : "appiek"} k dispozícii`}
              </div>
              <span className={styles.freeLabel}>{english ? "Free · No account required" : "Bezplatné · Bez registrácie"}</span>
            </div>
          </div>
        </section>

        <section className={styles.catalogue} aria-labelledby="catalogue-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>{english ? "MADE FOR REAL LIFE" : "VYTVORENÉ PRE SKUTOČNÝ ŽIVOT"}</p>
              <h2 id="catalogue-heading">{english ? "The collection" : "Kolekcia"}</h2>
            </div>
            <span className={styles.sectionCount}>{String(appListings.length).padStart(2, "0")}</span>
          </div>

          <div className={styles.grid}>
            {appListings.map((app, index) => (
              <article key={app.id} className={styles.appCard} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={styles.cardTop}>
                  <div className={styles.appIcon}>
                    <Image src={app.icon} alt={`${app.name} icon`} width={88} height={88} priority />
                  </div>
                  <span className={styles.available}>{english ? "AVAILABLE" : "DOSTUPNÁ"}</span>
                </div>
                <p className={styles.appPublisher}>ADHD SLOVAKIA · {english ? "DAILY LIFE" : "KAŽDODENNOSŤ"}</p>
                <h3>{app.name}</h3>
                <p className={styles.appDescription}>{app.description[locale]}</p>
                <p className={styles.appDetails}>{app.details[locale]}</p>
                <div className={styles.tags}>
                  {app.tags[locale].map((tag) => <span key={tag}>{tag}</span>)}
                  <span>PWA</span>
                </div>
                <div className={styles.actions}>
                  <a className={styles.openButton} href={`/${locale}${app.href}`}>
                    {english ? "Open app" : "Otvoriť appku"}<SiteIcon name="arrowUpRight" className={styles.actionIcon} />
                  </a>
                  <a className={styles.installButton} href={`/${locale}${app.detailsHref}`}>
                    <SiteIcon name="arrowDown" className={styles.actionIcon} />{english ? "How to install" : "Ako nainštalovať"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>ADHD<span className={styles.footerDot}>.</span>Slovakia</span>
          <span>{english ? "Made with care for different brains." : "S citom pre rôzne mozgy."}</span>
        </footer>
        </div>
      </main>
    </>
  );
}
