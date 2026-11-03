"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import styles from "./DiagnosisMap.module.css";
import { mapRegions } from "./slovakiaRegions";
import type { MapListing } from "../lib/map-listing-types";

const ProviderMap = dynamic(() => import("./ProviderMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} role="status">Načítavam mapu…</div>,
});

type Locale = "sk" | "en";
type AgeFilter = "all" | "adults" | "youngPeople";
type InsuranceFilter = "all" | "contracted" | "selfPay";
type RegionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type ProviderType = "psychologist" | "psychiatrist" | "support" | "neurologist" | "therapist";
type Centre = RawCentre & {
  providerType: ProviderType;
  coordinates: [number, number] | null;
};
type RawCentre = {
  id: string;
  city: string | null;
  regionId: RegionId | null;
  serviceMode: "inPerson" | "online" | "both";
  insuranceType: "contracted" | "selfPay" | "unknown";
  title: string;
  address: string;
  audience: "adults" | "youngPeople" | "both";
  price: Record<Locale, string>;
  insurance: Record<Locale, string>;
  details: Record<Locale, string>;
  href: string;
  phone?: string;
  email?: string;
  sourceLabel: Record<Locale, string>;
  origin?: "community";
  waitTime?: Record<Locale, string>;
  accepting?: Record<Locale, string>;
};

const centres: RawCentre[] = [
  {
    id: "trea",
    city: "Bratislava",
    regionId: 1,
    serviceMode: "inPerson",
    insuranceType: "selfPay",
    title: "TREA – ambulancia klinickej psychológie",
    address: "Kadnárova 15, Bratislava",
    audience: "both",
    price: { sk: "180 € deti · 450 € dospelí", en: "€180 children · €450 adults" },
    insurance: { sk: "Samoplatcovská služba", en: "Self-pay service" },
    details: { sk: "Klinická psychologická diagnostika ADHD pre deti aj dospelých. Poskytovateľ uvádza, že odporúčanie od lekára netreba.", en: "Clinical psychological ADHD assessment for children and adults. The provider says a doctor's referral is not required." },
    href: "https://trea.sk/adhd-diagnostika", phone: "+421903575990", email: "info@trea.sk",
    sourceLabel: { sk: "ADHD diagnostika a cenník", en: "ADHD assessment and pricing" },
  },
  {
    id: "inmea",
    city: "Bratislava",
    regionId: 1,
    serviceMode: "inPerson",
    insuranceType: "unknown",
    title: "Inmea – klinická psychológia",
    address: "Zdravotné stredisko Záporožská, Záporožská 12, Bratislava",
    audience: "both",
    price: { sk: "300 € · správa pre psychiatra 20 €", en: "€300 · psychiatrist report €20" },
    insurance: { sk: "Úhradu poisťovňou si overte", en: "Check reimbursement with the provider/insurer" },
    details: { sk: "Komplexné psychodiagnostické vyšetrenie ADHD pre adolescentov a dospelých. Psychologické vyšetrenie môže slúžiť ako podklad pre psychiatra. Telefón je kontakt na zdravotné stredisko, kde sa pracovisko nachádza.", en: "Comprehensive psychological ADHD assessment for adolescents and adults. The psychological assessment can provide supporting information for a psychiatrist. The phone number reaches the health centre where the clinic is located." },
    href: "https://www.inmea.sk/", phone: "+421263811219",
    sourceLabel: { sk: "Diagnostika a cenník", en: "Assessment and pricing" },
  },
  {
    id: "szu",
    city: "Bratislava",
    regionId: 1,
    serviceMode: "inPerson",
    insuranceType: "selfPay",
    title: "Ambulancia klinickej psychológie SZU",
    address: "Poliklinika SZU, Limbová 12–14, Bratislava",
    audience: "both",
    price: { sk: "215 € za komplexné vyšetrenie ADHD u dospelých", en: "€215 for comprehensive adult ADHD assessment" },
    insurance: { sk: "Nie je zmluvným partnerom poisťovní", en: "Not contracted with health insurers" },
    details: { sk: "Ambulancia uvádza komplexnú psychodiagnostiku ADHD pre adolescentov od 13 rokov a dospelých. Cenník platný od 1. 9. 2026 uvádza cenu pre dospelých.", en: "The clinic lists comprehensive ADHD psychological assessment for adolescents aged 13+ and adults. Its price list, effective 1 September 2026, gives the adult price." },
    href: "https://eszu.sk/ambulancie/a-k-p/", phone: "+421259370862", email: "andrea.hraskova@szu.sk",
    sourceLabel: { sk: "ADHD vyšetrenie a cenník ambulancie", en: "ADHD assessment and clinic price list" },
  },
  {
    id: "salvus",
    city: "Bratislava",
    regionId: 1,
    serviceMode: "inPerson",
    insuranceType: "unknown",
    title: "Salvus cez ksebe – psychodiagnostika ADHD",
    address: "Zdravotnícke centrum Salvus, Komárnická 11, Bratislava",
    audience: "adults",
    price: { sk: "650 € · interpretačné stretnutie 90 € navyše", en: "€650 · optional interpretation session €90" },
    insurance: { sk: "Úhradu poisťovňou si overte", en: "Check reimbursement with the provider/insurer" },
    details: { sk: "Vyšetrenie pre dospelých od 18 rokov zahŕňa klinické interview, testovanie a správu. Poskytovateľ výslovne uvádza, že nejde o finálnu psychiatrickú diagnózu; správa slúži ako podklad pre psychiatra.", en: "Assessment for adults aged 18+ includes a clinical interview, testing and a report. The provider states this is not a final psychiatric diagnosis; the report supports a psychiatrist's assessment." },
    href: "https://www.ksebe.sk/adhd-testovanie", phone: "+421948360360", email: "salvus@salvus.sk",
    sourceLabel: { sk: "Rozsah, vek a cena", en: "Scope, age and price" },
  },
  {
    id: "calma",
    city: "Bratislava",
    regionId: 1,
    serviceMode: "inPerson",
    insuranceType: "unknown",
    title: "Klinika Calma – diagnostika ADHD dospelých",
    address: "Zochova 6–8, Bratislava",
    audience: "adults",
    price: { sk: "179 € úvodné vyšetrenie; celková cena podľa ďalších krokov", en: "€179 initial assessment; total depends on further steps" },
    insurance: { sk: "Úhradu poisťovňou si overte", en: "Check reimbursement with the provider/insurer" },
    details: { sk: "Klinika opisuje diagnostický proces dospelých ADHD ako viacstupňový. Neuropsychologické vyšetrenie sa účtuje samostatne (139 €); celková cena závisí od odporúčaného rozsahu.", en: "The clinic describes adult ADHD assessment as a multi-step process. Neuropsychological testing is priced separately (€139); the total depends on the recommended scope." },
    href: "https://klinikacalma.sk/dospeli/adhd-u-dospelych/", phone: "+421221012310", email: "info@klinikacalma.sk",
    sourceLabel: { sk: "Postup a jednotlivé ceny", en: "Assessment process and fees" },
  },
  {
    id: "narnia",
    city: "Prešov",
    regionId: 7,
    serviceMode: "inPerson",
    insuranceType: "unknown",
    title: "Centrum Narnia – ADHD vyšetrenie si overte",
    address: "Bayerova 1A, Prešov",
    audience: "youngPeople",
    price: { sk: "Cenu ADHD vyšetrenia si overte", en: "Confirm the ADHD assessment fee" },
    insurance: { sk: "Úhradu ADHD vyšetrenia si potvrďte", en: "Confirm ADHD assessment coverage" },
    details: { sk: "Zverejnená stránka sa venuje vyšetreniu ADOS-2 a ambulancii klinickej psychológie, nie výslovne diagnostike ADHD. Pred objednaním si potvrďte, či ambulancia vykonáva ADHD vyšetrenie a aký je jeho doplatok.", en: "The linked page describes ADOS-2 and clinical psychology services, not ADHD assessment specifically. Confirm whether the clinic offers ADHD assessment and what the co-payment is before booking." },
    href: "https://centrumnarnia.sk/nase-aktivity/ambulancia-klinickej-psychologie-ados-2/", phone: "+421950418604", email: "pomoc@centrumnarnia.sk",
    sourceLabel: { sk: "Služby a kontakt ambulancie", en: "Clinic services and contact" },
  },
  {
    id: "psychologia-nitra",
    city: "Nitra",
    regionId: 4,
    serviceMode: "inPerson",
    insuranceType: "contracted",
    title: "Ambulancia klinickej psychológie Nitra",
    address: "Pivovarská 1, Nitra",
    audience: "youngPeople",
    price: { sk: "Cenu ADHD vyšetrenia si potvrďte v ambulancii", en: "Confirm the ADHD assessment fee with the clinic" },
    insurance: { sk: "Zmluvná VšZP, Dôvera a Union; úhradu ADHD výkonu si overte", en: "Contracts with VšZP, Dôvera and Union; confirm coverage for ADHD assessment" },
    details: { sk: "Ambulancia uvádza klinicko-psychologickú prácu s deťmi s poruchou pozornosti a hyperaktivitou (ADHD/ADD) a komplexné psychologické vyšetrenia. Overte si, či konkrétne vyšetrenie zodpovedá vašej potrebe.", en: "The clinic lists clinical psychology for children with attention deficit and hyperactivity (ADHD/ADD) and comprehensive psychological assessments. Confirm that its specific assessment matches your needs." },
    href: "https://psychologianitra.sk/kontakt", phone: "+421907154449", email: "ambulancia.zatkova@psychologianitra.sk",
    sourceLabel: { sk: "Služby a diagnostika", en: "Services and assessment" },
  },
  {
    id: "psycherhesis",
    city: "Trenčín",
    regionId: 3,
    serviceMode: "inPerson",
    insuranceType: "contracted",
    title: "PsycheRhesis – klinická psychológia",
    address: "Poliklinika JUH, Halalovka 63, Trenčín",
    audience: "youngPeople",
    price: { sk: "Psychologické vyšetrenie 40 €/hod. · posudok 15–30 €", en: "Psychological assessment €40/hour · report €15–30" },
    insurance: { sk: "Zmluvný partner Dôvery; úhradu si potvrďte", en: "Contracted with Dôvera; confirm coverage" },
    details: { sk: "Ambulancia uvádza psychodiagnostiku poruchy aktivity a pozornosti (ADHD) u detí. Cena a poistné krytie sa môžu líšiť podľa účelu vyšetrenia.", en: "The clinic lists psychodiagnostic assessment of activity and attention disorder (ADHD) in children. Fees and insurance coverage may depend on the purpose of the assessment." },
    href: "https://www.psycherhesis.sk/sluzby.html", phone: "+421903830268", email: "petra.durkechova@gmail.com",
    sourceLabel: { sk: "Diagnostika ADHD a cenník", en: "ADHD assessment and pricing" },
  },
  {
    id: "vrabec",
    city: null,
    regionId: null,
    serviceMode: "online",
    insuranceType: "unknown",
    title: "Vrabec.Care – podpora pre dospelých s ADHD",
    address: "Online pre dospelých; sídlo v Banskej Bystrici",
    audience: "adults",
    price: { sk: "Cena na stránke nie je zverejnená", en: "Price not published on the website" },
    insurance: { sk: "Poistné krytie na stránke nie je uvedené", en: "Insurance coverage not stated on the website" },
    details: { sk: "Online podpora a služby pre dospelých s ADHD. Web neuvádza, že by išlo o diagnostické vyšetrenie; pred objednaním si overte dostupné služby a cenu.", en: "Online support and services for adults with ADHD. The website does not identify this as a diagnostic assessment; confirm available services and fees before booking." },
    href: "https://vrabec.care/", email: "info@vrabec.care",
    sourceLabel: { sk: "Služby a kontakt", en: "Services and contact" },
  },
];

