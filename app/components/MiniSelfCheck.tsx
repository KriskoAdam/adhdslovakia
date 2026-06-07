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
  { id: "B2", category: "B", number: 2, text: "Cítite nepohodu, keď musíte sedieť dlhší čas na jednom mieste?", example: "napr. na poradách, v kine, v doprave" },
  { id: "B3", category: "B", number: 3, text: "Často začnete odpovedať predtým, než niekto dokončí otázku?" },
  { id: "B4", category: "B", number: 4, text: "Problémy s čakaním na rad — napríklad v rade, pri rozhovore?" },
  { id: "B5", category: "B", number: 5, text: "Často prerušujete iných alebo vnášate sa do cudzích rozhovorov?" },
  { id: "B6", category: "B", number: 6, text: "Robíte veci impulzívne, bez premýšľania o dôsledkoch?", example: "náhle výdavky, riskantné jazdenie" },
  { id: "B7", category: "B", number: 7, text: "Máte pocit, že vaša myseľ je ako „motor, ktorý nikdy nezastaví“?" },
  { id: "B8", category: "B", number: 8, text: "Často hovoríte príliš veľa alebo veľmi rýchlo?" },
  { id: "B9", category: "B", number: 9, text: "Hľadáte silné podnety (extrémne športy, hry) pretože bežné veci vás nudia?" },
];

