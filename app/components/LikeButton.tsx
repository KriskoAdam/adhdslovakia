"use client";

import { useEffect, useState } from "react";

type Props = {
  likeKey: string;
};

export default function LikeButton({ likeKey }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storageKey = `liked-${likeKey}`;
    setLiked(localStorage.getItem(storageKey) === "1");

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
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleLike}
        disabled={liked}
        aria-pressed={liked}
        aria-label={liked ? "Už sa ti to páči" : "Páči sa mi"}
        className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors text-[14px] ${
          liked
            ? "border-green-400/50 text-green-400 bg-green-400/10"
            : "border-[var(--border-color)] text-[var(--text-muted)] hover:text-green-400 hover:border-green-400/40"
        }`}
      >
        ♥
      </button>
      <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
        {count ?? "–"}
      </span>
    </div>
  );
}