// Community-suggested providers. Treat ADHD-specific service details as unconfirmed
// unless the provider's own current information explicitly verifies them.
const communityCentres: RawCentre[] = [
  {
    id: "community-psyche-educa", city: "Bratislava", regionId: 1, serviceMode: "inPerson", insuranceType: "unknown",
    title: "Psyche Educa – klinická psychológia", address: "Račianska 64D, Bratislava",
    audience: "adults", phone: "+421907711543", email: "info@psycheeduca.sk", href: "https://sluzby.psycheeduca.sk/index.php/kontakt",
    price: { sk: "Aktuálny cenník si overte na pracovisku", en: "Confirm current fees with the provider" },
    insurance: { sk: "Úhradu si overte u pracoviska a poisťovne", en: "Confirm coverage with the provider and insurer" },
    details: { sk: "Ambulancia klinickej psychológie. Konkrétny rozsah ADHD diagnostiky a termíny si potvrďte priamo pri objednaní.", en: "Clinical psychology practice. Confirm the scope of ADHD assessment and appointment availability directly when booking." },
    sourceLabel: { sk: "Web a kontakt pracoviska", en: "Provider website and contact" }, origin: "community",
  },
  {
    id: "community-ad-clinic", city: "Bratislava", regionId: 1, serviceMode: "inPerson", insuranceType: "unknown",
    title: "AD CLINIC – ADHD službu si overte", address: "Poliklinika Tehelná, Tehelná 26, Bratislava", audience: "adults",
    phone: "+421945506507", email: "info@adclinic.sk", href: "https://adclinic.sk/kontakt",
    price: { sk: "Aktuálnu cenu si overte u pracoviska", en: "Confirm the current fee with the provider" },
    insurance: { sk: "Úhradu si overte u pracoviska a poisťovne", en: "Confirm coverage with the provider and insurer" },
    details: { sk: "AD CLINIC poskytuje zdravotnú starostlivosť v oblasti závislostí. ADHD diagnostika nie je na ich webe potvrdená; kontakt slúži na overenie tipu.", en: "AD CLINIC provides addiction-related care. ADHD assessment is not confirmed on its website; use the contact to check this lead." },
    sourceLabel: { sk: "Web a kontakt pracoviska", en: "Provider website and contact" }, origin: "community",
  },
  {
    id: "community-mentart", city: "Bratislava", regionId: 1, serviceMode: "inPerson", insuranceType: "contracted",
    title: "MentART – psychiatrická ambulancia", address: "Zdravotné stredisko, Pohraničníkov 699, Bratislava–Rusovce", audience: "adults",
    email: "rusovce@mentart.sk", href: "https://www.mentart.sk/ambulancia/",
    price: { sk: "Cenník si overte u ambulancie", en: "Confirm fees with the clinic" },
    insurance: { sk: "Web uvádza zmluvy s VšZP, Dôvera a Union; ADHD výkon si overte", en: "Website lists VšZP, Dôvera and Union contracts; confirm ADHD coverage" },
    details: { sk: "Ambulancia poskytuje psychiatrickú starostlivosť pre dospelých aj deti. Web neuvádza ADHD diagnostiku ako konkrétnu službu.", en: "The clinic provides psychiatric care for adults and children. Its website does not list ADHD assessment as a specific service." },
    sourceLabel: { sk: "Web a kontakt pracoviska", en: "Provider website and contact" }, origin: "community",
  },
  {
    id: "community-gerin", city: "Svätý Jur", regionId: 1, serviceMode: "inPerson", insuranceType: "contracted",
    title: "GERIN – psychiatrická ambulancia", address: "Muškátová 2042/2, Svätý Jur", audience: "adults",
    phone: "+421220744160", email: "ambulancia@psychiaterprevas.sk", href: "https://www.e-vuc.sk/bsk/zdravotnictvo/ambulantne-zdravotnicke-zariadenia/pezinok/psychiatricka-ambulancia-svaty-jur-gerin.html?page_id=143522",
    price: { sk: "Cenu ADHD vyšetrenia si overte", en: "Confirm ADHD assessment fees" },
    insurance: { sk: "Zmluvná VšZP, Dôvera a Union; výkon si overte", en: "Contracts with VšZP, Dôvera and Union; confirm coverage" },
    details: { sk: "Oficiálny zdravotnícky register uvádza psychiatrickú ambulanciu a zmluvy s poisťovňami. ADHD diagnostiku ani cenu sa nepodarilo potvrdiť na oficiálnom webe — overte si ich telefonicky.", en: "The official health register lists a psychiatric clinic and insurer contracts. ADHD assessment and its price could not be confirmed on an official website; please ask by phone." },
    sourceLabel: { sk: "Zdravotnícky register a kontakt", en: "Health register and contact" }, origin: "community",
  },
  {
    id: "community-misanicova", city: "Bratislava", regionId: 1, serviceMode: "inPerson", insuranceType: "contracted",
    title: "Ambulancia klinickej psychológie – PhDr. Etela Mišaničová", address: "Poliklinika Šustekova, Šustekova 2, Bratislava", audience: "adults",
    phone: "+421918875961", email: "misanicova@centrum.sk", href: "https://www.klinickapsychologia.sk/",
    price: { sk: "Cenník si overte v ambulancii", en: "Confirm the fee with the clinic" },
    insurance: { sk: "Uvádza zmluvy s VšZP, Dôvera a Union; konkrétny výkon si overte", en: "Lists VšZP, Dôvera and Union contracts; confirm coverage for the service" },
    details: { sk: "Ambulancia klinickej psychológie. Jej web uvádza psychodiagnostiku, nie však osobitne ADHD; rozsah vyšetrenia si potvrďte pri objednaní.", en: "Clinical psychology practice. Its website lists psychological assessment, but not ADHD specifically; confirm the assessment scope when booking." },
    sourceLabel: { sk: "Web a kontakt ambulancie", en: "Clinic website and contact" }, origin: "community",
  },
  {
    id: "community-psychokonzult", city: "Bratislava", regionId: 1, serviceMode: "inPerson", insuranceType: "unknown",
    title: "PsychoKonzult – klinická psychológia", address: "Družstevná 2 (vchod Vajnorská 8/A), Bratislava", audience: "adults",
    phone: "+421905480700", email: "info@psychokonzult.sk", href: "https://www.psychokonzult.sk/kontakt/",
    price: { sk: "Cenník psychodiagnostiky si overte u pracoviska", en: "Confirm psychological assessment fees" },
    insurance: { sk: "Úhradu si overte u pracoviska a poisťovne", en: "Confirm coverage with provider and insurer" },
    details: { sk: "Pracovisko poskytuje klinickú psychológiu a psychodiagnostiku. Konkrétnu diagnostiku ADHD ani jej cenu si potvrďte priamo pri objednaní.", en: "The clinic provides clinical psychology and psychological assessment. Confirm ADHD assessment and its fee directly when booking." },
    sourceLabel: { sk: "Web a kontakt pracoviska", en: "Provider website and contact" }, origin: "community",
  },
  {
    id: "community-psychocentrum-presov", city: "Prešov", regionId: 7, serviceMode: "inPerson", insuranceType: "unknown",
    title: "Psychocentrum Prešov – klinická psychológia a EEG biofeedback",
    address: "Vajanského 21, Prešov",
    audience: "both", phone: "+421517703773", email: "psychocentrum@psychocentrum.sk", href: "https://www.psychocentrum.sk/",
    price: { sk: "Aktuálnu cenu si overte v centre", en: "Confirm current fees with the centre" },
    insurance: { sk: "Úhradu poisťovňou si overte v centre", en: "Confirm insurance coverage with the centre" },
    details: { sk: "Pracovisko uvádza ambulanciu klinickej a dopravnej psychológie a EEG biofeedback centrum. Diagnostiku ADHD uviedli respondenti dotazníka; konkrétny rozsah, vekové hranice a cenu si potvrďte priamo v centre.", en: "The provider lists clinical and traffic psychology services and an EEG biofeedback centre. ADHD assessment was reported by survey respondents; confirm the exact scope, age range and fee directly with the centre." },
    sourceLabel: { sk: "Web a kontakt pracoviska", en: "Provider website and contact" }, origin: "community",
  },
];

