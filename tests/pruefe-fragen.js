// Prüft den Fragenkatalog. Aufruf: node tests/pruefe-fragen.js
const path = require("path");
const fs = require("fs");
const { FRAGEN, BEREICHE } = require(path.join(__dirname, "..", "fragen.js"));

let fehler = 0;
const ok = (bed, text) => { if (!bed) { fehler++; console.log("FEHLER: " + text); } };
const zaehle = (key) => FRAGEN.reduce((m, f) => (m[f[key]] = (m[f[key]] || 0) + 1, m), {});

// 1. Anzahl
ok(FRAGEN.length === 50, "Es müssen genau 50 Fragen sein, gefunden: " + FRAGEN.length);
ok(new Set(FRAGEN.map(f => f.id)).size === FRAGEN.length, "IDs sind nicht eindeutig");

// 2. Verteilung nach Bereichen
const sollBereich = { grundlagen: 7, er: 5, kommission: 7, parlament: 7, rat: 7, gerichtshof: 6, ezb: 6, rechnungshof: 1, eusta: 1, ausschuesse: 2, agenturen: 1 };
const istBereich = zaehle("bereich");
for (const b in sollBereich) ok(istBereich[b] === sollBereich[b], `Bereich ${b}: soll ${sollBereich[b]}, ist ${istBereich[b] || 0}`);
for (const b in istBereich) ok(b in BEREICHE, "Unbekannter Bereich " + b);

// 3. Verteilung nach Formaten
const sollFormat = { einfach: 16, mehrfach: 10, zuordnen: 8, reihenfolge: 3, richtigfalsch: 7, fall: 6 };
const istFormat = zaehle("format");
for (const k in sollFormat) ok(istFormat[k] === sollFormat[k], `Format ${k}: soll ${sollFormat[k]}, ist ${istFormat[k] || 0}`);

// 4. AFB
const afb = zaehle("afb");
const anteil = k => Math.round(100 * (afb[k] || 0) / FRAGEN.length);
ok(Math.abs(anteil("I") - 30) <= 6 && Math.abs(anteil("II") - 50) <= 6 && Math.abs(anteil("III") - 20) <= 6, "AFB-Verteilung weicht stark ab");

// 5. Pflichtfelder und Lösung je Frage
for (const f of FRAGEN) {
  const t = f.id + ": ";
  ok(f.frage && f.hilfe1 && f.hilfe2 && f.seite && f.lesehinweis, t + "Pflichtfeld fehlt (frage, hilfe1, hilfe2, seite, lesehinweis)");
  ok(/^S\. \d/.test(f.seite), t + "Seite hat falsches Format");
  ok(/S\. \d/.test(f.hilfe2), t + "Hilfe 2 nennt keine Heftseite");
  ok(["I", "II", "III"].includes(f.afb), t + "AFB fehlt");
  if (["einfach", "fall", "mehrfach"].includes(f.format)) {
    const r = f.optionen.filter(o => o.richtig).length;
    ok(f.optionen.length >= 4, t + "zu wenige Optionen");
    if (f.format === "mehrfach") ok(r >= 2 && r < f.optionen.length, t + "Mehrfachauswahl braucht mindestens 2 richtige und mindestens 1 falsche Option");
    else ok(r === 1, t + "Einfachauswahl braucht genau 1 richtige Option");
    if (f.format === "fall") ok(f.fall && f.fall.length > 40, t + "Fallbeschreibung fehlt");
  }
  if (f.format === "zuordnen") {
    const zielIds = f.ziele.map(z => z.id);
    ok(f.elemente.every(e => zielIds.includes(e.ziel)), t + "Zuordnung verweist auf unbekanntes Ziel");
    ok(f.elemente.length >= 3, t + "zu wenige Elemente");
  }
  if (f.format === "reihenfolge") ok(Array.isArray(f.schritte) && f.schritte.length >= 4, t + "Reihenfolge braucht mindestens 4 Schritte");
  if (f.format === "richtigfalsch") {
    ok(typeof f.aussageRichtig === "boolean" && f.aussage, t + "Aussage oder Wahrheitswert fehlt");
    ok(f.begruendungen.filter(b => b.richtig).length === 1, t + "genau eine richtige Begründung nötig");
  }
}