export default function DIVATestDesktop() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scoreA = useMemo(() => questions.filter((q) => q.category === "A").reduce((sum, q) => sum + (answers[q.id] || 0), 0), [answers]);
  const scoreB = useMemo(() => questions.filter((q) => q.category === "B").reduce((sum, q) => sum + (answers[q.id] || 0), 0), [answers]);

  const getCategoryLabel = (cat: "A" | "B") => cat === "A" ? "Nepozornosť" : "Impulzivita / Hyperaktivita";

  const getResult = () => {
    if (!isComplete) return { title: "Test nie je dokončený", text: `Odpovedané ${Object.keys(answers).length}/${questions.length}`, color: "text-[#777]" };
    const isPositiveA = scoreA >= 4;
    const isPositiveB = scoreB >= 4;
    if (isPositiveA || isPositiveB) {
      const parts = [];
      if (isPositiveA) parts.push("nepozornosť");
      if (isPositiveB) parts.push("impulzivita");
      return { title: "Pozitívny screening", text: `Vyššie skóre v kategórii ${parts.join(" a ")}. Toto NIE je diagnóza.`, color: "text-yellow-500" };
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
    <aside className="hidden xl:block justify-self-end w-[1000px]">
      <div className="relative overflow-hidden rounded-[28px] border border-[#1e1e1e] bg-[#111] shadow-2xl h-[400px]">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        
        <div className="relative p-6 h-full flex flex-col">
          {/* HEADER (Fixed height) */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1">
                <span className="text-sm">🧠</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">Urobte si ADHD test</span>
              </div>
              <h2 className="font-display text-xl font-extrabold text-[#f0ede6]">Test na ADHD</h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{isComplete ? "Dokončené" : `${step + 1}/${questions.length}`}</div>
              <div className="text-[11px] text-[#777] font-mono">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</div>
            </div>
          </div>

          {/* PROGRESS (Fixed height) */}
          <div className="mb-4 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden flex-shrink-0">
            <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
          </div>

          {/* CONTENT AREA (Flexible but within fixed parent height) */}
          <div className="flex-1 min-h-0">
            {!isComplete ? (
              <div className="grid grid-cols-[1fr_240px] gap-4 h-full">
                {/* Question Box */}
                <div className="rounded-2xl border border-[#222] bg-[#0d0d0d] p-5 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center gap-3 mb-2 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentQuestion.category === "A" ? "bg-blue-400/10 text-blue-400" : "bg-purple-400/10 text-purple-400"}`}>
                      {currentQuestion.category}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                      {getCategoryLabel(currentQuestion.category)}
                    </div>
                  </div>
                  
                  {/* Text area - this grows but won't push buttons out because of flex-1 and mt-auto */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-display text-base font-bold text-[#f0ede6] leading-snug">{currentQuestion.text}</h3>
                    {currentQuestion.example && (
                      <p className="text-[11px] text-[#555] mt-1 italic">{currentQuestion.example}</p>
                    )}
                  </div>
                  
                  {/* Buttons at the bottom */}
                  <div className="mt-4 flex flex-col gap-2 flex-shrink-0">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 0, label: "Nikdy" },
                        { value: 1, label: "Stredne" },
                        { value: 2, label: "Vážne" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(opt.value as AnswerValue)}
                          className={`rounded-xl border-2 bg-[#0a0a0a] py-2.5 text-center transition-all ${
                            answers[currentQuestion.id] === opt.value ? "border-green-400 bg-green-400/5" : "border-[#222] hover:border-[#333]"
                          }`}
                        >
                          <div className={`text-lg font-display font-extrabold ${answers[currentQuestion.id] === opt.value ? "text-green-400" : "text-[#444]"}`}>{opt.value}</div>
                          <div className={`text-[9px] font-semibold uppercase ${answers[currentQuestion.id] === opt.value ? "text-green-400" : "text-[#777]"}`}>{opt.label}</div>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                       {step > 0 ? (
                        <button onClick={() => setStep((s) => s - 1)} className="text-[10px] text-[#555] hover:text-[#f0ede6]">← Späť</button>
                      ) : <div />}
                      <span className="text-[9px] text-[#333]">0 = Nijak · 1 = Stredne · 2 = Vážne</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar Score */}
                <div className="rounded-xl border border-[#222] bg-[#0d0d0d] p-4 flex flex-col h-full">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-4">Skóre</div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-blue-400">A. Nepozornosť</span>
                        <span className="text-[#777] font-mono">{scoreA}/18</span>
                      </div>
                      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 transition-all" style={{ width: `${(scoreA / 18) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-purple-400">B. Impulzivita</span>
                        <span className="text-[#777] font-mono">{scoreB}/18</span>
                      </div>
                      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 transition-all" style={{ width: `${(scoreB / 18) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] text-[#555] mt-auto pt-3 border-t border-[#1e1e1e]">
                    <strong className="text-[#777]">Prah:</strong> ≥4 body = pozitívny screening
                  </div>
                </div>
              </div>
            ) : (
              /* Results Screen (Uses the same flex-1 height) */
              <div className="rounded-2xl border border-[#222] bg-[#0d0d0d] p-6 h-full flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${result.title.includes("Pozitívny") ? "bg-yellow-400/10 text-yellow-500" : "bg-green-400/10 text-green-400"}`}>
                    {result.title.includes("Pozitívny") ? "⚠️" : "✓"}
                  </div>
                  <div>
                    <h3 className={`font-display text-lg font-extrabold ${result.color}`}>{result.title}</h3>
                    <p className="text-[13px] text-[#d0cdc6] mt-1">{result.text}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-3">
                    <div className="text-[10px] font-bold uppercase text-blue-400 mb-1">Nepozornosť</div>
                    <div className="text-2xl font-display font-extrabold text-[#f0ede6]">{scoreA}<span className="text-sm text-[#555]">/18</span></div>
                  </div>
                  <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-3">
                    <div className="text-[10px] font-bold uppercase text-purple-400 mb-1">Impulzivita</div>
                    <div className="text-2xl font-display font-extrabold text-[#f0ede6]">{scoreB}<span className="text-sm text-[#555]">/18</span></div>
                  </div>
                </div>
                
                <div className="flex gap-2.5">
                  <a href="/informacie-o-adhd" className="flex-1 rounded-xl bg-green-400 px-4 py-3 text-center text-[13px] font-bold text-[#0a0a0a] hover:bg-green-300 transition-colors">Zistiť viac o príznakoch →</a>
                  <button onClick={handleReset} className="rounded-xl border border-[#2a2a2a] px-4 py-3 text-[13px] font-semibold text-[#f0ede6] hover:border-[#444] transition-colors">Znova</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}