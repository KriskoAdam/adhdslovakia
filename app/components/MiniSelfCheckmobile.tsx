"use client";

import { useMemo, useState } from "react";

type AnswerValue = 0 | 1 | 2;

interface Question {
  id: string;
  category: "A" | "B";
  number: number;
  text: string;
  example?: string;
}

const questions: Question[] = [
  { id: "A1", category: "A", number: 1, text: "Nedokážete udržať pozornosť na úlohy, ktoré vyžadujú dlhú koncentráciu?", example: "napr. čítanie dokumentov, vyplňovanie formulárov" },
  { id: "A2", category: "A", number: 2, text: "Často zabúdate na denne potrebné veci (kľúče, peňaženku, telefón)?" },
  { id: "A3", category: "A", number: 3, text: "Keď niekto s vami hovorí, často ste inými myšlienkami a nepočujete celú vetu?" },
  { id: "A4", category: "A", number: 4, text: "Problémy s organizáciou úloh a časom — často nestíhate termíny?" },
  { id: "A5", category: "A", number: 5, text: "Vyhýbate sa úlohám, ktoré vyžadujú dlhú mentálnu námahu?" },
  { id: "A6", category: "A", number: 6, text: "Strácate veci potrebné pre činnosti (náradie, dokumenty, telefón)?" },
  { id: "A7", category: "A", number: 7, text: "Bývate rušení vonkajšími podnetmi, ktoré vás odvádzajú od úlohy?" },
  { id: "A8", category: "A", number: 8, text: "Zabúdate na dohodnuté schôdzky alebo termíny?" },
  { id: "A9", category: "A", number: 9, text: "Problémy s dokončením detailov — začnete veľa vecí, ale dokončíte málo?" },
  { id: "B1", category: "B", number: 1, text: "Často hýbete rukami/nohami alebo neposedíte pokojne?" },
  { id: "B2", category: "B", number: 2, text: "Cítite nepohodu, keď musíte sedieť dlhší čas na jednom mieste?", example: "napr. na poradách, v kine" },
  { id: "B3", category: "B", number: 3, text: "Často začnete odpovedať predtým, než niekto dokončí otázku?" },
  { id: "B4", category: "B", number: 4, text: "Problémy s čakaním na rad — napríklad v rade, pri rozhovore?" },
  { id: "B5", category: "B", number: 5, text: "Často prerušujete iných alebo vnášate sa do cudzích rozhovorov?" },
  { id: "B6", category: "B", number: 6, text: "Robíte veci impulzívne, bez premýšľania o dôsledkoch?", example: "náhle výdavky, riskantné jazdenie" },
  { id: "B7", category: "B", number: 7, text: "Máte pocit, že vaša myseľ je ako „motor, ktorý nikdy nezastaví?" },
  { id: "B8", category: "B", number: 8, text: "Často hovoríte príliš veľa alebo veľmi rýchlo?" },
  { id: "B9", category: "B", number: 9, text: "Hľadáte silné podnety (extrémne športy, hry) pretože bežné veci vás nudia?" },
];