const psychiatristIds = new Set(["community-mentart", "community-gerin"]);
const supportIds = new Set(["vrabec", "community-ad-clinic"]);
// Address-level coordinates geocoded from the listed provider addresses.
const providerCoordinates: Record<string, [number, number]> = {
  trea: [48.1981068, 17.1404958],
  inmea: [48.1263408, 17.0971513],
  szu: [48.1678978, 17.0890624],
  salvus: [48.1582298, 17.1560762],
  calma: [48.145991, 17.1026957],
  narnia: [48.9920027, 21.2482275],
  "psychologia-nitra": [48.2997705, 18.081839],
  psycherhesis: [48.870985, 18.0483865],
  "community-psyche-educa": [48.1779764, 17.1298564],
  "community-ad-clinic": [48.1644395, 17.1286833],
  "community-mentart": [48.05072, 17.14997],
  "community-gerin": [48.25446, 17.22058],
  "community-misanicova": [48.128457, 17.1238464],
  "community-psychokonzult": [48.1594245, 17.1301112],
  "community-psychocentrum-presov": [48.9956368, 21.2472838],
};
const allCentres: Centre[] = [...centres, ...communityCentres].map((centre) => ({
  ...centre,
  providerType: psychiatristIds.has(centre.id) ? "psychiatrist" : supportIds.has(centre.id) ? "support" : "psychologist",
  coordinates: providerCoordinates[centre.id] ?? null,
}));

