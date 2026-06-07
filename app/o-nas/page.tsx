import type { Metadata } from "next";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: "O nás – ADHD Slovakia",
  description: "Kto stojí za projektom ADHD Slovakia a prečo vznikol.",
};

export default function ONasPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede6]">

      
      <Nav />

      <div className="max-w-2xl mx-auto px-8 pt-14 pb-20">

        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5 animate-fade-up">
          O projekte
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-8 animate-fade-up delay-100">
          Prečo vzniklo<br />
          <span className="text-green-400 animate-fade-up delay-200">ADHD Slovakia</span>
        </h1>

        <div className="space-y-6 text-[15px] text-[#888] font-light leading-relaxed animate-fade-up delay-300">
          <p>
            Celý život som hľadal odpovede. Niečo nebolo v poriadku, vedel som to
            ale nikto mi nevedel povedať čo. Nie škola, nie lekári, nie systém.
            Odpoveď som nakoniec našiel vďaka zahraničným tvorcom obsahu, ktorí
            otvorene hovorili o ADHD u dospelých. Bol to zlom.
          </p>
          <p>
            Vtedy mi došlo: na Slovensku takýto obsah jednoducho neexistuje.
            Dospelí s ADHD tu nemajú kde hľadať informácie v slovenčine,
            odborníkov je málo, a mýtus že „ADHD majú len deti" je stále živý
            a to aj medzi zdravotníkmi.
          </p>
          <p>
            ADHD Slovakia som založil preto, aby som pomohol ľuďom nájsť odpovede
            skôr ako ja. Píšem články založené na vedeckých zdrojoch, pomáham
            ľuďom zorientovať sa v systéme, a bojujem za práva dospelých pacientov
            s ADHD na Slovensku.
          </p>
          <p>
            Vďaka tejto komunite sa už podarilo úspešne diagnostikovať viac ako
            10 dospelých pacientov, ktorým diagnózu potvrdil odborník. Každý
            z nich prežil podobný moment ako ja konečne dostali odpoveď.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#1e1e1e] my-12" />

        {/* MISSION */}
        <h2 className="font-display text-2xl font-extrabold tracking-tight mb-6 animate-fade-up delay-400">
          Čo robíme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e1e] border border-[#1e1e1e] rounded-xl overflow-hidden mb-12 animate-fade-up delay-500">
          {[
            { icon: "📰", title: "Obsah a články", desc: "Píšeme o ADHD na základe vedeckých a medicínskych zdrojov v slovenčine, zrozumiteľne." },
            { icon: "🔬", title: "Búranie mýtov", desc: "Bojujeme proti zastaraným predstavám o ADHD, že je to len detská diagnóza, alebo výhovorka." },
            { icon: "🤝", title: "Pomoc s diagnózou", desc: "Pomáhame ľuďom zorientovať sa kde hľadať odborníka, čo očakávať, ako sa pripraviť." },
            { icon: "⚖️", title: "Advokácia", desc: "Presadzujeme práva dospelých pacientov vrátane preplácania liekov zdravotnými poisťovňami." },
          ].map((item) => (
            <div key={item.title} className="bg-[#111] p-6 flex flex-col gap-2 animate-fade-up delay-600">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-display text-[15px] font-bold text-[#f0ede6]">{item.title}</h3>
              <p className="text-[13px] text-[#555] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* MEMBER OF */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#444] mb-3">
            Medzinárodná spolupráca
          </div>
          <p className="text-[14px] text-[#888] font-light leading-relaxed">
            ADHD Slovakia je v procese stávania sa členom{" "}
            <a href="https://adhdeurope.eu/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              ADHD Europe
            </a>
            {" "}— strešnej organizácie pre všetky ADHD organizácie v Európe.
            Zároveň pripravujeme oficiálnu registráciu ako nezisková organizácia.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="px-8 py-8 border-t border-[#1e1e1e] flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-display text-base font-extrabold text-[#333]">
          ADHD<span className="text-green-400/30">.</span>Slovakia
        </div>
        <div className="text-[12px] text-[#333]">© 2025 ADHD Slovakia</div>
      </footer>
    </div>
  );
}