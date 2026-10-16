"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_KEY, type PrivacyConsent } from "./CookieConsent";

type Props = {
  locale: "sk" | "en";
  translationKey: string;
};

export default function Comments({
  locale,
  translationKey,
}: Props) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}") as Partial<PrivacyConsent>;
        setAllowed(consent.external === true);
      } catch { setAllowed(false); }
    };
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, []);

  return (
    <div className="mt-14 pt-10 border-t border-[var(--border-color)]">
      {!allowed && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 text-sm text-[var(--text-secondary)]">
          <p>{locale === "sk" ? "Komentáre poskytuje externá služba Giscus/GitHub, ktorá sa načíta až po vašom súhlase." : "Comments are provided by the external Giscus/GitHub service and load only after your consent."}</p>
          <button type="button" onClick={() => window.dispatchEvent(new Event("open-privacy-settings"))} className="mt-3 text-green-500 underline underline-offset-2">
            {locale === "sk" ? "Povoliť externé komentáre v nastaveniach" : "Allow external comments in settings"}
          </button>
        </div>
      )}
      {allowed && (
      <Giscus
        id={`comments-${translationKey}`}
        repo="KriskoAdam/adhdslovakia"
        repoId="R_kgDOSxLs9g"
        category="Comments"
        categoryId="DIC_kwDOSxLs9s4DGcgO"
        mapping="specific"
        term={translationKey}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="en"
      />
      )}
    </div>
  );
}
