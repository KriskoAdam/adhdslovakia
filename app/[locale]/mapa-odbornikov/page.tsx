import type { Metadata } from "next";
import Nav from "../../components/Nav";
import DiagnosisMap from "../../components/DiagnosisMap";
import { getMapListings } from "../../lib/map-listings-store";

const site = "https://www.adhdslovakia.eu";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const english = locale === "en";
  const title = english
    ? "ADHD specialists and support in Slovakia – map"
    : "Mapa odborníkov a pomoci pri ADHD na Slovensku";
  const description = english
    ? "Search psychologists, psychiatrists and support services in Slovakia. Browse locations, contact details and information supplied by providers or the community; confirm services directly."
    : "Nájdite psychológov, psychiatrov a podporné služby na Slovensku. Prezrite si polohu, kontakty a informácie od pracovísk či komunity; konkrétne služby si vždy potvrďte priamo.";
  const path = `/${locale}/mapa-odbornikov`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        sk: "/sk/mapa-odbornikov",
        en: "/en/mapa-odbornikov",
        "x-default": "/sk/mapa-odbornikov",
      },
    },
    openGraph: {
      type: "website",
      siteName: "ADHD Slovakia",
      title,
      description,
      url: `${site}${path}`,
      locale: english ? "en_US" : "sk_SK",
      alternateLocale: [english ? "sk_SK" : "en_US"],
      images: [{ url: "/images/logo.png", width: 447, height: 559, alt: "ADHD Slovakia" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/logo.png"],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function MapDirectoryPage({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;
  const english = locale === "en";
  const initialListings = await getMapListings();
  const title = english
    ? "ADHD specialists and support in Slovakia"
    : "Odborníci a podpora pri ADHD na Slovensku";
  const description = english
    ? "Explore the ADHD Slovakia directory of psychologists, psychiatrists and support services. Use the map, search and filters to find a nearby or online service. The directory is informational; confirm the provider’s current services, availability and fees directly."
    : "Prezrite si adresár psychológov, psychiatrov a podporných služieb na ADHD Slovakia. Pomocou mapy, vyhľadávania a filtrov nájdite pracovisko vo svojom okolí alebo online. Adresár má informačný charakter; aktuálne služby, dostupnosť a cenu si potvrďte priamo u poskytovateľa.";
  const pageUrl = `${site}/${locale}/mapa-odbornikov`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#page`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": `${site}/#website` },
    about: { "@type": "MedicalCondition", name: "ADHD", alternateName: "Attention deficit hyperactivity disorder" },
    mainEntity: {
      "@type": "Map",
      name: title,
      description: english
        ? "Interactive map and searchable directory of ADHD-related specialists and support services in Slovakia."
        : "Interaktívna mapa a vyhľadávateľný adresár odborníkov a podporných služieb súvisiacich s ADHD na Slovensku.",
      inLanguage: locale,
    },
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <header className="border-b border-[var(--border-color)] px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">
              {english ? "ADHD SLOVAKIA · PROVIDER DIRECTORY" : "ADHD SLOVAKIA · ADRESÁR POMOCI"}
            </p>
            <h1 className="max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          </div>
        </header>
        <DiagnosisMap locale={locale} initialListings={initialListings} />
      </main>
    </>
  );
}
