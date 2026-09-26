import type { Metadata } from "next";
import Nav from "../../components/Nav";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "About",
  });

  return {
    title: `${t("title")} – ADHD Slovakia`,
    description: t("description"),
  };
}

export default async function ONasPage({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("About");

  const cards = [
    {
      icon: "📰",
      title: t("cards.content.title"),
      desc: t("cards.content.desc"),
    },
    {
      icon: "🔬",
      title: t("cards.myths.title"),
      desc: t("cards.myths.desc"),
    },
    {
      icon: "🤝",
      title: t("cards.diagnosis.title"),
      desc: t("cards.diagnosis.desc"),
    },
    {
      icon: "⚖️",
      title: t("cards.advocacy.title"),
      desc: t("cards.advocacy.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <div className="max-w-2xl mx-auto px-8 pt-14 pb-20">

        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5 animate-fade-up">
          {t("badge")}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-8 animate-fade-up delay-100">
          {t("headingBefore")}
          <br />
          <span className="text-green-400 animate-fade-up delay-200">
            ADHD Slovakia
          </span>
        </h1>

        <div className="space-y-6 text-[15px] text-[var(--text-secondary)] font-light leading-relaxed animate-fade-up delay-300">
          <p>{t("story.p1")}</p>

          <p>{t("story.p2")}</p>

          <p>{t("story.p3")}</p>

          <p>{t("story.p4")}</p>
        </div>

        <div className="border-t border-[var(--border-color)] my-12" />

        <h2 className="font-display text-2xl font-extrabold tracking-tight mb-6 animate-fade-up delay-400">
          {t("whatWeDo")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-12 animate-fade-up delay-500">
          {cards.map((item) => (
            <div
              key={item.title}
              className="bg-[var(--bg-secondary)] p-6 flex flex-col gap-2 animate-fade-up delay-600"
            >
              <span className="text-2xl">{item.icon}</span>

              <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>

              <p className="text-[13px] text-[var(--text-muted)] font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-3">
            {t("international.title")}
          </div>

          <p className="text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">
            {t("international.beforeLink")}{" "}
            <a
              href="https://adhdeurope.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              ADHD Europe
            </a>{" "}
            {t("international.afterLink")}
          </p>
        </div>

      </div>

      <footer className="px-8 py-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-display text-base font-extrabold text-[var(--text-muted)]">
          ADHD<span className="text-green-400/30">.</span>Slovakia
        </div>

        <div className="text-[12px] text-[var(--text-muted)]">
          {t("footer")}
        </div>
      </footer>
    </div>
  );
}