const copy = {
  sk: {
    eyebrow: "PRAKTICKÁ POMOC",
    title: "Kde hľadať pomoc pri ADHD",
    intro: "Prehľad pracovísk, psychiatrov, psychológov a podporných služieb. Nie každé pracovisko poskytuje ADHD diagnostiku; rozsah starostlivosti si potvrď priamo u odborníka.",
    all: "Všetky",
    adults: "Dospelí",
    youngPeople: "Deti a dospievajúci",
    mapTitle: "Pracoviská na Slovensku",
    mapCaption: "Mestá a cesty sa zobrazia pri priblížení",
    listTab: "Zoznam",
    mapTab: "Mapa",
    filters: "Filtre",
    region: "Kraj",
    allRegions: "Všetky kraje",
    specialistType: "Typ pomoci",
    allSpecialists: "Všetci odborníci",
    psychologists: "Psychológovia",
    psychiatrists: "Psychiatri",
    supportServices: "Podpora",
    neurologists: "Neurológovia",
    therapists: "Psychoterapeuti",
    insuranceFilter: "Úhrada",
    contracted: "Zmluvná poisťovňa",
    selfPay: "Samoplatca",
    onlineOnly: "Zobraziť online služby",
    layers: "Vrstvy",
    zoomIn: "Priblížiť mapu",
    zoomOut: "Oddialiť mapu",
    resetMap: "Obnoviť pohľad mapy",
    fullscreen: "Zobraziť mapu na celú obrazovku",
    exitFullscreen: "Zavrieť mapu na celú obrazovku",
    mapLegend: "Psychológ",
    communityLegend: "Psychiater",
    supportLegend: "Podporná služba",
    communityTip: "tip na overenie",
    communityTips: "tipy na overenie",
    dragHint: "Priblížiť: tlačidlami alebo gestom · reset ↺",
    searchPlaceholder: "Hľadať pracovisko, mesto alebo službu",
    noResults: "Nenašli sa žiadne pracoviská. Skús iné hľadanie alebo filter.",
    oneCentre: "záznam",
    manyCentres: "záznamov",
    listTitle: "Odborníci a pracoviská",
    price: "Cena",
    insurance: "Poisťovňa",
    audience: "Pre koho",
    adultTag: "Dospelí",
    youngTag: "Deti a dospievajúci",
    bothTag: "Dospelí aj mladí",
    online: "Online pre celé Slovensko",
    cityGroup: "mestá",
    source: "Overiť na stránke pracoviska",
    noteTitle: "Pred objednaním si over",
    note: "Pred objednaním si over aktuálnu dostupnosť, vekovú hranicu, konečnú cenu, zmluvu s poisťovňou a to, či vyšetrenie poskytne psychologický podklad alebo lekársku diagnózu. Táto mapa nenahrádza odborné vyšetrenie.",
    updated: "Kontaktné a cenové údaje sa môžu meniť; potvrď si ich priamo u poskytovateľa.",
    selected: "Vybrané pracovisko",
    onlineLabel: "Online",
    communitySource: "Tip na pracovisko · ADHD službu si potvrďte",
    contact: "Kontakt",
    website: "Web pracoviska",
    directions: "Trasa",
    addListing: "Pridať pracovisko alebo odborníka",
    addListingTitle: "Doplniť pracovisko do mapy",
    addListingIntro: "Vyplnené pracovisko sa po odoslaní automaticky zobrazí na mape. Zverejňujú sa len verejné kontakty pracoviska.",
    listingType: "Čo chceš pridať?",
    workplace: "Pracovisko",
    professional: "Odborník / odborníčka",
    providerKind: "Typ odborníka alebo služby",
    kindPsychologist: "Psychológ / klinický psychológ",
    kindPsychiatrist: "Psychiater / detský psychiater",
    kindNeurologist: "Neurológ / detský neurológ",
    kindTherapist: "Psychoterapeut",
    kindSupport: "Podporná služba / koučing",
    kindOther: "Iný odborník alebo pracovisko",
    listingName: "Názov pracoviska alebo meno odborníka",
    listingCity: "Mesto",
    listingRegion: "Kraj",
    chooseRegion: "Vyber kraj",
    addressLabel: "Adresa pracoviska (ak je relevantná)",
    serviceMode: "Forma služby",
    inPerson: "Osobne na pracovisku",
    bothModes: "Osobne aj online",
    listingAudience: "Pre koho",
    audienceAdults: "Dospelí",
    audienceYoung: "Deti a dospievajúci",
    audienceBoth: "Dospelí aj deti a dospievajúci",
    adhdServices: "Akú pomoc v súvislosti s ADHD poskytuje?",
    serviceAssessment: "Psychologické ADHD vyšetrenie / správa",
    serviceDiagnosis: "Psychiatrická diagnostika ADHD",
    serviceMedication: "Liečba / nastavenie liekov",
    serviceTherapy: "Psychoterapia alebo poradenstvo",
    serviceSupport: "Podpora, koučing alebo tréning",
    serviceBiofeedback: "Biofeedback / neurofeedback",
    serviceOther: "Iné (uveď v poznámke)",
    priceLabel: "Cena vyšetrenia alebo služby (ak je známa)",
    insuranceType: "Úhrada",
    insuranceContracted: "Poisťovňa (uveď ktorú)",
    insuranceSelfPay: "Samoplatca",
    insuranceMixed: "Poisťovňa aj samoplatca",
    insuranceUnknown: "Neviem / treba overiť",
    insuranceDetails: "Poisťovne alebo podmienky úhrady",
    waitingTime: "Čakacia doba (ak je známa)",
    acceptingPatients: "Prijíma nových pacientov?",
    acceptingYes: "Áno",
    acceptingNo: "Nie",
    acceptingUnknown: "Neviem",
    websiteLabel: "Webová stránka",
    phoneLabel: "Verejné telefónne číslo",
    emailLabel: "Verejný e-mail pracoviska",
    mapUrlLabel: "Odkaz na polohu v Google Maps alebo inej mape",
    sourceUrlLabel: "Zdroj, kde sa dajú overiť tieto údaje",
    noteLabel: "Ďalšie dôležité informácie (napr. vek, priebeh, odporúčanie lekára)",
    sendSuggestion: "Pridať na mapu",
    cancel: "Zrušiť",
    onlineMode: "Online",
    bothMode: "Osobne aj online",
    inPersonMode: "Osobne na pracovisku",
    submissionEmailNote: "Údaje sa zverejnia automaticky. Posielaj len informácie, ktoré patria na verejný profil pracoviska.",
    required: "Povinné polia sú označené *.",
    waitTime: "Čakanie",
    accepting: "Noví pacienti",
    coordinatesLabel: "Poloha pracoviska – zadaj GPS súradnice alebo vlož odkaz z mapy, ktorý ich obsahuje",
    consentLabel: "Súhlasím so zverejnením uvedených pracovných kontaktov a údajov na mape.",
    thankYouTitle: "Ďakujeme, že pomáhate!",
    thankYouMessage: "Pracovisko bolo pridané do mapy. Ďakujeme za pomoc komunite ADHD Slovakia.",
    duplicateMessage: "Podobný záznam už v mape existuje. Skontrolujte názov, adresu a kontakt.",
    submissionError: "Údaje sa nepodarilo odoslať. Skúste to, prosím, znova.",
    coordinatesError: "Pre osobné pracovisko pridajte súradnice alebo odkaz na polohu z mapy.",
    sending: "Odosielam…",
    closeThankYou: "Hotovo",
  },
  en: {
    eyebrow: "PRACTICAL SUPPORT",
    title: "Where to find ADHD support",
    intro: "Browse clinics, psychiatrists, psychologists and support services. Not every listing offers ADHD assessment; confirm the scope of care directly with the provider.",
    all: "All",
    adults: "Adults",
    youngPeople: "Children and teens",
    mapTitle: "Providers in Slovakia",
    mapCaption: "Cities and roads appear as you zoom in",
    listTab: "List",
    mapTab: "Map",
    filters: "Filters",
    region: "Region",
    allRegions: "All regions",
    specialistType: "Type of support",
    allSpecialists: "All providers",
    psychologists: "Psychologists",
    psychiatrists: "Psychiatrists",
    supportServices: "Support services",
    neurologists: "Neurologists",
    therapists: "Psychotherapists",
    insuranceFilter: "Coverage",
    contracted: "Insurer contracted",
    selfPay: "Self-pay",
    onlineOnly: "Show online services",
    layers: "Layers",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetMap: "Reset map view",
    fullscreen: "View map fullscreen",
    exitFullscreen: "Close fullscreen map",
    mapLegend: "Psychologist",
    communityLegend: "Psychiatrist",
    supportLegend: "Support service",
    communityTip: "lead to verify",
    communityTips: "leads to verify",
    dragHint: "Zoom with controls or gestures · reset ↺",
    searchPlaceholder: "Search provider, city or service",
    noResults: "No providers match your search. Try another term or filter.",
    oneCentre: "entry",
    manyCentres: "entries",
    listTitle: "Specialists and clinics",
    price: "Price",
    insurance: "Insurance",
    audience: "For",
    adultTag: "Adults",
    youngTag: "Children and teens",
    bothTag: "Adults and young people",
    online: "Online across Slovakia",
    cityGroup: "cities",
    source: "Verify on provider's website",
    noteTitle: "Before booking, confirm",
    note: "Before booking, confirm current availability, age limits, total cost, insurer contracts, and whether the result is a psychological report or medical diagnosis. This map does not replace a professional assessment.",
    updated: "Contact and pricing details can change; confirm them with the provider.",
    selected: "Selected provider",
    onlineLabel: "Online",
    communitySource: "Community lead · confirm ADHD service with provider",
    contact: "Contact",
    website: "Provider website",
    directions: "Directions",
    addListing: "Suggest a provider or professional",
    addListingTitle: "Suggest a map listing",
    addListingIntro: "After submission, the workplace will appear on the map automatically. Only public workplace contact details are published.",
    listingType: "What would you like to suggest?",
    workplace: "Workplace / clinic",
    professional: "Professional",
    providerKind: "Professional or service type",
    kindPsychologist: "Psychologist / clinical psychologist",
    kindPsychiatrist: "Psychiatrist / child psychiatrist",
    kindNeurologist: "Neurologist / child neurologist",
    kindTherapist: "Psychotherapist",
    kindSupport: "Support service / coaching",
    kindOther: "Other specialist or workplace",
    listingName: "Clinic name or professional's name",
    listingCity: "City",
    listingRegion: "Region",
    chooseRegion: "Choose a region",
    addressLabel: "Workplace address (if applicable)",
    serviceMode: "Service format",
    inPerson: "In person at a workplace",
    bothModes: "In person and online",
    listingAudience: "Who is it for?",
    audienceAdults: "Adults",
    audienceYoung: "Children and teens",
    audienceBoth: "Adults, children and teens",
    adhdServices: "Which ADHD-related services are offered?",
    serviceAssessment: "Psychological ADHD assessment / report",
    serviceDiagnosis: "Psychiatric ADHD diagnosis",
    serviceMedication: "Treatment / medication management",
    serviceTherapy: "Psychotherapy or counselling",
    serviceSupport: "Support, coaching or skills training",
    serviceBiofeedback: "Biofeedback / neurofeedback",
    serviceOther: "Other (describe in the notes)",
    priceLabel: "Assessment or service price (if known)",
    insuranceType: "Payment / insurance",
    insuranceContracted: "Insurance (name the insurer)",
    insuranceSelfPay: "Self-pay",
    insuranceMixed: "Insurance and self-pay",
    insuranceUnknown: "Unknown / confirm with provider",
    insuranceDetails: "Insurers or payment details",
    waitingTime: "Waiting time (if known)",
    acceptingPatients: "Accepting new patients?",
    acceptingYes: "Yes",
    acceptingNo: "No",
    acceptingUnknown: "Unknown",
    websiteLabel: "Website",
    phoneLabel: "Public phone number",
    emailLabel: "Public workplace email",
    mapUrlLabel: "Google Maps or other map location link",
    sourceUrlLabel: "Source to verify these details",
    noteLabel: "Additional important details (age, process, referral requirements)",
    sendSuggestion: "Add to the map",
    cancel: "Cancel",
    onlineMode: "Online",
    bothMode: "In person and online",
    inPersonMode: "In person at a workplace",
    submissionEmailNote: "Details are published automatically. Submit only information suitable for a public provider profile.",
    required: "Fields marked * are required.",
    waitTime: "Waiting time",
    accepting: "New patients",
    coordinatesLabel: "Workplace location – enter GPS coordinates or paste a map link that contains them",
    consentLabel: "I agree to publish the workplace contact details and information provided on the map.",
    thankYouTitle: "Thank you for helping!",
    thankYouMessage: "The provider has been added to the map. Thank you for supporting the ADHD Slovakia community.",
    duplicateMessage: "A similar listing is already on the map. Please check the name, address and contact details.",
    submissionError: "We could not submit the details. Please try again.",
    coordinatesError: "For in-person listings, add coordinates or a map location link.",
    sending: "Submitting…",
    closeThankYou: "Done",
  },
} satisfies Record<Locale, Record<string, string>>;

