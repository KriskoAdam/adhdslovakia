"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import PwaInstallGuide, { detectInstallPlatform, type InstallPlatform } from "../../components/PwaInstallGuide";
import SiteIcon from "../../components/SiteIcon";
import ThemeToggle from "../../components/ThemeToggle";
import { answerLabels, quizLevels, type QuizLocale } from "./quiz-data";
import styles from "./QuizClient.module.css";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Progress = { started: boolean; level: number; question: number; score: number; streak: number; selected: number | null; finished: boolean };
const STORAGE_KEY = "adhdslovakia-quiz-v1";
const SOUND_KEY = "adhdslovakia-quiz-sound";
const initialProgress: Progress = { started: false, level: 0, question: 0, score: 0, streak: 0, selected: null, finished: false };
const formatPoints = (value: number, locale: QuizLocale) => {
  if (locale === "en") return `${value} ${value === 1 ? "point" : "points"}`;
  return `${value} ${value === 1 ? "bod" : value > 1 && value < 5 ? "body" : "bodov"}`;
};

const text = {
  sk: {
    brand: "ADHD Slovakia", appName: "ADHD Quiz", back: "Späť na web", soundOn: "Vypnúť zvuky", soundOff: "Zapnúť zvuky",
    install: "Inštalovať", installed: "Nainštalované", eyebrow: "VEDOMOSTI BEZ SÚDENIA", title: "ADHD bez mýtov.", subtitle: "100 otázok. 5 levelov. Viac porozumenia — bez stopiek a bez tlaku.", start: "Poďme na to", continue: "Pokračovať v kvíze", tagline: "Každý mozog funguje trochu inak. Tu sa učíme, nie skúšame.",
    level: "LEVEL", of: "z", question: "Otázka", streak: "séria", choose: "Vyber najpresnejšiu odpoveď", correct: "Presne tak!", incorrect: "Dobrá snaha!", correctAnswer: "Správna odpoveď:", next: "Ďalšia otázka", nextLevel: "Dokončiť level", finish: "Pozrieť výsledok", levelDone: "Level dokončený!", keepGoing: "Každá odpoveď je ďalší kúsok skladačky.",
    finalEyebrow: "TVOJA CESTA K POROZUMENIU", finalTitle: "Dokázal/a si to!", result: "Tvoje skóre", outOf: "zo 100", restart: "Začať odznova", site: "Späť na ADHD Slovakia", share: "Toto je vzdelávací kvíz, nie diagnostický test.",
    ranks: ["Začiatok zvedavosti", "Lovec mýtov", "Objaviteľ ADHD", "Mozog v obraze", "ADHD sprievodca"],
    feedback: ["Každá nová informácia sa počíta. Skús ďalšiu!", "Už máš dobrý základ. Ideš ďalej!", "Pekná práca — tvoj prehľad rastie!", "Výborne! Mýty ti už len tak neprejdú.", "Skvelé skóre. Šíriš viac porozumenia!"],
    installMessage: "Kvíz je pripravený v tvojom zariadení.", soundLabel: "Zvukové efekty",
  },
  en: {
    brand: "ADHD Slovakia", appName: "ADHD Quiz", back: "Back to website", soundOn: "Turn sounds off", soundOff: "Turn sounds on",
    install: "Install", installed: "Installed", eyebrow: "LEARN WITHOUT JUDGEMENT", title: "ADHD, beyond the myths.", subtitle: "100 questions. 5 levels. More understanding — no timer, no pressure.", start: "Let's play", continue: "Continue quiz", tagline: "Every brain works a little differently. This is about learning, not testing.",
    level: "LEVEL", of: "of", question: "Question", streak: "streak", choose: "Choose the most accurate answer", correct: "Exactly right!", incorrect: "Nice try!", correctAnswer: "The best answer:", next: "Next question", nextLevel: "Complete level", finish: "See your result", levelDone: "Level complete!", keepGoing: "Every answer is another piece of the puzzle.",
    finalEyebrow: "YOUR JOURNEY TO UNDERSTANDING", finalTitle: "You did it!", result: "Your score", outOf: "out of 100", restart: "Start over", site: "Back to ADHD Slovakia", share: "This is an educational quiz, not a diagnostic test.",
    ranks: ["Curious beginner", "Myth buster", "ADHD explorer", "Brain-wise", "ADHD guide"],
    feedback: ["Every new fact counts. Try the next one!", "You have a good foundation. Keep going!", "Nice work — your understanding is growing!", "Brilliant! Myths won't fool you easily.", "Fantastic score. You're spreading understanding!"],
    installMessage: "The quiz is ready on your device.", soundLabel: "Sound effects",
  },
} satisfies Record<QuizLocale, Record<string, string | string[]>>;

