"use client";

import { useMemo, useState } from "react";
import Nav from "../../components/Nav";
import { useLocale, useTranslations } from "next-intl";

type AnswerValue = 0 | 1 | 2;

interface Question {
  id: string;
  category: "A" | "B";
  number: number;
  textKey: string;
  exampleKey?: string;
}

const questions: Question[] = [
  {
    id: "A1",
    category: "A",
    number: 1,
    textKey: "A1",
    exampleKey: "A1",
  },
  {
    id: "A2",
    category: "A",
    number: 2,
    textKey: "A2",
  },
  {
    id: "A3",
    category: "A",
    number: 3,
    textKey: "A3",
  },
  {
    id: "A4",
    category: "A",
    number: 4,
    textKey: "A4",
  },
  {
    id: "A5",
    category: "A",
    number: 5,
    textKey: "A5",
  },
  {
    id: "A6",
    category: "A",
    number: 6,
    textKey: "A6",
  },
  {
    id: "A7",
    category: "A",
    number: 7,
    textKey: "A7",
  },
  {
    id: "A8",
    category: "A",
    number: 8,
    textKey: "A8",
  },
  {
    id: "A9",
    category: "A",
    number: 9,
    textKey: "A9",
  },
  {
    id: "B1",
    category: "B",
    number: 1,
    textKey: "B1",
  },
  {
    id: "B2",
    category: "B",
    number: 2,
    textKey: "B2",
    exampleKey: "B2",
  },
  {
    id: "B3",
    category: "B",
    number: 3,
    textKey: "B3",
  },
  {
    id: "B4",
    category: "B",
    number: 4,
    textKey: "B4",
  },
  {
    id: "B5",
    category: "B",
    number: 5,
    textKey: "B5",
  },
  {
    id: "B6",
    category: "B",
    number: 6,
    textKey: "B6",
    exampleKey: "B6",
  },
  {
    id: "B7",
    category: "B",
    number: 7,
    textKey: "B7",
  },
  {
    id: "B8",
    category: "B",
    number: 8,
    textKey: "B8",
  },
  {
    id: "B9",
    category: "B",
    number: 9,
    textKey: "B9",
  },
];

