import type { ReactNode, SVGProps } from "react";

export type SiteIconName =
  | "brain" | "user" | "search" | "message" | "article" | "research"
  | "handshake" | "scales" | "lightning" | "child" | "dna" | "pill"
  | "school" | "work" | "heart" | "apple" | "help" | "clock" | "chart"
  | "alert" | "check" | "link" | "close" | "arrowUpRight" | "arrowDown"
  | "arrowLeft" | "arrowRight" | "sparkles" | "target" | "rotate" | "home" | "plus";

type Props = SVGProps<SVGSVGElement> & { name: SiteIconName };

const paths: Record<SiteIconName, ReactNode> = {
  brain: <><path d="M12 18V5a3 3 0 0 0-5.7-1.3A4 4 0 0 0 4 11a4 4 0 0 0 2 7.5h2"/><path d="M12 18V5a3 3 0 0 1 5.7-1.3A4 4 0 0 1 20 11a4 4 0 0 1-2 7.5h-2"/><path d="M8 14a3 3 0 0 1 0-6m8 6a3 3 0 0 0 0-6M9 21h6"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-4.3A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h8m-8 3h5"/></>,
  article: <><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 12h8m-8 4h8"/></>,
  research: <><path d="M9 3h6m-5 0v7l-5.5 8.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 10V3"/><path d="M8 16h8"/></>,
  handshake: <><path d="m3 12 4-4 4 2 3-2 7 4-5 6-4-2-3 2-6-6Z"/><path d="m7 8 3-3 5 1 3 3m-8 4 4 4"/></>,
  scales: <><path d="M12 3v18m-7 0h14M5 7h14M7 7l-4 7h8L7 7Zm10 0-4 7h8l-4-7Z"/></>,
  lightning: <path d="m13 2-3 9h7L9 22l2-9H5l8-11Z"/>,
  child: <><circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0m-7-10v4m-2-2h4"/></>,
  dna: <><path d="M7 3c0 6 10 12 10 18M17 3C17 9 7 15 7 21M8 6h8m-9 5h10m-10 5h10m-9 5h8"/></>,
  pill: <><rect x="5" y="5" width="14" height="14" rx="7" transform="rotate(-45 12 12)"/><path d="m8 8 8 8"/></>,
  school: <><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 3 7 3 10 0v-5m4-3v7"/></>,
  work: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 6h18m-11 0v2h4v-2"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
  apple: <><path d="M12 8c-1-4 1-6 4-6m-4 7c-3-3-8-1-8 4 0 5 3 9 6 9 1 0 2-.5 3-.5s2 .5 3 .5c3 0 6-4 6-9 0-4-4-7-8-4"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.8c-1.2 1.2-2 1.4-2 3.2m0 3h.01"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  chart: <><path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 6-7"/></>,
  alert: <><path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  link: <><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/></>,
  close: <path d="m18 6-12 12M6 6l12 12"/>,
  arrowUpRight: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
  arrowDown: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
  arrowLeft: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/><path d="m5 3 .7 1.3L7 5l-1.3.7L5 7l-.7-1.3L3 5l1.3-.7L5 3Z"/></>,
  target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/></>,
  rotate: <><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 1-2-5l3 5"/></>,
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
};

export default function SiteIcon({ name, ...props }: Props) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}
