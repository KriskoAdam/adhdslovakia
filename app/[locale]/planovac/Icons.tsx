// Icons.tsx
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconPlus = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);

export const IconCheck = (p: IconProps) => (
  <Base {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>
);

export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.8 2.8L16 10" />
  </Base>
);

export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M9 7V4.5h6V7" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
  </Base>
);

export const IconChevronLeft = (p: IconProps) => (
  <Base {...p}><path d="M15 18l-6-6 6-6" /></Base>
);

export const IconChevronRight = (p: IconProps) => (
  <Base {...p}><path d="M9 18l6-6-6-6" /></Base>
);

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);

export const IconTimer = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 10v3.5l2.5 2M9.5 2.5h5" />
  </Base>
);

export const IconPlay = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6z" />
  </Base>
);

export const IconPause = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="4" height="14" rx="1.3" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.3" />
  </Base>
);

export const IconReset = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4.5v4h4" />
  </Base>
);

export const IconSpeaker = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </Base>
);

export const IconSpeakerOff = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </Base>
);

export const IconDownload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
    <path d="M5 19.5h14" />
  </Base>
);

export const IconFlame = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3c.8 3.3 5 5.6 5 10.2A5 5 0 0 1 7 13.2c0-2.3 1.2-3.8 2.6-4.9.2 1.6.9 2.6 2 3.1-.2-3 .1-5.7.4-8.4z" />
  </Base>
);

export const IconTrophy = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
    <path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6h2.5a2.5 2.5 0 0 1-2.6 3.6" />
    <path d="M12 13v4M8.5 20.5h7M10 17h4" />
  </Base>
);

export const IconSparkles = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 3l1.7 4.8L17.5 9.5l-4.8 1.7L11 16l-1.7-4.8L4.5 9.5l4.8-1.7z" />
    <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  </Base>
);

export const IconBell = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </Base>
);

export const IconLeaf = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 19C5 11 10 6 19.5 5 19.5 14 14.5 19 6 19z" />
    <path d="M5 19l7.5-7.5" />
  </Base>
);

export const IconLock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.8" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </Base>
);

export const IconSun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Base>
);

export const IconMoon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </Base>
);

export const IconStar = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z" />
  </Base>
);

export const IconChecklist = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M4 18.5l1.5 1.5L8 17.5" />
    <path d="M11.5 7h8.5M11.5 13h8.5M11.5 19h8.5" />
  </Base>
);