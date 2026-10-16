"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

export type PrivacyConsent = { analytics: boolean; ads: boolean; external: boolean };
export const CONSENT_KEY = "adhd-privacy-consent-v1";
export const CONSENT_EVENT = "adhd-privacy-consent-change";

type Props = { locale: "sk" | "en" };

export default function CookieConsent({ locale }: Props) {
  const en = locale === "en";
  const [consent, setConsent] = useState<PrivacyConsent | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PrivacyConsent>({ analytics: false, ads: false, external: false });

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(CONSENT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as PrivacyConsent;
          setConsent(parsed);
          setDraft(parsed);
        }
      } catch {
        setConsent({ analytics: false, ads: false, external: false });
      }
    });
    const reopen = () => setEditing(true);
    window.addEventListener("open-privacy-settings", reopen);
    return () => window.removeEventListener("open-privacy-settings", reopen);
  }, []);

  const save = (value: PrivacyConsent) => {
    setConsent(value);
    setDraft(value);
    setEditing(false);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  };

  return (
    <>
      {consent?.ads && (
        <Script id="google-adsense" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6150590591009223" crossOrigin="anonymous" strategy="afterInteractive" />
      )}
      {consent?.analytics && <Analytics />}
      {consent && <button type="button" onClick={() => { setDraft(consent); setEditing(true); }} className="privacy-settings-trigger">
        {en ? "Privacy settings" : "Nastavenia súkromia"}
      </button>}
      {(consent === null || editing) && (
        <section className="privacy-consent" role="dialog" aria-modal="false" aria-labelledby="privacy-consent-title">
          <h2 id="privacy-consent-title">{en ? "Your privacy choices" : "Vaše nastavenia súkromia"}</h2>
          <p>{en ? "We use necessary storage for site functions. With your permission, we also use analytics, advertising and the external comments service. You can change your choice at any time." : "Nevyhnutné úložisko používame na fungovanie stránky. So súhlasom používame aj analytiku, reklamu a externú službu komentárov. Voľbu môžete kedykoľvek zmeniť."}</p>
          <a href={`/${locale}/ochrana-sukromia`}>{en ? "Privacy and cookies policy" : "Ochrana súkromia a cookies"}</a>
          {editing && (
            <div className="privacy-options">
              <label><input type="checkbox" checked disabled /> {en ? "Necessary (always active)" : "Nevyhnutné (vždy aktívne)"}</label>
              <label><input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })} /> {en ? "Analytics (Vercel Analytics)" : "Analytika (Vercel Analytics)"}</label>
              <label><input type="checkbox" checked={draft.ads} onChange={(e) => setDraft({ ...draft, ads: e.target.checked })} /> {en ? "Advertising (Google AdSense)" : "Reklama (Google AdSense)"}</label>
              <label><input type="checkbox" checked={draft.external} onChange={(e) => setDraft({ ...draft, external: e.target.checked })} /> {en ? "External comments (Giscus/GitHub)" : "Externé komentáre (Giscus/GitHub)"}</label>
              <button type="button" onClick={() => save(draft)} className="privacy-button privacy-primary">{en ? "Save choices" : "Uložiť výber"}</button>
            </div>
          )}
          {!editing ? (
            <div className="privacy-actions">
              <button type="button" onClick={() => save({ analytics: false, ads: false, external: false })} className="privacy-button">{en ? "Reject optional" : "Odmietnuť voliteľné"}</button>
              <button type="button" onClick={() => setEditing(true)} className="privacy-button">{en ? "Choose" : "Nastaviť"}</button>
              <button type="button" onClick={() => save({ analytics: true, ads: true, external: true })} className="privacy-button">{en ? "Accept all" : "Prijať všetko"}</button>
            </div>
          ) : (
            <button type="button" onClick={() => setEditing(false)} className="privacy-button">{en ? "Cancel" : "Zrušiť"}</button>
          )}
        </section>
      )}
    </>
  );
}
