"use client";

import { useMemo, useState } from "react";

const questions = [
  {
    id: "focus",
    text: "Mávate problém dokončiť úlohy, aj keď sú dôležité?",
  },
  {
    id: "time",
    text: "Strácate pojem o čase alebo často meškáte?",
  },
  {
    id: "procrastination",
    text: "Prokrastinujete aj veci, na ktorých vám záleží?",
  },
  {
    id: "mind",
    text: "Máte pocit, že hlava beží na 20 kartách naraz?",
  },
];

export default function MiniSelfCheck() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const answeredCount = Object.keys(answers).length;
  const yesCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const progress = (answeredCount / questions.length) * 100;

  const resultText =
    answeredCount < questions.length
      ? `Odpovedané ${answeredCount}/${questions.length}`
      : yesCount >= 3
        ? "Viacero odpovedí sedí. Možno stojí za to zistiť viac."
        : yesCount >= 1
          ? "Niečo z toho sedí. ADHD môže vyzerať rôzne."
          : "Zatiaľ nič výrazné — ale informácie môžu pomôcť aj tak.";

  function setAnswer(id: string, value: boolean) {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  return (
    <aside className="hidden lg:block justify-self-end w-full max-w-[430px]">
      <div className="relative overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111] p-6 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1">
            <span className="text-sm">⚡</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">
              Rýchly self-check
            </span>
          </div>

          <h2 className="font-display mb-2 text-2xl font-extrabold leading-tight tracking-tight text-[#f0ede6]">
            Spoznávate sa v tom?
          </h2>

          <p className="mb-5 text-[13px] font-light leading-relaxed text-[#777]">
            Krátky orientačný check. Nie je to diagnóza, ale môže vám napovedať,
            či má zmysel čítať ďalej.
          </p>

          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#1e1e1e]">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-[#222] bg-[#0d0d0d] p-4"
              >
                <p className="mb-3 text-[13px] leading-snug text-[#d0cdc6]">
                  {q.text}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswer(q.id, true)}
                    className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors ${
                      answers[q.id] === true
                        ? "bg-green-400 text-[#0a0a0a]"
                        : "bg-[#161616] text-[#888] hover:bg-[#1d1d1d] hover:text-[#f0ede6]"
                    }`}
                  >
                    Áno
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswer(q.id, false)}
                    className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors ${
                      answers[q.id] === false
                        ? "bg-[#f0ede6] text-[#0a0a0a]"
                        : "bg-[#161616] text-[#888] hover:bg-[#1d1d1d] hover:text-[#f0ede6]"
                    }`}
                  >
                    Nie
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-[#222] bg-[#0a0a0a] p-4">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#555]">
              Výsledok
            </div>
            <p className="text-[13px] leading-relaxed text-[#b8b4aa]">
              {resultText}
            </p>
          </div>

          <a
            href="/informacie-o-adhd"
            className="mt-4 block rounded-xl bg-green-400 px-5 py-3 text-center text-[13px] font-bold text-[#0a0a0a] transition-colors hover:bg-green-300"
          >
            Zistiť viac o príznakoch →
          </a>

          <p className="mt-3 text-center text-[11px] font-light text-[#444]">
            Tento check nenahrádza odbornú diagnostiku.
          </p>
        </div>
      </div>
    </aside>
  );
}