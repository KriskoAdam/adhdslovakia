"use client";

import { useState } from "react";

const getIcon =
  (symbol: string) =>
  ({
    size = 20,
    className = "",
  }: {
    size?: number;
    className?: string;
  }) =>
    (
      <span
        style={{ fontSize: size }}
        className={`text-green-400 ${className}`.trim()}
      >
        {symbol}
      </span>
    );

const sections = [
  {
    icon: getIcon("🧠"),
    title: "Čo je ADHD?",
    content:
      "ADHD, alebo porucha pozornosti s hyperaktivitou (Attention Deficit Hyperactivity Disorder), je neurovývojová porucha charakterizovaná pretrvávajúcimi vzorcami nepozornosti, hyperaktivity a impulzivity, ktoré narúšajú každodenné fungovanie jednotlivca. Tieto symptómy sa zvyčajne objavujú v detstve a môžu pretrvávať do dospelosti.",
  },
  {
    icon: getIcon("⚡"),
    title: "Príznaky ADHD",
    content:
      `Príznaky ADHD sa prejavujú v rôznych oblastiach života a ich intenzita sa líši v závislosti od veku, pohlavia a konkrétneho typu tejto neurodivergencie. V lekárskej praxi sa symptómy rozdeľujú do dvoch hlavných kategórií, ktorými sú nepozornosť a hyperaktivita spojená s impulzívnosťou, pričom u mnohých jedincov sa vyskytuje ich kombinovaná forma. Na rozdiel od bežnej roztržitosti sú prejavy ADHD chronické, sprevádzajú človeka od detstva a výrazne zasahujú do jeho schopnosti študovať, pracovať, organizovať si čas a budovať stabilné vzťahy.

Prvá veľká skupina príznakov sa točí okolo deficitu pozornosti a oslabených exekutívnych funkcií mozgu. Človek s ADHD má obrovské ťažkosti s udržaním koncentrácie na úlohách, ktoré preňho nie sú okamžite stimulujúce alebo zaujímavé, čo vedie k rýchlemu odbiehaniu k iným činnostiam. Typická je neschopnosť udržať detaily, robia sa takzvané chyby z nepozornosti a človek často pôsobí dojmom, že nepočúva, aj keď sa hovorí priamo k nemu. Výrazným problémom je chronická prokrastinácia, kedy je spustenie nejakej aktivity kvôli chýbajúcemu dopamínu takmer paralyzujúce. S tým úzko súvisí takzvaná časová slepota, teda neschopnosť reálne odhadnúť, koľko trvajú jednotlivé činnosti, čo ústí do chronického meškania. Oslabená pracovná pamäť spôsobuje neustále strácanie osobných vecí, zabúdanie na schôdzky a neschopnosť dokončiť rozpracované projekty, hoci na ich začiatku mohlo byť obrovské nadšenie. Špecifickým paradoxom je však schopnosť hyperfokusu, kedy sa človek pri téme, ktorá ho fascinuje, dokáže na dlhé hodiny extrémne hlboko ponoriť do práce a kompletne ignorovať celý okolitý svet.

Druhá skupina príznakov zahŕňa motorický a mentálny nepokoj spolu s impulzívnosťou. U detí sa hyperaktivita prejavuje neustálym behaním, skákaním a neschopnosťou zotrvať v pokoji, zatiaľ čo u dospelých sa tento fyzický nepokoj často transformuje do vnútorného napätia, neustáleho vírenia myšlienok a potreby aspoň neustále zamestnávať ruky či klopať nohou. Impulzívnosť sa premieta do každodenného správania ako neschopnosť počkať, kým na človeka príde rad, rýchle a neuvážené finančné či životné rozhodnutia a skákanie iným ľuďom do reči bez domyslenia následkov. K celkovému obrazu ADHD patrí aj výrazná emocionálna dysregulácia. Nízka frustračná tolerancia spôsobuje, že aj malé prekážky vyvolajú okamžitú vlnu hnevu, podráždenia alebo úzkosti, pričom tieto nálady sa môžu meniť veľmi rýchlo a nečakane, čo je dôsledkom oslabenej schopnosti prefrontálnej kôry mozgu tlmiť a korigovať prvotné emocionálne impulzy.`
  },
  {
    icon: getIcon("👶"),
    title: "ADHD u detí",
    content:
      `ADHD u detí patrí medzi najčastejšie neurovývojové poruchy a výrazne ovplyvňuje to, ako dieťa vníma svet, spracováva podnety a reaguje na svoje okolie. Na rozdiel od dospelých, u ktorých sa prejavy často presúvajú do vnútornej roviny, u detí je ADHD viditeľné najmä navonok v ich správaní, motorike a sociálnych interakciách. Nejde o prejav nevychovanosti, vzdoru alebo nízkej inteligencie, ale o dôsledok špecifického vývoja mozgových štruktúr, ktoré majú na starosti sebaovládanie, filtráciu podnetov a plánovanie. Príznaky sa zvyčajne naplno prejavia pred siedmym rokom života a sprevádzajú dieťa vo všetkých oblastiach, od rodinného zázemia až po materskú a základnú školu.

V detskom veku sa hyperaktivita a motorický nepokoj prejavujú najokatejším spôsobom. Dieťa s ADHD je v neustálom pohybe, často pôsobí, akoby bolo poháňané motorom, nedokáže vydržať sedieť na stoličke pri obede či učení a neustále sa mrví, skáče alebo behá aj v situáciách, kedy je to nevhodné. Tento fyzický nepokoj sprevádza vysoká miera impulzívnosti, ktorá dieťaťu znemožňuje domyslieť následky svojho konania pred tým, než niečo urobí. Typické je skákanie do reči dospelým aj rovesníkom, neschopnosť počkať, kým naň príde rad pri hre, a siahnie po veciach bez dovolenia. Impulzívnosť sa premieta aj do zvýšeného rizika drobných úrazov, keďže tieto deti majú prirodzene posunutý prah vnímania nebezpečenstva a chýba im vnútorná brzda, ktorá by ich pred riskantným správaním včas zastavila.

Deficit pozornosti u detí zásadne komplikuje ich schopnosť učiť sa a fungovať v štruktúrovanom prostredí. Dieťa s ADHD má obrovský problém udržať koncentráciu na úlohách, ktoré ho okamžite nebavia alebo mu neprinášajú okamžitú odmenu. Pri hre alebo školských úlohách odbieha od jednej aktivity k druhej bez toho, aby prvú dokončilo. Veľkou záťažou je oslabená pracovná pamäť, kvôli ktorej dieťa neustále stráca hračky, školské pomôcky či oblečenie a opakovane zabúda na priame pokyny rodičov. Často pôsobí dojmom, že nepočúva, keď sa naň hovorí, hoci má sluch v úplnom poriadku. Na druhej strane sa u nich objavuje aj fenomén hyperfokusu, kedy sa pri téme alebo hre, ktorá ich fascinuje – napríklad pri stavaní špecifickej stavebnice alebo sledovaní obľúbenej témy – dokážu koncentrovať tak hlboko, že úplne prestanú vnímať okolitý svet a nereagujú ani na oslovenie.

Nemenej dôležitou a často prehliadanou zložkou detského ADHD je extrémna emocionálna dysregulácia. Detský mozog s touto diagnózou nedokáže efektívne filtrovať a tlmiť intenzívne emócie, čo vedie k častejším, prudším a dlhším záchvatom hnevu, plaču alebo frustrácie aj pri zdanlivých malichernostiach. Prechod medzi absolútnou pohodou a obrovským hnevom môže nastať v priebehu sekundy. Tento nízky prah tolerancie voči neúspechu či odmietnutiu komplikuje vrstovnícke vzťahy, kedy dieťa kvôli neprimeraným reakciám pri prehrách v hrách naráža na nepochopenie kolektívu, čo môže viesť k jeho sociálnej izolácii alebo k nálepke problémového dieťaťa.

Prístup k výchove a podpore dieťaťa s ADHD si vyžaduje obrovskú mieru trpezlivosti, pochopenia a najmä zavedenie pevných externých pravidiel. Tradičné trestanie a neustála kritika u týchto detí nefungujú, naopak, prehlbujú pocity úzkosti a nízkeho sebavedomia. Omnoho efektívnejšia je pozitívna motivácia, kedy sa oceňuje každé drobné úsilie a správne správanie ihneď v momente, kedy nastane. Domáce prostredie by malo mať jasnú štruktúru s predvídateľným denným režimom, kde majú činnosti ako vstávanie, jedlo, domáce úlohy a spánok pevne stanovený čas. Inštrukcie od rodičov musia byť krátke, jasné a formulované po jednom kroku, ideálne podporené očným kontaktom. Vytvorením predvídateľného a bezpečného prostredia, kde sa dieťa cíti prijaté aj so svojou inakosťou, dokážeme výrazne zmierniť prejavy ADHD a pomôcť mu úspešne rozvíjať jeho silné stránky, ktorými bývajú kreativita, nadšenie a obrovská miera empatie.`
  },
  {
    icon: getIcon("👤"),
    title: "ADHD u dospelých",
    content:
      "ADHD (porucha pozornosti s hyperaktivitou) u dospelých sa môže prejavovať rôznymi spôsobmi a môže mať významný dopad na osobný a profesionálny život. Hoci sa ADHD často diagnostikuje v detstve, mnohí dospelí si nie sú vedomí, že majú túto poruchu, pretože symptómy sa môžu meniť a prispôsobovať s vekom.",
  },
  {
    icon: getIcon("🧬"),
    title: "Príčiny ADHD",
    content:
      `Vznik ADHD je komplexný proces, ktorý nie je spôsobený jedinou príčinou, ale je výsledkom súhry viacerých biologických, genetických a environmentálnych faktorov. Napriek pretrvávajúcim mýtom nie je táto porucha dôsledkom nesprávnej výchovy, nadmerného sledovania obrazoviek alebo konzumácie cukru. Moderná medicína a neuroveda jednoznačne definujú ADHD ako vrodenú neurovývojovú poruchu, čo znamená, že odlišnosti v štruktúre a fungovaní mozgu sú prítomné už od narodenia.

Najsilnejším faktorom pri vzniku ADHD je genetika, pričom miera dedičnosti sa odhaduje na viac ako sedemdesiat percent. Štúdie opakovane potvrdzujú, že ak má ADHD jeden z rodičov alebo súrodencov, pravdepodobnosť výskytu u ďalšieho člena rodiny dramaticky stúpa. Vedci neidentifikovali jeden konkrétny „ADHD gén“, ale skôr kombináciu viacerých génov, ktoré ovplyvňujú to, ako mozog transportuje a spracováva kľúčové chemické látky. Ide predovšetkým o neurotransmitery dopamín a noradrenalín, ktoré sú zodpovedné za prenos signálov medzi nervovými bunkami a hrajú zásadnú rolu v systéme odmeny, motivácie, riadenia pozornosti a kontroly impulzov. U jedincov s ADHD je dostupnosť týchto látok v určitých častiach mozgu znížená, čo vedie k neustálemu podvedomému vyhľadávaniu nových stimulov.

Neuroanatomické výskumy pomocou zobrazovacích metód odhaľujú aj konkrétne štrukturálne a funkčné rozdiely v mozgu ľudí s ADHD. Pozorovateľné je mierne oneskorenie vo vývoji a dozrievaní prefrontálnej kôry, ktorá funguje ako riadiace centrum mozgu a má na starosti exekutívne funkcie, plánovanie, sebaovládanie a potláčanie nevhodných reakcií. Rozdiely sa objavujú aj v oblastiach ako bazálne通gliá a mozoček, ktoré koordinujú motoriku a spracovanie času. Okrem samotnej veľkosti jednotlivých oblastí je narušená aj vzájomná konektivita, teda spôsob, akým medzi sebou jednotlivé neurónové siete komunikujú. To spôsobuje, že mozog s ADHD má problém efektívne prepínať medzi režimom hlbokého sústredenia a režimom denného snívania, kedy myšlienky voľne prúdia.

Okrem genetického základu môžu k rozvoju ADHD prispieť aj environmentálne vplyvy a rizikové faktory pôsobiace počas tehotenstva alebo krátko po pôrode. Patrí sem najmä vystavenie plodu toxickým látkam, ako je nikotín, alkohol či určité lieky, ktoré môžu narušiť jemný vývoj nervovej sústavy nenarodeného dieťaťa. Významným faktorom je tiež nízka pôrodná hmotnosť a predčasný pôrod, kedy dieťa prichádza na svet pred úplným dokončením vývoja kľúčových mozgových štruktúr. Medzi popôrodné vplyvy sa radí napríklad rané vystavenie ťažkým kovom, najmä olovu, alebo vážne úrazy hlavy v ranom detstve, ktoré zasiahli oblasti zodpovedné za pozornosť a správanie. Tieto faktory síce samy o sebe nemusia ADHD spôsobiť, no u geneticky predisponovaných jedincov výrazne zvyšujú riziko rozvinutia plných prejavov tejto poruchy.`,
  },
  {
    icon: getIcon("🔍"),
    title: "Diagnostika ADHD",
    content:
      `Diagnostika ADHD je komplexný, viacstupňový proces, ktorý sa nespolieha na jediný izolovaný test, odber krvi alebo rýchle vyšetrenie. Keďže neexistuje žiadny jednoznačný biologický marker tejto poruchy, stanovenie diagnózy je postavené na dôkladnom behaviorálnom, klinickom a psychologickom posúdení. Hlavným cieľom diagnostiky je nielen potvrdiť prítomnosť symptómov nepozornosti, hyperaktivity a impulzívnosti, ale najmä určiť ich intenzitu, chronickosť a overiť, či tieto prejavy výrazne narúšajú fungovanie človeka vo dvoch alebo viacerých oblastiach života, napríklad v škole, v práci, v rodine či v sociálnych vzťahoch.

Celý proces diagnostiky u detí aj dospelých vedie tím špecializovaných odborníkov, najčastejšie klinický psychológ, pedopsychiater alebo psychiater pre dospelých, prípadne neurológ. Prvým a najdôležitejším krokom je podrobná klinická anamnéza. Počas rozhovoru lekár mapuje vývoj pacienta od raného detstva, priebeh tehotenstva a pôrodu, dosiahnuté vývojové míľniky, ako aj výskyt psychiatrických či neurovývojových porúch v rodine, keďže ADHD má silnú genetickú zložku. U dospelých pacientov je kľúčové preukázať, že symptómy boli v určitej forme prítomné už pred dvanástym rokom života, aj keď v tom čase neboli oficiálne diagnostikované.

Dôležitou súčasťou diagnostiky je zber informácií z viacerých nezávislých zdrojov, čo pomáha eliminovať subjektívne skreslenie. Odborníci využívajú štandardizované diagnostické dotazníky, škály a hodnotiace hárky, ktoré vypĺňa nielen samotný pacient, ale v prípade detí aj rodičia a učitelia. Tieto materiály podrobne skúmajú frekvenciu a závažnosť prejavov v rôznych prostrediach. U dospelých sa často analyzujú staré školské vysvedčenia, slovné hodnotenia alebo sa realizuje rozhovor s partnerom či rodičom, ktorý si pamätá správanie pacienta v detskom veku.

Následne sa pristupuje k psychologickému vyšetreniu, ktoré často zahŕňa testy kognitívnych schopností a inteligencie. Tieto testy neslúžia priamo na odhalenie ADHD, ale pomáhajú zmapovať štruktúru intelektu, úroveň pracovnej pamäte, rýchlosť spracovania informácií a schopnosť exekutívnych funkcií. Psychologické testovanie dokáže odhaliť špecifické vzorce, kedy človek s vysokým intelektom zlyháva v úlohách vyžadujúcich neprerušovanú pozornosť a mentálnu kontrolu. Súčasťou komplexného vyšetrenia býva aj medicínske posúdenie, napríklad neurologické vyšetrenie vrátane EEG, ktoré vylučuje iné organické príčiny ťažkostí, ako sú skryté formy epilepsie alebo poruchy spánku.

Kľúčovou výzvou v celom diagnostickom procese je takzvaná diferenciálna diagnostika a odhalenie komorbidít. Prejavy podobné ADHD, ako je nesústredenosť, nepokoj alebo emočná labilita, môžu byť totiž sprievodným znakom iných stavov – napríklad porúch učenia, úzkostných porúch, depresie, traumy, porúch autistického spektra alebo dysfunkcie štítnej žľazy. Odborník musí precízne rozlíšiť, či je primárnou príčinou problémov práve ADHD, alebo ide o iný psychický či zdravotný stav. Správne a detailne stanovená diagnóza je jediným východiskovým bodom pre vytvorenie efektívneho plánu liečby, terapie a podporných opatrení šitých na mieru konkrétnemu človeku.`
  },
  {
    icon: getIcon("💊"),
    title: "Liečba a terapia",
    content: `Multimodálny prístup k liečbe a manažmentu ADHD (poruchy pozornosti s hyperaktivitou) je v súčasnosti považovaný za najefektívnejšiu cestu, ako zmierniť prejavy tohto stavu a výrazne zvýšiť kvalitu života. Keďže ADHD ovplyvňuje kognitívne funkcie, emócie aj každodenné správanie, optimálna liečba kombinuje psychologickú podporu, úpravu životného štýlu a v prípade potreby aj farmakoterapiu.
    
    Farmakologická liečba pomáha vyrovnať hladinu neurotransmiterov (najmä dopamínu a noradrenalínu) v mozgu, čo vedie k lepšej koncentrácii a kontrole impulzov. Lieky predpisuje výhradne psychiater. Najčastejšie využívaná a vysoko účinná skupina liekov sú tzv. stimulanty (napr. s účinnou látkou metylfenidát). 
    Zvyšujú dostupnosť dopamínu v prefrontálnej kôre, čím okamžite zlepšujú pozornosť a tlmia hyperaktivitu. 
    
    Okrem stimulantov sú aj nestimulačné lieky používajú sa v prípadoch, kedy stimulanty nezaberajú, spôsobujú nežiaduce účinky, alebo ak je prítomné riziko úzkostných porúch (napr. s účinnou látkou atomoxetín). Ich účinok nastupuje postupne (v priebehu niekoľkých týždňov)
    
    Terapeutické prístupy zas pomáhajú jednotlivcom (deťom aj dospelým) porozumieť vlastnému mozgu, vyvinúť mechanizmy na zvládanie symptómov a pracovať so sebahodnotením, ktoré býva pri ADHD často narušené.`,
  },
  {
    icon: getIcon("🎓"),
    title: "ADHD v škole",
    content:
      `Školské prostredie predstavuje pre deti a dospievajúcich s ADHD jednu z najväčších každodenných výziev, pretože jeho tradičné nastavenie priamo naráža na oslabené exekutívne funkcie ich mozgu. Systém postavený na dlhodobom sedení, neprerušovanej pozornosti, tichu a plnení presne štruktúrovaných inštrukcií vyžaduje presne tie zručnosti, ktoré sú pre neurodivergentného žiaka najťažšie dosiahnuteľné. V dôsledku toho sa v škole ADHD neprejavuje len horším prospechom, ktorý často vôbec nezodpovedá skutočnému intelektu dieťaťa, ale aj sociálnymi konfliktmi, emočným vyčerpaním a rizikom skorého školského zlyhania.

V samotnom procese učenia a na vyučovacích hodinách sa deficit pozornosti prejavuje neschopnosťou filtrovať okolité podnety. Pre žiaka s ADHD je šuchot papiera, pohyb spolužiaka alebo zvuk z chodby rovnako intenzívny ako hlas učiteľa, čo vedie k okamžitej strate nite a k chybám z nepozornosti pri zadaniach. Oslabená pracovná pamäť spôsobuje, že dieťa si nedokáže zapamätať viacstupňové pokyny – ak učiteľ povie, aby si žiaci otvorili učebnicu na strane tridsať, vyriešili tretí príklad a zapísali výsledok do zošita, žiak s ADHD často uviazne už pri prvom kroku. Výrazným problémom je aj motorický nepokoj, ktorý núti dieťa neustále sa mrviť na stoličke, hojdať sa, klopať perom alebo bez dovolenia vstávať, čím neúmyselne narúša priebeh vyučovania. K tomu sa pridáva impulzívnosť v podobe vykrikovania odpovedí pred vyvolaním, neschopnosti počkať, kým príde na rad, a rýchleho, povrchného odovzdávania písomiek bez spätnej kontroly.

Mimo samotných vyučovacích hodín prináša školský život obrovskú záťaž v oblasti organizácie a self-manažmentu. Žiaci s ADHD zápasia s chronickým zabúdaním učebníc, domácich úloh či pomôcok na špecifické predmety. Ich školské tašky, zošity a skrinky často vyzerajú chaoticky, čo nie je prejavom lenivosti, ale neschopnosti vytvoriť si funkčný systém triedenia informácií. Problémom je aj dlhodobé plánovanie, kedy príprava na projekt alebo dôležitú skúšku, o ktorej vedia týždne vopred, začína kvôli časovej slepote a prokrastinácii až noc pred termínom. V oblasti sociálnych vzťahov v triede môže impulzívnosť a nižšia frustračná tolerancia viesť k tomu, že dieťa reaguje na bežné konflikty alebo prehry pri hrách prehnane emotívne, čo môže vyústiť do izolácie od kolektívu spolužiakov, ktorí ho začnú vnímať ako problémové alebo konfliktné.

Úspešné zvládnutie školskej dochádzky s ADHD preto striktne vyžaduje zmenu prístupu, individualizáciu a úzku spoluprácu medzi školou, rodičmi a centrami poradenstva. Medzi najefektívnejšie úpravy v prostredí patrí strategické usadenie žiaka do predných lavíc bližšie k učiteľovi a ďalej od okien či dverí, kde je minimum rušivých vplyvov. Pedagógovia by mali dlhé zadania deliť na menšie, čiastkové kroky a overovať si porozumenie priamym očným kontaktom. Mimoriadne dôležité je umožniť žiakovi legálny pohyb, napríklad formou krátkeho poverenia zotrieť tabuľu alebo rozdať zošity, a povoliť diskrétne kompenzačné pomôcky, ako sú antistresové loptičky na zamestnanie rúk. Hodnotenie by malo byť postavené na reálnych vedomostiach, nie na penalizácii za neporiadny rukopis, chýbajúce okraje alebo gramatické chyby spôsobené čistou nepozornosťou. Iba prostredníctvom pochopenia a vytvorenia podporného prostredia namiesto neustáleho trestania dokáže škola v žiakovi s ADHD udržať motiváciu k vzdelávaniu a predísť rozvoju úzkostí či chronického pocitu vlastného zlyhania.`,
  },
  {
    icon: getIcon("💼"),
    title: "ADHD v práci",
    content:
      `Pracovné prostredie prináša pre dospelých s ADHD jedinečnú dynamiku, v ktorej sa špecifiká ich neurodivergentného mozgu môžu stať buď zdrojom vážnych komplikácií, alebo naopak, motorom mimoriadneho úspechu. Tradičný model zamestnania, ktorý striktne vyžaduje jednotvárnu administratívu, dlhé sedenie na poradách, plnenie rutinných úloh a dokonalý self-manažment, priamo naráža na oslabené exekutívne funkcie. Ak sa však človek s ADHD ocitne v prostredí, ktoré dokáže stimulovať jeho záujmy a rešpektuje jeho potrebu flexibility, dokáže vygenerovať obrovskú pridanú hodnotu.

Najväčšie každodenné prekážky v práci súvisia s deficitom pozornosti, časovou slepotou a prokrastináciou. Úlohy, ktoré človeka s ADHD vnútorne nefascinujú alebo sú príliš monotónne, vedú k rýchlej mentálnej únave a neustálemu odkladaniu na neskôr. Spustenie takejto činnosti je kvôli chýbajúcemu dopamínu paralyzujúce, čo často vyúsťuje do stresových situácií a dobiehania termínov na poslednú chvíľu. Oslabená pracovná pamäť spôsobuje, že zamestnanec ľahko zabudne na drobné zadania z ústnych rozhovorov, stráca prehľad v e-mailoch alebo robí prehliadnuteľné chyby v detailoch a reportoch. Otvorené kancelárske priestory (open-office) predstavujú pre týchto ľudí obrovský vizuálny a akustický smog, kde ich od práce dokáže vytrhnúť aj to najmenšie vyrušenie spolupracovníkom, pričom opätovné nadviazanie na rozrobenú myšlienku trvá neprimerane dlho.

Emocionálna zložka a impulzívnosť zasahujú aj do profesijných vzťahov a hierarchie. Kvôli dysfórii z citlivosti na odmietnutie (RSD) môže človek s ADHD vnímať aj konštruktívnu kritiku od nadriadeného alebo spätnú väzbu od klienta ako osobné zlyhanie či útok, čo vedie k obrannej reakcii, úzkosti alebo okamžitej demotivácii. Impulzívnosť sa zasa môže prejaviť neuváženými vyjadreniami na poradách, skákaním do reči kolegom alebo unáhleným prijímaním nových záväzkov a projektov, ktoré potom človek z kapacitných dôvodov nedokáže reálne dokončiť, čo zbytočne vyvoláva dojem nespoľahlivosti.

Na druhej strane, ak je práca pre človeka s ADHD vášňou a osobným záujmom, naplno sa prejaví fenomén hyperfokusu. V tomto stave dokáže zamestnanec pracovať s extrémnym nasadením, vyriešiť za pár hodín komplexné technické problémy, ktoré by iným trvali dni, a preukázať obrovskú kreativitu. Ľudia s ADHD excelujú v krízovom manažmente a dynamických prostrediach, kde sa veci neustále menia. Keďže ich mozog je zvyknutý fungovať v miernom chaose, v momente nečakanej krízy nepanikária, ale bleskovo nachádzajú nekonvenčné, inovatívne riešenia (takzvané „thinking outside the box“), ktoré ich neurotypickí kolegovia môžu prehliadnuť.

Pre úspešné fungovanie v kariére je preto kľúčové implementovať funkčné kompenzačné stratégie a hľadať správny typ pracovného zaradenia. Mnohým jednotlivcom s ADHD vyhovuje flexibilný pracovný čas, možnosť práce z domu (home office) a profesie, ktoré sú pestré a orientované na výsledok, nie na striktne odpracované hodiny – ako je IT sektor, kreatívny priemysel, podnikanie, krízový manažment alebo záchranné zložky. V rámci self-manažmentu je nevyhnutné nespoliehať sa na vlastnú pamäť a premeniť všetky dohody na písomnú formu v digitálnych plánovačoch či aplikáciách na projektový manažment. Používanie slúchadiel s potlačením hluku, delenie veľkých projektov na mikroulohy s okamžitými cieľmi a delegovanie monotónnej administratívy sú nástroje, ktoré umožňujú dospelým s ADHD eliminovať svoje slabé stránky a naplno nechať vyniknúť ich jedinečný intelektový a tvorivý potenciál.`
  },
  {
    icon: getIcon("❤️"),
    title: "Vzťahy a ADHD",
    content:
      `Prejavy ADHD hlboko ovplyvňujú dynamiku najbližších partnerských, rodinných a priateľských vzťahov, pričom formujú spôsob, akým človek komunikuje, udržiava pozornosť a prežíva emócie. V oblasti komunikácie prináša táto diagnóza špecifické výzvy v podobe impulzívneho skákania do reči či zdanlivého nepočúvania, kedy pozornosť človeka náhle odvedie nevýznamný vonkajší podnet alebo vlastný prúd myšlienok.
      
      V dlhodobom spolužití sa často prejavuje oslabená krátkodobá pamäť, ktorá spôsobuje rýchle zabúdanie verbálnych dohôd, termínov a sľubov, čo si druhá strana môže nesprávne vysvetliť ako nezáujem, lenivosť alebo nedostatok rešpektu. Veľkou skúškou pre partnerský život býva prechod z počiatočnej fázy randenia, kedy človek s ADHD dokáže upriamiť všetku svoju pozornosť a hyperfokus na nového partnera, do bežnej každodennej rutiny. Keď toto počiatočné očarenie opadne, hrozí rozvinutie nezdravej vzťahovej dynamiky, ktorá pripomína vzťah rodiča a dieťaťa. K tomu dochádza vtedy, keď partner bez ADHD preberie všetku organizačnú a praktickú zodpovednosť za chod domácnosti, účty a termíny, čo časom vedie k jeho vyhoreniu a u oboch partnerov k hlbokej frustrácii a strate rovnocennosti.    

Kľúčovým aspektom, ktorý komplikuje vzájomné porozumenie, je emocionálna dysregulácia a extrémna citlivosť na odmietnutie alebo kritiku, známa aj pod skratkou RSD. Emócie ľudí s ADHD môžu nastúpiť mimoriadne rýchlo a s obrovskou intenzitou, kvôli čomu aj konštruktívna spätná väzba od partnera dokáže vyvolať prudkú obrannú reakciu, hnev alebo úplné stiahnutie sa do seba. Cesta k harmonickému vzťahu preto vyžaduje dôsledné oddelenie symptómov poruchy od charakteru človeka. Namiesto spoliehania sa na pamäť je nevyhnutné zaviesť externé vizuálne systémy, ako sú zdieľané kalendáre či jasne rozdelené kompetencie. Ak partneri dokážu v momente vyhrotenia emócií uplatňovať pravidlo krátkej komunikačnej pauzy na upokojenie nervovej sústavy a namiesto neustálej kritiky postavia spolužitie na oceňovaní drobného úsilia, ADHD prestane byť prekážkou a vzťah získa novú stabilitu.`,
  },
  {
    icon: getIcon("🍎"),
    title: "Životný štýl",
    content:
      `Správne nastavený životný štýl a každodenné návyky tvoria jeden z najdôležitejších pilierov úspešného manažmentu ADHD, pretože priamo ovplyvňujú biologickú a chemickú rovnováhu v mozgu. Keďže neurodivergentný mozog prirodzene zápasí s nedostatkom dopamínu a noradrenalínu, vedome zvolené aktivity a pevná štruktúra dokážu tieto deficity prirodzene kompenzovať. Cielené úpravy v oblasti fyzickej aktivity, spánkového režimu, stravovania a budovania rutín tak výrazne znižujú prejavy exekutívnej dysfunkcie a prinášajú do života potrebnú stabilitu a psychickú pohodu.

Pravidelný pohyb funguje pre človeka s ADHD doslova ako prírodný liek s okamžitým účinkom na nervovú sústavu. Počas intenzívnej fyzickej aktivity, ako je beh, silový tréning, plávanie alebo bicyklovanie, dochádza k masívnemu uvoľňovaniu dopamínu, serotonínu a endorfínov. Tento chemický koktail okamžite zvyšuje schopnosť koncentrácie, upokojuje vnútorný nepokoj a výrazne zlepšuje náladu. Pohyb zároveň slúži ako konštruktívny ventil pre prebytočnú motorickú hyperaktivitu, vďaka čomu sa človek dokáže po tréningu jednoduchšie usadiť k mentálnej práci. Kľúčom k úspechu je vybrať si aktivitu, ktorá človeka skutočne baví a prináša mu okamžitú stimuláciu, čo uľahčuje jej dlhodobé udržanie v harmonograme.

Ďalšou kritickou oblasťou je spánok, ktorého nedostatok dramaticky zhoršuje všetky typické symptómy ADHD, od zabúdania až po impulzívnosť. Ľudia s ADHD často trpia posunutou fázou spánku, čo znamená, že ich mozog začína byť prirodzene bdelý a kreatívny neskoro večer, zatiaľ čo ranné vstávanie je sprevádzané obrovskou únavou a mentálnou hmlou. Zavedenie prísnej spánkovej hygieny, kedy človek chodí spať a vstáva v rovnakom čase bez ohľadu na to, či je víkend alebo pracovný deň, pomáha resetovať tieto vnútorné biologické hodiny. Nevyhnutnosťou je obmedzenie modrého svetla z obrazoviek smartfónov a počítačov minimálne hodinu pred spaním a vytvorenie upokojujúceho večerného rituálu, ktorý mozgu vyšle jasný signál, že je čas spomaliť a oddychovať.

Stravovanie má na fungovanie mozgu s ADHD rovnako hlboký vplyv, pričom správna voľba potravín pomáha stabilizovať hladinu energie a emócií počas celého dňa. Neurodivergentný mozog mimoriadne citlivo reaguje na prudké výkyvy cukru v krvi. Konzumácia jednoduchých sacharidov a priemyselne spracovaných jedál síce prináša okamžitý príval energie, no po ňom nasleduje prudký pád, ktorý sa prejavuje extrémnou únavou, podráždenosťou a neschopnosťou sústrediť sa. Jedálniček by mal byť preto postavený na potravinách bohatých na bielkoviny, ktoré slúžia ako stavebný kameň pre tvorbu neurotransmiterov. Dôležité sú tiež komplexné sacharidy zabezpečujúce postupné uvoľňovanie energie a zdravé tuky, najmä omega-3 mastné kyseliny, ktoré priamo podporujú kognitívne funkcie a štruktúru mozgových buniek.

Budovanie rutín a externého poriadku je posledným, no nemenej dôležitým krokom k zvládnutiu každodenného chaosu. Pre mozog s ADHD je predstava voľného, neštruktúrovaného času paralyzujúca, pretože nevie, akou úlohou začať a ako si rozdeliť energiu. Pevná, vizuálne spracovaná rutina – napríklad nemenný ranný a večerný postup krokov – odľahčuje pracovnú pamäť, pretože človek nemusí neustále premýšľať nad ďalším krokom, ale koná automaticky. Používanie analógových nástrojov, ako sú tabule na stenu, alebo digitálnych aplikácií s vizuálnymi pripomienkami pomáha prekonať časovú slepotu. Keď sa tieto zdravé návyky prepoja do uceleného životného štýlu, človek s ADHD získa pevnú pôdu pod nohami a dokáže efektívne fungovať bez neustáleho pocitu vyčerpania a stresu.`,
  },
  {
    icon: getIcon("❓"),
    title: "FAQ",
    content: (
         <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-2">
          Je ADHD skutočná diagnóza?
        </h3>
        <p>
          Áno. ADHD je vedecky uznaná neurovývinová porucha, ktorá ovplyvňuje
          pozornosť, impulzivitu, organizáciu a exekutívne funkcie mozgu.
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">
          Dá sa ADHD vyliečiť?
        </h3>
        <p>
          ADHD nie je možné „vyliečiť“, pretože ide o spôsob fungovania mozgu.
          Správna terapia, návyky a prípadne liečba však dokážu výrazne zlepšiť
          kvalitu života.
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">
          Môže mať ADHD aj dospelý človek?
        </h3>
        <p>
          Áno. ADHD nezmizne po dovŕšení dospelosti. Mnohí ľudia sú
          diagnostikovaní až v dospelom veku, keď začnú pociťovať problémy v
          práci, vzťahoch alebo organizácii života.
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">
          Je ADHD spôsobené zlou výchovou?
        </h3>
        <p>
          Nie. ADHD má prevažne genetický a neurologický základ. Výchova môže
          ovplyvniť spôsob zvládania symptómov, ale nie je príčinou ADHD.
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">
          Môžu lieky pomôcť?
        </h3>
        <p>
          U mnohých ľudí áno. O vhodnej liečbe však vždy rozhoduje odborník
          (psychiater) na základe individuálneho posúdenia.
        </p>
      </div>

      <div className="border-t border-[#1e1e1e] pt-6 mt-8">
        <h3 className="text-white font-semibold mb-3">
          Nenašli ste odpoveď na svoju otázku?
        </h3>

        <p className="mb-4">
          Ak máte otázku týkajúcu sa ADHD, môžete nám ju anonymne poslať cez
          formulár a radi ju zaradíme do FAQ.
        </p>

        <a
          href="https://forms.gle/ai1TLsWiWL1Jo5u7A"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-green-500
            hover:bg-green-400
            text-black
            font-semibold
            transition-colors
          "
        >
          Položiť otázku →
        </a>
      </div>
    </div>
    ),
  },
];

