"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import PwaInstallGuide, { detectInstallPlatform, type InstallPlatform } from "../../components/PwaInstallGuide";
import SiteIcon from "../../components/SiteIcon";
import ThemeToggle from "../../components/ThemeToggle";
import styles from "./PlannerClient.module.css";

type Locale = "sk" | "en";
type Category = "everyday" | "work" | "health" | "rest";
type Priority = "gentle" | "important";
type Task = {
  id: string;
  title: string;
  date: string;
  time: string;
  category: Category;
  priority: Priority;
  done: boolean;
  createdAt: number;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "adhdslovakia-planner-v1";
const WEEKDAYS: Record<Locale, string[]> = {
  sk: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const COPY = {
  sk: {
    back: "ADHD Slovakia", app: "Flow", apps: "Appky", eyebrow: "Tvoj priestor, tvoje tempo",
    intro: "Nemusíš stihnúť všetko. Stačí začať jednou malou vecou.", today: "Dnes",
    week: "Tento týždeň", tasks: "Úlohy", addTitle: "Čo chceš dnes urobiť?",
    placeholder: "Napríklad: odpísať na jeden e-mail", add: "Pridať úlohu",
    noTasks: "Zatiaľ tu nič nemusí byť.", noTasksHint: "Keď budeš pripravený/á, pridaj jednu drobnú úlohu.",
    allDone: "Na dnes máš hotovo. Dopraj si chvíľu oddychu.",
    important: "Dôležitá", gentle: "Bez tlaku", everyday: "Bežné", work: "Práca / škola",
    health: "Zdravie", rest: "Oddych", time: "Čas (nepovinné)", priority: "Ako veľmi to ponáhľa?",
    focus: "Krátke sústredenie", focusHint: "Jeden krok. Potom prestávka.", start: "Začať 25 min",
    pause: "Pozastaviť", resume: "Pokračovať", reset: "Vynulovať", delete: "Odstrániť úlohu",
    progress: "Dnešný postup", completed: "splnené", install: "Inštalovať", installed: "Nainštalované",
    local: "Úlohy sa ukladajú iba v tomto zariadení.", previous: "Predchádzajúci týždeň",
    next: "Nasledujúci týždeň", todayButton: "Prejsť na dnes", date: "Dátum",
  },
  en: {
    back: "ADHD Slovakia", app: "Flow", apps: "Apps", eyebrow: "Your space, at your pace",
    intro: "You don’t have to do it all. Starting with one small thing is enough.", today: "Today",
    week: "This week", tasks: "Tasks", addTitle: "What would you like to do?",
    placeholder: "For example: reply to one email", add: "Add task",
    noTasks: "Nothing has to be here yet.", noTasksHint: "When you’re ready, add one small task.",
    allDone: "You’re done for today. Take a moment to rest.",
    important: "Important", gentle: "No pressure", everyday: "Everyday", work: "Work / study",
    health: "Health", rest: "Rest", time: "Time (optional)", priority: "How urgent is it?",
    focus: "A little focus time", focusHint: "One step. Then a break.", start: "Start 25 min",
    pause: "Pause", resume: "Continue", reset: "Reset", delete: "Delete task",
    progress: "Today’s progress", completed: "done", install: "Install", installed: "Installed",
    local: "Your tasks are stored only on this device.", previous: "Previous week",
    next: "Next week", todayButton: "Go to today", date: "Date",
  },
} satisfies Record<Locale, Record<string, string>>;

function dateKey(date: Date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
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

function formatDate(value: string, locale: Locale, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === "sk" ? "sk-SK" : "en-GB", options).format(fromDateKey(value));
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function PlannerClient({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<Category>("everyday");
  const [priority, setPriority] = useState<Priority>("gentle");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>("desktop");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Hydrate browser-only data after the server-rendered loading state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setTasks(parsed as Task[]);
      }
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled by the browser. */ }
    }
    setReady(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/planner-sw.js").catch(() => undefined);
    }

    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
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
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* Keep the planner usable when storage is full or disabled. */ }
    }
  }, [tasks, ready]);

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

  const todayKey = ready ? dateKey(new Date()) : "";
  const weekStart = selectedDate ? mondayOf(selectedDate) : "";
  const weekDays = useMemo(
    () => weekStart ? Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)) : [],
    [weekStart],
  );
  const dayTasks = tasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.time || "99:99").localeCompare(b.time || "99:99") || a.createdAt - b.createdAt);
  const completedCount = dayTasks.filter((task) => task.done).length;
  const activeCount = dayTasks.length - completedCount;

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedTitle = title.trim();
    if (!cleanedTitle || !selectedDate) return;
    setTasks((previous) => [...previous, {
      id: makeId(), title: cleanedTitle, date: selectedDate, time, category, priority, done: false, createdAt: Date.now(),
    }]);
    setTitle("");
    setTime("");
    setCategory("everyday");
    setPriority("gentle");
  };

  const toggleTask = (id: string) => {
    setTasks((previous) => previous.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  };

  const deleteTask = (id: string) => setTasks((previous) => previous.filter((task) => task.id !== id));

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

  const categoryLabel = (value: Category) => ({
    everyday: t.everyday,
    work: t.work,
    health: t.health,
    rest: t.rest,
  })[value];

  const formatTimer = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  if (!ready) {
    return <main className={styles.loading} aria-label={t.app}><span className={styles.brandText}>ADHD<span>.</span>Slovakia</span></main>;
  }

  return (
    <main className={styles.app}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href={`/${locale}`} aria-label={t.back}>
            <span className={styles.brandText}>ADHD<span>.</span>Slovakia</span>
          </a>
          <ThemeToggle />
          {isInstalled ? (
            <span className={styles.installedBadge}><SiteIcon name="check" className={styles.icon} />{t.installed}</span>
          ) : (
            <button className={styles.installButton} onClick={install} type="button">
              <SiteIcon name="arrowDown" className={styles.icon} /> {t.install}
            </button>
          )}
        </header>

        {showInstallHelp && <PwaInstallGuide locale={locale} platform={installPlatform} onClose={() => setShowInstallHelp(false)} />}

        <section className={styles.welcome} aria-labelledby="planner-title">
          <div className={styles.welcomeCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowDot} />{t.eyebrow}</p>
            <h1 id="planner-title">{t.app}<span className={styles.headingPeriod}>.</span></h1>
            <p className={styles.intro}>{t.intro}</p>
          </div>
          <div className={styles.welcomeDecoration} aria-hidden="true">
            <span className={styles.orbitOne} />
            <span className={styles.orbitTwo} />
            <span className={styles.sun}><SiteIcon name="sparkles" /></span>
            <span className={styles.decorLabel}>one thing<br />at a time</span>
          </div>
        </section>

        <section className={styles.weekSection} aria-label={t.week}>
          <div className={styles.weekHeading}>
            <div>
              <p className={styles.sectionEyebrow}>{t.week}</p>
              <h2>{weekStart ? formatDate(weekStart, locale, { month: "long", year: "numeric" }) : ""}</h2>
            </div>
            <div className={styles.weekControls}>
              <button type="button" onClick={() => setSelectedDate((date) => addDays(date, -7))} aria-label={t.previous}><SiteIcon name="arrowLeft" className={styles.icon} /></button>
              <button type="button" onClick={() => setSelectedDate((date) => addDays(date, 7))} aria-label={t.next}><SiteIcon name="arrowRight" className={styles.icon} /></button>
              {selectedDate !== todayKey && <button type="button" className={styles.todayButton} onClick={() => setSelectedDate(todayKey)}>{t.todayButton}</button>}
            </div>
          </div>
          <div className={styles.weekGrid}>
            {weekDays.map((day, index) => {
              const count = tasks.filter((task) => task.date === day && !task.done).length;
              const isSelected = day === selectedDate;
              const isToday = day === todayKey;
              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.dayButton} ${isSelected ? styles.daySelected : ""} ${isToday && !isSelected ? styles.dayToday : ""}`}
                  onClick={() => setSelectedDate(day)}
                  aria-pressed={isSelected}
                >
                  <span className={styles.dayName}>{WEEKDAYS[locale][index]}</span>
                  <span className={styles.dayNumber}>{formatDate(day, locale, { day: "numeric" })}</span>
                  <span className={styles.dayDot} aria-label={`${count} ${t.tasks.toLowerCase()}`}>
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
                <p className={styles.sectionEyebrow}>{selectedDate === todayKey ? t.today : formatDate(selectedDate, locale, { weekday: "long" })}</p>
                <h2 id="tasks-title">{t.tasks}<span className={styles.taskCount}>{activeCount}</span></h2>
              </div>
              <p className={styles.dateLabel}>{formatDate(selectedDate, locale, { day: "numeric", month: "short" })}</p>
            </div>

            <form className={styles.addForm} onSubmit={addTask}>
              <label className={styles.srOnly} htmlFor="new-task">{t.addTitle}</label>
              <div className={styles.addInputRow}>
                <span className={styles.plusIcon} aria-hidden="true"><SiteIcon name="plus" className={styles.icon} /></span>
                <input
                  id="new-task"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t.placeholder}
                  maxLength={120}
                  required
                />
                <button type="submit" disabled={!title.trim()}>{t.add}</button>
              </div>
              <div className={styles.formOptions}>
                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>{t.tasks}</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
                    <option value="everyday">{t.everyday}</option>
                    <option value="work">{t.work}</option>
                    <option value="health">{t.health}</option>
                    <option value="rest">{t.rest}</option>
                  </select>
                </label>
                <label className={styles.timeInput}>
                  <SiteIcon name="clock" className={styles.icon} />
                  <span className={styles.srOnly}>{t.time}</span>
                  <input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label={t.time} />
                </label>
                <label className={styles.prioritySelect}>
                  <span className={styles.srOnly}>{t.priority}</span>
                  <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
                    <option value="gentle">{t.gentle}</option>
                    <option value="important">{t.important}</option>
                  </select>
                </label>
              </div>
            </form>

            {dayTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIllustration} aria-hidden="true"><SiteIcon name="sparkles" /><i /></div>
                <p className={styles.emptyTitle}>{t.noTasks}</p>
                <p>{t.noTasksHint}</p>
              </div>
            ) : (
              <ul className={styles.taskList}>
                {dayTasks.map((task) => (
                  <li key={task.id} className={`${styles.taskRow} ${task.done ? styles.taskDone : ""}`}>
                    <button
                      className={styles.checkButton}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={`${task.done ? (locale === "sk" ? "Označiť ako nesplnené" : "Mark as not done") : (locale === "sk" ? "Označiť ako splnené" : "Mark as done")}: ${task.title}`}
                      aria-pressed={task.done}
                    >
                      {task.done && <SiteIcon name="check" className={styles.icon} />}
                    </button>
                    <div className={styles.taskBody}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskMeta}>
                        {task.time && <span>{task.time}</span>}
                        <span className={styles.categoryChip}>{categoryLabel(task.category)}</span>
                        {task.priority === "important" && <span className={styles.importantChip}>{t.important}</span>}
                      </span>
                    </div>
                    <button className={styles.deleteButton} type="button" onClick={() => deleteTask(task.id)} aria-label={`${t.delete}: ${task.title}`}><SiteIcon name="close" className={styles.icon} /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className={styles.sideColumn}>
            <section className={styles.progressCard} aria-label={t.progress}>
              <div className={styles.progressHeading}>
                <div>
                  <p className={styles.sectionEyebrow}>{t.progress}</p>
                  <p className={styles.progressCount}>{completedCount}<span> / {dayTasks.length}</span></p>
                </div>
                <div className={styles.progressFlower} aria-hidden="true"><SiteIcon name="sparkles" /></div>
              </div>
              <div className={styles.progressTrack} role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={dayTasks.length || 1} aria-valuenow={completedCount}>
                <span style={{ width: `${dayTasks.length ? (completedCount / dayTasks.length) * 100 : 0}%` }} />
              </div>
              <p className={styles.progressCaption}>{dayTasks.length && completedCount === dayTasks.length ? t.allDone : `${completedCount} ${t.completed}`}</p>
            </section>

            <section className={styles.focusCard}>
              <div className={styles.focusIcon} aria-hidden="true"><SiteIcon name="target" /></div>
              <p className={styles.focusEyebrow}>{t.focus}</p>
              <h2>{formatTimer}</h2>
              <p className={styles.focusHint}>{t.focusHint}</p>
              <div className={styles.timerControls}>
                <button type="button" className={styles.timerMain} onClick={() => setTimerRunning((running) => !running)}>
                  {timerRunning ? t.pause : secondsLeft === 25 * 60 ? t.start : t.resume}
                </button>
                <button type="button" className={styles.timerReset} onClick={() => { setTimerRunning(false); setSecondsLeft(25 * 60); }} aria-label={t.reset}><SiteIcon name="rotate" className={styles.icon} /></button>
              </div>
            </section>

            <p className={styles.privacyNote}><SiteIcon name="home" className={styles.icon} />{t.local}</p>
          </aside>
        </div>

        <footer className={styles.footer}><span>ADHD Slovakia</span><span aria-hidden="true">·</span><span>{t.eyebrow}</span></footer>
      </div>
    </main>
  );
}
