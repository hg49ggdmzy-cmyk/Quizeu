// Spielt den Selbsttest im Browser durch. Aufruf: node tests/browsertest.js [URL] [Ordner für Screenshots]
// Voraussetzung: Playwright mit Chromium, Seite läuft z. B. über "python3 -m http.server 8765".
const { chromium } = require("playwright");
const path = require("path");
const URL = process.argv[2] || "http://127.0.0.1:8765/";
const SHOTS = process.argv[3] || path.join(__dirname, "screenshots");
require("fs").mkdirSync(SHOTS, { recursive: true });

let fehler = 0;
const ok = (b, t) => { console.log((b ? "  ok    " : "  FEHLER ") + t); if (!b) fehler++; };

// Absichtlich falsch: alle Aufgaben der EZB, zwei des Gerichtshofs, der Rechnungshof, eine Aufgabe Grundlagen.
const FALSCH = new Set(["F40", "F41", "F42", "F43", "F44", "F45", "F34", "F39", "F46", "F06"]);
const OFFEN = new Set(["F20", "F33"]); // bleiben unbeantwortet

async function aktuelleId(page) { return page.getAttribute("article.aufgabe", "data-id"); }

async function beantworte(page, f, richtig) {
  const klick = async (sel) => { await page.locator(sel).locator("xpath=ancestor::label[1]").click(); };
  if (["einfach", "fall"].includes(f.format)) {
    const o = f.optionen.find(o => o.richtig === richtig);
    await klick(`input[name="antwort"][value="${o.id}"]`);
  } else if (f.format === "mehrfach") {
    const wahl = richtig ? f.optionen.filter(o => o.richtig) : f.optionen.filter(o => o.richtig).slice(0, 1).concat(f.optionen.filter(o => !o.richtig).slice(0, 1));
    for (const o of wahl) await klick(`input[name="antwort"][value="${o.id}"]`);
  } else if (f.format === "richtigfalsch") {
    const urteil = richtig ? f.aussageRichtig : f.aussageRichtig; // falsch nur über die Begründung
    await klick(`input[name="urteil"][value="${urteil ? "richtig" : "falsch"}"]`);
    const b = f.begruendungen.find(b => b.richtig === richtig);
    await klick(`input[name="begruendung"][value="${b.id}"]`);
  } else if (f.format === "zuordnen") {
    for (const [i, e] of f.elemente.entries()) {
      let ziel = e.ziel;
      if (!richtig && i === 0) ziel = f.ziele.find(z => z.id !== e.ziel).id;
      await klick(`input[name="el-${e.id}"][value="${ziel}"]`);
    }
  } else if (f.format === "reihenfolge") {
    // Sortieren über die Pfeil-Buttons (Bubble Sort), bei "falsch" am Ende die ersten zwei tauschen
    for (let runde = 0; runde < 10; runde++) {
      const liste = await page.evaluate((id) => {
        const s = JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1"));
        return (s.antworten[id] && s.antworten[id].liste) || s.mischung[id];
      }, f.id);
      const pos = liste.findIndex((v, i) => i < liste.length - 1 && v > liste[i + 1]);
      if (pos < 0) break;
      await page.click(`button.pfeil[data-pos="${pos}"][data-r="1"]`);
    }
    const s = await page.evaluate((id) => JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1")).antworten[id], f.id);
    if (!s || !s.bestaetigt) await page.click("#reihe-ok");
    if (!richtig) await page.click(`button.pfeil[data-pos="0"][data-r="1"]`);
  }
}

async function keinQuerscroll(page, name) {
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  ok(w[0] <= w[1], `${name}: kein waagerechtes Scrollen (${w[0]} <= ${w[1]})`);
}

async function lauf(breite, hoehe) {
  console.log(`\n=== Durchlauf bei ${breite} Pixel Breite ===`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: breite, height: hoehe }, deviceScaleFactor: 1, hasTouch: true });
  let page = await context.newPage();
  const fremd = [], konsolenfehler = [];
  page.on("request", r => { if (!r.url().startsWith(URL) && !r.url().startsWith("data:")) fremd.push(r.url()); });
  page.on("console", m => { if (m.type() === "error") konsolenfehler.push(m.text()); });
  page.on("pageerror", e => konsolenfehler.push(e.message));

  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const FRAGEN = await page.evaluate(() => FRAGEN);
  const nachId = Object.fromEntries(FRAGEN.map(f => [f.id, f]));

  ok(await page.textContent("h1") === "Die EU-Institutionen im Selbsttest", "Startseite mit Titel");
  ok((await page.textContent("main")).includes("45"), "Hinweis auf etwa 45 Minuten");
  const font = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === "loaded").map(f => f.family + " " + f.weight); });
  ok(font.some(f => f.includes("Carlito")), "Schrift Carlito geladen: " + font.join(", "));
  await page.screenshot({ path: `${SHOTS}/${breite}-start.png`, fullPage: true });
  await keinQuerscroll(page, "Startseite");

  await page.click("#start");
  const ersteReihenfolge = await page.evaluate(() => JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1")).reihenfolge);
  ok(ersteReihenfolge.length === 50, "Durchgang hat 50 Aufgaben");

  const gesehen = new Set(), formatShot = new Set();
  let hilfeGenutzt = 0;
  for (let i = 0; i < 50; i++) {
    const id = await aktuelleId(page);
    const f = nachId[id];
    gesehen.add(id);
    ok(!(await page.locator(".fortschritt-zeile").textContent()).includes("richtig"), `Aufgabe ${i + 1}: keine Rückmeldung zur Richtigkeit`);
    if (i < 3) { // Hilfen testen
      await page.click("#hilfe1");
      ok(await page.isVisible("#hilfe1-text"), `Hilfe 1 erscheint (${id})`);
      ok(!(await page.isVisible("#hilfe2-text")), "Hilfe 2 noch verborgen");
      if (i === 0) { await page.click("#hilfe2"); ok((await page.textContent("#hilfe2-text")).includes("S. "), "Hilfe 2 nennt die Heftseite"); }
      hilfeGenutzt++;
    }
    if (!OFFEN.has(id)) await beantworte(page, f, !FALSCH.has(id));
    if (id === "F12") { await page.click("#markieren"); ok(await page.getAttribute("#markieren", "aria-pressed") === "true", "Aufgabe markiert"); }
    if (!formatShot.has(f.format)) { formatShot.add(f.format); await page.screenshot({ path: `${SHOTS}/${breite}-format-${f.format}.png`, fullPage: true }); await keinQuerscroll(page, "Format " + f.format); }

    if (i === 20) { // Schließen und wieder öffnen
      const vorher = await page.evaluate(() => localStorage.getItem("eu-selbsttest.stand.v1"));
      await page.close();
      const p2 = await context.newPage();
      p2.on("request", r => { if (!r.url().startsWith(URL) && !r.url().startsWith("data:")) fremd.push(r.url()); });
      p2.on("pageerror", e => konsolenfehler.push(e.message));
      await p2.goto(URL);
      ok(await p2.isVisible("#weiter"), "Nach dem Schließen: Button „Weitermachen“ sichtbar");
      ok((await p2.textContent("main")).includes("20 von 50") || (await p2.textContent("main")).includes("21 von 50") || (await p2.textContent("main")).includes("19 von 50"), "Nach dem Schließen: Zwischenstand angezeigt");
      await p2.click("#weiter");
      ok(await aktuelleId(p2) === id, "Fortsetzen bei derselben Aufgabe");
      const nachher = await p2.evaluate(() => localStorage.getItem("eu-selbsttest.stand.v1"));
      ok(vorher === nachher, "Gespeicherter Stand unverändert (gleiche Mischung und Antworten)");
      // zurück blättern prüfen
      await p2.click("#zurueck");
      ok(await aktuelleId(p2) === ersteReihenfolge[i - 1], "Zurück blättern funktioniert");
      await p2.click("#vor");
      page = p2;
    }
    await page.click("#vor");
  }
  ok(gesehen.size === 50, "Alle 50 Aufgaben wurden angezeigt");

  // Abgabe
  ok(await page.textContent("h1") === "Abgabe", "Abgabeseite erscheint");
  const abgabe = await page.textContent("main");
  ok(abgabe.includes("Unbeantwortet (2)"), "Hinweis auf 2 unbeantwortete Aufgaben");
  ok(abgabe.includes("markiert (1)"), "Markierte Aufgabe wird gelistet");
  await page.screenshot({ path: `${SHOTS}/${breite}-abgabe.png`, fullPage: true });
  await page.click("#abgeben");

  // Auswertung
  const erwartetRichtig = 50 - FALSCH.size - OFFEN.size;
  const text = await page.textContent("main");
  ok(text.includes(`${erwartetRichtig} von 50`), `Gesamtergebnis ${erwartetRichtig} von 50`);
  ok(text.includes("Hilfen genutzt: bei 3 von 50"), "Hilfennutzung wird angezeigt");
  const bereiche = await page.$$eval(".bereich", els => els.map(e => ({
    name: e.querySelector("h3").textContent, status: e.querySelector(".status").textContent,
    anteil: e.querySelector(".anteil").textContent, lese: [...e.querySelectorAll(".leseliste li")].map(l => l.textContent)
  })));
  const quoten = bereiche.map(b => { const [r, , n] = b.anteil.split(" "); return +r / +n; });
  ok(quoten.every((q, i) => i === 0 || q >= quoten[i - 1]), "Bereiche vom schwächsten zum stärksten sortiert");
  const nach = Object.fromEntries(bereiche.map(b => [b.name, b]));
  ok(nach["Europäische Zentralbank"].status === "gründlich wiederholen" && nach["Europäische Zentralbank"].anteil === "0 von 6", "EZB: 0 von 6, gründlich wiederholen");
  ok(nach["Gerichtshof der EU"].anteil === "4 von 6" && nach["Gerichtshof der EU"].status === "nachlesen", "Gerichtshof: 4 von 6, nachlesen");
  ok(nach["Europäischer Rechnungshof"].status === "nachlesen", "Rechnungshof (1 Aufgabe, falsch): nachlesen");
  ok(nach["Europäische Staatsanwaltschaft"].status === "sicher", "EuStA (1 Aufgabe, richtig): sicher");
  ok(nach["Grundlagen und Prinzipien"].anteil === "6 von 7" && nach["Grundlagen und Prinzipien"].status === "sicher", "Grundlagen 6 von 7 (86 %): sicher, ohne Leseliste");
  ok(nach["Grundlagen und Prinzipien"].lese.length === 0, "Bereich „sicher“ ohne Leseliste");
  ok(nach["Europäischer Rat"].status === "sicher", "Europäischer Rat: sicher");
  ok(nach["Europäisches Parlament"].anteil === "6 von 7", "Parlament: unbeantwortete Aufgabe zählt als falsch");
  const gh = nach["Gerichtshof der EU"].lese;
  ok(gh.length === 1 && gh[0] === "S. 24: Klagearten am EuGH", "Leseliste Gerichtshof: doppelter Eintrag zusammengefasst (" + gh.join(" | ") + ")");
  ok(nach["Europäische Zentralbank"].lese.length === 6, "Leseliste EZB hat 6 Einträge: " + nach["Europäische Zentralbank"].lese.join(" | "));
  ok(bereiche.every(b => b.lese.every(l => /^S\. \d/.test(l))), "Leselisten im Format „S. x: Thema“");
  ok(bereiche.every(b => ["sicher", "nachlesen", "gründlich wiederholen"].includes(b.status)), "Status steht immer als Text da");
  // keine Lösungen sichtbar
  const loesungsTexte = FRAGEN.filter(f => f.optionen).map(f => f.optionen.find(o => o.richtig).text).filter(t => t.length > 30); // kurze Antworten sind zugleich Bereichsnamen
  ok(!loesungsTexte.some(t => text.includes(t)), "Keine Lösungen in der Auswertung");
  ok(!/super|toll|klasse|glückwunsch|prima|bravo|note\b/i.test(text), "Keine Lobfloskeln oder Noten");
  await page.screenshot({ path: `${SHOTS}/${breite}-ergebnis-1.png`, fullPage: true });
  await keinQuerscroll(page, "Auswertung");

  // Nach Neuladen bleibt die Auswertung
  await page.reload();
  ok((await page.textContent("h1")) === "Deine Auswertung", "Auswertung bleibt nach Neuladen erhalten");

  // Nur falsche wiederholen
  const anzahlFalsch = FALSCH.size + OFFEN.size;
  ok((await page.textContent("#falsche")).includes(`(${anzahlFalsch})`), `Button nennt ${anzahlFalsch} falsche Aufgaben`);
  await page.click("#falsche");
  const ids2 = await page.evaluate(() => JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1")).reihenfolge);
  ok(ids2.length === anzahlFalsch && ids2.every(id => FALSCH.has(id) || OFFEN.has(id)), "Wiederholung enthält genau die falschen und offenen Aufgaben");
  for (let i = 0; i < ids2.length; i++) {
    const id = await aktuelleId(page);
    await beantworte(page, nachId[id], !["F40", "F41"].includes(id)); // zwei bleiben falsch
    await page.click("#vor");
  }
  await page.click("#abgeben");
  const text2 = await page.textContent("main");
  ok(text2.includes(`${anzahlFalsch - 2} von ${anzahlFalsch}`), "Ergebnis der Wiederholung korrekt");
  ok(text2.includes("Letzter Versuch: 38 von 50"), "Vergleich mit dem letzten Versuch (gesamt)");
  ok(text2.includes("Im letzten Versuch: 0 von 6 in diesem Bereich"), "Vergleich pro Bereich (EZB vorher 0 von 6)");
  ok(!text2.includes("jetzt besser"), "Teilwiederholung ohne irreführende Tendenz");
  await page.screenshot({ path: `${SHOTS}/${breite}-ergebnis-2.png`, fullPage: true });

  // Test komplett wiederholen
  await page.click("#wiederholen");
  const ids3 = await page.evaluate(() => JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1")));
  ok(ids3.reihenfolge.length === 50, "„Test wiederholen“ startet mit allen 50 Aufgaben");
  ok(JSON.stringify(ids3.reihenfolge) !== JSON.stringify(ersteReihenfolge), "Neue Mischung der Fragen");
  ok(Object.keys(ids3.antworten).length === 0, "Antworten zurückgesetzt");

  // Zweiter voller Durchgang: alles richtig außer F40, Vergleich mit dem ersten vollen Durchgang
  for (let i = 0; i < 50; i++) {
    const id = await aktuelleId(page);
    await beantworte(page, nachId[id], id !== "F40");
    await page.click("#vor");
  }
  await page.click("#abgeben");
  const text3 = await page.textContent("main");
  ok(text3.includes("49 von 50") && text3.includes("Letzter vollständiger Durchgang: 38 von 50"), "Zweiter voller Durchgang mit Gesamtvergleich");
  ok(text3.includes("Letzter vollständiger Durchgang: 0 von 6 (jetzt besser)"), "Vergleich pro Bereich mit Tendenz als Text (EZB)");
  ok(text3.includes("Letzter vollständiger Durchgang: 7 von 7 (unverändert)") || text3.includes("(unverändert)"), "Unveränderte Bereiche werden benannt");
  await page.screenshot({ path: `${SHOTS}/${breite}-ergebnis-3.png`, fullPage: true });
  await page.click("#wiederholen");

  // Tastaturbedienung: Tab zu einer Option und mit Leertaste wählen
  await page.keyboard.press("Tab");
  let gefunden = false;
  for (let t = 0; t < 12 && !gefunden; t++) {
    const tag = await page.evaluate(() => document.activeElement && document.activeElement.tagName + ":" + document.activeElement.type);
    if (tag.startsWith("INPUT")) { gefunden = true; await page.keyboard.press("Space"); }
    else await page.keyboard.press("Tab");
  }
  const tastAntwort = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("eu-selbsttest.stand.v1")); return Object.keys(s.antworten).length; });
  ok(gefunden && tastAntwort === 1, "Antwort per Tastatur auswählbar");

  // Ohne Speicher (localStorage blockiert)
  const ctx2 = await browser.newContext({ viewport: { width: breite, height: hoehe } });
  await ctx2.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blockiert"); } }); });
  const p3 = await ctx2.newPage();
  const fehler3 = [];
  p3.on("pageerror", e => fehler3.push(e.message));
  await p3.goto(URL);
  await p3.click("#start");
  await p3.locator('input').first().locator("xpath=ancestor::label[1]").click().catch(() => {});
  await p3.click("#vor");
  ok(fehler3.length === 0 && (await p3.textContent(".fortschritt-zeile")).includes("Aufgabe 2 von 50"), "Quiz läuft auch ohne verfügbaren Speicher");
  await ctx2.close();

  ok(fremd.length === 0, "Keine Anfragen an fremde Server" + (fremd.length ? ": " + fremd.join(", ") : ""));
  const cookies = await context.cookies();
  ok(cookies.length === 0, "Keine Cookies");
  ok(konsolenfehler.length === 0, "Keine JavaScript-Fehler" + (konsolenfehler.length ? ": " + konsolenfehler.join(" | ") : ""));
  await browser.close();
}

(async () => {
  await lauf(375, 740);
  await lauf(820, 1180);
  console.log(fehler ? `\n${fehler} FEHLER` : "\nALLE BROWSERTESTS BESTANDEN");
  process.exit(fehler ? 1 : 0);
})();
