"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const sections = [
  { icon: "🧠", key: "whatIsAdhd" },
  { icon: "⚡", key: "symptoms" },
  { icon: "👶", key: "children" },
  { icon: "👤", key: "adults" },
  { icon: "🧬", key: "causes" },
  { icon: "🔍", key: "diagnosis" },
  { icon: "💊", key: "treatment" },
  { icon: "🎓", key: "school" },
  { icon: "💼", key: "work" },
  { icon: "❤️", key: "relationships" },
  { icon: "🍎", key: "lifestyle" },
  { icon: "❓", key: "faq" },
] as const;

export default function ADHDInfoGrid() {
  const t = useTranslations("AdhdInfoGrid");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="flex flex-col gap-2">
      {sections.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={item.key}
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? "border-green-400/40 bg-[var(--bg-secondary)]"
                : "border-[var(--border-color)] bg-[var(--bg-tertiary)]"
            }`}
          >
            {/* HEADER */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>

                <span className="font-display font-bold text-[15px] text-[var(--text-primary)]">
                  {t(`sections.${item.key}.title`)}
                </span>
              </div>

              <span
                className={`text-green-400 text-lg transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {/* CONTENT */}
            {isOpen && (
              <div className="px-5 pb-6 border-t border-[var(--border-color)]">
                <div className="pt-4 text-[14px] text-[var(--text-secondary)] leading-7 font-light whitespace-pre-line">
                  {t(`sections.${item.key}.content`)}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* FAQ CTA */}
      <div className="mt-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-tertiary)] px-5 py-5">
        <p className="text-[13px] text-[var(--text-muted)] mb-3">
          {t("cta.question")}
        </p>

        <a
          href="https://forms.gle/ai1TLsWiWL1Jo5u7A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-400 hover:bg-green-300 text-[#0a0a0a] text-[13px] font-semibold transition-colors"
        >
          {t("cta.button")} →
        </a>
      </div>
    </div>
  );
}