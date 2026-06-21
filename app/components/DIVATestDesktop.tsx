"use client";

export default function DIVATestDesktop() {
  return (
    <aside className="hidden xl:block justify-self-end w-[420px] flex-shrink-0 animate-fade-up">
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl p-6 flex flex-col justify-between h-[320px]">
        {/* Svetelný efekt v rohu — v oboch režimoch dodá pekný moderný nádych */}
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        
        {/* Horná časť */}
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1">
            <span className="text-xs">🧠</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">
              ADHD Test online
            </span>
          </div>
          
          <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
            Orientačný ADHD test
          </h2>
          
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-[320px]">
            Zistite, či vaše symptómy nepozornosti, impulzivity alebo hyperaktivity zodpovedajú kritériám dospelých podľa klasifikácie <span className="text-[var(--text-primary)] font-medium">DSM-5</span>.
          </p>
        </div>

        {/* Spodná časť s informáciami a tlačidlom */}
        <div className="relative z-10 pt-4 border-t border-[var(--border-color)] flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              ⏱️ <span className="font-medium text-[var(--text-secondary)]">Doba: cca 3 minúty</span>
            </span>
            <span>📊 18 otázok (DIVA-5)</span>
          </div>

          <a 
            href="/test"
            className="w-full rounded-xl bg-green-400 py-3 text-center text-[13px] font-bold text-[#0a0a0a] hover:bg-green-300 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-green-400/5 flex items-center justify-center gap-2"
          >
            <span>Spustiť ADHD test</span>
            <span className="text-xs font-normal opacity-70">→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
