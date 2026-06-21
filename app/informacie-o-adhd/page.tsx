import type { Metadata } from "next";
import { getAllArticles } from "../../app/lib/articles";
import ADHDInfoGrid from "../components/ADHDInfoGrid";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: "Informácie o ADHD – ADHD Slovakia",
  description: "Všetky informácie o ADHD na jednom mieste.",
};

export default function InformacieOAdhdPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      {/* HEADER */}
      <section className="px-8 pt-14 pb-10 border-b border-[var(--border-color)]">
        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-4 animate-fade-up">
          Informácie
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight animate-fade-up delay-100">
          Informácie o ADHD
        </h1>
        <p className="text-[var(--text-secondary)] text-[15px] font-light mt-3 max-w-md leading-relaxed animate-fade-up delay-200">
          Všetky informácie na jednom mieste
        </p>
      </section>

      <section className="px-8 py-14 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-3 animate-fade-up delay-300">
            Sprievodca ADHD
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl animate-fade-up delay-400">
            Vyberte si tému, ktorá vás zaujíma, a kliknutím zobrazte
            podrobnejšie informácie.
          </p>
        </div>
        <div className="animate-fade-up delay-500">
          <ADHDInfoGrid />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-8 border-t border-[var(--border-color)] mt-8 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-display text-base font-extrabold text-[var(--text-muted)]">
          ADHD<span className="text-green-400/30">.</span>Slovakia
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">© 2025 ADHD Slovakia</div>
      </footer>
    </div>
  );
}