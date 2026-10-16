"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import SiteIcon from "./SiteIcon";

type Props = {
  likeKey: string;
};

export default function LikeButton({ likeKey }: Props) {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storageKey = `liked-${likeKey}`;
    queueMicrotask(() => setLiked(localStorage.getItem(storageKey) === "1"));

    fetch(`/api/likes/${likeKey}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }, [likeKey]);

  const handleLike = async () => {
    if (liked) return; // jeden lajk na prehliadač (localStorage), nie prísna autentifikácia
    setLiked(true);
    localStorage.setItem(`liked-${likeKey}`, "1");
    setCount((c) => (c ?? 0) + 1); // optimistická aktualizácia, nech to reaguje okamžite

    try {
      const res = await fetch(`/api/likes/${likeKey}`, { method: "POST" });
      const data = await res.json();
      setCount(data.count);
    } catch {
      // ak request zlyhá, necháme optimistickú hodnotu - nie je to kritická funkcia
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={handleLike}
        disabled={liked}
        aria-pressed={liked}
        aria-label={liked
          ? (isEnglish ? "You liked this article" : "Tento článok sa vám páči")
          : (isEnglish ? "Like this article" : "Páči sa mi tento článok")}
        className={`min-h-11 min-w-11 flex items-center justify-center rounded-full border transition-colors text-[14px] flex items-center justify-center rounded-full border transition-colors text-[14px] ${
          liked
            ? "border-green-400/50 text-green-400 bg-green-400/10"
            : "border-[var(--border-color)] text-[var(--text-muted)] hover:text-green-400 hover:border-green-400/40"
        }`}
      >
        <SiteIcon name="heart" className="h-4 w-4 fill-current" />
      </button>
      <span className="text-[11px] text-[var(--text-secondary)] tabular-nums" aria-label={count === null ? (isEnglish ? "Likes loading" : "Načítavam počet označení") : `${count} ${isEnglish ? (count === 1 ? "like" : "likes") : "označení Páči sa mi to"}`}>
        {count ?? "–"}
      </span>
    </div>
  );
}
