"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  num: string;
  label: string;
  delay?: number;
  speed?: number;
};

export default function AnimatedStat({
  num,
  label,
  delay = 0,
  speed = 70,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(num);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasStarted, num]);

  useEffect(() => {
    if (!hasStarted) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let index = 0;

    timeoutId = setTimeout(() => {
      const typeNext = () => {
        index += 1;
        setDisplayValue(num.slice(0, index));

        if (index < num.length) {
          timeoutId = setTimeout(typeNext, speed);
        }
      };

      typeNext();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [hasStarted, num, delay, speed]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="relative inline-block font-display text-3xl font-extrabold text-green-400 tabular-nums">
        {/* Neviditeľná hodnota drží šírku, aby layout neskákal */}
        <span className="invisible">{num}</span>

        {/* Animovaná hodnota */}
        <span className="absolute left-0 top-0">
          {displayValue}
          {displayValue.length < num.length && hasStarted && (
            <span className="ml-0.5 animate-pulse text-green-400/70">|</span>
          )}
        </span>
      </div>

      <div className="text-[12px] text-[#555] mt-0.5 font-light">
        {label}
      </div>
    </div>
  );
}