"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type AnimatedStatProps = {
  num: string;
  label: string;
  loopDelay?: number;
  scanSpeed?: number; // ponechané kvôli spätnej kompatibilite s volaním, nepoužíva sa priamo
};

/**
 * Rozdelí reťazec ako "10+", "4–5%", "∞" na:
 * - target: číslo, ku ktorému sa má počítať (alebo null ak sa nedá parsovať, napr. "∞")
 * - suffix: zvyšok reťazca za číslom (napr. "+", "–5%")
 * - decimals: počet desatinných miest v pôvodnej hodnote
 */
function parseStat(raw: string) {
  const match = raw.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) {
    return { target: null as number | null, suffix: raw, decimals: 0 };
  }
  const numStr = match[1].replace(",", ".");
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return {
    target: parseFloat(numStr),
    suffix: match[2],
    decimals,
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedStat({
  num,
  label,
  loopDelay = 10000,
}: AnimatedStatProps) {
  const { target, suffix, decimals } = parseStat(num);
  const [current, setCurrent] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (target === null) return; // napr. "∞" - nepočíta sa, len sa zobrazí

    const duration = 1600;

    const animate = () => {
      setIsLive(true);
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setCurrent(target * eased);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          setCurrent(target);
          setIsLive(false);
          timeoutRef.current = setTimeout(animate, loopDelay);
        }
      };

      frameRef.current = requestAnimationFrame(step);
    };

    // krátke oneskorenie pri prvom načítaní stránky
    timeoutRef.current = setTimeout(animate, 400);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [target, loopDelay]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Živý indikátor + číslo */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-green-400"
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
        </span>

        <motion.div
          className="font-display text-3xl font-extrabold tabular-nums text-[var(--text-primary)]"
          animate={isLive ? { opacity: [0.85, 1] } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-green-400">
            {target === null ? "" : current.toFixed(decimals)}
          </span>
          <span>{suffix}</span>
        </motion.div>
      </div>

      {/* Animovaná podčiarkovacia línia - sleduje priebeh počítania */}
      <div className="h-[2px] w-14 rounded-full bg-[var(--border-color)] overflow-hidden ml-3.5">
        <motion.div
          className="h-full bg-green-400"
          animate={{
            width:
              target === null
                ? "100%"
                : `${Math.min((current / target) * 100, 100)}%`,
          }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>

      {/* Label */}
      <div className="text-[12px] text-[var(--text-muted)] font-light ml-3.5">
        {label}
      </div>
    </div>
  );
}