"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import SiteIcon from "./SiteIcon";

type Props = {
  title: string;
  url: string;
  orientation?: "vertical" | "horizontal";
};

export default function ShareButtons({ title, url, orientation = "vertical" }: Props) {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API nemusí byť dostupné (napr. bez HTTPS) - ticho ignorujeme
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  const iconClass =
    `flex shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors font-semibold hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${orientation === "horizontal" ? "h-[52px] w-[52px] bg-[var(--bg-secondary)] text-base" : "min-h-11 min-w-11 text-sm"}`;

  return (
    <div
      className={`flex items-center ${orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-3"}`}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isEnglish
            ? `Share on ${link.label === "in" ? "LinkedIn" : link.label === "f" ? "Facebook" : "X"} (opens in a new tab)`
            : `Zdieľať na ${link.label === "in" ? "LinkedIn" : link.label === "f" ? "Facebook" : "X"} (otvorí sa na novej karte)`}
          className={iconClass}
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={isEnglish ? "Copy article link" : "Kopírovať odkaz na článok"}
        className={iconClass}
      >
        <SiteIcon name={copied ? "check" : "link"} className={orientation === "horizontal" ? "h-5 w-5" : "h-4 w-4"} />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? (isEnglish ? "Link copied" : "Odkaz bol skopírovaný") : ""}
      </span>
    </div>
  );
}