export default function QuizClient({ locale }: { locale: QuizLocale }) {
  const copy = text[locale];
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");
  const [installed, setInstalled] = useState(false);
  const [installMessage, setInstallMessage] = useState("");
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const value = JSON.parse(saved) as Partial<Progress>;
          if (typeof value.level === "number" && value.level >= 0 && value.level < quizLevels.length) {
            setProgress({ ...initialProgress, ...value });
          }
        }
        setSoundOn(localStorage.getItem(SOUND_KEY) !== "off");
      } catch { /* Keep the quiz usable when storage is unavailable. */ }
      setInstalled(window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
      setReady(true);
    });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/planner-sw.js").catch(() => undefined);
    const onInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); setGuideOpen(false); setInstallMessage(copy.installMessage); };
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => { cancelled = true; window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("appinstalled", onInstalled); };
  }, [copy.installMessage]);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Progress remains available for this session. */ }
    }
  }, [progress, ready]);

  const currentLevel = quizLevels[progress.level];
  const currentQuestion = currentLevel.questions[progress.question];
  const totalAnswered = progress.finished ? 100 : progress.level * 20 + progress.question + (progress.selected === null ? 0 : 1);
  const feedbackRank = Math.min(4, Math.floor(progress.score / 20));
  const correct = progress.selected === currentQuestion?.correct;
  const answerOptions = useMemo(() => answerLabels[locale], [locale]);

  const playTone = (success: boolean) => {
    if (!soundOn) return;
    try {
      const Context = window.AudioContext;
      if (!Context) return;
      const context = audioRef.current ?? new Context();
      audioRef.current = context;
      if (context.state === "suspended") void context.resume();
      const notes = success ? [523.25, 659.25, 783.99] : [392, 330];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + index * (success ? 0.075 : 0.11);
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(success ? 0.13 : 0.07, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.19);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
      });
      if ("vibrate" in navigator) navigator.vibrate(success ? [18, 28, 30] : 12);
    } catch { /* Audio is optional and may be disabled by the browser. */ }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try { localStorage.setItem(SOUND_KEY, next ? "on" : "off"); } catch { /* Sound still toggles for this session. */ }
    if (next) playTone(true);
  };

  const chooseAnswer = (choice: number) => {
    if (progress.selected !== null || !currentQuestion) return;
    const isCorrect = choice === currentQuestion.correct;
    playTone(isCorrect);
    setProgress((previous) => ({
      ...previous,
      selected: choice,
      score: previous.score + (isCorrect ? 1 : 0),
      streak: isCorrect ? previous.streak + 1 : 0,
    }));
  };

  const advance = useCallback(() => {
    setProgress((previous) => {
      if (previous.question < 19) return { ...previous, question: previous.question + 1, selected: null };
      if (previous.level < 4) return { ...previous, level: previous.level + 1, question: 0, selected: null };
      return { ...previous, finished: true };
    });
  }, []);

  useEffect(() => {
    if (progress.selected === null || !correct) return;
    const timeout = window.setTimeout(advance, 750);
    return () => window.clearTimeout(timeout);
  }, [progress.selected, correct, advance]);

  const startQuiz = () => setProgress((previous) => ({ ...previous, started: true }));
  const restart = () => setProgress({ ...initialProgress, started: true });

  const install = async () => {
    setInstallMessage("");
    if (!installPrompt) { setPlatform(detectInstallPlatform()); setGuideOpen(true); return; }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallMessage(locale === "en" ? "Installing…" : "Inštalujem…");
    setInstallPrompt(null);
  };

  if (!ready) return <main className={styles.loading} aria-label={copy.appName}><span className={styles.loader} /></main>;

  return (
    <main id="main-content" className={styles.app}>
      <div className={styles.ambient} aria-hidden="true"><span /><span /><span /></div>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href={`/${locale}`} aria-label={copy.back}>
            <span className={styles.brandMark} aria-hidden="true">✦</span>
            <span className={styles.brandText}>ADHD<span>.</span>Slovakia</span>
          </a>
          <span className={styles.appBadge}><span className={styles.badgeDot} />{copy.appName}</span>
          <div className={styles.headerActions}>
            <button className={styles.soundButton} type="button" onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? copy.soundOn : copy.soundOff}>
              {soundOn ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/></svg>}
            </button>
            <ThemeToggle />
            {installed ? <span className={styles.installed}><SiteIcon name="check" />{copy.installed}</span> : <button type="button" onClick={install} className={styles.installButton}><SiteIcon name="arrowDown" />{copy.install}</button>}
          </div>
        </header>
        {installMessage && <p className={styles.installMessage} role="status">{installMessage}</p>}

        {!progress.started ? (
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span />{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <p className={styles.subtitle}>{copy.subtitle}</p>
              <p className={styles.tagline}>{copy.tagline}</p>
              <button className={styles.primaryButton} type="button" onClick={startQuiz}>{copy.start}<span aria-hidden="true">↗</span></button>
              <p className={styles.disclaimer}>{copy.share}</p>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={`${styles.orbit} ${styles.orbitOne}`} /><div className={`${styles.orbit} ${styles.orbitTwo}`} />
              <div className={styles.quizGlass}><span className={styles.quizStar}>✦</span><span className={styles.quizQuestion}>?</span><span className={styles.quizSpark}>✧</span></div>
              <span className={styles.floatChip}>{locale === "en" ? "100 questions" : "100 otázok"}</span>
              <span className={`${styles.floatChip} ${styles.floatChipSecond}`}>{locale === "en" ? "5 levels" : "5 levelov"}</span>
            </div>
          </section>
        ) : progress.finished ? (
          <section className={styles.resultCard} aria-live="polite">
            <div className={styles.resultIcon} aria-hidden="true">🏆</div>
            <p className={styles.eyebrow}><span />{copy.finalEyebrow}</p>
            <h1>{copy.finalTitle}</h1>
            <div className={styles.scoreRing} style={{ "--score": `${progress.score}%` } as CSSProperties}><div><strong>{progress.score}</strong><span>/100</span></div></div>
            <p className={styles.scoreLabel}>{copy.result} · {copy.ranks[feedbackRank]}</p>
            <p className={styles.resultMessage}>{copy.feedback[feedbackRank]}</p>
            <div className={styles.resultMeta}><span>✨ 5/5 {locale === "en" ? "levels" : "levelov"}</span><span>🎯 {formatPoints(progress.score, locale)}</span></div>
            <button className={styles.primaryButton} type="button" onClick={restart}>{copy.restart}<span aria-hidden="true">↻</span></button>
            <a className={styles.backLink} href={`/${locale}`}>{copy.site}</a>
            <p className={styles.disclaimer}>{copy.share}</p>
          </section>
        ) : (
          <section className={styles.game}>
            <div className={styles.gameTop}>
              <div><p className={styles.levelEyebrow}>{copy.level} {progress.level + 1} {copy.of} 5 <span>·</span> {currentLevel.title[locale]}</p><h1>{currentLevel.subtitle[locale]}</h1></div>
              <div className={styles.gameTopActions}>
                <div className={styles.scorePill}><span aria-hidden="true">✦</span>{formatPoints(progress.score, locale)}</div>
                <button className={styles.restartButton} type="button" onClick={restart} aria-label={copy.restart} title={copy.restart}><span aria-hidden="true">↻</span></button>
              </div>
            </div>
            <div className={styles.progressTrack} role="progressbar" aria-label={locale === "en" ? "Quiz progress" : "Postup kvízom"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={totalAnswered}><span style={{ width: `${totalAnswered}%` }} /></div>
            <div className={styles.levelTrack} aria-label={locale === "en" ? "Levels" : "Levely"}>{quizLevels.map((level, index) => <div key={level.title.sk} className={`${styles.levelStep} ${index < progress.level ? styles.levelComplete : ""} ${index === progress.level ? styles.levelCurrent : ""}`}><span>{index < progress.level ? "✓" : index + 1}</span><small>{level.title[locale]}</small></div>)}</div>

            <article className={`${styles.questionCard} ${progress.selected !== null ? (correct ? styles.correctCard : styles.incorrectCard) : ""}`}>
              <div className={styles.questionMeta}><span>{copy.question} {progress.question + 1} {copy.of} 20</span>{progress.streak > 1 && <span className={styles.streak}>🔥 {progress.streak} {copy.streak}</span>}</div>
              <div className={styles.questionNumber}>{String(progress.question + 1).padStart(2, "0")}</div>
              <h2>{currentQuestion.statement[locale]}</h2>
              <p className={styles.chooseHint}>{copy.choose}</p>
              <div className={styles.answers}>
                {answerOptions.map((option, index) => {
                  const isSelected = progress.selected === index;
                  const isCorrect = currentQuestion.correct === index;
                  const resultClass = progress.selected === null ? "" : isCorrect ? styles.answerCorrect : isSelected ? styles.answerWrong : styles.answerDim;
                  return <button key={option} type="button" className={`${styles.answer} ${resultClass}`} onClick={() => chooseAnswer(index)} disabled={progress.selected !== null} aria-pressed={isSelected}>
                    <span className={styles.answerLetter}>{String.fromCharCode(65 + index)}</span><span>{option}</span>{progress.selected !== null && isCorrect && <span className={styles.answerCheck}>✓</span>}
                  </button>;
                })}
              </div>
            </article>
            <div className={styles.gameFooter}><span>{copy.keepGoing}</span><span>✦ {formatPoints(progress.score, locale)}</span></div>
            <p className={styles.disclaimer}>{copy.share}</p>
          </section>
        )}
      </div>
      {progress.started && progress.selected !== null && !correct && <div className={styles.feedbackOverlay}>
        <section className={styles.feedbackModal} role="dialog" aria-modal="true" aria-labelledby="answer-feedback-title" aria-describedby="answer-feedback-description">
          <span className={styles.feedbackIcon} aria-hidden="true">💡</span>
          <p className={styles.feedbackEyebrow}>{copy.incorrect}</p>
          <h2 id="answer-feedback-title">{copy.correctAnswer} {answerOptions[currentQuestion.correct]}.</h2>
          <p id="answer-feedback-description" className={styles.feedbackDescription}>{currentQuestion.explanation[locale]}</p>
          <button className={styles.primaryButton} type="button" onClick={advance} autoFocus>{progress.question < 19 ? copy.next : progress.level < 4 ? copy.nextLevel : copy.finish}<span aria-hidden="true">→</span></button>
        </section>
      </div>}
      {guideOpen && <PwaInstallGuide locale={locale} platform={platform} appName={copy.appName} onClose={() => setGuideOpen(false)} />}
    </main>
  );
}
