"use client";

import { useEffect, useRef } from "react";

type Props = {
  locale: "sk" | "en";
  translationKey: string;
};

export default function Comments({
  locale,
  translationKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");

    script.src = "https://giscus.app/client.js";
    script.async = true;

    script.setAttribute("data-repo", "KriskoAdam/adhdslovakia");
    script.setAttribute("data-repo-id", "R_kgDOSxLs9g");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "DIC_kwDOSxLs9s4DGcgO");

    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", translationKey);

    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", locale);

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [locale, translationKey]);

  return (
    <div className="mt-14 pt-10 border-t border-[var(--border-color)]">
      <div ref={containerRef} />
    </div>
  );
}