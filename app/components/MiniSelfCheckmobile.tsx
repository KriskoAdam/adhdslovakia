"use client";

import { useMemo, useState } from "react";
import Nav from "../components/Nav";

export const title = "Online ADHD Test pre dospelých (DIVA screening) | ADHD Slovakia";
export const description = "Otestujte sa pomocou rýchleho indikatívneho screeningového testu pre dospelých vychádzajúceho z diagnostických kritérií DIVA.";

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
  { id: "A3", category: "A", number: 3, text: "Keď niekto s vami hovorí, často ste inými myšlienkami and nepočujete celú vetu?" },
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
    if (!isComplete) return { title: "Test nie je dokončený", text: `Odpovedané ${Object.keys(answers).length}/${questions.length}`, color: "text-[var(--text-muted)]" };
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-300 font-sans">
      <div>
        <Nav />

        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-16 w-full">
          
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl w-full flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/5 blur-3xl pointer-events-none" />
            
            <div className="p-4 sm:p-6 md:p-10 flex-1 flex flex-col">
              
              {/* HLAVIČKA TESTU */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded border border-green-400/25 bg-green-400/10 px-3 py-1 max-w-full">
                    <span className="flex-shrink-0 text-sm">🧠</span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-green-400 truncate">Diagnostická metrika DIVA (Indikatívny screening)</span>
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)] break-words">Test symptómov ADHD u dospelých</h1>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{isComplete ? "Dokončené" : `Otázka ${step + 1} z ${questions.length}`}</div>
                  <div className="text-xs text-green-400 font-mono font-bold">{Math.round((Object.keys(answers).length / questions.length) * 100)}% hotovo</div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-6 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
              </div>

              {/* OBSAH: OTÁZKA ALEBO VÝSLEDOK */}
              <div className="flex-1 flex flex-col justify-center">
                {!isComplete ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
                    
                    {/* Box s otázkou a tlačidlami hneď pod sebou */}
                    <div className="lg:col-span-8 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                      
                      {/* TENTO WRAPPER MÁ PEVNÚ MINIMÁLNU VÝŠKU, KTORÁ ZABRAŇUJE SKÁKANIU OBSAHU */}
                      <div className="min-w-0 min-h-[220px] sm:min-h-[150px] lg:min-h-[140px] flex flex-col justify-start">
                        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold bg-green-400/10 text-green-400 border border-green-400/25 flex-shrink-0">
                            {currentQuestion.category}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">
                            Sekcia: {getCategoryLabel(currentQuestion.category)}
                          </div>
                        </div>
                        
                        <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug break-words hyphens-auto" lang="sk">
                          {currentQuestion.text}
                        </h2>
                        
                        {currentQuestion.example && (
                          <p className="text-[13px] text-[var(--text-secondary)] mt-3 italic bg-[var(--bg-secondary)] p-3 rounded-md border border-[var(--border-color)] leading-relaxed font-light break-words hyphens-auto" lang="sk">
                            {currentQuestion.example}
                          </p>
                        )}
                      </div>

                      {/* TLAČIDLÁ ODPOVEDÍ */}
                      <div className="mt-6 w-full flex-shrink-0">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: 0, label: "Nikdy / zriedka", sub: "0 bodov" },
                            { value: 1, label: "Niekedy / stredne", sub: "1 bod" },
                            { value: 2, label: "Často / vážne", sub: "2 body" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleAnswer(opt.value as AnswerValue)}
                              className={`rounded-md border bg-[var(--bg-secondary)] p-3.5 sm:p-4 text-center transition-all flex flex-col items-center justify-center gap-0.5 group min-w-0 ${
                                answers[currentQuestion.id] === opt.value 
                                  ? "border-green-400 bg-green-400/10" 
                                  : "border-[var(--border-color)] hover:border-green-400/40"
                              }`}
                            >
                              <div className={`text-[13px] sm:text-xs font-bold uppercase tracking-wide break-words w-full ${
                                answers[currentQuestion.id] === opt.value 
                                  ? "text-green-400" 
                                  : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                              }`}>{opt.label}</div>
                              <div className={`text-[10px] font-mono ${
                                answers[currentQuestion.id] === opt.value 
                                  ? "text-green-400/70" 
                                  : "text-[var(--text-muted)]"
                              }`}>{opt.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Spodná navigácia krokov */}
                      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-between items-center gap-4 flex-shrink-0 w-full">
                        {step > 0 ? (
                          <button 
                            onClick={() => setStep((s) => s - 1)} 
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium flex-shrink-0 py-1"
                          >
                            ← Predchádzajúca otázka
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] opacity-40 font-medium select-none pointer-events-none py-1">
                            ← Predchádzajúca otázka
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline text-right break-words">Stupnica: 0 (Nikdy) až 2 (Vážne)</span>
                      </div>
                    </div>

                    {/* Bočný panel s priebežným skóre */}
                    <div className="lg:col-span-4 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 sm:p-6 flex flex-col justify-between">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 truncate">Aktuálny stav bodov</div>
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 gap-2">
                              <span className="text-[var(--text-primary)] font-medium truncate">A. Nepozornosť</span>
                              <span className="text-[var(--text-secondary)] font-mono font-bold flex-shrink-0">{scoreA} <span className="text-[var(--text-muted)]">/ 18 b.</span></span>
                            </div>
                            <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 transition-all" style={{ width: `${(scoreA / 18) * 100}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 gap-2">
                              <span className="text-[var(--text-primary)] font-medium truncate">B. Hyperaktivita</span>
                              <span className="text-[var(--text-secondary)] font-mono font-bold flex-shrink-0">{scoreB} <span className="text-[var(--text-muted)]">/ 18 b.</span></span>
                            </div>
                            <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 transition-all" style={{ width: `${(scoreB / 18) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[var(--text-muted)] mt-6 pt-4 border-t border-[var(--border-color)] leading-relaxed font-light break-words">
                        Hranica klinického podozrenia je dosiahnutie <strong className="text-[var(--text-primary)]">≥ 4 bodov</strong> v ktorejkoľvek sekcii.
                      </div>
                    </div>

                  </div>
                ) : (
                  /* OBRAZOVKA KONEČNÝCH VÝSLEDKOV */
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 md:p-10 flex flex-col justify-between gap-8 max-w-4xl mx-auto w-full min-w-0">
                    <div className="flex flex-col sm:flex-row items-start gap-5 min-w-0">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 border border-[var(--border-color)] bg-[var(--bg-secondary)]`}>
                        {result.title.includes("Pozitívny") ? "⚠️" : "✓"}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-display text-xl sm:text-2xl md:text-3xl font-bold break-words ${result.color}`}>{result.title}</h3>
                        <p className="text-[14px] text-[var(--text-secondary)] mt-2 leading-relaxed font-light break-words">{result.text}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 min-w-0">
                        <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-1 truncate">Sekcia A: Nepozornosť</div>
                        <div className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">{scoreA}<span className="text-base text-[var(--text-muted)] font-light"> / 18 b.</span></div>
                        <p className={`text-xs mt-2 font-medium break-words ${scoreA >= 4 ? "text-yellow-500" : "text-[var(--text-muted)]"}`}>{scoreA >= 4 ? "Skóre indikuje prejavy nepozornosti" : "V normatívnom rozmedzí"}</p>
                      </div>
                      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 min-w-0">
                        <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-1 truncate">Sekcia B: Impulzivita / Hyperaktivita</div>
                        <div className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">{scoreB}<span className="text-base text-[var(--text-muted)] font-light"> / 18 b.</span></div>
                        <p className={`text-xs mt-2 font-medium break-words ${scoreB >= 4 ? "text-yellow-500" : "text-[var(--text-muted)]"}`}>{scoreB >= 4 ? "Skóre indikuje prejavy hyperaktivity" : "V normatívnom rozmedzí"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                      <a href="/informacie-o-adhd" className="flex-1 rounded-md bg-green-400 px-5 py-3 text-center text-[13px] font-semibold text-[#0a0a0a] hover:bg-green-300 transition-colors break-words">Ako postupovať pri diagnostike? →</a>
                      <button onClick={handleReset} className="rounded-md border border-[var(--border-color)] px-5 py-3 text-[13px] font-semibold text-[var(--text-primary)] hover:border-green-400/40 bg-transparent transition-colors break-words">Resetovať a spustiť znova</button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="font-display text-base font-extrabold text-[var(--text-primary)]">
          ADHD<span className="text-green-400">.</span>Slovakia
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">© 2026 ADHD Slovakia · Orientačný screening</div>
      </footer>
    </div>
  );
}
