"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type Props = {
  items: TocItem[];
  title?: string;
};

export default function ArticleToc({ items, title = "Obsah" }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // Krátke články nepotrebujú navigáciu
  if (items.length < 2) return null;

  return (
    <nav className="sticky top-24 text-[13px]" aria-label={title}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${item.id}`}
              className={`block py-0.5 leading-snug transition-colors ${
                activeId === item.id
                  ? "text-green-400 font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
