// plannerFx.ts – zvuky (Web Audio, bez súborov), vibrácie a konfety pre ADHD Flow

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Zavolať pri akomkoľvek kliknutí – mobilné prehliadače odomknú zvuk až po geste. */
export function unlockAudio() {
  getCtx();
}

type ToneOptions = { type?: OscillatorType; gain?: number; slideTo?: number };

function tone(freq: number, start: number, duration: number, options: ToneOptions = {}) {
  const c = getCtx();
  if (!c || !enabled) return;
  const { type = "sine", gain = 0.16, slideTo } = options;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp);
  amp.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

// ---------- Zvuky ----------

/** Jemné kliknutie na bežné tlačidlá. */
export function playTick() {
  tone(880, 0, 0.05, { type: "triangle", gain: 0.05 });
}

/** Pridanie úlohy – veselé „pop“. */
export function playAdd() {
  tone(520, 0, 0.09, { type: "triangle", gain: 0.14 });
  tone(780, 0.07, 0.16, { type: "triangle", gain: 0.14 });
}

/** Splnenie úlohy – vzostupný akord, s každým ďalším splnením v sérii o poltón vyššie. */
export function playComplete(combo = 1) {
  const shift = Math.pow(2, Math.min(Math.max(combo - 1, 0), 7) / 12);
  [523.25, 659.25, 783.99].forEach((f, i) => tone(f * shift, i * 0.07, 0.22, { gain: 0.15 }));
  tone(1046.5 * shift, 0.21, 0.35, { type: "triangle", gain: 0.12 });
}

/** Celý deň hotový / nový level. */
export function playFanfare() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.11, 0.3, { type: "triangle", gain: 0.15 }));
  tone(1568, 0.6, 0.9, { gain: 0.14 });
  tone(1046.5, 0.6, 0.9, { gain: 0.1 });
}

/** Zrušenie splnenia – jemný zostupný tón (žiadny trest, len neutrálne). */
export function playUncomplete() {
  tone(440, 0, 0.16, { type: "triangle", gain: 0.09, slideTo: 330 });
}

/** Odstránenie – „swoosh“. */
export function playRemove() {
  tone(620, 0, 0.2, { type: "triangle", gain: 0.09, slideTo: 140 });
}

/** Štart časovača. */
export function playStart() {
  tone(392, 0, 0.1, { type: "triangle", gain: 0.12 });
  tone(587.33, 0.08, 0.18, { type: "triangle", gain: 0.12 });
}

/** Koniec časovača – zvonček trikrát za sebou. */
export function playBell() {
  [0, 0.7, 1.4].forEach((start) => {
    tone(880, start, 1.1, { gain: 0.16 });
    tone(1320, start, 0.9, { gain: 0.08 });
    tone(1760, start, 0.6, { gain: 0.05 });
  });
}

// ---------- Vibrácie ----------

export function haptic(pattern: number | number[]) {
  if (!enabled || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* Vibrácie nemusia byť dostupné. */
  }
}

// ---------- Konfety ----------

const COLORS = ["#ff5c8a", "#ffb703", "#06d6a0", "#4cc9f0", "#9b5de5", "#ff7b00"];

export function confetti(x: number, y: number, count = 24, power = 1) {
  if (typeof document === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    const size = 6 + Math.random() * 6;
    Object.assign(el.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * 0.6}px`,
      background: COLORS[Math.floor(Math.random() * COLORS.length)],
      borderRadius: Math.random() < 0.3 ? "50%" : "2px",
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = (60 + Math.random() * 140) * power;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 80 * power;

    const animation = el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.1}px, ${dy + 220}px) rotate(${Math.random() * 900}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" },
    );
    animation.onfinish = () => el.remove();
  }
}