export default function DIVATestMobile() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scoreA = useMemo(() => questions.filter((q) => q.category === "A").reduce((sum, q) => sum + (answers[q.id] || 0), 0), [answers]);
  const scoreB = useMemo(() => questions.filter((q) => q.category === "B").reduce((sum, q) => sum + (answers[q.id] || 0), 0), [answers]);

  const getResult = () => {
    if (!isComplete) return { title: "Test nie je dokončený", text: `Odpovedané ${Object.keys(answers).length}/${questions.length}`, color: "text-[#777]" };
    const isPositiveA = scoreA >= 4;
    const isPositiveB = scoreB >= 4;
    if (isPositiveA || isPositiveB) {
      return { title: "Pozitívny screening", text: "Vyššie skóre v jednej alebo oboch kategóriách. Toto NIE je diagnóza.", color: "text-yellow-500" };
    }
    return { title: "Negatívny screening", text: "Skóre je pod prahom pre podozrenie na ADHD.", color: "text-green-400" };
  };

  const result = getResult();
  const currentQuestion = questions[step];

  const handleAnswer = (value: AnswerValue) => {
    if (!isComplete) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      if (step < questions.length - 1) setStep((s) => s + 1);
      else setIsComplete(true);
    }
  };

  const handleReset = () => { setAnswers({}); setStep(0); setIsComplete(false); };

  return (
    <div className="block xl:hidden w-full">
      <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] shadow-lg min-h-[420px]">
        <div className="p-5 min-h-[420px] flex flex-col">
          {/* Header */}
          <div className="mb-4 flex-shrink-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 mb-3">
              <span className="text-sm">🧠</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">ADHD Test</span>
            </div>
            <div className="flex justify-between items-end">
              <h2 className="font-display text-lg font-extrabold text-[#f0ede6]">Test na ADHD</h2>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{isComplete ? "Hotovo" : `${step + 1}/${questions.length}`}</div>
                <div className="text-[11px] text-[#777] font-mono">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden flex-shrink-0">
            <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {!isComplete ? (
              <div className="rounded-2xl border border-[#222] bg-[#0d0d0d] p-5 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentQuestion.category === "A" ? "bg-blue-400/10 text-blue-400" : "bg-purple-400/10 text-purple-400"}`}>
                      {currentQuestion.category}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Príznak {currentQuestion.number}/9</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#f0ede6] leading-snug">{currentQuestion.text}</h3>
                  {currentQuestion.example && <p className="text-[11px] text-[#555] mt-2 italic">{currentQuestion.example}</p>}
                </div>

                <div className="space-y-2 mt-auto">
                  {[
                    { value: 0, label: "Nikdy / len málo", desc: "0 bodov" },
                    { value: 1, label: "Stredne", desc: "1 bod" },
                    { value: 2, label: "Vážne / často", desc: "2 body" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value as AnswerValue)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all flex justify-between items-center ${
                        answers[currentQuestion.id] === opt.value
                          ? "border-green-400 bg-green-400/5"
                          : "border-[#222] bg-[#0a0a0a] hover:border-[#333]"
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${answers[currentQuestion.id] === opt.value ? "text-green-400" : "text-[#d0cdc6]"}`}>{opt.label}</div>
                        <div className="text-[10px] text-[#555] mt-0.5">{opt.desc}</div>
                      </div>
                      <div className={`text-xl font-display font-extrabold ${answers[currentQuestion.id] === opt.value ? "text-green-400" : "text-[#444]"}`}>{opt.value}</div>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button onClick={() => setStep((s) => s - 1)} className="mt-3 text-[11px] text-[#555] hover:text-[#f0ede6] text-left">← Späť</button>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#222] bg-[#0d0d0d] p-5 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${result.title.includes("Pozitívny") ? "bg-yellow-400/10 text-yellow-500" : "bg-green-400/10 text-green-400"}`}>
                    {result.title.includes("Pozitívny") ? "⚠️" : "✓"}
                  </div>
                  <div>
                    <h3 className={`font-display text-base font-extrabold ${result.color}`}>{result.title}</h3>
                    <p className="text-[12px] text-[#d0cdc6] mt-0.5">{result.text}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-3">
                    <div className="text-[10px] font-bold uppercase text-blue-400 mb-1">Nepozornosť</div>
                    <div className="text-xl font-display font-extrabold text-[#f0ede6]">{scoreA}<span className="text-xs text-[#555]">/18</span></div>
                    <div className={`text-[10px] font-bold uppercase mt-1 ${scoreA >= 4 ? "text-yellow-500" : "text-green-400"}`}>{scoreA >= 4 ? "Pozitívne" : "Norma"}</div>
                  </div>
                  <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-3">
                    <div className="text-[10px] font-bold uppercase text-purple-400 mb-1">Impulzivita</div>
                    <div className="text-xl font-display font-extrabold text-[#f0ede6]">{scoreB}<span className="text-xs text-[#555]">/18</span></div>
                    <div className={`text-[10px] font-bold uppercase mt-1 ${scoreB >= 4 ? "text-yellow-500" : "text-green-400"}`}>{scoreB >= 4 ? "Pozitívne" : "Norma"}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <a href="/informacie-o-adhd" className="flex-1 rounded-xl bg-green-400 px-4 py-3 text-center text-[12px] font-bold text-[#0a0a0a] hover:bg-green-300">Zistiť viac →</a>
                  <button onClick={handleReset} className="rounded-xl border border-[#2a2a2a] px-4 py-3 text-[12px] font-semibold text-[#f0ede6] hover:border-[#444]">Znova</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}