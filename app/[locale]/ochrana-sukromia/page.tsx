import type { Metadata } from "next";
import Nav from "../../components/Nav";

type Locale = "sk" | "en";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Privacy and cookies policy" : "Ochrana súkromia a cookies",
    description: en ? "How ADHD Slovakia uses cookies, analytics, advertising and comment services." : "Ako ADHD Slovakia používa cookies, analytiku, reklamu a službu komentárov.",
    alternates: { canonical: `/${locale}/ochrana-sukromia`, languages: { sk: "/sk/ochrana-sukromia", en: "/en/ochrana-sukromia" } },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const sections = en ? [
    ["Who operates the site", "The site is operated by Adam Kriško under the name ADHD Slovakia. Address: Trnovec nad Váhom 619, 925 71, Slovakia. Contact: info@adhdslovakia.eu."],
    ["Cookies and similar storage", "Strictly necessary browser storage remembers your privacy choice and the site's display preference. Optional services are off until you consent. You can accept all, reject optional services or choose each category separately. Use the Privacy settings button on every page to change or withdraw your choice."],
    ["Purposes, legal bases and retention", "Optional analytics, advertising and embedded comments run on consent, which you can withdraw at any time. The browser keeps your consent choice until you change or clear it; the theme and like preference remain in your browser until cleared. Aggregate like and view totals are kept in the database while the site uses those counters. Hosting and service providers retain technical logs according to their own current terms. Contact the operator to ask about a specific record or request deletion where applicable."],
    ["Optional services", "Analytics: Vercel Analytics, loaded only when analytics consent is given. Advertising: Google AdSense, loaded only when advertising consent is given; Google may process device and usage data under its own terms. Comments: Giscus embedded through GitHub, loaded only after external comments consent. These services may transfer data outside the European Economic Area; consult their current privacy notices for details and safeguards."],
    ["Likes and article views", "When you use a like button or open an article, the site updates an aggregate counter in Upstash Redis. The counter is associated with an article key, not a named profile. Likes are limited in the browser using local storage. The hosting and database providers may process technical request data such as IP address as part of delivering the service."],
    ["Your choices and rights", "You may withdraw consent at any time in Privacy settings. Where personal data is processed, you may have rights to access, rectification, erasure, restriction, objection, portability and complaint to the Slovak Data Protection Authority. For requests, write to info@adhdslovakia.eu."],
    ["Updates", "This notice may be updated when site features or providers change. The current version is published on this page."],
  ] : [
    ["Prevádzkovateľ stránky", "Stránku prevádzkuje Adam Kriško pod názvom ADHD Slovakia. Adresa: Trnovec nad Váhom 619, 925 71, Slovensko. Kontakt: info@adhdslovakia.eu."],
    ["Cookies a podobné úložisko", "Nevyhnutné úložisko prehliadača si pamätá vašu voľbu súkromia a nastavenie vzhľadu stránky. Voliteľné služby sú vypnuté, kým s nimi nesúhlasíte. Môžete prijať všetko, odmietnuť voliteľné služby alebo si vybrať jednotlivé kategórie. Voľbu môžete kedykoľvek zmeniť alebo odvolať tlačidlom Nastavenia súkromia na každej stránke."],
    ["Účely, právne základy a uchovávanie", "Voliteľná analytika, reklama a vložené komentáre sa spúšťajú na základe súhlasu, ktorý môžete kedykoľvek odvolať. Prehliadač uchová voľbu súhlasu, kým ju nezmeníte alebo nevymažete; nastavenie vzhľadu a označenie Páči sa mi to zostávajú v prehliadači do vymazania. Súhrnné počty označení Páči sa mi to a zobrazení sú v databáze, kým stránka tieto počítadlá používa. Poskytovatelia hostingu a služieb uchovávajú technické záznamy podľa svojich aktuálnych podmienok. Pri konkrétnom zázname alebo žiadosti o vymazanie kontaktujte prevádzkovateľa."],
    ["Voliteľné služby", "Analytika: Vercel Analytics sa načíta len po súhlase s analytikou. Reklama: Google AdSense sa načíta len po súhlase s reklamou; Google môže podľa vlastných podmienok spracúvať údaje o zariadení a používaní. Komentáre: Giscus vložený cez GitHub sa načíta len po súhlase s externými komentármi. Tieto služby môžu prenášať údaje mimo Európskeho hospodárskeho priestoru; podrobnosti a záruky sú v aktuálnych zásadách poskytovateľov."],
    ["Páči sa mi to a zobrazenia článkov", "Pri použití tlačidla Páči sa mi to alebo otvorení článku stránka aktualizuje súhrnné počítadlo v Upstash Redis. Počítadlo je priradené ku kľúču článku, nie k pomenovanému profilu. Opakované označenie Páči sa mi to sa obmedzuje v prehliadači pomocou lokálneho úložiska. Poskytovatelia hostingu a databázy môžu pri doručení služby spracúvať technické údaje požiadavky, napríklad IP adresu."],
    ["Vaše voľby a práva", "Súhlas môžete kedykoľvek odvolať v Nastaveniach súkromia. Ak sa spracúvajú osobné údaje, môžete mať právo na prístup, opravu, vymazanie, obmedzenie spracúvania, námietku, prenosnosť údajov a podanie sťažnosti na Úrad na ochranu osobných údajov SR. Žiadosti posielajte na info@adhdslovakia.eu."],
    ["Zmeny", "Oznámenie môžeme aktualizovať pri zmene funkcií stránky alebo poskytovateľov. Aktuálna verzia je zverejnená na tejto stránke."],
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />
      <main id="main-content" tabIndex={-1} className="outline-none">
      <article className="mx-auto max-w-3xl px-5 sm:px-8 pt-14 pb-24">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{en ? "Privacy and cookies policy" : "Ochrana súkromia a cookies"}</h1>
        <p className="mt-4 text-sm text-[var(--text-muted)]">{en ? "Last updated: 16 October 2026" : "Aktualizované: 16. októbra 2026"}</p>
        <div className="mt-10 space-y-8">
          {sections.map(([title, text]) => <section key={title}>
            <h2 className="font-display text-xl font-bold mb-2">{title}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{text}</p>
          </section>)}
        </div>
        <p className="mt-10 border-t border-[var(--border-color)] pt-6 text-xs text-[var(--text-muted)]">
          {en ? "This information is a technical starting point and does not replace a review of the operator's actual legal identity, data flows, retention periods and provider terms." : "Tieto informácie sú technickým východiskom. Nenahrádzajú kontrolu skutočnej identity prevádzkovateľa, tokov údajov, lehôt uchovávania a podmienok poskytovateľov."}
        </p>
      </article>
      </main>
    </div>
  );
}
