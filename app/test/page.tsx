"use client";

import { useMemo, useState } from "react";
import Nav from "../components/Nav";


Title: "Online ADHD Test pre dospelých (DIVA screening) | ADHD Slovakia"
Description: "Otestujte sa pomocou rýchleho indikatívneho screeningového testu pre dospelých vychádzajúceho z diagnostických kritérií DIVA."

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

export default function TestPage() {
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
      if (isPositiveB) parts.push("impulzivita/hyperaktivita");
      return { title: "Pozitívny screening", text: `Dosiahli ste vyššie skóre v kategórii ${parts.join(" a ")}. Toto slúži výhradne ako indikatívne vodítko. Odporúčame výsledky konzultovať s klinickým psychológom alebo psychiatrom.`, color: "text-yellow-500" };
    }
    return { title: "Negatívny screening", text: "Vaše skóre je momentálne pod prahom pre indikatívne podozrenie na ADHD u dospelých.", color: "text-green-400" };
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede6] flex flex-col justify-between">
      <div>
        <Nav />

        {/* CENTROVANÝ BLOK NA CELÚ ŠÍRKU OBRAZOVKY */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 pb-16 w-full">
          
          <div className="relative overflow-hidden rounded-[28px] border border-[#1e1e1e] bg-[#111] shadow-2xl w-full min-h-[520px] flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/5 blur-3xl pointer-events-none" />
            
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
              
              {/* HLAVIČKA TESTU */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e1e] pb-6 mb-6">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1">
                    <span className="text-sm">🧠</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">Diagnostická metrika DIVA (Indikatívny screening)</span>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#f0ede6]">Test symptómov ADHD u dospelých</h1>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{isComplete ? "Dokončené" : `Otázka ${step + 1} z ${questions.length}`}</div>
                  <div className="text-xs text-green-400 font-mono mt-0.5 font-bold">{Math.round((Object.keys(answers).length / questions.length) * 100)}% hotovo</div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-8 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
              </div>

              {/* OBSAH: OTÁZKA ALEBO VÝSLEDOK */}
              <div className="flex-1 flex flex-col justify-center">
                {!isComplete ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Hlavný box s otázkou (Zaberá 8 stĺpcov z 12) */}
                    <div className="lg:col-span-8 rounded-2xl border border-[#222] bg-[#0d0d0d] p-6 md:p-8 flex flex-col justify-between min-h-[250px]">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentQuestion.category === "A" ? "bg-blue-400/10 text-blue-400" : "bg-purple-400/10 text-purple-400"}`}>
                            {currentQuestion.category}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                            Sekcia: {getCategoryLabel(currentQuestion.category)}
                          </div>
                        </div>
                        
                        <h2 className="font-display text-xl md:text-2xl font-bold text-[#f0ede6] leading-snug">{currentQuestion.text}</h2>
                        
                        {currentQuestion.example && (
                          <p className="text-xs md:text-sm text-[#666] mt-3 italic bg-[#111] p-3 rounded-xl border border-[#1a1a1a] leading-relaxed">
                            {currentQuestion.example}
                          </p>
                        )}
                      </div>
                      
                      {/* Spätná navigácia */}
                      <div className="mt-6 pt-4 border-t border-[#161616] flex justify-between items-center">
                        {step > 0 ? (
                          <button onClick={() => setStep((s) => s - 1)} className="text-xs text-[#666] hover:text-[#f0ede6] transition-colors font-medium">← Predchádzajúca otázka</button>
                        ) : <div />}
                        <span className="text-[10px] text-[#444] hidden sm:inline">Stupnica hodnotenia: 0 (Nikdy) až 2 (Vážne)</span>
                      </div>
                    </div>

                    {/* Bočný panel s priebežným skóre (Zaberá 4 stĺpce z 12) */}
                    <div className="lg:col-span-4 rounded-2xl border border-[#222] bg-[#0d0d0d] p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[#555] mb-4">Aktuálny stav bodov</div>
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-blue-400 font-medium">A. Nepozornosť</span>
                              <span className="text-[#888] font-mono font-bold">{scoreA} <span className="text-[#444]">/ 18 b.</span></span>
                            </div>
                            <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400 transition-all" style={{ width: `${(scoreA / 18) * 100}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-purple-400 font-medium">B. Hyperaktivita</span>
                              <span className="text-[#888] font-mono font-bold">{scoreB} <span className="text-[#444]">/ 18 b.</span></span>
                            </div>
                            <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                              <div className="h-full bg-purple-400 transition-all" style={{ width: `${(scoreB / 18) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#555] mt-6 pt-4 border-t border-[#1e1e1e] leading-relaxed">
                        Hranica klinického podozrenia je dosiahnutie <strong className="text-[#888]">≥ 4 bodov</strong> v ktorejkoľvek sekcii.
                      </div>
                    </div>

                  </div>
                ) : (
                  /* OBRAZOVKA KONEČNÝCH VÝSLEDKOV */
                  <div className="rounded-2xl border border-[#222] bg-[#0d0d0d] p-6 md:p-10 flex flex-col justify-between gap-8 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${result.title.includes("Pozitívny") ? "bg-yellow-400/10 text-yellow-500" : "bg-green-400/10 text-green-400"}`}>
                        {result.title.includes("Pozitívny") ? "⚠️" : "✓"}
                      </div>
                      <div>
                        <h3 className={`font-display text-2xl md:text-3xl font-extrabold ${result.color}`}>{result.title}</h3>
                        <p className="text-[15px] text-[#aaa] mt-2 leading-relaxed">{result.text}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-5">
                        <div className="text-xs font-bold uppercase text-blue-400 mb-1">Sekcia A: Nepozornosť</div>
                        <div className="text-4xl font-display font-black text-[#f0ede6]">{scoreA}<span className="text-base text-[#444] font-light"> / 18 b.</span></div>
                        <p className={`text-xs mt-2 font-medium ${scoreA >= 4 ? "text-yellow-500/80" : "text-[#555]"}`}>{scoreA >= 4 ? "Skóre indikuje prejavy nepozornosti" : "V normatívnom rozmedzí"}</p>
                      </div>
                      <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-5">
                        <div className="text-xs font-bold uppercase text-purple-400 mb-1">Sekcia B: Impulzivita / Hyperaktivita</div>
                        <div className="text-4xl font-display font-black text-[#f0ede6]">{scoreB}<span className="text-base text-[#444] font-light"> / 18 b.</span></div>
                        <p className={`text-xs mt-2 font-medium ${scoreB >= 4 ? "text-yellow-500/80" : "text-[#555]"}`}>{scoreB >= 4 ? "Skóre indikuje prejavy hyperaktivity" : "V normatívnom rozmedzí"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                      <a href="/informacie-o-adhd" className="flex-1 rounded-xl bg-green-400 px-6 py-4 text-center text-sm font-bold text-[#0a0a0a] hover:bg-green-300 transition-colors shadow-lg shadow-green-400/10">Ako postupovať pri diagnostike? →</a>
                      <button onClick={handleReset} className="rounded-xl border border-[#2a2a2a] px-6 py-4 text-sm font-semibold text-[#f0ede6] hover:border-[#444] bg-[#0a0a0a] transition-colors">Resetovať a spustiť znova</button>
                    </div>
                  </div>
                )}
              </div>

              {/* INTERAKTÍVNE TLAČIDLÁ SPODNÉHO PANELU (Len počas testu) */}
              {!isComplete && (
                <div className="mt-8 pt-6 border-t border-[#1e1e1e]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 0, label: "Nikdy / zriedka", sub: "0 bodov" },
                      { value: 1, label: "Niekedy / stredne", sub: "1 bod" },
                      { value: 2, label: "Často / vážne", sub: "2 body" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value as AnswerValue)}
                        className={`rounded-xl border-2 bg-[#0a0a0a] p-4 text-center transition-all flex flex-col items-center justify-center gap-1 group ${
                          answers[currentQuestion.id] === opt.value ? "border-green-400 bg-green-400/5" : "border-[#222] hover:border-[#444]"
                        }`}
                      >
                        <div className={`text-xs font-bold uppercase tracking-wide ${answers[currentQuestion.id] === opt.value ? "text-green-400" : "text-[#aaa] group-hover:text-[#fff]"}`}>{opt.label}</div>
                        <div className={`text-[10px] font-mono ${answers[currentQuestion.id] === opt.value ? "text-green-400/70" : "text-[#555]"}`}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 border-t border-[#1e1e1e] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="font-display text-base font-extrabold text-[#444]">
          ADHD<span className="text-green-400/40">.</span>Slovakia
        </div>
        <div className="text-xs text-[#444]">© 2026 ADHD Slovakia · Orientačný screening</div>
      </footer>
    </div>
  );
}
