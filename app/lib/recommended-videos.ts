export type RecommendedVideo = {
  id: string;
  channel: string;
  language: "sk" | "cs" | "en";
  startAt?: number;
  title: { sk: string; en: string };
  topic: { sk: string; en: string };
};

// Curated educational videos. YouTube embeds load only after a visitor chooses a video.
export const recommendedVideos: RecommendedVideo[] = [
  {
    id: "hdSdzmyFCfw",
    channel: "Tohle Je Život · Podcast Michala Slováka",
    language: "cs",
    startAt: 22,
    title: { sk: "25 rokov pekla v hlave: diagnóza ADHD priniesla pokoj", en: "25 Years of Chaos: Finding Calm After an ADHD Diagnosis" },
    topic: { sk: "Český rozhovor", en: "Czech conversation" },
  },
  {
    id: "jhcn1_qsYmg",
    channel: "How to ADHD",
    language: "en",
    title: { sk: "Ako vysvetliť ADHD", en: "How to (Explain) ADHD" },
    topic: { sk: "Základy ADHD", en: "ADHD basics" },
  },
  {
    id: "dPpD9SaNAAE",
    channel: "Vidrail",
    language: "cs",
    title: { sk: "ADHD | OVERTHINK", en: "ADHD | OVERTHINK" },
    topic: { sk: "Česká osobná skúsenosť", en: "Czech lived experience" },
  },
  {
    id: "ji0hg1LduU8",
    channel: "How to ADHD",
    language: "en",
    title: { sk: "Aké je to naozaj žiť s ADHD", en: "This Is What It’s Really Like to Have ADHD" },
    topic: { sk: "Osobná skúsenosť", en: "Lived experience" },
  },
  {
    id: "Y4PHrTstIwU",
    channel: "SME · podcast Ľudskosť",
    language: "sk",
    title: { sk: "Psychologička o ADHD u dospelých", en: "A Psychologist on ADHD in Adults" },
    topic: { sk: "Slovenský rozhovor", en: "Slovak conversation" },
  },
  {
    id: "dmeE3qTJRUw",
    channel: "How to ADHD",
    language: "en",
    title: { sk: "ADHD u dievčat: ako rozpoznať prejavy", en: "ADHD in Girls: How to Recognize the Symptoms" },
    topic: { sk: "ADHD u dievčat", en: "ADHD in girls" },
  },
  {
    id: "uCRs05rMtWk",
    channel: "DVTV",
    language: "cs",
    title: { sk: "ADHD nemajú len chlapci, ktorí sa hojdajú na lustroch", en: "ADHD Isn’t Just for Boys Who Swing from Chandeliers" },
    topic: { sk: "Český rozhovor", en: "Czech conversation" },
  },
  {
    id: "ybk2IzwV6Zg",
    channel: "TEDx Talks",
    language: "en",
    title: { sk: "ADHD u žien a dievčat", en: "ADHD in Girls and Women" },
    topic: { sk: "Prednáška", en: "Talk" },
  },
  {
    id: "6FENcqlmHD8",
    channel: "DVTV",
    language: "cs",
    title: { sk: "Diagnóza ADHD ako návod na použitie", en: "An ADHD Diagnosis as an Instruction Manual" },
    topic: { sk: "Český rozhovor", en: "Czech conversation" },
  },
  {
    id: "fRUkPHnltuI",
    channel: "TEDx Talks",
    language: "en",
    title: { sk: "Odhaľovanie ADHD", en: "Unmasking ADHD" },
    topic: { sk: "Osobná skúsenosť", en: "Lived experience" },
  },
  {
    id: "LknSlFMYFeg",
    channel: "#odvážný pořad",
    language: "cs",
    title: { sk: "ADHD nie je len neposednosť", en: "ADHD Is More Than Restlessness" },
    topic: { sk: "Český rozhovor", en: "Czech conversation" },
  },
  {
    id: "K2RKNVpnK2o",
    channel: "Rick Green & Dr. Ahmed",
    language: "en",
    title: { sk: "ADHD v dospelosti", en: "ADHD in Adults" },
    topic: { sk: "Dospelí", en: "Adults" },
  },
  {
    id: "ouZrZa5pLXk",
    channel: "Brown Attention Deficit Disorder Clinic",
    language: "en",
    title: { sk: "Čo je ADHD?", en: "What Is ADHD?" },
    topic: { sk: "Základy ADHD", en: "ADHD basics" },
  },
];
