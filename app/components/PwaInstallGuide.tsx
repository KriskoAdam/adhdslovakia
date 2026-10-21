"use client";

import { useEffect } from "react";
import styles from "./PwaInstallGuide.module.css";

export type InstallPlatform = "ios" | "android" | "desktop";

export function detectInstallPlatform(): InstallPlatform {
  const agent = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(agent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(agent)) return "android";
  return "desktop";
}

export default function PwaInstallGuide({ locale, platform, onClose, appName = "ADHD Flow" }: { locale: "sk" | "en"; platform: InstallPlatform; onClose: () => void; appName?: string }) {
  const english = locale === "en";
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const content = {
    ios: {
      title: english ? "Install on iPhone or iPad" : "Inštalácia na iPhone alebo iPade",
      note: english ? "This needs to be done in Safari." : "Tento postup funguje v prehliadači Safari.",
      steps: english
        ? ["Open this page in Safari (if it opened in another app, use Share → Open in Safari).", "Tap the Share button — the square with an arrow pointing up.", "Scroll down and tap “Add to Home Screen”.", "Tap “Add” in the top-right corner. The app icon will appear on your Home Screen."]
        : ["Otvor túto stránku v Safari (ak sa otvorila v inej aplikácii, cez Zdieľať ju otvor v Safari).", "Ťukni na tlačidlo Zdieľať — štvorec so šípkou nahor.", "Posuň ponuku nižšie a vyber „Pridať na plochu“.", "Vpravo hore ťukni na „Pridať“. Ikonu nájdeš na ploche."]
    },
    android: {
      title: english ? "Install on Android" : "Inštalácia na Androide",
      note: english ? "Chrome gives the simplest installation." : "Najjednoduchšie to pôjde v prehliadači Chrome.",
      steps: english
        ? ["Open this page in Chrome.", "Tap the three dots ⋮ in the top-right corner.", "Choose “Install app” or “Add to Home screen”.", "Confirm with “Install” or “Add”. The icon will appear with your other apps."]
        : ["Otvor túto stránku v prehliadači Chrome.", "Vpravo hore ťukni na tri bodky ⋮.", "Vyber „Inštalovať aplikáciu“ alebo „Pridať na plochu“.", "Potvrď „Inštalovať“ alebo „Pridať“. Ikonu potom nájdeš medzi aplikáciami."]
    },
    desktop: {
      title: english ? "Install on your computer" : "Inštalácia v počítači",
      note: english ? "Use a current version of Chrome or Edge." : "Použi aktuálny Chrome alebo Edge.",
      steps: english
        ? ["Open this page in Chrome or Edge.", "Look for the install icon in the address bar, or open the browser menu ⋮.", `Choose “Install ${appName}” or “Install app”.`, "Confirm the installation. You can then open the app from your desktop or app launcher."]
        : ["Otvor túto stránku v prehliadači Chrome alebo Edge.", "V adresnom riadku nájdi ikonu inštalácie alebo otvor menu prehliadača ⋮.", `Vyber „Inštalovať ${appName}“ alebo „Inštalovať aplikáciu“.`, "Potvrď inštaláciu. Potom appku otvoríš z plochy alebo zo zoznamu aplikácií."]
    }
  }[platform];

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="install-guide-title">
        <div className={styles.dialogTop}>
          <span className={styles.guideIcon} aria-hidden="true">↓</span>
          <button autoFocus type="button" className={styles.closeButton} onClick={onClose} aria-label={english ? "Close installation guide" : "Zavrieť návod na inštaláciu"}>×</button>
        </div>
        <p className={styles.eyebrow}>{english ? "A QUICK SETUP" : "RÝCHLE NASTAVENIE"}</p>
        <h2 id="install-guide-title">{content.title}</h2>
        <p className={styles.note}>{content.note}</p>
        <ol className={styles.steps}>{content.steps.map((step) => <li key={step}><span>{step}</span></li>)}</ol>
        <p className={styles.tip}>{english ? "Can’t find the option? Make sure you’re using the browser named above, then reload this page." : "Možnosť nevidíš? Skontroluj, či používaš uvedený prehliadač, a potom stránku obnov."}</p>
        <button type="button" className={styles.doneButton} onClick={onClose}>{english ? "Got it" : "Rozumiem"}</button>
      </section>
    </div>
  );
}
