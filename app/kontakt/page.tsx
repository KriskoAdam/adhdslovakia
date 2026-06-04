import type { Metadata } from "next";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Kontakt – ADHD Slovakia",
  description: "Kontaktujte nás — ADHD Slovakia.",
};

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede6]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
        <a href="/" className="font-display text-xl font-extrabold tracking-tight">
          ADHD<span className="text-green-400">.</span>Slovakia
        </a>
        <div className="hidden md:flex gap-7 text-[13px] font-medium text-[#888]">
          {[
            { label: "Domov", href: "/" },
            { label: "Články", href: "/clanky" },
            { label: "O nás", href: "/o-nas" },
            { label: "Kontakt", href: "/kontakt" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="hover:text-[#f0ede6] transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-8 pt-14 pb-20">

        <div className="inline-block bg-green-400/10 text-green-400 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5">
          Kontakt
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Napíšte nám
        </h1>
        <p className="text-[#888] text-[15px] font-light leading-relaxed mb-10">
          Máte otázku, chcete zdieľať svoj príbeh alebo spolupracovať?
          Ozvite sa — každá správa sa počíta.
        </p>

        {/* CONTACT OPTIONS */}
        <div className="flex flex-col gap-px bg-[#1e1e1e] border border-[#1e1e1e] rounded-xl overflow-hidden mb-10">
          {[
            {
              label: "Email",
              value: "info@adhdslovakia.eu",
              href: "mailto:info@adhdslovakia.eu",
              desc: "Pre všeobecné otázky a spoluprácu",
            },
            {
              label: "Instagram",
              value: "@adhd_slovensko",
              href: "https://www.instagram.com/adhd_slovensko?igsh=bHVsY2lpZmQ2NmV0&utm_source=qr",
              desc: "Sledujte nás pre každodenný obsah",
            },
             {
              label: "Facebook",
              value: "ADHD SLOVENSKO",
              href: "https://www.facebook.com/share/1D5PZDYNER/?mibextid=wwXIfr",
              desc: "Sledujte nás na našej Facebook stránke",
            },
             {
              label: "TikTok",
              value: "@adhdslovakia",
              href: "https://www.tiktok.com/@iny_mozog?_r=1&_t=ZN-96wOVFy7krW",
              desc: "Sledujte nás na TikToku",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-[#111] px-6 py-5 flex items-center gap-5 hover:bg-[#161616] transition-colors group"
            >
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#444] mb-1">
                  {item.label}
                </div>
                <div className="font-display text-[15px] font-bold text-green-400 group-hover:underline">
                  {item.value}
                </div>
                <div className="text-[12px] text-[#555] font-light mt-0.5">
                  {item.desc}
                </div>
              </div>
              <span className="text-[#333] group-hover:text-green-400 transition-colors text-lg">→</span>
            </a>
          ))}
        </div>

        {/* NOTE */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6">
          <p className="text-[13px] text-[#555] font-light leading-relaxed">
            Ak hľadáte pomoc s diagnózou alebo potrebujete poradiť kde sa obrátiť,
            napíšte nám — pokúsime sa pomôcť alebo nasmerovať na správneho odborníka.
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