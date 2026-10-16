import type { Metadata } from "next";
import { getAllArticles } from "../../lib/articles";
import Nav from "../../components/Nav";
import ArticleBrowser from "../../components/ArticleBrowser";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Articles" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/clanky`, languages: { sk: "/sk/clanky", en: "/en/clanky" } },
  };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Articles");
  const articles = getAllArticles(locale);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="border-b border-[var(--border-color)] px-4 pb-10 pt-14 md:px-8">
          <div className="mb-4 inline-block rounded border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("badge")}
          </div>
          <h1 className="font-display break-words text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {t("description")}
          </p>
        </section>

        <div className="px-4 py-8 md:px-8">
          {articles.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">{t("empty")}</p>
          ) : (
            <ArticleBrowser articles={articles} locale={locale} />
          )}
        </div>
      </main>

      <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-color)] px-4 py-8 text-center sm:flex-row sm:text-left md:px-8">
        <div className="font-display text-base font-extrabold text-[var(--text-secondary)]">
          ADHD<span className="text-[var(--accent)]">.</span>Slovakia
        </div>
        <div className="text-xs text-[var(--text-secondary)]">{t("footer")}</div>
      </footer>
    </div>
  );
}