const regionNames: Record<Locale, Record<RegionId, string>> = {
  sk: { 1: "Bratislavský kraj", 2: "Trnavský kraj", 3: "Trenčiansky kraj", 4: "Nitriansky kraj", 5: "Žilinský kraj", 6: "Banskobystrický kraj", 7: "Prešovský kraj", 8: "Košický kraj" },
  en: { 1: "Bratislava Region", 2: "Trnava Region", 3: "Trenčín Region", 4: "Nitra Region", 5: "Žilina Region", 6: "Banská Bystrica Region", 7: "Prešov Region", 8: "Košice Region" },
};
export default function DiagnosisMap({ locale, initialListings = [] }: { locale: Locale; initialListings?: MapListing[] }) {
  const text = copy[locale];
  const [filter, setFilter] = useState<AgeFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionId | "all">("all");
  const [insuranceFilter, setInsuranceFilter] = useState<InsuranceFilter>("all");
  const [providerTypeFilter, setProviderTypeFilter] = useState<ProviderType | "all">("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedId, setSelectedId] = useState("trea");
  const selectedDetailsRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"map" | "list">("map");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [savedListings, setSavedListings] = useState<MapListing[]>(initialListings);
  const [submissionState, setSubmissionState] = useState<"idle" | "sending" | "success" | "duplicate" | "coordinates" | "error">("idle");
  const selectProvider = (id: string) => {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 820px)").matches) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        selectedDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }));
    }
  };
  useEffect(() => {
    if (initialListings.length) return;
    fetch("/api/map-listings", { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { listings?: MapListing[] }) => setSavedListings(Array.isArray(data.listings) ? data.listings : []))
      .catch(() => undefined);
  }, [initialListings.length]);
  const dynamicCentres = useMemo<Centre[]>(() => savedListings.map((listing) => {
    const providerType: ProviderType = ["psychologist", "psychiatrist", "neurologist", "therapist", "support"].includes(listing.providerKind) ? listing.providerKind as ProviderType : "support";
    const serviceText = listing.services.map((service) => ({ assessment: text.serviceAssessment, diagnosis: text.serviceDiagnosis, medication: text.serviceMedication, therapy: text.serviceTherapy, support: text.serviceSupport, biofeedback: text.serviceBiofeedback, other: text.serviceOther }[service])).filter(Boolean).join(", ");
    const details = [serviceText ? `${text.adhdServices}: ${serviceText}` : "", listing.details].filter(Boolean).join(" · ") || (listing.locale === "en" ? "Community-submitted ADHD support listing." : "Tip od komunity na ADHD podporu.");
    return {
      id: listing.id, city: listing.city || null, regionId: listing.regionId as RegionId | null,
      serviceMode: listing.serviceMode, insuranceType: listing.insuranceType === "contracted" ? "contracted" : listing.insuranceType === "selfPay" ? "selfPay" : "unknown",
      title: listing.name, address: listing.address, audience: listing.audience,
      price: { sk: listing.price || "Cenu si overte u pracoviska", en: listing.price || "Confirm fees with the provider" },
      insurance: { sk: listing.insuranceDetails || "Úhradu si overte", en: listing.insuranceDetails || "Confirm coverage with the provider" },
      details: { sk: details, en: details }, href: listing.website || listing.sourceUrl || (listing.email ? `mailto:${listing.email}` : listing.mapUrl || "#"),
      phone: listing.phone || undefined, email: listing.email || undefined, sourceLabel: { sk: "Údaje od komunity", en: "Community-submitted information" }, origin: "community",
      waitTime: listing.waitingTime ? { sk: listing.waitingTime, en: listing.waitingTime } : undefined,
      accepting: listing.accepting === "unknown" ? undefined : { sk: listing.accepting === "yes" ? text.acceptingYes : text.acceptingNo, en: listing.accepting === "yes" ? text.acceptingYes : text.acceptingNo },
      providerType, coordinates: listing.coordinates,
    };
  }), [savedListings, text]);
  const visibleCentres = useMemo(() => [...allCentres, ...dynamicCentres].filter((centre) => {
    if (providerTypeFilter !== "all" && centre.providerType !== providerTypeFilter) return false;
    if (filter !== "all" && centre.audience !== "both" && centre.audience !== filter) return false;
    if (regionFilter !== "all" && centre.regionId !== regionFilter) return false;
    if (insuranceFilter !== "all" && centre.insuranceType !== insuranceFilter) return false;
    if (onlineOnly && centre.serviceMode === "inPerson") return false;
    return true;
  }), [dynamicCentres, filter, insuranceFilter, onlineOnly, providerTypeFilter, regionFilter]);
  const matchingCentres = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return visibleCentres;
    return visibleCentres.filter((centre) => [centre.title, centre.city, centre.address, centre.details[locale], centre.price[locale], centre.regionId ? regionNames[locale][centre.regionId] : null]
      .filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedQuery));
  }, [locale, query, visibleCentres]);
  const selected = matchingCentres.find((centre) => centre.id === selectedId) ?? matchingCentres[0];
  const audienceLabel = (audience: Centre["audience"]) => audience === "adults" ? text.adultTag : audience === "youngPeople" ? text.youngTag : text.bothTag;
  const directionsUrl = (centre: Centre) => {
    if (!centre.coordinates) return undefined;
    const [latitude, longitude] = centre.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };
  const openDirections = (event: MouseEvent<HTMLAnchorElement>, centre: Centre) => {
    if (!centre.coordinates || typeof navigator === "undefined") return;
    const [latitude, longitude] = centre.coordinates;
    const destination = `${latitude},${longitude}`;
    const label = encodeURIComponent(`${centre.title}, ${centre.address}`);
    if (/android/i.test(navigator.userAgent)) {
      event.preventDefault();
      window.location.assign(`geo:0,0?q=${destination}(${label})`);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      event.preventDefault();
      window.location.assign(`https://maps.apple.com/?daddr=${destination}&dirflg=d&q=${label}`);
    }
  };

  const selectRegion = (region: RegionId | "all") => {
    setRegionFilter(region);
  };

  useEffect(() => {
    if (!mapFullscreen && !submissionOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMapFullscreen(false);
        setSubmissionOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mapFullscreen, submissionOpen]);

  const submitListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const coordinatesFromUrl = (url: string): [number, number] | null => {
      try {
        const parsed = new URL(url);
        for (const key of ["ll", "center", "coordinate", "q", "query", "destination"]) {
          const value = parsed.searchParams.get(key);
          const match = value?.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,.*)?$/);
          if (match) return [Number(match[1]), Number(match[2])];
        }
      } catch { /* Continue with coordinate patterns in non-standard map links. */ }
      const patterns = [/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/, /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, /[?&](?:ll|center|coordinate|q|query|destination)=(-?\d+(?:\.\d+)?)(?:%2C|,)\s*(-?\d+(?:\.\d+)?)/i];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return [Number(match[1]), Number(match[2])];
      }
      return null;
    };
    const lat = String(values.get("latitude") ?? "").trim();
    const lng = String(values.get("longitude") ?? "").trim();
    const mapUrl = String(values.get("mapUrl") ?? "").trim();
    const coordinates = lat && lng ? [Number(lat), Number(lng)] : coordinatesFromUrl(mapUrl);
    if (values.get("serviceMode") !== "online" && !coordinates) { setSubmissionState("coordinates"); return; }
    const normalize = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const name = String(values.get("name") ?? "").trim();
    const city = String(values.get("city") ?? "").trim();
    const address = String(values.get("address") ?? "").trim();
    const phone = String(values.get("phone") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const isDuplicate = [...allCentres, ...savedListings.map((listing) => ({ title: listing.name, city: listing.city, address: listing.address, phone: listing.phone, email: listing.email }))]
      .some((entry) => (normalize(entry.title) === normalize(name) && normalize(entry.city ?? "") === normalize(city)) || Boolean(address && normalize(entry.address) === normalize(address) && normalize(entry.city ?? "") === normalize(city)) || Boolean(email && entry.email && normalize(entry.email) === normalize(email)) || Boolean(phone && entry.phone && normalize(entry.phone) === normalize(phone)));
    if (isDuplicate) { setSubmissionState("duplicate"); return; }
    setSubmissionState("sending");
    try {
      const response = await fetch("/api/map-listings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, city, address, regionId: values.get("region"), listingType: values.get("listingType"), providerKind: values.get("providerKind"), serviceMode: values.get("serviceMode"),
          audience: values.get("audience"), services: values.getAll("services"), price: values.get("price"), insuranceType: values.get("insuranceType"),
          insuranceDetails: values.get("insuranceDetails"), waitingTime: values.get("waitingTime"), accepting: values.get("accepting"), phone, email,
          website: values.get("website"), mapUrl, sourceUrl: values.get("sourceUrl"), details: values.get("note"), locale,
          coordinates: values.get("serviceMode") === "online" ? null : coordinates,
          companyWebsite: values.get("companyWebsite"), consent: values.get("consent"),
        }),
      });
      if (response.status === 409) { setSubmissionState("duplicate"); return; }
      if (response.status === 400) {
        const errorBody = await response.json() as { error?: string };
        if (errorBody.error === "coordinates_required") { setSubmissionState("coordinates"); return; }
        throw new Error("Invalid listing");
      }
      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json() as { listing: MapListing };
      if (result.listing) setSavedListings((current) => [result.listing, ...current]);
      setSubmissionState("success");
      form.reset();
    } catch {
      setSubmissionState("error");
    }
  };

  return (
    <section id="diagnosis-map" className={`${styles.section} scroll-mt-24`} aria-labelledby="diagnosis-map-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}><span />{text.eyebrow}</p>
        <h2 id="diagnosis-map-title">{text.title}</h2>
        <p>{text.intro}</p>
      </div>

      <div className={styles.submissionBar}>
        <span>{locale === "en" ? "Know a service we should include?" : "Poznáš pracovisko alebo odborníka, ktorý tu chýba?"}</span>
        <button className={styles.addAction} type="button" onClick={() => { setSubmissionState("idle"); setSubmissionOpen(true); }} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>{text.addListing}
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.viewTabs} role="tablist" aria-label={locale === "en" ? "Directory view" : "Zobrazenie adresára"}>
          <button type="button" role="tab" aria-selected={view === "list"} onClick={() => setView("list")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>{text.listTab}<span>{matchingCentres.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={view === "map"} onClick={() => setView("map")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" /></svg>{text.mapTab}
          </button>
        </div>
        <button className={`${styles.iconAction} ${searchOpen ? styles.actionActive : ""}`} type="button" aria-label={text.searchPlaceholder} aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
        </button>
        <button className={`${styles.filterAction} ${filtersOpen ? styles.actionActive : ""}`} type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10m-7 6h4" /></svg>{text.filters}
        </button>
      </div>

      {searchOpen && <label className={styles.search}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} autoFocus />
        {query && <button type="button" onClick={() => setQuery("")} aria-label={locale === "en" ? "Clear search" : "Vymazať hľadanie"}>×</button>}
      </label>}

      {filtersOpen && <div className={styles.filterPanel}>
        <p>{text.specialistType}</p>
        <div className={styles.filters} role="group" aria-label={text.specialistType}>
          {(["all", "psychologist", "psychiatrist", "neurologist", "therapist", "support"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={providerTypeFilter === item} onClick={() => setProviderTypeFilter(item)}>
              {item === "all" ? text.allSpecialists : item === "psychologist" ? text.psychologists : item === "psychiatrist" ? text.psychiatrists : item === "neurologist" ? text.neurologists : item === "therapist" ? text.therapists : text.supportServices}
            </button>
          ))}
        </div>
        <p>{locale === "en" ? "Who is the assessment for?" : "Pre koho hľadáš vyšetrenie?"}</p>
        <div className={styles.filters} role="group" aria-label={locale === "en" ? "Filter providers by age" : "Filtrovať pracoviská podľa veku"}>
          {(["all", "adults", "youngPeople"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item === "all" ? text.all : item === "adults" ? text.adults : text.youngPeople}
            </button>
          ))}
        </div>
        <div className={styles.advancedFilters}>
          <label className={styles.regionSelect}><span>{text.region}</span><select value={regionFilter} onChange={(event) => selectRegion(event.target.value === "all" ? "all" : Number(event.target.value) as RegionId)}>
            <option value="all">{text.allRegions}</option>
            {mapRegions.map((region) => <option key={region.id} value={region.id}>{regionNames[locale][region.id as RegionId]}</option>)}
          </select></label>
          <div className={styles.filters} role="group" aria-label={text.insuranceFilter}>
            {(["all", "contracted", "selfPay"] as const).map((item) => <button key={item} type="button" aria-pressed={insuranceFilter === item} onClick={() => setInsuranceFilter(item)}>{item === "all" ? text.all : item === "contracted" ? text.contracted : text.selfPay}</button>)}
          </div>
          <label className={styles.onlineFilter}><input type="checkbox" checked={onlineOnly} onChange={(event) => setOnlineOnly(event.target.checked)} />{text.onlineOnly}</label>
        </div>
      </div>}

      <div className={`${styles.content} ${view === "list" ? styles.listOnly : ""}`}>
        {view === "map" && <div className={`${styles.mapPanel} ${mapFullscreen ? styles.fullscreen : ""}`}>
          <div className={styles.mapHeader}>
            <h3>{text.mapTitle}</h3>
            <span><span />{text.mapCaption}</span>
          </div>
          <div className={styles.map}>
            <button className={styles.mapFullscreenAction} type="button" onClick={() => setMapFullscreen((value) => !value)}>
              {mapFullscreen ? text.exitFullscreen : text.fullscreen}
            </button>
            <ProviderMap
              providers={matchingCentres.map(({ id, city, title, providerType, coordinates }) => ({ id, city, title, providerType, coordinates }))}
              selectedId={selected?.id}
              locale={locale}
              onSelect={selectProvider}
              labels={{
                zoomIn: text.zoomIn,
                zoomOut: text.zoomOut,
                reset: text.resetMap,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                choose: locale === "en" ? "Choose a provider" : "Vyber pracovisko",
              }}
            />
            <div className={styles.mapLegend} aria-label={text.specialistType}>
              <span><i className={styles.psychologistKey} />{text.mapLegend}</span>
              <span><i className={styles.communityKey} />{text.communityLegend}</span>
              <span><i className={styles.supportKey} />{text.supportLegend}</span>
            </div>
          </div>
          <p className={styles.mapHint}>{locale === "en" ? "Markers point to the listed street address. Online-only services are not pinned to a physical location." : "Značky ukazujú polohu uvedenej adresy pracoviska. Online služby nemajú fyzickú značku."}</p>
        </div>}

        <div className={styles.results}>
          <div className={styles.resultsHeading}>
            <h3>{text.listTitle}</h3>
            <span>{matchingCentres.length}</span>
          </div>
          {selected && <article ref={selectedDetailsRef} className={`${styles.selectedCard} ${styles.featuredCard}`}>
            <p className={styles.selectedLabel}>{text.selected}</p>
            <h4>{selected.title}</h4>
            <span className={`${styles.providerTypeTag} ${styles[`type-${selected.providerType}`]}`}>
              {selected.providerType === "psychiatrist" ? text.psychiatrists : selected.providerType === "neurologist" ? text.neurologists : selected.providerType === "therapist" ? text.therapists : selected.providerType === "psychologist" ? text.psychologists : text.supportServices}
            </span>
            <p className={styles.address}>{selected.city ? `${selected.address}` : text.online}</p>
            {selected.origin === "community" && <p className={styles.communityWarning}>{text.communitySource}</p>}
            <p className={styles.details}>{selected.details[locale]}</p>
            <dl className={styles.facts}>
              <div><dt>{text.price}</dt><dd>{selected.price[locale]}</dd></div>
              <div><dt>{text.insurance}</dt><dd>{selected.insurance[locale]}</dd></div>
              {selected.waitTime && <div><dt>{text.waitTime}</dt><dd>{selected.waitTime[locale]}</dd></div>}
              {selected.accepting && <div><dt>{text.accepting}</dt><dd>{selected.accepting[locale]}</dd></div>}
              <div><dt>{text.audience}</dt><dd>{audienceLabel(selected.audience)}</dd></div>
            </dl>
            <div className={styles.contactActions}>
              {selected.phone && <a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}>{selected.phone}</a>}
              {selected.email && <a href={`mailto:${selected.email}`}>{selected.email}</a>}
              {selected.href && <a href={selected.href} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>{text.website}</a>}
              {selected.coordinates && <a href={directionsUrl(selected)} onClick={(event) => openDirections(event, selected)} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>{text.directions}</a>}
            </div>
          </article>}
          {matchingCentres.length === 0 ? <p className={styles.noResults}>{text.noResults}</p> : <div className={styles.providerList}>
            {matchingCentres.filter((centre) => centre.id !== selected?.id).map((centre) => <article key={centre.id} className={styles.providerCard}>
              <button type="button" className={styles.providerSelect} onClick={() => selectProvider(centre.id)}>
                <span className={styles.providerCity}>{centre.city ?? text.online}</span>
                <strong>{centre.title}</strong>
                <span className={`${styles.providerTypeTag} ${styles[`type-${centre.providerType}`]}`}>
                  {centre.providerType === "psychiatrist" ? text.psychiatrists : centre.providerType === "neurologist" ? text.neurologists : centre.providerType === "therapist" ? text.therapists : centre.providerType === "psychologist" ? text.psychologists : text.supportServices}
                </span>
                <span className={styles.providerPrice}>{centre.price[locale]}</span>
              </button>
              {centre.href ? <a className={styles.compactLink} href={centre.href} target="_blank" rel="noreferrer" aria-label={`${text.source}: ${centre.title}`}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a> : <span className={styles.communityTag} title={text.communitySource}>●</span>}
            </article>)}
          </div>}
        </div>
      </div>

      <aside className={styles.note}>
        <span className={styles.noteIcon} aria-hidden="true">i</span>
        <div><strong>{text.noteTitle}</strong><p>{text.note}</p><small>{text.updated}</small></div>
      </aside>

      {submissionOpen && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSubmissionOpen(false); }}>
        <section className={styles.submissionDialog} role="dialog" aria-modal="true" aria-labelledby="map-submission-title">
          <button className={styles.dialogClose} type="button" onClick={() => { setSubmissionOpen(false); setSubmissionState("idle"); }} aria-label={locale === "en" ? "Close" : "Zavrieť"}>×</button>
          <p className={styles.selectedLabel}>{text.addListing}</p>
          <h3 id="map-submission-title">{text.addListingTitle}</h3>
          <p className={styles.dialogIntro}>{text.addListingIntro}</p>
          {submissionState === "success" ? <div className={styles.thankYou} role="status"><span aria-hidden="true">✓</span><h4>{text.thankYouTitle}</h4><p>{text.thankYouMessage}</p><button type="button" className={styles.addAction} onClick={() => { setSubmissionOpen(false); setSubmissionState("idle"); }}>{text.closeThankYou}</button></div> : <>
          <form className={styles.submissionForm} onSubmit={submitListing}>
            <label className={styles.honeypot} aria-hidden="true">Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
            <label>{text.listingType}<select name="listingType" defaultValue="workplace"><option value="workplace">{text.workplace}</option><option value="professional">{text.professional}</option></select></label>
              <label>{text.providerKind}<select name="providerKind" defaultValue="psychologist">
              <option value="psychologist">{text.kindPsychologist}</option><option value="psychiatrist">{text.kindPsychiatrist}</option><option value="neurologist">{text.kindNeurologist}</option><option value="therapist">{text.kindTherapist}</option><option value="support">{text.kindSupport}</option><option value="other">{text.kindOther}</option>
            </select></label>
            <div className={styles.formGrid}>
              <label>{text.listingName} *<input name="name" required maxLength={120} /></label>
              <label>{text.listingCity} *<input name="city" required maxLength={80} /></label>
              <label>{text.listingRegion}<select name="region" defaultValue=""><option value="">{text.chooseRegion}</option>{mapRegions.map((region) => <option key={region.id} value={region.id}>{regionNames[locale][region.id as RegionId]}</option>)}</select></label>
              <label>{text.addressLabel}<input name="address" maxLength={180} /></label>
              <label>{text.serviceMode}<select name="serviceMode" defaultValue="inPerson"><option value="inPerson">{text.inPersonMode}</option><option value="online">{text.onlineMode}</option><option value="both">{text.bothMode}</option></select></label>
              <label>{text.listingAudience}<select name="audience" defaultValue="both"><option value="adults">{text.audienceAdults}</option><option value="youngPeople">{text.audienceYoung}</option><option value="both">{text.audienceBoth}</option></select></label>
              <label>{text.priceLabel}<input name="price" maxLength={120} placeholder={locale === "en" ? "e.g. €120 / session" : "napr. 120 € / sedenie"} /></label>
              <label>{text.insuranceType}<select name="insuranceType" defaultValue="unknown"><option value="contracted">{text.insuranceContracted}</option><option value="selfPay">{text.insuranceSelfPay}</option><option value="mixed">{text.insuranceMixed}</option><option value="unknown">{text.insuranceUnknown}</option></select></label>
              <label>{text.insuranceDetails}<input name="insuranceDetails" maxLength={160} /></label>
              <label>{text.waitingTime}<input name="waitingTime" maxLength={100} /></label>
              <label>{text.acceptingPatients}<select name="accepting" defaultValue="unknown"><option value="yes">{text.acceptingYes}</option><option value="no">{text.acceptingNo}</option><option value="unknown">{text.acceptingUnknown}</option></select></label>
              <label>{text.phoneLabel}<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
              <label>{text.emailLabel}<input name="email" type="email" autoComplete="email" maxLength={160} /></label>
              <label>{text.websiteLabel}<input name="website" type="url" placeholder="https://" maxLength={200} /></label>
              <label>{text.mapUrlLabel}<input name="mapUrl" type="url" placeholder="https://" maxLength={300} /></label>
              <label>{text.sourceUrlLabel}<input name="sourceUrl" type="url" placeholder="https://" maxLength={300} /></label>
              <label>{text.coordinatesLabel}<div className={styles.coordinateInputs}><input name="latitude" type="number" inputMode="decimal" step="any" min="47.6" max="49.9" placeholder={locale === "en" ? "Latitude" : "Zemepisná šírka"} /><input name="longitude" type="number" inputMode="decimal" step="any" min="16.5" max="22.7" placeholder={locale === "en" ? "Longitude" : "Zemepisná dĺžka"} /></div></label>
            </div>
            <fieldset className={styles.serviceChoices}><legend>{text.adhdServices}</legend>{[["assessment", text.serviceAssessment], ["diagnosis", text.serviceDiagnosis], ["medication", text.serviceMedication], ["therapy", text.serviceTherapy], ["support", text.serviceSupport], ["biofeedback", text.serviceBiofeedback], ["other", text.serviceOther]].map(([value, label]) => <label key={value}><input type="checkbox" name="services" value={value} />{label}</label>)}</fieldset>
            <label>{text.noteLabel}<textarea name="note" rows={3} maxLength={1000} /></label>
            <label className={styles.consent}><input type="checkbox" name="consent" required />{text.consentLabel}</label>
            <small>{text.submissionEmailNote}</small>
            <small>{text.required}</small>
            {submissionState !== "idle" && submissionState !== "sending" && <p className={styles.formError} role="alert">{submissionState === "duplicate" ? text.duplicateMessage : submissionState === "coordinates" ? text.coordinatesError : text.submissionError}</p>}
            <div className={styles.dialogActions}>
              <button type="button" className={styles.cancelAction} onClick={() => { setSubmissionOpen(false); setSubmissionState("idle"); }}>{text.cancel}</button>
              <button type="submit" className={styles.addAction} disabled={submissionState === "sending"}>{submissionState === "sending" ? text.sending : text.sendSuggestion}</button>
            </div>
          </form>
          </>}
        </section>
      </div>}
    </section>
  );
}
