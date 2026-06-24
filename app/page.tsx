import Image from "next/image";
import { getAllArticles } from "./lib/articles";
import Nav from "./components/Nav";
import AnimatedStat from "./components/AnimatedStat";
import DIVATestDesktop from "./components/DIVATestDesktop";
import TypewriterHeading from "./components/TypewriterHeading";

const awarenessCards = [
  {
    icon: "🧠",
    title: "Čo je ADHD?",
    desc: "ADHD je neurovývojová porucha ktorá pretrváva do dospelosti. Nie je to len neposlušnosť alebo lenivosť ide o rozdielne fungujúci mozog.",
  },
  {
    icon: "👤",
    title: "ADHD u dospelých",
    desc: "Odhaduje sa že 4–5% ľudí v Európe má ADHD. Väčšina z nich nikdy nedostala diagnózu a nevie prečo im niektoré veci v ich živote nejdú.",
  },
  {
    icon: "🔍",
    title: "Diagnóza & liečba",
    desc: "Správna diagnóza môže zmeniť život. Na Slovensku je cesta k diagnóze náročná, ale možná. Pomôžeme ti zorientovať sa.",
  },
  {
    icon: "💬",
    title: "Mýty o ADHD",
    desc: "Majú to len deti. Stačí sa viac snažiť. To je len výhovorka. Tieto mýty škodia — a my ich búrame jeden po druhom.",
  },
];

export default function Home() {
  const allArticles = getAllArticles();
  const featuredArticles = allArticles.slice(0, 3);
  const listArticles = allArticles.slice(3, 7);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <Nav />

      {/* HERO */}
      <section className="px-8 pt-16 pb-12 border-b border-[var(--border-color)]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px] gap-12 xl:gap-20 items-center">
          <div>
            <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5 animate-fade-up">
              Neurodiverzita · Osveta · Slovensko
            </div>

            <TypewriterHeading />

            <p className="text-[16px] text-[var(--text-secondary)] max-w-md leading-relaxed font-light mb-8 animate-fade-up delay-200">
              Informácie, skúsenosti a veda o ADHD v slovenčine. Pre ľudí,
              ktorí hľadajú odpovede.
            </p>

            <div className="flex gap-3 flex-wrap animate-fade-up delay-300">
              <a
                href="/clanky"
                className="inline-block bg-green-400 text-[#0a0a0a] text-[13px] font-semibold px-5 py-2.5 rounded-md hover:bg-green-300 transition-colors"
              >
                Čítať články
              </a>

              <a
                href="/o-nas"
                className="inline-block bg-transparent text-[var(--text-primary)] text-[13px] font-semibold px-5 py-2.5 rounded-md border border-[var(--border-color)] hover:border-green-400/40 transition-colors"
              >
                O projekte
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
          { num: "10+", label: "úspešných diagnóz cez komunitu" },
          { num: "4–5%", label: "ľudí má ADHD v Európe" },
          { num: "∞", label: "mýtov ktoré treba zbúrať" },
        ].map((s, i) => (
          <div key={s.label} className="contents [&_h2]:notranslate" data-translate-ignore>
            <AnimatedStat
              num={s.num}
              label={s.label}
              delay={i * 180}
              speed={65}
            />
          </div>
        ))}
      </div>

      {/* FEATURED ARTICLES */}
      {featuredArticles.length > 0 && (
        <>
          <div className="flex items-center justify-between px-8 pt-6 pb-4 animate-fade-up">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
              Najnovšie články
            </span>
            <a
              href="/clanky"
              className="text-[12px] text-green-400 hover:underline animate-fade-up delay-100"
            >
              Všetky články →
            </a>
          </div>
          <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden animate-fade-up delay-100">
            {featuredArticles.map((a, i) => (
              <a
                key={a.slug}
                href={`/clanky/${a.slug}`}
                className={`bg-[var(--bg-secondary)] flex flex-col gap-2.5 hover:opacity-90 transition-opacity group ${
                  i === 0 ? "md:row-span-2 p-8" : "p-7"
                }`}
              >
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-400">
                  {a.category}
                </span>
                <h2
                  className={`font-display font-bold leading-snug tracking-tight text-[var(--text-primary)] ${
                    i === 0 ? "text-3xl" : "text-xl"
                  }`}
                >
                  {a.title}
                </h2>
                {a.excerpt && (
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-light">
                    {a.excerpt}
                  </p>
                )}
                <div className="text-[11px] text-[var(--text-muted)] mt-auto pt-3 border-t border-[var(--border-color)]">
                  {a.readTime} · {a.date}
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      
      {/* AWARENESS SECTION */}
      <div className="mx-8 mb-8">
        <div className="flex items-center justify-between pt-2 pb-4">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
            ADHD Info & Awareness
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-4">
          {awarenessCards.map((item, i) => (
            <div
              key={item.title}
              className="bg-[var(--bg-secondary)] p-6 flex flex-col gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-xl">{item.icon}</span>
              <h3 className="font-display text-[14px] font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-[12px] text-[var(--text-muted)] font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <a
          href="https://adhdeurope.eu/adhd-awareness-month/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-6 py-4 hover:opacity-90 transition-opacity group"
        >
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-green-400 mb-1">
              ADHD Europe · Október je ADHD Awareness Month
            </div>
            <div className="font-display text-[15px] font-bold text-[var(--text-primary)] opacity-90">
              2025 téma: The Many Faces of ADHD →
            </div>
          </div>
          <span className="text-green-400 text-xl">🌍</span>
        </a>
      </div>

      {/* MORE ARTICLES */}
      {listArticles.length > 0 && (
        <>
          <div className="flex items-center justify-between px-8 pt-2 pb-4">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
              Ďalšie články
            </span>
          </div>
          <div className="mx-8 flex flex-col gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-8">
            {listArticles.map((a, i) => (
              <a
                key={a.slug}
                href={`/clanky/${a.slug}`}
                className="flex items-center gap-5 bg-[var(--bg-secondary)] px-6 py-4 hover:opacity-90 transition-opacity group"
              >
                <span className="font-display text-[13px] font-extrabold text-[var(--text-muted)] min-w-[28px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[14px] font-bold text-[var(--text-primary)] flex-1 leading-snug">
                  {a.title}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded whitespace-nowrap">
                  {a.category}
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="ADHD Slovakia logo"
            width={48}
            height={48}
            className="object-contain opacity-80"
          />
          <div>
            <div className="font-display text-base font-extrabold text-[var(--text-primary)]">
              ADHD<span className="text-green-400">.</span>Slovakia
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Neurodiverzita · Osveta · Slovensko
            </div>
          </div>
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">
          © 2025 ADHD Slovakia · Všetky práva vyhradené
        </div>
      </footer>
    </div>
  );
}