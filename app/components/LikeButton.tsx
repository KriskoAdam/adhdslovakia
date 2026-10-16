"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import SiteIcon from "./SiteIcon";

type Props = {
  likeKey: string;
  size?: "default" | "large";
};

export default function LikeButton({ likeKey, size = "default" }: Props) {
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
        className={`${size === "large" ? "h-[52px] w-[52px] shrink-0" : "min-h-11 min-w-11"} flex items-center justify-center rounded-full transition-colors text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
          liked
            ? "text-green-400 bg-green-400/10"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
        }`}
      >
        <SiteIcon name="heart" className={size === "large" ? "h-5 w-5 fill-current" : "h-4 w-4 fill-current"} />
      </button>
      <span className="text-[11px] text-[var(--text-secondary)] tabular-nums" aria-label={count === null ? (isEnglish ? "Likes loading" : "Načítavam počet označení") : `${count} ${isEnglish ? (count === 1 ? "like" : "likes") : "označení Páči sa mi to"}`}>
        {count ?? "–"}
      </span>
    </div>
  );
}
