// jscs:disable maximumLineLength
const TEAMS = {
  '_default': ['Hämmentävä', 'Ylväs', 'Kaikkivoipa', 'Humanistinen', 'Kelvollinen', 'Erehtymätön', 'Akateeminen', 'Hupeloiva', 'Lannistumaton', 'Romanttinen'],
  'autek': ['Automaattinen', 'Automatisoitu', 'Autonominen', 'Itsetoimiva', 'Keltainen'],
  'bioner': ['Biologinen', 'Luomu', 'Alkuvoimainen', 'Luonnollinen', 'Geneettinen', 'Beige'],
  'hiukkanen': ['Hiukkasteleva', 'Tekninen', 'Matemaattinen', 'Logaritminen', 'Violetti'],
  'indecs': ['Indeksoitu', 'Taloudellinen', 'Optimaalinen', 'Valkotakkinen'],
  'kork': ['Koneellinen', 'Koneistettu', 'Korkkaileva', 'Sorvaava', 'Punalahkeinen'],
  'man@ger': ['Johtava', 'Mikromanageroiva', 'Pörssinoteerattu', 'Pikkutakkeileva', 'Graniitinharmaa'],
  'mik': ['Materiaalinen', 'Pintanahkainen', 'Jalopuinen', 'Kuminen', 'Timanttinen', 'Viininpunainen'],
  'skilta': ['Sähköinen', 'Elektroninen', 'Korkeajännitteinen', 'Vaihtovirtainen', 'Maadoitettu', 'Sähkönsininen'],
  'tamark': ['Arkkitehtoninen', 'Suurpiirteinen', 'Pimeä', 'Taiteellinen', 'Tarkka', 'Tummanpuhuva'],
  'taraki': ['Rakentava', 'Kestopuinen', 'Keltakypäräinen', 'Rakentava', 'Poraava', 'Tummansininen'],
  'tite': ['Binäärinen', 'Tietotekninen', 'Koodintuoksuinen', 'Tummasieluinen', 'Looginen', 'Yönmusta'],
  'yki': ['Ympäristöystävällinen', 'Ympäröivä', 'Metsämansikkainen', 'Skutsinvihreä'],
  'arkkitehtikilta': ['Esteettinen', 'Alaston', 'Esteetön', 'Suunnitelmallinen', 'Maalarinvalkoinen'],
  'athene': ['Informatiivinen', 'Avoin', 'Iloinen', 'Verkostoituva', 'Oliivinvihreä'],
  'automaatio- ja systeemitekniikan kilta': ['Säätävä', 'Kimblenjanoinen', 'Smurffinen', 'Aivan samasti', 'Violetti'],
  'as': ['Säätävä', 'Kimblenjanoinen', 'Smurffinen', 'Aivan samasti', 'Violetti'],
  'fyysikkokilta': ['Fyysinen', 'Laskelmoiva', 'Matemaattinen', 'Tieteilijä', 'Luonnonvalkoinen', 'Hiukkas', 'Kvantti'],
  'inkubio': ['Laikukas', 'Ammuva', 'Luonnollinen', 'Bioottinen', 'Punaruseka'],
  'kemistikilta': ['Poreileva', 'Reagoiva', 'Virtaava', 'Liuennut', 'Punainen', 'Tislattu'],
  'koneinsinöörikilta': ['Poreileva', 'Reagoiva', 'Virtaava', 'Liuennut', 'Punainen', 'Tislattu'],
  'ky': ['Sijoittava', 'Yrittävä', 'Perinteikäs', 'Klassinen', 'Dollarinvihreä', 'Johtava'],
  'maanmittarikilta': ['Mittaava', 'Laskelmallinen', 'Rakastava', 'Kaavoittava', 'Mattamusta'],
  'prodeko': ['Tuottava', 'Diskonttaava', 'Startuppaava', 'Logistinen', 'Sateenkaarinen'],
  'prosessiteekkarit': ['Prosessoiva', 'Kavitoiva', 'Syövyttävä', 'Pumppaava', 'Vihreä'],
  'puunjalostajakilta': ['Tamminen', 'Vaahterainen', 'Koivuinen', 'Sellisti', 'Keltainen', 'Killankeltainen', 'Mustalipeäinen', 'Metsäinen', 'Mekanisti', 'Bio', 'Valkaistu'],
  'rakennusinsinöörikilta': ['Rakentava', 'Pimeä', 'Jalonen', 'Tummansininen'],
  'sähköinsinöörikilta': ['Sähköinen', 'Sähäkkä', 'Jännittävä', 'Varautunut', 'Valkoinen', 'Potentiaalinen'],
  'teknologföreningen': ['Bolognesentuoksuinen', 'Rapuinen', 'Betoninen', 'Glad', 'Tekniikanpunainen'],
  'tietokilta': ['Koodaava', 'Tekninen', 'Funktionaalinen', 'Määrätietoinen', 'Kiiltävänmusta'],
  'tokyo': ['Taiteellinen', 'Impressionistinen', 'Moderni', 'Värikäs', 'Muotoileva', 'Luova', 'Naivistinen', 'Cubistinen'],
  'vuorimieskilta': ['Timantinkova', 'Metallinen', 'Teräksinen', 'Rautainen', 'Sininen']
};

