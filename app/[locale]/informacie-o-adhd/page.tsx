import type { Metadata } from "next";
import ADHDInfoGrid from "../../components/ADHDInfoGrid";
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
    namespace: "AdhdInfo",
  });

  return {
    title: `${t("title")} – ADHD Slovakia`,
    description: t("description"),
  };
}

export default async function InformacieOAdhdPage({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("AdhdInfo");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <section className="px-8 pt-14 pb-10 border-b border-[var(--border-color)]">
        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-4 animate-fade-up">
          {t("badge")}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight animate-fade-up delay-100">
          {t("title")}
        </h1>

        <p className="text-[var(--text-secondary)] text-[15px] font-light mt-3 max-w-md leading-relaxed animate-fade-up delay-200">
          {t("description")}
        </p>
      </section>

      <section className="px-8 py-14 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-3 animate-fade-up delay-300">
            {t("guideTitle")}
          </h2>

          <p className="text-[var(--text-secondary)] max-w-2xl animate-fade-up delay-400">
            {t("guideDescription")}
          </p>
        </div>

        <div className="animate-fade-up delay-500">
          <ADHDInfoGrid />
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-[var(--border-color)] mt-8 flex flex-col md:flex-row justify-between items-center gap-3">
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