"use client";
import { useState } from "react";

const sections = [
  {
    icon: "🧠",
    title: "Čo je ADHD?",
    content: `ADHD, alebo porucha pozornosti s hyperaktivitou, je neurovývojová porucha charakterizovaná pretrvávajúcimi vzorcami nepozornosti, hyperaktivity a impulzivity, ktoré narúšajú každodenné fungovanie. Tieto symptómy sa zvyčajne objavujú v detstve a môžu pretrvávať do dospelosti.

Nejde o výhovorku ani o výsledok zlej výchovy — je to rozdielne fungujúci mozog s preukázateľnými neurologickými rozdielmi.`,
  },
  {
    icon: "⚡",
    title: "Príznaky ADHD",
    content: `Príznaky ADHD sa delia do dvoch hlavných kategórií:

Nepozornosť:
• Ťažkosti so sústredením na úlohy
• Časová slepota — neschopnosť odhadnúť čas
• Chronická prokrastinácia
• Oslabená pracovná pamäť
• Hyperfokus na zaujímavé témy

Hyperaktivita a impulzívnosť:
• Vnútorný nepokoj a neschopnosť vydržať v pokoji
• Skákanie do reči, unáhlené rozhodnutia
• Emocionálna dysregulácia — rýchle a intenzívne emócie`,
  },
  {
    icon: "👶",
    title: "ADHD u detí",
    content: `U detí je ADHD najviditeľnejšie navonok — v správaní, motorike a sociálnych interakciách. Nie je to prejav nevychovanosti ani nízkej inteligencie.

Typické prejavy u detí:
• Neustály pohyb, neschopnosť vydržať sedieť
• Impulzívne konanie bez domyslenia následkov
• Zabúdanie na pomôcky, povinnosti
• Ťažkosti v kolektíve kvôli emocionálnym reakciám

Kľúčom je pochopenie a pevná, láskyplná štruktúra — nie trestanie.`,
  },
  {
    icon: "👤",
    title: "ADHD u dospelých",
    content: `ADHD nezmizne po dospievaní. Mnohí dospelí sú diagnostikovaní až keď začnú narážať na problémy v práci, vzťahoch alebo organizácii života.

U dospelých sa hyperaktivita často transformuje do vnútorného nepokoja. Typické problémy:
• Chronické meškanie a nedodržiavanie termínov
• Ťažkosti s udržaním práce alebo vzťahov
• Pocit, že "niečo nie je v poriadku" celý život
• Nízke sebavedomie po rokoch neúspechov`,
  },
  {
    icon: "🧬",
    title: "Príčiny ADHD",
    content: `ADHD má prevažne genetický základ — miera dedičnosti je viac ako 70%. Nie je spôsobené zlou výchovou, cukrom ani obrazovkami.

Biologické príčiny:
• Genetika — ak má ADHD rodič, riziko u dieťaťa výrazne stúpa
• Odlišná dostupnosť dopamínu a noradrenalínu v mozgu
• Oneskorené dozrievanie prefrontálnej kôry

Rizikové faktory:
• Fajčenie alebo alkohol počas tehotenstva
• Nízka pôrodná hmotnosť, predčasný pôrod
• Vystavenie ťažkým kovom v ranom detstve`,
  },
  {
    icon: "🔍",
    title: "Diagnostika ADHD",
    content: `Diagnostika ADHD je komplexný proces — neexistuje jeden test ani odber krvi. Je postavená na dôkladnom klinickom a psychologickom posúdení.

Čo diagnostika zahŕňa:
• Podrobná anamnéza od detstva
• Štandardizované dotazníky a hodnotiace škály
• Psychologické testovanie kognitívnych funkcií
• Vylúčenie iných príčin (úzkosť, depresia, trauma)

Na Slovensku diagnostiku vykonáva psychiater alebo klinický psychológ. Cesta k diagnóze môže byť dlhá — odborníkov je málo.`,
  },
  {
    icon: "💊",
    title: "Liečba a terapia",
    content: `Najefektívnejší prístup kombinuje niekoľko zložiek:

Lieky (predpisuje psychiater):
• Stimulanty (metylfenidát, lisdexamfetamín) — zvyšujú dostupnosť dopamínu
• Nestimulačné lieky (atomoxetín) — pre prípadoch kedy stimulanty nezaberajú

Terapia:
• Kognitívno-behaviorálna terapia (KBT)
• Koučing zameraný na ADHD
• Nácvik exekutívnych zručností

Životný štýl:
• Pravidelný pohyb, spánková hygiena, štruktúrovaná rutina`,
  },
  {
    icon: "🎓",
    title: "ADHD v škole",
    content: `Školské prostredie je pre deti s ADHD veľkou výzvou — vyžaduje presne tie zručnosti, ktoré sú pre ne najťažšie.

Časté problémy:
• Neschopnosť filtrovať rušivé podnety
• Zabúdanie pomôcok a domácich úloh
• Impulzívne správanie v kolektíve

Čo pomáha:
• Sedenie vpredu, ďalej od okien
• Delenie úloh na menšie kroky
• Povolenie pohybu (vstať, zotrieť tabuľu)
• Ocenenie úsilia, nie len výsledku`,
  },
  {
    icon: "💼",
    title: "ADHD v práci",
    content: `Dospelí s ADHD môžu byť mimoriadne produktívni — ak sa ocitnu v správnom prostredí.

Výzvy:
• Prokrastinácia pri nezaujímavých úlohách
• Zabúdanie na ústne dohody
• Ťažkosti s open-office prostredím
• Impulzívne reakcie na kritiku

Silné stránky:
• Hyperfokus pri zaujímavých projektoch
• Kreativita a nekonvenčné riešenia
• Výkon v krízových situáciách

Pomáha: flexibilný čas, home office, digitálne plánovače, slúchadlá s ANC.`,
  },
  {
    icon: "❤️",
    title: "Vzťahy a ADHD",
    content: `ADHD ovplyvňuje aj najbližšie vzťahy — partnerské, rodinné, priateľské.

Časté problémy:
• Zabúdanie na sľuby a dohody
• Zdanlivé nepočúvanie počas rozhovoru
• Emocionálna intenzita a citlivosť na kritiku (RSD)
• Nerovnomerné rozdelenie zodpovednosti v domácnosti

Čo pomáha:
• Písomné dohody namiesto ústnych
• Zdieľané digitálne kalendáre
• Pochopenie — zabúdanie nie je nezáujem
• Párová terapia s odborníkom na ADHD`,
  },
  {
    icon: "🍎",
    title: "Životný štýl",
    content: `Správny životný štýl dokáže výrazne zmierniť prejavy ADHD — prirodzenou cestou.

Pohyb:
• Uvoľňuje dopamín a serotonín
• Znižuje hyperaktivitu a zlepšuje koncentráciu
• Najlepšie ráno pred prácou alebo školou

Spánok:
• Nedostatok spánku zhoršuje všetky symptómy
• Pevný čas spánku aj cez víkendy
• Bez obrazoviek hodinu pred spaním

Strava:
• Bielkoviny ráno (stabilizujú dopamín)
• Menej jednoduchých cukrov
• Omega-3 mastné kyseliny

Rutina:
• Pevná štruktúra dňa znižuje kognitívnu záťaž
• Vizuálne plánovače a pripomienky`,
  },
  {
    icon: "❓",
    title: "FAQ",
    content: `Najčastejšie otázky o ADHD:

Je ADHD skutočná diagnóza?
Áno. Je to vedecky uznaná neurovývinová porucha s preukázateľnými neurologickými rozdielmi.

Dá sa ADHD vyliečiť?
Nie je to choroba ktorú treba vyliečiť — je to spôsob fungovania mozgu. Správna podpora výrazne zlepšuje kvalitu života.

Môže mať ADHD aj dospelý?
Áno. Mnoho ľudí je diagnostikovaných až v dospelosti.

Je ADHD spôsobené zlou výchovou?
Nie. Má genetický a neurologický základ.

Môžu lieky pomôcť?
U mnohých ľudí áno. Vždy rozhoduje psychiater na základe individuálneho posúdenia.`,
  },
];

export default function ADHDInfoGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="flex flex-col gap-2">
      {sections.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              isOpen ? "border-green-400/40 bg-[var(--bg-secondary)]" : "border-[var(--border-color)] bg-[var(--bg-tertiary)]"
            }`}
          >
            {/* HEADER */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-display font-bold text-[15px] text-[var(--text-primary)]">
                  {item.title}
                </span>
              </div>
              <span className={`text-green-400 text-lg transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>

            {/* CONTENT */}
            {isOpen && (
              <div className="px-5 pb-6 border-t border-[var(--border-color)]">
                <div className="pt-4 text-[14px] text-[var(--text-secondary)] leading-7 font-light whitespace-pre-line">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* FAQ CTA */}
      <div className="mt-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-tertiary)] px-5 py-5">
        <p className="text-[13px] text-[var(--text-muted)] mb-3">Nenašli ste odpoveď na svoju otázku?</p>
        <a
          href="https://forms.gle/ai1TLsWiWL1Jo5u7A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-400 hover:bg-green-300 text-[#0a0a0a] text-[13px] font-semibold transition-colors"
        >
          Položiť otázku →
        </a>
      </div>
    </div>
  );
}