// 6. Sichtbarer Text der Fragen
const texte = f => [f.frage, f.fall, f.aussage, f.hilfe1, f.hilfe2, f.lesehinweis,
  ...(f.optionen || []).map(o => o.text), ...(f.elemente || []).map(o => o.text), ...(f.ziele || []).map(o => o.text),
  ...(f.schritte || []), ...(f.begruendungen || []).map(o => o.text)].filter(Boolean).join(" \n ");

// 7. Gedankenstriche (auch in der Oberfläche)
const dash = /[‒–—―]|\s-\s|\s--\s/;
for (const f of FRAGEN) ok(!dash.test(texte(f)), f.id + ": Gedankenstrich gefunden");
for (const datei of ["index.html", "quiz.js"]) {
  const p = path.join(__dirname, "..", datei);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  if (datei === "quiz.js") s = (s.match(/"[^"\n]*"|`[^`]*`/g) || []).join("\n"); // nur Zeichenketten
  ok(!/[‒–—―]/.test(s), datei + ": Gedankenstrich gefunden");
  const visible = datei === "index.html" ? s.replace(/<[^>]+>/g, " ") : s;
  ok(!/\s-\s/.test(visible.replace(/\$\{[^}]*\}/g, "")), datei + ": Bindestrich als Gedankenstrich gefunden");
}

// 8. Ausschlussliste
const regeln = [
  ["EuStA: teilnehmende Staaten", f => /Irland|Dänemark|Österreich|24 Mitgliedstaaten|nicht alle Mitgliedstaaten|beigetreten|teilnehm/i.test(texte(f)) && /EuStA|Staatsanwaltschaft/.test(texte(f))],
  ["EZB: Rang oder Abwägung Preisstabilität", f => /Preisstabilität|Zielkonflikt|abwäg|Wirtschaftsförderung|gesamtwirtschaftlich/i.test(texte(f))],
  ["Parlament: Gesetzesvorschläge oder Initiativrecht des Parlaments", f => /Parlament[^.]{0,60}(Gesetzesvorschl|Gesetzgebungsvorschl|Initiativ|unterbreit|anstoß)|(Initiativrecht|Gesetzesvorschl|Gesetzgebungsvorschl)[^.]{0,40}(beim|des|dem) (Europäischen )?Parlament/i.test(texte(f))],
  ["Grafik: Zählen", f => /zähl|wie viele (Punkte|Sterne|Figuren)/i.test(texte(f))],
  ["Namen aktueller Amtsträgerinnen und Amtsträger", f => /von der Leyen|Costa|Kallas|Metsola|Lagarde|Barnier|Leijtens|Merz|Macron/i.test(texte(f))]
];
for (const f of FRAGEN) for (const [name, test] of regeln) ok(!test(f), f.id + ": verstößt gegen Ausschluss " + name);

// 9. Antwortlängen: richtige Antwort darf nicht auffällig länger sein
let laengenWarnungen = 0;
for (const f of FRAGEN) {
  const opts = f.optionen || f.begruendungen;
  if (!opts || f.format === "mehrfach") continue;
  const r = opts.find(o => o.richtig).text.length;
  const andere = opts.filter(o => !o.richtig).map(o => o.text.length);
  const max = Math.max(...andere), min = Math.min(...andere);
  if (r > max * 1.12 || r < min * 0.85) { laengenWarnungen++; console.log(`HINWEIS Länge ${f.id}: richtig ${r}, andere ${andere.join("/")}`); }
}
if (FRAGEN.some(f => /alle genannten|keine der genannten/i.test(texte(f)))) ok(false, "„Alle genannten“ oder „Keine der genannten“ gefunden");

console.log("\nBereiche:", JSON.stringify(istBereich));
console.log("Formate:", JSON.stringify(istFormat));
console.log(`AFB: I ${afb.I} (${anteil("I")} %), II ${afb.II} (${anteil("II")} %), III ${afb.III} (${anteil("III")} %)`);
console.log("Längenhinweise:", laengenWarnungen);
console.log(fehler === 0 ? "\nALLE PRÜFUNGEN BESTANDEN" : `\n${fehler} FEHLER`);
process.exit(fehler ? 1 : 0);