const FIRST_NAMES = [
  'Leksa', 'Jönssi', 'Pirkko', 'Lissu', 'Hessu', 'Jallu', 'Eevertti', 'Kaaleppi', 'Tenho', 'Juuso', 'Jorma', 'Jorma-Liisa', 'Tiuhti', 'Viuhti', 'Nipsu', 'Kyösti', 'Kyöstikki', 'Kuuno', 'Tyyne', 'Frida', 'Masa', 'Mirkku', 'Jean-Pierre', 'Ihkuli', 'Kustaa', 'Kukkuluuru', 'Mymmeli', 'Nuppu', 'Kikka', 'Gandalf', 'Uolevi', 'Kirka', 'Orvokki', 'Maikku', 'Aune', 'Aadolf', 'Loordi', 'Juuli', 'Ahti', 'Lempi', 'Turso', 'Marjatta', 'Lalli', 'Mielikki', 'Joe', 'Däni', 'Mimmu', 'Kyllikki'
];

const EPITHETS = [
  'Nörtti', 'Ruuti', 'Saha', 'Kirves', 'Keihäs', 'Jallu', 'Viski', 'Leka', 'Puukko', 'Näyttöpääte', 'Touhu', 'Karaoke', 'Rymy', 'Peuhu', 'Pauhu', 'Kauhu', 'Paini', 'Mekastus', 'Mökellys', 'Örveltäjä', 'Luomu', 'Liivate', 'Porakone', 'Robotti', 'Näköis', 'Kukka', 'Kökkö', 'Kakkosnelos', 'Raparperi', 'Kehveli', 'Räppi', 'BB', 'Koeputki', 'Kannuttelu', 'Ruukku', 'Skutsi', 'Bönde', 'Pölhö', 'Nöpönenä', 'Pissa', 'Vehje', 'Tööttä', 'Krumeluuri', 'Peikko', 'Velho', 'Loitsu', 'Haltia', 'Autotalli', 'Kellari', 'Varasto', 'Jemma', 'Bussi', 'Juna', 'Toimisto', 'Nurmikko', 'Reikä', 'Rykäys', 'Mämmi', 'Kilju', 'Kojootti', 'Kiire', 'Cthulhu', 'Pipetti', 'Tehdas', 'Hillo', 'Hyntty', 'Mähmä', 'Siirtomaa', 'Traktori', 'Otsatukka', 'Takatukka', 'Nahka', 'Jalopuu', 'Burrito', 'Puuro', 'Bönthö', 'Myytti', 'Siemen', 'Tamppi', 'Piilohumanisti', 'Keinosiementäjä', 'Taikuri', 'Vippaskonsti', 'Silmänkääntö', 'Hämäys', 'Sankari', 'Muiluttaja', 'Sivaltaja', 'Livauttaja', 'Maalais', 'Lato', 'Vale', 'Keino', 'Heppa', 'Lierihattu', 'Cowboy', 'Saksikäsi', 'Win95', 'Linux', 'Öylätti', 'Kyykkä', 'Tissi', 'Bile', 'Nyrkki'
];

const generateName = (team = '') => {
  let teamIdx = team.toLowerCase();
  if (!TEAMS[teamIdx]) {
    teamIdx = '_default';
  }

  const getRandomFrom = (arr) => {
    let randomizedIndex = Math.round(Math.random() * (arr.length - 1));
    return arr[randomizedIndex];
  }

  return getRandomFrom(TEAMS[teamIdx]) + ' ' +
    getRandomFrom(EPITHETS) + '-' +
    getRandomFrom(FIRST_NAMES);
}

export default {
  generateName
};

if (process.argv && !module.parent) {
  // node_modules/.bin/babel-node app/services/namegen.js
  console.log(generateName(process.argv[2]));
}
