"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "../../i18n/navigation";
import { useTranslations } from "next-intl";
import type { ArticleMeta } from "../lib/articles";

type Props = {
  articles: ArticleMeta[];
  locale: "sk" | "en";
};

type Category =
  | "diagnosis"
  | "myths"
  | "medications"
  | "research"
  | "personal-story"
  | "science"
  | "lifestyle"
  | "interviews"
  | "sources";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function isoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2})[.-](\d{1,2})[.-](\d{4})$/);
  return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : undefined;
}

export default function ArticleBrowser({ articles, locale }: Props) {
  const tCategories = useTranslations("Categories");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const isEnglish = locale === "en";
  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category).filter(Boolean))),
    [articles],
  );
  const filteredArticles = useMemo(() => {
    const needle = normalize(query.trim());
    return articles.filter((article) => {
      const matchesCategory = category === "all" || article.category === category;
      const searchableText = normalize(`${article.title} ${article.excerpt} ${article.category}`);
      return matchesCategory && (!needle || searchableText.includes(needle));
    });
  }, [articles, category, query]);

  return (
    <section aria-label={isEnglish ? "Search and filter articles" : "Vyhľadávanie a filtrovanie článkov"}>
      <div className="mb-6 grid gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.55fr)] sm:p-5">
        <div>
          <label htmlFor="article-search" className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
            {isEnglish ? "Search articles" : "Hľadať články"}
          </label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isEnglish ? "Title, topic or keyword" : "Názov, téma alebo kľúčové slovo"}
            className="min-h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div>
          <label htmlFor="article-category" className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
            {isEnglish ? "Filter by topic" : "Filtrovať podľa témy"}
          </label>
          <select
            id="article-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-base text-[var(--text-primary)]"
          >
            <option value="all">{isEnglish ? "All topics" : "Všetky témy"}</option>
            {categories.map((key) => (
              <option key={key} value={key}>{tCategories(key as Category)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3" aria-live="polite" aria-atomic="true">
        <p className="text-sm text-[var(--text-secondary)]">
          {isEnglish
            ? `${filteredArticles.length} ${filteredArticles.length === 1 ? "article" : "articles"} found`
            : `Nájdených článkov: ${filteredArticles.length}`}
        </p>
        {(query || category !== "all") && (
          <button
            type="button"
            onClick={() => { setQuery(""); setCategory("all"); }}
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 hover:bg-[var(--bg-tertiary)]"
          >
            {isEnglish ? "Clear filters" : "Zrušiť filtre"}
          </button>
        )}
      </div>

      {filteredArticles.length === 0 ? (
        <p className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 text-[var(--text-secondary)]" role="status">
          {isEnglish ? "No articles match your search. Try another phrase or topic." : "Hľadaným výrazom alebo téme nezodpovedá žiadny článok. Skúste iné slovo alebo tému."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <article key={article.slug} className="min-w-0">
              <Link
                href={`/clanky/${article.slug}`}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-500/50 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-500 motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-tertiary)]">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  ) : (
                    <div aria-hidden="true" className="flex h-full items-center justify-center bg-gradient-to-br from-green-500/20 to-[var(--bg-tertiary)] font-display text-3xl font-extrabold text-[var(--accent)]">ADHD.</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
                    {tCategories(article.category as Category)}
                  </p>
                  <h2 className="font-display text-lg font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                    {article.title}
                  </h2>
                  {article.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--border-color)] pt-4 text-xs text-[var(--text-secondary)]">
                    <span>{article.readTime}</span>
                    {article.date && <time dateTime={isoDate(article.date)}>{article.date}</time>}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
