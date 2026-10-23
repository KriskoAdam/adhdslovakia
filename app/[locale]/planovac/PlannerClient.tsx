"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import PwaInstallGuide, {
  detectInstallPlatform,
  type InstallPlatform,
} from "../../components/PwaInstallGuide";
import SiteIcon from "../../components/SiteIcon";
import ThemeToggle from "../../components/ThemeToggle";
import styles from "./PlannerClient.module.css";
import fx from "./PlannerFx.module.css";
import * as sfx from "./PlannerFx";

type Locale = "sk" | "en";
type Priority = "gentle" | "important";
type Task = {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
  doneOn?: string; // kedy bola úloha splnená (pre sériu dní)
  bonus?: number; // náhodný bonus XP („kritický zásah“)
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Toast = { id: number; text: string; special: boolean };

const STORAGE_KEY = "adhdslovakia-planner-v1";
const FX_KEY = "adhdslovakia-planner-fx";
const TIMER_DURATION_KEY = "adhdslovakia-planner-timer-minutes";
const DEFAULT_TIMER_MINUTES = 25;
const MIN_TIMER_MINUTES = 1;
const MAX_TIMER_MINUTES = 180;
const WEEKDAYS: Record<Locale, string[]> = {
  sk: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const COPY = {
  sk: {
    back: "ADHD Slovakia",
    app: "Flow",
    apps: "Appky",
    eyebrow: "Tvoj priestor, tvoje tempo",
    intro: "Nemusíš stihnúť všetko. Stačí začať jednou malou vecou.",
    today: "Dnes",
    week: "Tento týždeň",
    tasks: "Úlohy",
    addTitle: "Čo chceš dnes urobiť?",
    placeholder: "Napríklad: odpísať na jeden e-mail",
    add: "Pridať úlohu",
    noTasks: "Zatiaľ tu nič nemusí byť.",
    noTasksHint: "Keď budeš pripravený/á, pridaj jednu drobnú úlohu.",
    allDone: "Na dnes máš hotovo. Dopraj si chvíľu oddychu.",
    important: "Dôležitá",
    gentle: "Bez tlaku",
    time: "Čas (nepovinné)",
    priority: "Ako veľmi to ponáhľa?",
    focus: "Krátke sústredenie",
    focusHint: "Jeden krok. Potom prestávka.",
    start: "Začať",
    timerDuration: "Dĺžka sústredenia",
    minutes: "min",
    pause: "Pozastaviť",
    resume: "Pokračovať",
    reset: "Vynulovať",
    delete: "Odstrániť úlohu",
    progress: "Dnešný postup",
    completed: "splnené",
    install: "Inštalovať",
    installed: "Nainštalované",
    local: "Úlohy sa ukladajú iba v tomto zariadení.",
    previous: "Predchádzajúci týždeň",
    next: "Nasledujúci týždeň",
    todayButton: "Prejsť na dnes",
    date: "Dátum",
  },
  en: {
    back: "ADHD Slovakia",
    app: "Flow",
    apps: "Apps",
    eyebrow: "Your space, at your pace",
    intro:
      "You don’t have to do it all. Starting with one small thing is enough.",
    today: "Today",
    week: "This week",
    tasks: "Tasks",
    addTitle: "What would you like to do?",
    placeholder: "For example: reply to one email",
    add: "Add task",
    noTasks: "Nothing has to be here yet.",
    noTasksHint: "When you’re ready, add one small task.",
    allDone: "You’re done for today. Take a moment to rest.",
    important: "Important",
    gentle: "No pressure",
    time: "Time (optional)",
    priority: "How urgent is it?",
    focus: "A little focus time",
    focusHint: "One step. Then a break.",
    start: "Start",
    timerDuration: "Focus duration",
    minutes: "min",
    pause: "Pause",
    resume: "Continue",
    reset: "Reset",
    delete: "Delete task",
    progress: "Today’s progress",
    completed: "done",
    install: "Install",
    installed: "Installed",
    local: "Your tasks are stored only on this device.",
    previous: "Previous week",
    next: "Next week",
    todayButton: "Go to today",
    date: "Date",
  },
} satisfies Record<Locale, Record<string, string>>;

const FX_COPY = {
  sk: {
    cheers: [
      "Pekne. Každý malý krok sa ráta ✨",
      "Hotovo. Môžeš pokračovať vlastným tempom 🌱",
      "Ďalší krok za tebou ⭐",
      "Všimni si, čo sa ti práve podarilo 💛",
      "Pokrok nemusí byť dokonalý 🚀",
      "Toto sa ti podarilo 🏆",
    ],
    levelUp: (level: number) => `Level ${level}! 🎊`,
    dayDone: "Celý deň hotový! 🏆",
    levelTitles: [
      "Štartér",
      "Iskra",
      "Plamienok",
      "Raketa",
      "Hviezda",
      "Legenda",
    ],
    level: "Level",
    streak: "Séria dní (jeden vynechaný deň ti nevadí)",
    toNext: (n: number) => `${n} XP do ďalšieho levelu`,
    soundOn: "Vypnúť zvuky a vibrácie",
    soundOff: "Zapnúť zvuky a vibrácie",
    timerDoneTitle: "Čas vypršal!",
    timerDoneText: "Skvelá práca. Dopraj si prestávku.",
    timerDoneButton: "Super, idem na pauzu",
  },
  en: {
    cheers: [
      "Nice. Every small step counts ✨",
      "Done. Keep going at your own pace 🌱",
      "Another step behind you ⭐",
      "Notice what you just accomplished 💛",
      "Progress doesn’t need to be perfect 🚀",
      "You did that 🏆",
    ],
    levelUp: (level: number) => `Level ${level}! 🎊`,
    dayDone: "Whole day done! 🏆",
    levelTitles: ["Starter", "Spark", "Flame", "Rocket", "Star", "Legend"],
    level: "Level",
    streak: "Day streak (one missed day is forgiven)",
    toNext: (n: number) => `${n} XP to next level`,
    soundOn: "Turn sounds and vibration off",
    soundOff: "Turn sounds and vibration on",
    timerDoneTitle: "Time’s up!",
    timerDoneText: "Great work. Take a break.",
    timerDoneButton: "Great, break time",
  },
};

function dateKey(date: Date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(local.getDate()).padStart(2, "0")}`;
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(value: string, amount: number) {
  const date = fromDateKey(value);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

function mondayOf(value: string) {
  const date = fromDateKey(value);
  const weekday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - weekday);
  return dateKey(date);
}

function formatDate(
  value: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(
    locale === "sk" ? "sk-SK" : "en-GB",
    options,
  ).format(fromDateKey(value));
}

function makeId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

// ---------- XP, level, séria ----------
const basePoints = (task: Task) => (task.priority === "important" ? 20 : 10);
const xpOf = (list: Task[]) =>
  list.reduce(
    (sum, task) =>
      task.done ? sum + basePoints(task) + (task.bonus ?? 0) : sum,
    0,
  );
const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 40)) + 1;
const levelFloor = (level: number) => 40 * (level - 1) * (level - 1);

function daysBetween(a: string, b: string) {
  return Math.round(
    (fromDateKey(a).getTime() - fromDateKey(b).getTime()) / 86400000,
  );
}

function streakOf(list: Task[], today: string) {
  const days = Array.from(
    new Set(
      list
        .filter((task) => task.done && task.doneOn)
        .map((task) => task.doneOn as string),
    ),
  )
    .sort()
    .reverse();
  if (!days.length || daysBetween(today, days[0]) > 2) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (daysBetween(days[i - 1], days[i]) <= 2) streak++;
    else break;
  }
  return streak;
}

export default function PlannerClient({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const f = FX_COPY[locale];
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<Priority>("gentle");
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIMER_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installPlatform, setInstallPlatform] =
    useState<InstallPlatform>("desktop");
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const comboRef = useRef({ count: 0, at: 0 });

  const timerDone = secondsLeft === 0 && !timerRunning;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setTasks(parsed as Task[]);
      }
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* Storage may be disabled */
      }
    }
    try {
      if (localStorage.getItem(FX_KEY) === "off") {
        setSoundOn(false);
        sfx.setSoundEnabled(false);
      }
    } catch {
      /* Storage may be disabled */
    }
    try {
      const savedTimerMinutes = Number(
        localStorage.getItem(TIMER_DURATION_KEY),
      );
      if (
        Number.isInteger(savedTimerMinutes) &&
        savedTimerMinutes >= MIN_TIMER_MINUTES &&
        savedTimerMinutes <= MAX_TIMER_MINUTES
      ) {
        setTimerMinutes(savedTimerMinutes);
        setSecondsLeft(savedTimerMinutes * 60);
      }
    } catch {
      /* Storage may be disabled */
    }
    setReady(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/planner-sw.js").catch(() => undefined);
    }

    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const isStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    setIsInstalled(isStandalone());
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => setIsInstalled(isStandalone());
    window.addEventListener("beforeinstallprompt", handleInstall);
    window.addEventListener("appinstalled", handleInstalled);
    standaloneQuery.addEventListener("change", handleDisplayModeChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        /* Storage full */
      }
    }
  }, [tasks, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(TIMER_DURATION_KEY, String(timerMinutes));
    } catch {
      /* Storage may be disabled */
    }
  }, [timerMinutes, ready]);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((remaining) => {
        if (remaining <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!timerDone) return;
    sfx.playBell();
    sfx.haptic([200, 100, 200, 100, 400]);
    sfx.confetti(window.innerWidth / 2, window.innerHeight / 3, 60, 1.5);
    const repeat = window.setInterval(() => {
      sfx.playBell();
      sfx.haptic([200, 100, 200]);
    }, 10000);
    return () => window.clearInterval(repeat);
  }, [timerDone]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const todayKey = ready ? dateKey(new Date()) : "";
  const weekStart = selectedDate ? mondayOf(selectedDate) : "";
  const weekDays = useMemo(
    () =>
      weekStart
        ? Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
        : [],
    [weekStart],
  );
  const dayTasks = tasks
    .filter((task) => task.date === selectedDate)
    .sort(
      (a, b) =>
        Number(a.done) - Number(b.done) ||
        (a.time || "99:99").localeCompare(b.time || "99:99") ||
        a.createdAt - b.createdAt,
    );
  const completedCount = dayTasks.filter((task) => task.done).length;
  const activeCount = dayTasks.length - completedCount;

  const xp = xpOf(tasks);
  const level = levelOf(xp);
  const levelStart = levelFloor(level);
  const levelEnd = levelFloor(level + 1);
  const levelPct = Math.round(
    ((xp - levelStart) / (levelEnd - levelStart)) * 100,
  );
  const streak = ready ? streakOf(tasks, dateKey(new Date())) : 0;

  const showToast = (text: string, special = false) =>
    setToast({ id: Date.now(), text, special });

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedTitle = title.trim();
    if (!cleanedTitle || !selectedDate) return;
    const submit = event.currentTarget.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    const rect = submit?.getBoundingClientRect();
    const newTask: Task = {
      id: makeId(),
      title: cleanedTitle,
      date: selectedDate,
      time,
      priority,
      done: false,
      createdAt: Date.now(),
    };
    setTasks((previous) => [...previous, newTask]);
    setJustAddedId(newTask.id);
    window.setTimeout(() => setJustAddedId(null), 600);
    sfx.playAdd();
    sfx.haptic(15);
    if (rect)
      sfx.confetti(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        10,
        0.5,
      );
    setTitle("");
    setTime("");
    setPriority("gentle");
  };

  const toggleTask = (
    task: Task,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const completing = !task.done;

    const bonus = task.bonus;
    const updated: Task = {
      ...task,
      done: completing,
      doneOn: completing ? dateKey(new Date()) : undefined,
      bonus,
    };
    const next = tasks.map((item) => (item.id === task.id ? updated : item));
    setTasks(next);

    if (!completing) {
      comboRef.current = { count: 0, at: 0 };
      sfx.playUncomplete();
      sfx.haptic(10);
      return;
    }

    const now = Date.now();
    const combo =
      now - comboRef.current.at < 120000 ? comboRef.current.count + 1 : 1;
    comboRef.current = { count: combo, at: now };

    const gained = basePoints(task) + (bonus ?? 0);
    const dayFinished = next
      .filter((item) => item.date === task.date)
      .every((item) => item.done);
    const leveledUp = levelOf(xpOf(next)) > levelOf(xpOf(tasks));

    const milestone = combo >= 3;
    sfx.confetti(x, y, milestone ? 36 : 18, milestone ? 1.15 : 0.85);
    sfx.playComplete(combo);
    sfx.haptic(milestone ? [18, 40, 18] : 18);

    if (dayFinished || leveledUp) {
      window.setTimeout(() => {
        sfx.playFanfare();
        sfx.haptic([40, 60, 40, 60, 120]);
        sfx.confetti(window.innerWidth / 2, window.innerHeight / 3, 90, 2);
      }, 350);
    }

    const comboText = combo >= 3 ? ` · 🔥 x${combo}` : "";
    if (leveledUp)
      showToast(`${f.levelUp(levelOf(xpOf(next)))} +${gained} XP`, true);
    else if (dayFinished) showToast(`${f.dayDone} +${gained} XP`, true);
    else
      showToast(
        `${f.cheers[(combo - 1) % f.cheers.length]} +${gained} XP${comboText}`,
      );
  };

  const deleteTask = (id: string) => {
    sfx.playRemove();
    sfx.haptic(12);
    setRemovingId(id);
    window.setTimeout(() => {
      setTasks((previous) => previous.filter((task) => task.id !== id));
      setRemovingId(null);
    }, 220);
  };

  const toggleTimer = () => {
    if (timerRunning) sfx.playTick();
    else sfx.playStart();
    sfx.haptic(15);
    setTimerRunning((running) => !running);
  };

  const dismissTimer = () => setSecondsLeft(timerMinutes * 60);

  const updateTimerDuration = (value: number) => {
    if (
      !Number.isInteger(value) ||
      value < MIN_TIMER_MINUTES ||
      value > MAX_TIMER_MINUTES
    ) {
      return;
    }
    setTimerMinutes(value);
    if (!timerRunning) setSecondsLeft(value * 60);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sfx.setSoundEnabled(next);
    try {
      localStorage.setItem(FX_KEY, next ? "on" : "off");
    } catch {
      /* Storage disabled */
    }
    if (next) sfx.playTick();
  };

  const handleFxClick = (event: ReactMouseEvent<HTMLElement>) => {
    sfx.unlockAudio();
    const button = (event.target as HTMLElement).closest("button");
    if (button && !button.hasAttribute("data-fx")) {
      sfx.playTick();
      sfx.haptic(8);
    }
  };

  const install = async () => {
    if (!installPrompt) {
      setInstallPlatform(detectInstallPlatform());
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const formatTimer = `${String(Math.floor(secondsLeft / 60)).padStart(
    2,
    "0",
  )}:${String(secondsLeft % 60).padStart(2, "0")}`;

  if (!ready) {
    return (
      <main className={styles.loading} aria-label={t.app}>
        <span className={styles.brandText}>
          ADHD<span>.</span>Slovakia
        </span>
      </main>
    );
  }

  return (
    <main className={`${styles.app} ${fx.root}`} onClickCapture={handleFxClick}>
      {toast && (
        <div
          key={toast.id}
          className={`${fx.toast} ${toast.special ? fx.toastSpecial : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}

      {timerDone && (
        <div
          className={fx.overlay}
          role="alertdialog"
          aria-modal="true"
          aria-label={f.timerDoneTitle}
        >
          <div className={fx.overlayCard}>
            <span className={fx.overlayEmoji} aria-hidden="true">
              ⏰
            </span>
            <h2>{f.timerDoneTitle}</h2>
            <p>{f.timerDoneText}</p>
            <button
              type="button"
              data-fx="own"
              className={fx.overlayButton}
              onClick={dismissTimer}
              autoFocus
            >
              {f.timerDoneButton}
            </button>
          </div>
        </div>
      )}

      <header className={styles.header}>
    <a className={styles.brand} href={`/${locale}`} aria-label={t.back}>
      <span className={styles.brandText}>
        ADHD<span>.</span>Slovakia
      </span>
    </a>

    <button
      type="button"
      data-fx="own"
      className={fx.soundToggle}
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? f.soundOn : f.soundOff}
    >
      {soundOn ? (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>

    <ThemeToggle />

    {isInstalled ? (
      <span className={styles.installedBadge}>
        <SiteIcon name="check" className={styles.icon} />
        {t.installed}
      </span>
    ) : (
      <button
        className={styles.installButton}
        onClick={install}
        type="button"
      >
        <SiteIcon name="arrowDown" className={styles.icon} />
        {t.install}
      </button>
    )}
      </header>

      <div className={styles.shell}>
        {showInstallHelp && (
          <PwaInstallGuide
            locale={locale}
            platform={installPlatform}
            onClose={() => setShowInstallHelp(false)}
          />
        )}

        <section className={styles.welcome} aria-labelledby="planner-title">
          <div className={styles.welcomeCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              {t.eyebrow}
            </p>
            <h1 id="planner-title">
              {t.app}
              <span className={styles.headingPeriod}>.</span>
            </h1>
            <p className={styles.intro}>{t.intro}</p>
          </div>
          <div className={styles.welcomeDecoration} aria-hidden="true">
            <span className={styles.orbitOne} />
            <span className={styles.orbitTwo} />
            <span className={styles.sun}>
              <SiteIcon name="sparkles" />
            </span>
            <span className={styles.decorLabel}>
              one thing
              <br />
              at a time
            </span>
          </div>
        </section>

        <section className={styles.weekSection} aria-label={t.week}>
          <div className={styles.weekHeading}>
            <div>
              <p className={styles.sectionEyebrow}>{t.week}</p>
              <h2>
                {weekStart
                  ? formatDate(weekStart, locale, {
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </h2>
            </div>
            <div className={styles.weekControls}>
              <button
                type="button"
                onClick={() => setSelectedDate((date) => addDays(date, -7))}
                aria-label={t.previous}
              >
                <SiteIcon name="arrowLeft" className={styles.icon} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate((date) => addDays(date, 7))}
                aria-label={t.next}
              >
                <SiteIcon name="arrowRight" className={styles.icon} />
              </button>
              {selectedDate !== todayKey && (
                <button
                  type="button"
                  className={styles.todayButton}
                  onClick={() => setSelectedDate(todayKey)}
                >
                  {t.todayButton}
                </button>
              )}
            </div>
          </div>
          <div className={styles.weekGrid}>
            {weekDays.map((day, index) => {
              const count = tasks.filter(
                (task) => task.date === day && !task.done,
              ).length;
              const isSelected = day === selectedDate;
              const isToday = day === todayKey;
              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.dayButton} ${
                    isSelected ? styles.daySelected : ""
                  } ${isToday && !isSelected ? styles.dayToday : ""}`}
                  onClick={() => setSelectedDate(day)}
                  aria-pressed={isSelected}
                >
                  <span className={styles.dayName}>
                    {WEEKDAYS[locale][index]}
                  </span>
                  <span className={styles.dayNumber}>
                    {formatDate(day, locale, { day: "numeric" })}
                  </span>
                  <span
                    className={styles.dayDot}
                    aria-label={`${count} ${t.tasks.toLowerCase()}`}
                  >
                    {count > 0 ? <i /> : <i className={styles.emptyDot} />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.tasksPanel} aria-labelledby="tasks-title">
            <div className={styles.tasksHeading}>
              <div>
                <p className={styles.sectionEyebrow}>
                  {selectedDate === todayKey
                    ? t.today
                    : formatDate(selectedDate, locale, { weekday: "long" })}
                </p>
                <h2 id="tasks-title">
                  {t.tasks}
                  <span className={styles.taskCount}>{activeCount}</span>
                </h2>
              </div>
              <p className={styles.dateLabel}>
                {formatDate(selectedDate, locale, {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <form className={styles.addForm} onSubmit={addTask}>
              <label className={styles.srOnly} htmlFor="new-task">
                {t.addTitle}
              </label>
              <div className={styles.addInputRow}>
                <input
                  id="new-task"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t.placeholder}
                  maxLength={120}
                  required
                />
                <button
                  type="submit"
                  data-fx="own"
                  disabled={!title.trim()}
                  aria-label={t.add}
                >
                  <SiteIcon name="plus" className={styles.icon} />
                </button>
              </div>
              <div className={styles.formOptions}>
                <label className={styles.timeInput}>
                  <SiteIcon name="clock" className={styles.icon} />
                  <span className={styles.srOnly}>{t.time}</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    aria-label={t.time}
                  />
                </label>
                <label className={styles.prioritySelect}>
                  <span className={styles.srOnly}>{t.priority}</span>
                  <select
                    value={priority}
                    onChange={(event) => {
                      sfx.playTick();
                      setPriority(event.target.value as Priority);
                    }}
                  >
                    <option value="gentle">{t.gentle}</option>
                    <option value="important">{t.important}</option>
                  </select>
                </label>
              </div>
            </form>

            {dayTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIllustration} aria-hidden="true">
                  <SiteIcon name="sparkles" />
                  <i />
                </div>
                <p className={styles.emptyTitle}>{t.noTasks}</p>
                <p>{t.noTasksHint}</p>
              </div>
            ) : (
              <ul className={styles.taskList}>
                {dayTasks.map((task) => (
                  <li
                    key={task.id}
                    className={[
                      styles.taskRow,
                      task.done ? styles.taskDone : "",
                      task.id === justAddedId ? fx.pop : "",
                      task.id === removingId ? fx.out : "",
                    ].join(" ")}
                  >
                    <button
                      className={`${styles.checkButton} ${
                        task.done ? fx.checkDone : ""
                      }`}
                      type="button"
                      data-fx="own"
                      onClick={(event) => toggleTask(task, event)}
                      aria-label={`${
                        task.done
                          ? locale === "sk"
                            ? "Označiť ako nesplnené"
                            : "Mark as not done"
                          : locale === "sk"
                          ? "Označiť ako splnené"
                          : "Mark as done"
                      }: ${task.title}`}
                      aria-pressed={task.done}
                    >
                      {task.done && (
                        <SiteIcon name="check" className={styles.icon} />
                      )}
                    </button>
                    <div className={styles.taskBody}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskMeta}>
                        {task.time && <span>{task.time}</span>}
                        {task.priority === "important" && (
                          <span className={styles.importantChip}>
                            {t.important}
                          </span>
                        )}
                      </span>
                    </div>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      data-fx="own"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`${t.delete}: ${task.title}`}
                    >
                      <SiteIcon name="close" className={styles.icon} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className={styles.sideColumn}>
            <section className={fx.xpCard} aria-label={f.level}>
              <div className={fx.xpTop}>
                <span className={fx.levelBadge} aria-hidden="true">
                  {level}
                </span>
                <div className={fx.xpInfo}>
                  <p className={fx.xpTitle}>
                    {f.level} {level} ·{" "}
                    {
                      f.levelTitles[
                        Math.min(level - 1, f.levelTitles.length - 1)
                      ]
                    }
                  </p>
                  <p className={fx.xpSub}>{xp} XP</p>
                </div>
                <span
                  className={fx.streak}
                  title={f.streak}
                  aria-label={`${f.streak}: ${streak}`}
                >
                  {" "}
                  {streak}
                </span>
              </div>
              <div
                className={fx.xpTrack}
                role="progressbar"
                aria-label={f.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={levelPct}
              >
                <span style={{ width: `${levelPct}%` }} />
              </div>
              <p className={fx.xpSub}>{f.toNext(levelEnd - xp)}</p>
            </section>

            <section className={styles.progressCard} aria-label={t.progress}>
              <div className={styles.progressHeading}>
                <div>
                  <p className={styles.sectionEyebrow}>{t.progress}</p>
                  <p className={styles.progressCount}>
                    {completedCount}
                    <span> / {dayTasks.length}</span>
                  </p>
                </div>
                <div className={styles.progressFlower} aria-hidden="true">
                  <SiteIcon name="sparkles" />
                </div>
              </div>
              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-label={t.progress}
                aria-valuemin={0}
                aria-valuemax={dayTasks.length || 1}
                aria-valuenow={completedCount}
              >
                <span
                  className={fx.progressFill}
                  style={{
                    width: `${
                      dayTasks.length
                        ? (completedCount / dayTasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className={styles.progressCaption}>
                {dayTasks.length && completedCount === dayTasks.length
                  ? t.allDone
                  : `${completedCount} ${t.completed}`}
              </p>
            </section>

            <section className={styles.focusCard}>
              <div className={styles.focusIcon} aria-hidden="true">
                <SiteIcon name="target" />
              </div>
              <p className={styles.focusEyebrow}>{t.focus}</p>
              <h2>{formatTimer}</h2>
              <p className={styles.focusHint}>{t.focusHint}</p>
              <label className={styles.timerDuration} htmlFor="focus-duration">
                <span>{t.timerDuration}</span>
                <span className={styles.timerDurationInput}>
                  <input
                    id="focus-duration"
                    type="number"
                    min={MIN_TIMER_MINUTES}
                    max={MAX_TIMER_MINUTES}
                    step={1}
                    value={timerMinutes}
                    disabled={timerRunning}
                    onChange={(event) =>
                      updateTimerDuration(Number(event.currentTarget.value))
                    }
                    aria-label={t.timerDuration}
                  />
                  <span>{t.minutes}</span>
                </span>
              </label>
              <div className={styles.timerControls}>
                <button
                  type="button"
                  data-fx="own"
                  className={styles.timerMain}
                  onClick={toggleTimer}
                >
                  {timerRunning
                    ? t.pause
                    : secondsLeft === timerMinutes * 60
                    ? `${t.start} ${timerMinutes} ${t.minutes}`
                    : t.resume}
                </button>
                <button
                  type="button"
                  className={styles.timerReset}
                  onClick={() => {
                    setTimerRunning(false);
                    setSecondsLeft(timerMinutes * 60);
                  }}
                  aria-label={t.reset}
                >
                  <SiteIcon name="rotate" className={styles.icon} />
                </button>
              </div>
            </section>

            <p className={styles.privacyNote}>
              <SiteIcon name="home" className={styles.icon} />
              {t.local}
            </p>
          </aside>
        </div>

        <footer className={styles.footer}>
          <span>ADHD Slovakia</span>
          <span aria-hidden="true">·</span>
          <span>{t.eyebrow}</span>
        </footer>
      </div>
    </main>
  );
}