export default function TestPage() {
  const locale = useLocale();
  const t = useTranslations("Test");

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scoreA = useMemo(
    () =>
      questions
        .filter((q) => q.category === "A")
        .reduce((sum, q) => sum + (answers[q.id] || 0), 0),
    [answers]
  );

  const scoreB = useMemo(
    () =>
      questions
        .filter((q) => q.category === "B")
        .reduce((sum, q) => sum + (answers[q.id] || 0), 0),
    [answers]
  );

  const getCategoryLabel = (cat: "A" | "B") =>
    cat === "A" ? t("categories.inattention") : t("categories.hyperactivity");

  const getResult = () => {
    if (!isComplete) {
      return {
        title: t("results.incomplete.title"),
        text: t("results.incomplete.text", {
          answered: Object.keys(answers).length,
          total: questions.length,
        }),
        color: "text-[var(--text-muted)]",
      };
    }

    const isPositiveA = scoreA >= 4;
    const isPositiveB = scoreB >= 4;

    if (isPositiveA || isPositiveB) {
      const parts = [];

      if (isPositiveA) {
        parts.push(t("categories.inattentionLower"));
      }

      if (isPositiveB) {
        parts.push(t("categories.hyperactivityLower"));
      }

      return {
        title: t("results.positive.title"),
        text: t("results.positive.text", {
          categories: parts.join(
            locale === "sk" ? " a " : " and "
          ),
        }),
        color: "text-yellow-500",
      };
    }

    return {
      title: t("results.negative.title"),
      text: t("results.negative.text"),
      color: "text-green-400",
    };
  };

  const result = getResult();
  const currentQuestion = questions[step];

  const handleAnswer = (value: AnswerValue) => {
    if (!isComplete) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));

      if (step < questions.length - 1) {
        setStep((s) => s + 1);
      } else {
        setIsComplete(true);
      }
    }
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
    setIsComplete(false);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-300 font-sans">
      <div>
        <Nav />

        <main className="max-w-7xl mx-auto px-8 pt-10 pb-16 w-full">
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl w-full flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/5 blur-3xl pointer-events-none" />

            <div className="p-6 md:p-10 flex-1 flex flex-col">

              {/* TEST HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded border border-green-400/25 bg-green-400/10 px-3 py-1 max-w-full">
                    <span className="flex-shrink-0 text-sm">🧠</span>

                    <span className="text-[10px] font-semibold uppercase tracking-widest text-green-400 truncate">
                      {t("badge")}
                    </span>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] break-words">
                    {t("title")}
                  </h1>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    {isComplete
                      ? t("completed")
                      : t("questionProgress", {
                          current: step + 1,
                          total: questions.length,
                        })}
                  </div>

                  <div className="text-xs text-green-400 font-mono mt-0.5 font-bold">
                    {Math.round(progress)}% {t("done")}
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-6 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* QUESTION / RESULT */}
              <div className="flex-1 flex flex-col justify-center">
                {!isComplete ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[340px] w-full">

                    {/* QUESTION BOX */}
                    <div className="lg:col-span-8 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 md:p-8 flex flex-col justify-between h-full">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold bg-green-400/10 text-green-400 border border-green-400/25 flex-shrink-0">
                            {currentQuestion.category}
                          </div>

                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">
                            {t("section")}:{" "}
                            {getCategoryLabel(currentQuestion.category)}
                          </div>
                        </div>

                        <h2
                          className="font-display text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug break-words hyphens-auto"
                          lang={locale}
                        >
                          {t(`questions.${currentQuestion.textKey}`)}
                        </h2>

                        {currentQuestion.exampleKey && (
                          <p
                            className="text-[13px] text-[var(--text-secondary)] mt-3 italic bg-[var(--bg-secondary)] p-3 rounded-md border border-[var(--border-color)] leading-relaxed font-light break-words hyphens-auto"
                            lang={locale}
                          >
                            {t(
                              `examples.${currentQuestion.exampleKey}`
                            )}
                          </p>
                        )}
                      </div>

                      {/* BOTTOM QUESTION BAR */}
                      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-between items-center gap-4 flex-shrink-0 w-full">
                        {step > 0 ? (
                          <button
                            onClick={() => setStep((s) => s - 1)}
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium flex-shrink-0"
                          >
                            ← {t("previous")}
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] opacity-40 font-medium select-none pointer-events-none">
                            ← {t("previous")}
                          </span>
                        )}

                        <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline text-right break-words">
                          {t("scale")}
                        </span>
                      </div>
                    </div>

                    {/* SCORE PANEL */}
                    <div className="lg:col-span-4 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 flex flex-col justify-between h-full">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 truncate">
                          {t("currentScore")}
                        </div>

                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 gap-2">
                              <span className="text-[var(--text-primary)] font-medium truncate">
                                A. {t("categories.inattention")}
                              </span>

                              <span className="text-[var(--text-secondary)] font-mono font-bold flex-shrink-0">
                                {scoreA}{" "}
                                <span className="text-[var(--text-muted)]">
                                  / 18 {t("pointsShort")}
                                </span>
                              </span>
                            </div>

                            <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-400 transition-all"
                                style={{
                                  width: `${(scoreA / 18) * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1.5 gap-2">
                              <span className="text-[var(--text-primary)] font-medium truncate">
                                B. {t("categories.hyperactivity")}
                              </span>

                              <span className="text-[var(--text-secondary)] font-mono font-bold flex-shrink-0">
                                {scoreB}{" "}
                                <span className="text-[var(--text-muted)]">
                                  / 18 {t("pointsShort")}
                                </span>
                              </span>
                            </div>

                            <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-400 transition-all"
                                style={{
                                  width: `${(scoreB / 18) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[var(--text-muted)] mt-6 pt-4 border-t border-[var(--border-color)] leading-relaxed font-light break-words">
                        {t("threshold")}{" "}
                        <strong className="text-[var(--text-primary)]">
                          ≥ 4 {t("pointsShort")}
                        </strong>{" "}
                        {t("thresholdEnd")}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* RESULTS */
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 md:p-10 flex flex-col justify-between gap-8 max-w-4xl mx-auto w-full min-w-0">
                    <div className="flex flex-col sm:flex-row items-start gap-5 min-w-0">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                        {result.title === t("results.positive.title")
                          ? "⚠️"
                          : "✓"}
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`font-display text-2xl md:text-3xl font-bold break-words ${result.color}`}
                        >
                          {result.title}
                        </h3>

                        <p className="text-[14px] text-[var(--text-secondary)] mt-2 leading-relaxed font-light break-words">
                          {result.text}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 min-w-0">
                        <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-1 truncate">
                          {t("resultSectionA")}
                        </div>

                        <div className="text-4xl font-display font-bold text-[var(--text-primary)]">
                          {scoreA}
                          <span className="text-base text-[var(--text-muted)] font-light">
                            {" "}
                            / 18 {t("pointsShort")}
                          </span>
                        </div>

                        <p
                          className={`text-xs mt-2 font-medium break-words ${
                            scoreA >= 4
                              ? "text-yellow-500"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {scoreA >= 4
                            ? t("resultScores.inattentionPositive")
                            : t("resultScores.normalRange")}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 min-w-0">
                        <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-1 truncate">
                          {t("resultSectionB")}
                        </div>

                        <div className="text-4xl font-display font-bold text-[var(--text-primary)]">
                          {scoreB}
                          <span className="text-base text-[var(--text-muted)] font-light">
                            {" "}
                            / 18 {t("pointsShort")}
                          </span>
                        </div>

                        <p
                          className={`text-xs mt-2 font-medium break-words ${
                            scoreB >= 4
                              ? "text-yellow-500"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {scoreB >= 4
                            ? t("resultScores.hyperactivityPositive")
                            : t("resultScores.normalRange")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                      <a
                        href={`/${locale}/informacie-o-adhd`}
                        className="flex-1 rounded-md bg-green-400 px-5 py-3 text-center text-[13px] font-semibold text-[#0a0a0a] hover:bg-green-300 transition-colors break-words"
                      >
                        {t("diagnosisLink")} →
                      </a>

                      <button
                        onClick={handleReset}
                        className="rounded-md border border-[var(--border-color)] px-5 py-3 text-[13px] font-semibold text-[var(--text-primary)] hover:border-green-400/40 bg-transparent transition-colors break-words"
                      >
                        {t("reset")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ANSWER BUTTONS */}
            {!isComplete && (
              <div className="p-6 md:p-10 pt-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-b-xl w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: 0,
                      label: t("answers.never"),
                      sub: t("answers.zero"),
                    },
                    {
                      value: 1,
                      label: t("answers.sometimes"),
                      sub: t("answers.one"),
                    },
                    {
                      value: 2,
                      label: t("answers.often"),
                      sub: t("answers.two"),
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        handleAnswer(opt.value as AnswerValue)
                      }
                      className={`rounded-md border bg-[var(--bg-primary)] p-4 text-center transition-all flex flex-col items-center justify-center gap-1 group min-w-0 ${
                        answers[currentQuestion.id] === opt.value
                          ? "border-green-400 bg-green-400/10"
                          : "border-[var(--border-color)] hover:border-green-400/40"
                      }`}
                    >
                      <div
                        className={`text-xs font-bold uppercase tracking-wide break-words w-full ${
                          answers[currentQuestion.id] === opt.value
                            ? "text-green-400"
                            : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {opt.label}
                      </div>

                      <div
                        className={`text-[10px] font-mono ${
                          answers[currentQuestion.id] === opt.value
                            ? "text-green-400/70"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 py-10 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="font-display text-base font-extrabold text-[var(--text-primary)]">
          ADHD<span className="text-green-400">.</span>Slovakia
        </div>

        <div className="text-[12px] text-[var(--text-muted)]">
          {t("footer")}
        </div>
      </footer>
    </div>
  );
}