"use client";

import { useEffect, useState } from "react";
import PwaInstallGuide, { detectInstallPlatform, type InstallPlatform } from "../../components/PwaInstallGuide";
import SiteIcon from "../../components/SiteIcon";
import styles from "./AppsPage.module.css";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export default function AppsClient({ locale, appName }: { locale: "sk" | "en"; appName: string }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");
  const [guideOpen, setGuideOpen] = useState(false);
  const [message, setMessage] = useState("");
  const english = locale === "en";

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/planner-sw.js").catch(() => undefined);
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setGuideOpen(false);
      setMessage(english ? `${appName} is ready on your device.` : `${appName} je pripravená v tvojom zariadení.`);
    };
    window.addEventListener("beforeinstallprompt", handleInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [appName, english]);

  const install = async () => {
    setMessage("");
    if (!installPrompt) {
      setPlatform(detectInstallPlatform());
      setGuideOpen(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setMessage(english ? "Installing…" : "Inštalujem…");
    setInstallPrompt(null);
  };

  return (
    <div className={styles.installWrap}>
      <button className={styles.installButton} type="button" onClick={install}>
        <SiteIcon name="arrowDown" className={styles.actionIcon} />{english ? "Install" : "Nainštalovať"}
      </button>
      {message && <p className={styles.installMessage} role="status">{message}</p>}
      {guideOpen && <PwaInstallGuide locale={locale} platform={platform} appName={appName} onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
