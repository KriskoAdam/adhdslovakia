import type { Metadata } from "next";
import { getAllArticles } from "../lib/articles";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: "Články – ADHD Slovakia",
  description: "Všetky články o ADHD v slovenčine.",
};

export default function ClankyPage() {
  const articles = getAllArticles();
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
      <Nav />

      {/* HEADER */}
      <section className="px-4 md:px-8 pt-14 pb-10 border-b border-[var(--border-color)]">
        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-4 animate-fade-up">
          Všetky články
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-tight break-words animate-fade-up delay-100">
          Články o ADHD
        </h1>
        <p className="text-[var(--text-secondary)] text-[15px] font-light mt-3 max-w-md leading-relaxed animate-fade-up delay-200">
          Veda, skúsenosti a praktické informácie v slovenčine.
        </p>
      </section>

      {/* ARTICLES */}
      <div className="px-4 md:px-8 py-8 animate-fade-up delay-300">
        {articles.length === 0 ? (
          <p className="text-[var(--text-muted)] text-[14px]">Zatiaľ žiadne články. Čoskoro!</p>
        ) : (
          <div className="flex flex-col gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            {articles.map((article) => (
              <a
                key={article.slug}
                href={`/clanky/${article.slug}`}
                className="bg-[var(--bg-secondary)] px-4 md:px-7 py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 hover:opacity-90 transition-opacity group"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-green-400 md:min-w-[100px]">
                  {article.category}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-[16px] md:text-[18px] font-bold text-[var(--text-primary)] leading-snug break-words">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-[13px] text-[var(--text-muted)] font-light mt-1 leading-relaxed break-words">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] whitespace-nowrap md:text-right">
                  <div>{article.readTime}</div>
                  <div className="mt-0.5">{article.date}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="px-4 md:px-8 py-8 border-t border-[var(--border-color)] mt-8 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-display text-base font-extrabold text-[var(--text-muted)]">
          ADHD<span className="text-green-400/30">.</span>Slovakia
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">© 2026 ADHD Slovakia</div>
      </footer>
    </div>
  );
}