export default function ADHDInfoGrid() {
  const [open, setOpen] = useState(0);

  return (
    <div>
      {/* GRID KARIET */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sections.map((item, index) => {
          const Icon = item.icon;
          const isOpen = open === index;

          return (
            <button
              key={index}
              onClick={() => setOpen(index)}
              className={`
                text-left
                border
                rounded-2xl
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-400/30

                ${
                  isOpen
                    ? "border-green-400/40 bg-[#111]"
                    : "border-[#1e1e1e] bg-[#0f0f0f]"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>

                <h3 className="font-semibold text-lg text-[#f0ede6]">
                  {item.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* DETAIL PANEL */}
      <div
        className="
          mt-8
          border
          border-green-400/25
          rounded-3xl
          bg-[#0f0f0f]
          overflow-hidden
        "
      >
        <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center shrink-0">
              {(() => {
                const Icon = sections[open].icon;
                return <Icon size={28} />;
              })()}
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#f0ede6]">
                {sections[open].title}
              </h2>

              <p className="text-[#666] mt-1">
                Podrobné informácie
              </p>
            </div>
          </div>

          <div className="border-t border-[#1e1e1e] pt-6">
            <div
              className="
                text-[#a1a1a1]
                leading-8
                text-[15px]
                whitespace-pre-line
                max-w-4xl
              "
            >
              {sections[open].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}