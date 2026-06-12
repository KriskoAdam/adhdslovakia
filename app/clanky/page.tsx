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
    // Pridané overflow-x-hidden, aby žiadny element nepretlačil horizontálny scrollbar
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede6] overflow-x-hidden">

      <Nav />

      {/* HEADER - zmenšený padding na px-4 na mobile, px-8 na desktopoch (md:) */}
      <section className="px-4 md:px-8 pt-14 pb-10 border-b border-[#1e1e1e]">
        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-4 animate-fade-up">
          Všetky články
        </div>
        {/* Pridané break-words, aby nadpis na mobile nepretiekol */}
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-tight break-words animate-fade-up delay-100">
          Články o ADHD
        </h1>
        <p className="text-[#888] text-[15px] font-light mt-3 max-w-md leading-relaxed animate-fade-up delay-200">
          Veda, skúsenosti a praktické informácie v slovenčine.
        </p>
      </section>

      {/* ARTICLES - zmenšený padding na px-4 na mobile */}
      <div className="px-4 md:px-8 py-8 animate-fade-up delay-300">
        {articles.length === 0 ? (
          <p className="text-[#555] text-[14px]">Zatiaľ žiadne články. Čoskoro!</p>
        ) : (
          <div className="flex flex-col gap-px bg-[#1e1e1e] border border-[#1e1e1e] rounded-xl overflow-hidden">
            {articles.map((article) => (
              <a
                key={article.slug}
                href={`/clanky/${article.slug}`}
                
                className="bg-[#111] px-4 md:px-7 py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 hover:bg-[#161616] transition-colors group"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-green-400 md:min-w-[100px] animate-fade-up delay-400">
                  {article.category}
                </span>
                <div className="flex-1 min-w-0"> {/* min-w-0 je kritické pre správne fungovanie flex zalamovania textu */}
                  {/* Pridané break-words pre zamedzenie pretŕčania dlhých názvov článkov */}
                  <h2 className="font-display text-[16px] md:text-[18px] font-bold text-[#d0cdc6] group-hover:text-white transition-colors leading-snug break-words">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-[13px] text-[#555] font-light mt-1 leading-relaxed break-words">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <div className="text-[11px] text-[#444] whitespace-nowrap md:text-right">
                  <div>{article.readTime}</div>
                  <div className="mt-0.5">{article.date}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER - zmenšený padding na px-4 na mobile */}
      <footer className="px-4 md:px-8 py-8 border-t border-[#1e1e1e] mt-8 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-display text-base font-extrabold text-[#333]">
          ADHD<span className="text-green-400/30">.</span>Slovakia
        </div>
        <div className="text-[12px] text-[#333]">© 2026 ADHD Slovakia</div> {/* Aktualizovaný rok na 2026 */}
      </footer>
    </div>
  );
}
