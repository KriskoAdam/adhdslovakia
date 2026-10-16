"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewCounter({ slug, locale }: { slug: string; locale: "sk" | "en" }) {
  const [count, setCount] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    fetch(`/api/views/${encodeURIComponent(slug)}`, { method: "POST", cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { count: number }) => setCount(data.count))
      .catch(() => setCount(null));
  }, [slug]);

  return <span aria-live="polite">{count === null ? "" : `${count.toLocaleString(locale === "sk" ? "sk-SK" : "en-US")} ${locale === "sk" ? "zobrazení" : "views"}`}</span>;
}
