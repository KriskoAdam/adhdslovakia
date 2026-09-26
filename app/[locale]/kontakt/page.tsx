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
    namespace: "Contact",
  });

  return {
    title: `${t("title")} – ADHD Slovakia`,
    description: t("description"),
  };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: "sk" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  const contactItems = [
    {
      label: t("items.email.label"),
      value: "info@adhdslovakia.eu",
      href: "mailto:info@adhdslovakia.eu",
      desc: t("items.email.desc"),
    },
    {
      label: t("items.instagram.label"),
      value: "@adhd_slovensko",
      href: "https://www.instagram.com/adhd_slovensko?igsh=bHVsY2lpZmQ2NmV0&utm_source=qr",
      desc: t("items.instagram.desc"),
    },
    {
      label: t("items.facebook.label"),
      value: "ADHD SLOVENSKO",
      href: "https://www.facebook.com/share/1D5PZDYNER/?mibextid=wwXIfr",
      desc: t("items.facebook.desc"),
    },
    {
      label: t("items.tiktok.label"),
      value: "@adhd_slovakia",
      href: "https://www.tiktok.com/@adhd_slovakia",
      desc: t("items.tiktok.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <div className="max-w-xl mx-auto px-8 pt-14 pb-20">

        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5 animate-fade-up">
          {t("badge")}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-up delay-100">
          {t("title")}
        </h1>

        <p className="text-[var(--text-secondary)] text-[15px] font-light leading-relaxed mb-10 animate-fade-up delay-200">
          {t("intro")}
        </p>

        <div className="flex flex-col gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden mb-10 animate-fade-up delay-300">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-[var(--bg-secondary)] px-6 py-5 flex items-center gap-5 hover:opacity-90 transition-opacity group"
            >
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1">
                  {item.label}
                </div>

                <div className="font-display text-[15px] font-bold text-green-400 group-hover:underline">
                  {item.value}
                </div>

                <div className="text-[12px] text-[var(--text-muted)] font-light mt-0.5">
                  {item.desc}
                </div>
              </div>

              <span className="text-[var(--text-muted)] group-hover:text-green-400 transition-colors text-lg">
                →
              </span>
            </a>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <p className="text-[13px] text-[var(--text-muted)] font-light leading-relaxed">
            {t("helpText")}
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