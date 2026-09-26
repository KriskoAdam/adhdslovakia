"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  orientation?: "vertical" | "horizontal";
};

export default function ShareButtons({ title, orientation = "vertical" }: Props) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

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
    "w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] hover:text-green-400 hover:border-green-400/40 transition-colors text-[12px] font-semibold";

  return (
    <div
      className={`flex items-center gap-3 ${
        orientation === "vertical" ? "flex-col" : "flex-row"
      }`}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Zdieľať na ${link.label === "in" ? "LinkedIn" : link.label === "f" ? "Facebook" : "X"}`}
          className={iconClass}
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Kopírovať odkaz na článok"
        className={iconClass}
      >
        {copied ? "✓" : "🔗"}
      </button>
    </div>
  );
}
