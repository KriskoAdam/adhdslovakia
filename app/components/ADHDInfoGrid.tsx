"use client";

import { useState } from "react";

// Funkcia, ktorá vracia ikony
const getIcon =
  (symbol: string) =>
  ({
    size = 20,
    className = "",
  }: {
    size?: number;
    className?: string;
  }) => (
    <span
      style={{ fontSize: size }}
      className={`text-green-400 ${className}`.trim()}
    >
      {symbol}
    </span>
  );

// Sekcie pre zobrazenie obsahu
const sections = [
  {
    icon: getIcon("🧠"),
    title: "Čo je ADHD?",
    content:
      "ADHD, alebo porucha pozornosti s hyperaktivitou, je neurovývojová porucha charakterizovaná pretrvávajúcimi vzorcami nepozornosti, hyperaktivity a impulzivity.",
  },
  {
    icon: getIcon("⚡"),
    title: "Príznaky ADHD",
    content:
      "Medzi najznámejšie patrí problém s koncentráciou, hyperaktivita a impulzívnosť. Symptómy sa prejavujú odlišne podľa veku.",
  },
  {
    icon: getIcon("👶"),
    title: "ADHD u detí",
    content:
      "Deti s ADHD majú problémy so sústredením, impulzívnym správaním a často pôsobia, akoby boli neustále poháňané motorom.",
  },
];

export default function ADHDInfoGrid() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-8">
      {/* Responzívna mriežka */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((item, index) => {
          const Icon = item.icon;
          const isOpen = open === index;

          return (
            <button
              key={index}
              onClick={() => setOpen(isOpen ? null : index)}
              className={`border rounded-xl transition-all duration-300 p-4 shadow-md
                ${
                  isOpen
                    ? "bg-green-100 border-green-300"
                    : "bg-white border-gray-200 hover:border-green-200 hover:shadow-lg"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                  <Icon size={24} />
                </div>
                <h3 className="font-medium text-lg text-gray-700">{item.title}</h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {open !== null && (
        <div className="p-6 border rounded-xl bg-gray-50 shadow-lg">
          <h2 className="font-bold text-xl mb-4 text-gray-800">
            {sections[open].title}
          </h2>
          <p className="text-gray-700 leading-relaxed">{sections[open].content}</p>
        </div>
      )}
    </div>
  );
}