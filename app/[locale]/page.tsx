import Image from "next/image";
import { getAllArticles } from "../lib/articles";
import Nav from "../components/Nav";
import AnimatedStat from "../components/AnimatedStat";
import DIVATestDesktop from "../components/DIVATestDesktop";
import TypewriterHeading from "../components/TypewriterHeading";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SiteIcon, { type SiteIconName } from "../components/SiteIcon";

export async function generateMetadata({ params }: { params: Promise<{ locale: "sk" | "en" }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  const title = en ? "ADHD Slovakia – information, support and stories" : "ADHD Slovakia – informácie, podpora a príbehy";
  const description = en
    ? "Clear information about ADHD in Slovakia: diagnosis, treatment, life stories and neurodiversity support."
    : "Zrozumiteľné informácie o ADHD na Slovensku: diagnostika, liečba, osobné príbehy a podpora neurodiverzity.";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}`, languages: { sk: "/sk", en: "/en", "x-default": "/sk" } },
    openGraph: { title, description, url: `https://www.adhdslovakia.eu/${locale}`, locale: locale === "sk" ? "sk_SK" : "en_US", type: "website" },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("Home");
  const tCategories = await getTranslations("Categories");

  const allArticles = getAllArticles(locale);
  const featuredArticles = allArticles.slice(0, 3);
  const listArticles = allArticles.slice(3, 7);

  const awarenessCards = [
    {
      icon: "brain",
      title: t("awareness.whatIsAdhd.title"),
      desc: t("awareness.whatIsAdhd.desc"),
    },
    {
      icon: "user",
      title: t("awareness.adults.title"),
      desc: t("awareness.adults.desc"),
    },
    {
      icon: "search",
      title: t("awareness.diagnosis.title"),
      desc: t("awareness.diagnosis.desc"),
    },
    {
      icon: "message",
      title: t("awareness.myths.title"),
      desc: t("awareness.myths.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <Nav />

      <main id="main-content" tabIndex={-1} className="outline-none">
      {/* HERO */}
      <section className="px-8 pt-16 pb-12 border-b border-[var(--border-color)]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px] gap-12 xl:gap-20 items-center">
          <div>
            <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5 animate-fade-up">
              {t("badge")}
            </div>

            <TypewriterHeading />

            <p className="text-[16px] text-[var(--text-secondary)] max-w-md leading-relaxed font-light mb-8 animate-fade-up delay-200">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
              <a href={`/${locale}/clanky`} className="inline-flex min-h-11 items-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] motion-reduce:transition-none">
                {t("readArticles")}
              </a>
              <a href={`/${locale}/test`} className="inline-flex min-h-11 items-center rounded-lg border border-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] motion-reduce:transition-none">
                {locale === "en" ? "Take the ADHD screening" : "Vyskúšať orientačný test"}
              </a>
              <a href={`/${locale}/o-nas`} className="inline-flex min-h-11 items-center rounded-lg border border-[var(--border-color)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] motion-reduce:transition-none">
                {t("aboutProject")}
              </a>
            </div>
          </div>

          <div className="animate-scale delay-400 hidden xl:block">
            <DIVATestDesktop />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="flex flex-wrap gap-10 px-8 py-7 border-b border-[var(--border-color)]">
        {[
          {
            num: "10+",
            label: t("stats.diagnoses"),
          },
          {
            num: "4–5%",
            label: t("stats.europeAdhd"),
          },
          {
            num: "∞",
            label: t("stats.myths"),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="contents [&_h2]:notranslate"
            data-translate-ignore
          >
            <AnimatedStat
              num={s.num}
              label={s.label}
              loopDelay={10000}
              scanSpeed={300}
            />
          </div>
        ))}
      </div>

      {/* LATEST ARTICLES */}
      {featuredArticles.length > 0 && (
        <section aria-labelledby="latest-articles-title" className="px-4 pb-8 pt-6 sm:px-8 animate-fade-up">
          <div className="flex items-center justify-between px-4 pb-4 sm:px-8">
            <h2 id="latest-articles-title" className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
              {t("sections.latestArticles")}
            </h2>

            <a
              href={`/${locale}/clanky`}
              className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              {t("sections.allArticles")} →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredArticles.map((a) => (
              <a
                key={a.slug}
                href={`/${locale}/clanky/${a.slug}`}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-700/50 hover:shadow-xl hover:shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-tertiary)]">
                  {a.coverImage ? (
                    <Image
                      src={a.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) calc(50vw - 28px), 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-500/20 via-[var(--bg-secondary)] to-[var(--bg-tertiary)] font-display text-3xl font-extrabold text-green-500/70">
                      ADHD<span className="text-[var(--text-muted)]">.</span>
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {tCategories(
                      a.category as
                        | "diagnosis"
                        | "myths"
                        | "medications"
                        | "research"
                        | "personal-story"
                        | "science"
                        | "lifestyle"
                        | "interviews"
                        | "sources",
                    )}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-[var(--text-primary)] line-clamp-2 transition-colors group-hover:text-green-600 sm:text-xl">
                    {a.title}
                  </h3>

                  {a.excerpt && (
                    <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4 text-xs text-[var(--text-secondary)]">
                    <span>{a.readTime}{a.readTime && a.date ? " · " : ""}{a.date}</span>
                    <span aria-hidden="true" className="shrink-0 font-semibold text-green-500 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* AWARENESS SECTION */}
      <div className="mx-8 mb-8">
        <div className="flex items-center justify-between pt-2 pb-4">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
            {t("sections.awareness")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-4">
          {awarenessCards.map((item, i) => (
            <div
              key={item.title}
              className="bg-[var(--bg-secondary)] p-6 flex flex-col gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><SiteIcon name={item.icon as SiteIconName} className="h-5 w-5" /></span>

              <h3 className="font-display text-[14px] font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>

              <p className="text-[12px] text-[var(--text-muted)] font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* MORE ARTICLES */}
      {listArticles.length > 0 && (
        <>
          <div className="flex items-center justify-between px-8 pt-2 pb-4">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
              {t("sections.moreArticles")}
            </span>
          </div>

          <div className="mx-8 flex flex-col gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-8">
            {listArticles.map((a, i) => (
              <a
                key={a.slug}
                href={`/${locale}/clanky/${a.slug}`}
                className="flex items-center gap-5 bg-[var(--bg-secondary)] px-6 py-4 hover:opacity-90 transition-opacity group"
              >
                <span className="font-display text-[13px] font-extrabold text-[var(--text-muted)] min-w-[28px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="font-display text-[14px] font-bold text-[var(--text-primary)] flex-1 leading-snug">
                  {a.title}
                </span>

                <span className="text-[10px] font-semibold tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded whitespace-nowrap">
                  {tCategories(
                    a.category as
                      | "diagnosis"
                      | "myths"
                      | "medications"
                      | "research"
                      | "personal-story"
                      | "science"
                      | "lifestyle"
                      | "interviews"
                      | "sources",
                  )}
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      </main>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="ADHD Slovakia logo"
            width={447}
            height={559}
            className="h-auto w-12 shrink-0 object-contain opacity-80"
          />

          <div>
            <div className="font-display text-base font-extrabold text-[var(--text-primary)]">
              ADHD<span className="text-green-400">.</span>Slovakia
            </div>

            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {t("footer.tagline")}
            </div>
          </div>
        </div>

        <div className="text-[12px] text-[var(--text-muted)]">
          {t("footer.copyright")}
        </div>
      </footer>
    </div>
  );
}
