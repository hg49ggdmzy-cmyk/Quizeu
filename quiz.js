/* Die EU-Institutionen im Selbsttest: Ablauf, Speicherung, Auswertung.
   Die Fragen stehen in fragen.js. Es werden keine Daten übertragen,
   der Zwischenstand liegt nur im localStorage dieses Browsers. */
(function () {
  "use strict";

  var SCHLUESSEL_STAND = "eu-selbsttest.stand.v1";
  var SCHLUESSEL_VERLAUF = "eu-selbsttest.verlauf.v1";
  var FORMATNAME = {
    einfach: "Einfachauswahl", mehrfach: "Mehrfachauswahl", zuordnen: "Zuordnen",
    reihenfolge: "Reihenfolge", richtigfalsch: "Richtig oder falsch", fall: "Fallzuordnung"
  };
  var ANLEITUNG = {
    einfach: "Wähle die zutreffende Antwort.",
    fall: "Lies den Fall und wähle die zutreffende Antwort.",
    mehrfach: "Prüfe jede Antwort einzeln. Die Aufgabe zählt nur, wenn deine Auswahl vollständig stimmt.",
    zuordnen: "Lies die Liste mit den Buchstaben. Tippe dann bei jedem Eintrag den passenden Buchstaben an.",
    reihenfolge: "Verschiebe die Einträge mit den Pfeilen. Oben steht, was zuerst kommt.",
    richtigfalsch: "Beides muss stimmen: dein Urteil und die gewählte Begründung."
  };
  var BUCHSTABEN = "ABCDEFGH";

  var fragenNachId = {};
  FRAGEN.forEach(function (f) { fragenNachId[f.id] = f; });

  /* ---------- Speicher mit Fehlerabfang ---------- */
  var ersatz = {};
  var speicher = {
    lesen: function (k) {
      try {
        var v = window.localStorage.getItem(k);
        if (v) return JSON.parse(v);
      } catch (e) { /* kein Speicher verfügbar */ }
      return ersatz[k] ? JSON.parse(ersatz[k]) : null;
    },
    schreiben: function (k, wert) {
      var s = JSON.stringify(wert);
      ersatz[k] = s;
      try { window.localStorage.setItem(k, s); } catch (e) { /* ignorieren, Quiz läuft weiter */ }
    },
    loeschen: function (k) {
      delete ersatz[k];
      try { window.localStorage.removeItem(k); } catch (e) { /* ignorieren */ }
    }
  };

  /* ---------- Hilfsfunktionen ---------- */
  function zufall(n) {
    try {
      var a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] % n;
    } catch (e) { return Math.floor(Math.random() * n); }
  }
  function mische(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = zufall(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function prozent(r, n) { return n ? Math.round(100 * r / n) : 0; }
  function gleich(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  var main = document.getElementById("inhalt");
  var fussEl = document.getElementById("fuss");
  var stand = speicher.lesen(SCHLUESSEL_STAND);
  if (stand && (!stand.reihenfolge || !stand.reihenfolge.every(function (id) { return fragenNachId[id]; }))) stand = null;
  var uebersichtOffen = false;
  var neuBestaetigen = false;

  function speichern() { speicher.schreiben(SCHLUESSEL_STAND, stand); }

  /* ---------- Neuer Durchgang ---------- */
  function neuerDurchgang(ids, modus) {
    var mischung = {};
    ids.forEach(function (id) {
      var f = fragenNachId[id];
      if (f.optionen) mischung[id] = mische(f.optionen.map(function (o) { return o.id; }));
      if (f.begruendungen) mischung[id] = mische(f.begruendungen.map(function (o) { return o.id; }));
      if (f.ziele) mischung[id] = mische(f.ziele.map(function (o) { return o.id; }));
      if (f.schritte) {
        var richtig = f.schritte.map(function (_, i) { return i; });
        var m;
        do { m = mische(richtig); } while (gleich(m, richtig));
        mischung[id] = m;
      }
    });
    stand = {
      version: 1, phase: "test", modus: modus,
      reihenfolge: mische(ids), idx: 0,
      mischung: mischung, antworten: {}, markiert: {}, hilfen: {},
      begonnen: Date.now()
    };
    uebersichtOffen = false;
    speichern();
    zeigeFrage();
  }

  /* ---------- Antwortstatus ---------- */
  function zustand(f) {
    var a = stand.antworten[f.id];
    if (a === undefined || a === null) return "offen";
    switch (f.format) {
      case "einfach": case "fall": return a ? "ok" : "offen";
      case "mehrfach": return a.length ? "ok" : "offen";
      case "zuordnen":
        var n = f.elemente.filter(function (e) { return a[e.id]; }).length;
        return n === f.elemente.length ? "ok" : (n ? "halb" : "offen");
      case "reihenfolge": return a.bestaetigt ? "ok" : "offen";
      case "richtigfalsch":
        var t = (a.urteil !== undefined && a.urteil !== null) + (a.begruendung ? 1 : 0);
        return t === 2 ? "ok" : (t ? "halb" : "offen");
    }
    return "offen";
  }
  function istRichtig(f, a) {
    if (a === undefined || a === null) return false;
    switch (f.format) {
      case "einfach": case "fall":
        var r = f.optionen.filter(function (o) { return o.richtig; })[0];
        return a === r.id;
      case "mehrfach":
        var soll = f.optionen.filter(function (o) { return o.richtig; }).map(function (o) { return o.id; }).sort();
        return gleich(a.slice().sort(), soll);
      case "zuordnen":
        return f.elemente.every(function (e) { return a[e.id] === e.ziel; });
      case "reihenfolge":
        return !!a.bestaetigt && a.liste.every(function (v, i) { return v === i; });
      case "richtigfalsch":
        var rb = f.begruendungen.filter(function (b) { return b.richtig; })[0];
        return a.urteil === f.aussageRichtig && a.begruendung === rb.id;
    }
    return false;
  }

  /* ---------- Startseite ---------- */
  function zeigeStart() {
    fussEl.innerHTML = "";
    var laufend = stand && stand.phase === "test";
    var fertig = stand && stand.phase === "ergebnis";
    var html = "";
    html += '<h1 tabindex="-1" id="titel">Die EU-Institutionen im Selbsttest</h1>';
    html += '<p class="leise">Sozialkunde Leistungskurs, Jahrgangsstufe 12. Aufbau, Ziele und Aufgaben der Organe und weiteren Institutionen der Europäischen Union.</p>';
    html += '<ul class="fakten">' +
      '<li><b>50</b>Aufgaben aus allen Bereichen</li>' +
      '<li><b>45</b>Minuten etwa, ohne Zeitlimit</li>' +
      '<li><b>6</b>Aufgabenformate</li>' +
      '</ul>';
    html += '<div class="karte"><h2>So funktioniert der Test</h2><ul class="hinweise">' +
      '<li>Während des Tests erfährst du nicht, ob eine Antwort stimmt. Erst die Auswertung am Ende zeigt dir, welche Bereiche du sicher beherrschst.</li>' +
      '<li>Eine Aufgabe zählt nur, wenn sie vollständig richtig gelöst ist.</li>' +
      '<li>Du kannst vor und zurück blättern und Aufgaben markieren, um sie später noch einmal zu prüfen.</li>' +
      '<li>Zu jeder Aufgabe gibt es zwei Hilfen: einen Denkanstoß und die Fundstelle im Heft. Sie kosten keine Punkte, ihre Nutzung siehst du aber in der Auswertung.</li>' +
      '<li>Fragen und Antworten werden bei jedem Durchgang neu gemischt.</li>' +
      '</ul></div>';
    html += '<p class="heft">Zum Nacharbeiten brauchst du das Heft <i>Informationen zur politischen Bildung 366: Europäische Union</i>, Seiten 16 bis 31. Die Auswertung verweist auf die passenden Seiten.</p>';

    if (laufend) {
      var beantwortet = stand.reihenfolge.filter(function (id) { return zustand(fragenNachId[id]) === "ok"; }).length;
      html += '<div class="karte"><h2>Dein begonnener Test</h2><p>Du hast ' + beantwortet + ' von ' + stand.reihenfolge.length + ' Aufgaben beantwortet. Du kannst dort weitermachen, wo du aufgehört hast.</p>';
      html += '<div class="btn-reihe"><button class="btn" id="weiter">Weitermachen</button>';
      html += neuBestaetigen
        ? '<button class="btn zweit" id="neu-ja">Ja, neu beginnen</button><button class="btn schlicht" id="neu-nein">Abbrechen</button>'
        : '<button class="btn zweit" id="neu">Neu beginnen</button>';
      html += '</div>' + (neuBestaetigen ? '<p class="klein leise" role="status">Dein bisheriger Zwischenstand wird dabei gelöscht.</p>' : '') + '</div>';
    } else {
      html += '<div class="btn-reihe"><button class="btn" id="start">Test starten</button>';
      if (fertig) html += '<button class="btn zweit" id="auswertung">Letzte Auswertung ansehen</button>';
      html += '</div>';
    }
    html += '<p class="klein leise" style="margin-top:28px">Datenschutz: Es gibt keine Anmeldung, keine Cookies und kein Tracking. Dein Zwischenstand und deine Ergebnisse werden nur in diesem Browser auf deinem Gerät gespeichert und nicht übertragen.</p>';
    main.innerHTML = html;

    var b;
    if ((b = document.getElementById("start"))) b.onclick = function () { neuerDurchgang(FRAGEN.map(function (f) { return f.id; }), "voll"); };
    if ((b = document.getElementById("weiter"))) b.onclick = function () { zeigeFrage(); };
    if ((b = document.getElementById("auswertung"))) b.onclick = function () { zeigeErgebnis(); };
    if ((b = document.getElementById("neu"))) b.onclick = function () { neuBestaetigen = true; zeigeStart(); fokus("neu-ja"); };
    if ((b = document.getElementById("neu-nein"))) b.onclick = function () { neuBestaetigen = false; zeigeStart(); fokus("neu"); };
    if ((b = document.getElementById("neu-ja"))) b.onclick = function () { neuBestaetigen = false; neuerDurchgang(FRAGEN.map(function (f) { return f.id; }), "voll"); };
    window.scrollTo(0, 0);
  }

  function fokus(id) { var el = document.getElementById(id); if (el) el.focus(); }

  /* ---------- Aufgabe anzeigen ---------- */
  function zeigeFrage(fokusId) {
    var gesamt = stand.reihenfolge.length;
    var id = stand.reihenfolge[stand.idx];
    var f = fragenNachId[id];
    var beantwortet = stand.reihenfolge.filter(function (q) { return zustand(fragenNachId[q]) === "ok"; }).length;
    var html = "";

    html += '<div class="fortschritt">' +
      '<div class="fortschritt-zeile"><span><strong>Aufgabe ' + (stand.idx + 1) + ' von ' + gesamt + '</strong></span><span>' + beantwortet + ' beantwortet</span></div>' +
      '<div class="leiste" role="progressbar" aria-label="Beantwortete Aufgaben" aria-valuemin="0" aria-valuemax="' + gesamt + '" aria-valuenow="' + beantwortet + '"><span style="width:' + prozent(beantwortet, gesamt) + '%"></span></div>' +
      '</div>';

    html += '<article class="karte aufgabe" data-id="' + id + '">';
    html += '<span class="format">' + FORMATNAME[f.format] + '</span>' + (stand.markiert[id] ? '<span class="markiert-hinweis">Markiert</span>' : '');
    if (f.format === "fall") html += '<div class="fall"><span class="fall-titel">Fall</span>' + esc(f.fall) + '</div>';
    if (f.format === "richtigfalsch") html += '<div class="aussage"><span class="aussage-titel">Aussage</span>' + esc(f.aussage) + '</div>';
    html += '<h2 id="frage-titel" tabindex="-1">' + esc(f.frage) + '</h2>';
    html += '<p class="anleitung">' + ANLEITUNG[f.format] + '</p>';
    html += antwortBereich(f);

    var h = stand.hilfen[id] || [0, 0];
    html += '<div class="hilfen">';
    html += '<div class="hilfen-knoepfe">';
    if (!h[0]) html += '<button class="btn zweit" id="hilfe1">Hilfe 1: Denkanstoß</button>';
    if (!h[1]) html += '<button class="btn zweit" id="hilfe2">Hilfe 2: Fundstelle</button>';
    html += '</div>';
    if (h[0]) html += '<p class="hilfe-text" id="hilfe1-text"><b>Denkanstoß</b>' + esc(f.hilfe1) + '</p>';
    if (h[1]) html += '<p class="hilfe-text" id="hilfe2-text"><b>Fundstelle</b>' + esc(f.hilfe2) + '</p>';
    html += '</div>';
    html += '</article>';

    html += uebersichtHtml();
    main.innerHTML = html;

    var letzte = stand.idx === gesamt - 1;
    fussEl.innerHTML = '<nav class="fuss" aria-label="Navigation im Test"><div class="wrap">' +
      '<button class="btn zweit" id="zurueck"' + (stand.idx === 0 ? " disabled" : "") + '>Zurück</button>' +
      '<button class="btn zweit mark" id="markieren" aria-pressed="' + (stand.markiert[id] ? "true" : "false") + '">' + (stand.markiert[id] ? "Markiert" : "Markieren") + '</button>' +
      '<button class="btn" id="vor">' + (letzte ? "Zur Abgabe" : "Weiter") + '</button>' +
      '</div></nav>';

    bindeAntworten(f);
    bindeUebersicht();
    document.getElementById("zurueck").onclick = function () { if (stand.idx > 0) { stand.idx--; speichern(); zeigeFrage(); } };
    document.getElementById("vor").onclick = function () {
      if (letzte) { zeigeAbgabe(); return; }
      stand.idx++; speichern(); zeigeFrage();
    };
    document.getElementById("markieren").onclick = function () {
      if (stand.markiert[id]) delete stand.markiert[id]; else stand.markiert[id] = true;
      speichern(); zeigeFrage("markieren");
    };
    ["hilfe1", "hilfe2"].forEach(function (hid, i) {
      var b = document.getElementById(hid);
      if (b) b.onclick = function () {
        var hh = stand.hilfen[id] || [0, 0];
        hh[i] = 1; stand.hilfen[id] = hh; speichern();
        zeigeFrage(hid + "-text");
      };
    });

    if (fokusId) {
      var el = document.getElementById(fokusId);
      if (el) { if (!el.hasAttribute("tabindex") && el.tagName === "P") el.setAttribute("tabindex", "-1"); el.focus(); return; }
    }
    window.scrollTo(0, 0);
    document.getElementById("frage-titel").focus({ preventScroll: true });
  }

  function antwortBereich(f) {
    var id = f.id, a = stand.antworten[id], html = "", reihen;
    if (f.format === "einfach" || f.format === "fall" || f.format === "mehrfach") {
      var typ = f.format === "mehrfach" ? "checkbox" : "radio";
      html += '<fieldset><legend class="skip">Antwortmöglichkeiten</legend><div class="optionen">';
      stand.mischung[id].forEach(function (oid) {
        var o = f.optionen.filter(function (x) { return x.id === oid; })[0];
        var an = typ === "radio" ? a === oid : !!(a && a.indexOf(oid) >= 0);
        html += '<label class="option' + (an ? " gewaehlt" : "") + '"><input type="' + typ + '" name="antwort" value="' + oid + '"' + (an ? " checked" : "") + '>' +
          '<span class="ind ' + (typ === "radio" ? "rund" : "eckig") + '" aria-hidden="true"></span><span>' + esc(o.text) + '</span></label>';
      });
      html += '</div></fieldset>';
    }
    if (f.format === "richtigfalsch") {
      a = a || {};
      html += '<fieldset><legend>Die Aussage ist …</legend><div class="rf-urteil">';
      [[true, "richtig"], [false, "falsch"]].forEach(function (u) {
        var an = a.urteil === u[0];
        html += '<label class="option' + (an ? " gewaehlt" : "") + '"><input type="radio" name="urteil" value="' + u[1] + '"' + (an ? " checked" : "") + '><span class="ind rund" aria-hidden="true"></span><span>' + u[1] + '</span></label>';
      });
      html += '</div></fieldset>';
      html += '<fieldset><legend>Begründung</legend><div class="optionen">';
      stand.mischung[id].forEach(function (bid) {
        var b = f.begruendungen.filter(function (x) { return x.id === bid; })[0];
        var an = a.begruendung === bid;
        html += '<label class="option' + (an ? " gewaehlt" : "") + '"><input type="radio" name="begruendung" value="' + bid + '"' + (an ? " checked" : "") + '><span class="ind rund" aria-hidden="true"></span><span>' + esc(b.text) + '</span></label>';
      });
      html += '</div></fieldset>';
    }
    if (f.format === "zuordnen") {
      a = a || {};
      var ziele = stand.mischung[id];
      html += '<ul class="ziele" aria-label="Auswahlliste">';
      ziele.forEach(function (zid, i) {
        var z = f.ziele.filter(function (x) { return x.id === zid; })[0];
        html += '<li><span class="buchstabe" aria-hidden="true">' + BUCHSTABEN[i] + '</span><span><span class="skip">' + BUCHSTABEN[i] + ': </span>' + esc(z.text) + '</span></li>';
      });
      html += '</ul>';
      f.elemente.forEach(function (e, k) {
        html += '<div class="element" role="radiogroup" aria-labelledby="el-titel-' + e.id + '"><p class="element-titel" id="el-titel-' + e.id + '"><b>' + (k + 1) + '.</b> ' + esc(e.text) + '</p><div class="wahl">';
        ziele.forEach(function (zid, i) {
          var z = f.ziele.filter(function (x) { return x.id === zid; })[0];
          var an = a[e.id] === zid;
          html += '<label><input type="radio" name="el-' + e.id + '" value="' + zid + '"' + (an ? " checked" : "") + ' aria-label="' + BUCHSTABEN[i] + ': ' + esc(z.text) + '"><span aria-hidden="true">' + BUCHSTABEN[i] + '</span></label>';
        });
        html += '</div></div>';
      });
    }
    if (f.format === "reihenfolge") {
      var liste = a ? a.liste : stand.mischung[id];
      var best = a && a.bestaetigt;
      html += '<ol class="reihe' + (best ? " bestaetigt" : "") + '" aria-label="Aktuelle Reihenfolge">';
      liste.forEach(function (si, pos) {
        html += '<li><span class="nr" aria-hidden="true">' + (pos + 1) + '.</span><span class="txt">' + esc(f.schritte[si]) + '</span>' +
          '<span class="pfeile">' +
          '<button class="pfeil" id="hoch-' + si + '" data-pos="' + pos + '" data-r="-1"' + (pos === 0 ? " disabled" : "") + ' aria-label="Position ' + (pos + 1) + ' nach oben verschieben">' + pfeil(true) + '</button>' +
          '<button class="pfeil" id="runter-' + si + '" data-pos="' + pos + '" data-r="1"' + (pos === liste.length - 1 ? " disabled" : "") + ' aria-label="Position ' + (pos + 1) + ' nach unten verschieben">' + pfeil(false) + '</button>' +
          '</span></li>';
      });
      html += '</ol>';
      html += best
        ? '<p class="reihe-status" role="status">Deine Reihenfolge ist gespeichert. Du kannst sie weiter verändern.</p>'
        : '<p class="reihe-status">Sobald du einen Eintrag verschiebst, wird deine Reihenfolge gespeichert. Passt sie schon so, übernimm sie direkt.</p><button class="btn zweit" id="reihe-ok">Reihenfolge übernehmen</button>';
    }
    return html;
  }

  function pfeil(hoch) {
    return '<svg viewBox="0 0 20 20" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (hoch ? '<path d="M10 16V4M4.5 9.5L10 4l5.5 5.5"/>' : '<path d="M10 4v12M4.5 10.5L10 16l5.5-5.5"/>') + '</svg>';
  }

  function bindeAntworten(f) {
    var id = f.id;
    function markiereGewaehlt() {
      main.querySelectorAll("label.option").forEach(function (l) {
        var inp = l.querySelector("input");
        l.classList.toggle("gewaehlt", inp.checked);
      });
    }
    if (f.format === "einfach" || f.format === "fall") {
      main.querySelectorAll('input[name="antwort"]').forEach(function (inp) {
        inp.onchange = function () { stand.antworten[id] = inp.value; speichern(); markiereGewaehlt(); aktualisiereFortschritt(); };
      });
    }
    if (f.format === "mehrfach") {
      main.querySelectorAll('input[name="antwort"]').forEach(function (inp) {
        inp.onchange = function () {
          var werte = [];
          main.querySelectorAll('input[name="antwort"]:checked').forEach(function (c) { werte.push(c.value); });
          stand.antworten[id] = werte; speichern(); markiereGewaehlt(); aktualisiereFortschritt();
        };
      });
    }
    if (f.format === "richtigfalsch") {
      main.querySelectorAll('input[name="urteil"], input[name="begruendung"]').forEach(function (inp) {
        inp.onchange = function () {
          var a = stand.antworten[id] || {};
          if (inp.name === "urteil") a.urteil = inp.value === "richtig"; else a.begruendung = inp.value;
          stand.antworten[id] = a; speichern(); markiereGewaehlt(); aktualisiereFortschritt();
        };
      });
    }
    if (f.format === "zuordnen") {
      f.elemente.forEach(function (e) {
        main.querySelectorAll('input[name="el-' + e.id + '"]').forEach(function (inp) {
          inp.onchange = function () {
            var a = stand.antworten[id] || {};
            a[e.id] = inp.value; stand.antworten[id] = a; speichern(); aktualisiereFortschritt();
          };
        });
      });
    }
    if (f.format === "reihenfolge") {
      main.querySelectorAll(".pfeil").forEach(function (b) {
        b.onclick = function () {
          var a = stand.antworten[id] || { liste: stand.mischung[id].slice() };
          var pos = +b.getAttribute("data-pos"), r = +b.getAttribute("data-r");
          var ziel = pos + r;
          if (ziel < 0 || ziel >= a.liste.length) return;
          var si = a.liste[pos];
          a.liste[pos] = a.liste[ziel]; a.liste[ziel] = si;
          a.bestaetigt = true;
          stand.antworten[id] = a; speichern();
          var neuerFokus = (r < 0 ? "hoch-" : "runter-") + si;
          if ((r < 0 && ziel === 0) || (r > 0 && ziel === a.liste.length - 1)) neuerFokus = (r < 0 ? "runter-" : "hoch-") + si;
          zeigeFrage(neuerFokus);
        };
      });
      var ok = document.getElementById("reihe-ok");
      if (ok) ok.onclick = function () {
        stand.antworten[id] = { liste: stand.mischung[id].slice(), bestaetigt: true };
        speichern(); zeigeFrage("frage-titel");
      };
    }
  }

  function aktualisiereFortschritt() {
    var gesamt = stand.reihenfolge.length;
    var beantwortet = stand.reihenfolge.filter(function (q) { return zustand(fragenNachId[q]) === "ok"; }).length;
    var zeile = main.querySelector(".fortschritt-zeile span:last-child");
    if (zeile) zeile.textContent = beantwortet + " beantwortet";
    var leiste = main.querySelector(".leiste");
    if (leiste) { leiste.setAttribute("aria-valuenow", beantwortet); leiste.firstChild.style.width = prozent(beantwortet, gesamt) + "%"; }
    if (uebersichtOffen) {
      var ueb = document.getElementById("uebersicht");
      if (ueb) { ueb.outerHTML = uebersichtHtml(); bindeUebersicht(); }
    }
  }

  /* ---------- Übersicht aller Aufgaben ---------- */
  function uebersichtHtml() {
    var html = '<section class="uebersicht" id="uebersicht">';
    html += '<button class="btn schlicht" id="ueb-knopf" aria-expanded="' + uebersichtOffen + '" aria-controls="ueb-raster">' + (uebersichtOffen ? "Übersicht schließen" : "Übersicht aller Aufgaben") + '</button>';
    if (uebersichtOffen) {
      html += '<div id="ueb-raster"><div class="raster">';
      stand.reihenfolge.forEach(function (qid, i) {
        var z = zustand(fragenNachId[qid]);
        var txt = z === "ok" ? "beantwortet" : (z === "halb" ? "unvollständig" : "offen");
        html += '<button class="kachel ' + (z === "ok" ? "ok" : (z === "halb" ? "halb" : "")) + (i === stand.idx ? " aktuell" : "") + '" data-i="' + i + '" aria-label="Aufgabe ' + (i + 1) + ', ' + txt + (stand.markiert[qid] ? ", markiert" : "") + '"' + (i === stand.idx ? ' aria-current="true"' : "") + '>' + (i + 1) +
          (stand.markiert[qid] ? '<span class="flag" aria-hidden="true">!</span>' : "") + '</button>';
      });
      html += '</div><div class="legende"><span><i class="ok"></i>beantwortet</span><span><i class="halb"></i>unvollständig</span><span><i></i>offen</span><span><i class="flag"></i>markiert</span></div></div>';
    }
    return html + '</section>';
  }
  function bindeUebersicht() {
    var k = document.getElementById("ueb-knopf");
    if (k) k.onclick = function () {
      uebersichtOffen = !uebersichtOffen;
      var ueb = document.getElementById("uebersicht");
      ueb.outerHTML = uebersichtHtml(); bindeUebersicht(); fokus("ueb-knopf");
    };
    main.querySelectorAll(".kachel").forEach(function (b) {
      b.onclick = function () { stand.idx = +b.getAttribute("data-i"); speichern(); zeigeFrage(); };
    });
  }

  /* ---------- Abgabe ---------- */
  function zeigeAbgabe() {
    var offen = [], halb = [], mark = [];
    stand.reihenfolge.forEach(function (qid, i) {
      var z = zustand(fragenNachId[qid]);
      if (z === "offen") offen.push(i); else if (z === "halb") halb.push(i);
      if (stand.markiert[qid]) mark.push(i);
    });
    var gesamt = stand.reihenfolge.length;
    var html = '<h1 tabindex="-1" id="titel">Abgabe</h1>';
    html += '<div class="karte"><p>Du hast <b>' + (gesamt - offen.length - halb.length) + ' von ' + gesamt + '</b> Aufgaben vollständig beantwortet.</p>';
    if (offen.length || halb.length) {
      html += '<div class="warnung" role="alert">Noch nicht vollständig beantwortete Aufgaben werden bei der Abgabe als nicht gelöst gewertet.</div>';
    }
    if (offen.length) html += '<h2>Unbeantwortet (' + offen.length + ')</h2>' + nummernListe(offen);
    if (halb.length) html += '<h2 style="margin-top:16px">Unvollständig (' + halb.length + ')</h2>' + nummernListe(halb);
    if (mark.length) html += '<h2 style="margin-top:16px">Von dir markiert (' + mark.length + ')</h2>' + nummernListe(mark);
    if (!offen.length && !halb.length && !mark.length) html += '<p>Es gibt keine offenen oder markierten Aufgaben.</p>';
    html += '<div class="btn-reihe"><button class="btn" id="abgeben">Test abgeben</button><button class="btn zweit" id="zurueck-test">Zurück zum Test</button></div></div>';
    main.innerHTML = html;
    fussEl.innerHTML = "";
    main.querySelectorAll(".nummern button").forEach(function (b) {
      b.onclick = function () { stand.idx = +b.getAttribute("data-i"); speichern(); zeigeFrage(); };
    });
    document.getElementById("zurueck-test").onclick = function () { zeigeFrage(); };
    document.getElementById("abgeben").onclick = auswerten;
    window.scrollTo(0, 0);
    fokus("titel");
  }
  function nummernListe(liste) {
    return '<ul class="nummern">' + liste.map(function (i) {
      return '<li><button data-i="' + i + '" aria-label="Zu Aufgabe ' + (i + 1) + '">' + (i + 1) + '</button></li>';
    }).join("") + '</ul>';
  }

  /* ---------- Auswertung ---------- */
  function statusVon(r, n) {
    if (n < 4) return r === n ? "sicher" : "nachlesen";
    var p = r / n;
    if (p >= 0.8) return "sicher";
    if (p >= 0.5) return "nachlesen";
    return "wiederholen";
  }
  var STATUSTEXT = { sicher: "sicher", nachlesen: "nachlesen", wiederholen: "gründlich wiederholen" };

  function auswerten() {
    var bereiche = {}, falsch = [], h1 = 0, h2 = 0, mitHilfe = 0, richtig = 0;
    stand.reihenfolge.forEach(function (qid) {
      var f = fragenNachId[qid];
      var ok = istRichtig(f, stand.antworten[qid]);
      var b = bereiche[f.bereich] || (bereiche[f.bereich] = { r: 0, n: 0, lese: [] });
      b.n++;
      if (ok) { b.r++; richtig++; }
      else {
        falsch.push(qid);
        var eintrag = f.seite + ": " + f.lesehinweis;
        if (b.lese.indexOf(eintrag) < 0) b.lese.push(eintrag);
      }
      var h = stand.hilfen[qid] || [0, 0];
      h1 += h[0]; h2 += h[1]; if (h[0] || h[1]) mitHilfe++;
    });
    var verlauf = speicher.lesen(SCHLUESSEL_VERLAUF) || { durchgaenge: 0, letzter: null, letzterVoll: null };
    // Volle Durchgänge werden mit dem letzten vollen Durchgang verglichen, Teilwiederholungen mit dem letzten Versuch.
    var vorher = stand.modus === "voll" ? (verlauf.letzterVoll || null) : verlauf.letzter;
    stand.ergebnis = {
      datum: Date.now(), modus: stand.modus, richtig: richtig, gesamt: stand.reihenfolge.length,
      bereiche: bereiche, falsch: falsch, hilfen: { eins: h1, zwei: h2, aufgaben: mitHilfe },
      vorher: vorher, durchgang: verlauf.durchgaenge + 1
    };
    stand.phase = "ergebnis";
    speichern();
    var kurz = {};
    Object.keys(bereiche).forEach(function (k) { kurz[k] = { r: bereiche[k].r, n: bereiche[k].n }; });
    var dieser = { datum: stand.ergebnis.datum, modus: stand.modus, richtig: richtig, gesamt: stand.reihenfolge.length, bereiche: kurz };
    speicher.schreiben(SCHLUESSEL_VERLAUF, {
      durchgaenge: verlauf.durchgaenge + 1,
      letzter: dieser,
      letzterVoll: stand.modus === "voll" ? dieser : (verlauf.letzterVoll || null)
    });
    zeigeErgebnis();
  }

  function seitenZahl(eintrag) { var m = /S\. (\d+)/.exec(eintrag); return m ? +m[1] : 99; }

  function zeigeErgebnis() {
    var e = stand.ergebnis;
    fussEl.innerHTML = "";
    var html = '<h1 tabindex="-1" id="titel">Deine Auswertung</h1>';
    html += '<div class="karte">';
    html += '<div class="gesamt"><span class="zahl">' + e.richtig + ' von ' + e.gesamt + '</span><span>Aufgaben vollständig richtig (' + prozent(e.richtig, e.gesamt) + ' Prozent)</span></div>';
    if (e.modus === "falsche") html += '<p class="leise" style="margin-top:10px">Dieser Durchgang enthielt nur die Aufgaben, die beim vorherigen Versuch nicht richtig gelöst waren.</p>';
    var vollVergleich = e.vorher && e.modus === "voll";
    var vorherName = vollVergleich ? "Letzter vollständiger Durchgang" : "Letzter Versuch";
    if (e.vorher) html += '<p class="vergleich" style="margin-top:10px">' + vorherName + ': ' + e.vorher.richtig + ' von ' + e.vorher.gesamt + ' richtig.</p>';
    html += '<p style="margin:14px 0 0">' + (e.hilfen.aufgaben
      ? 'Hilfen genutzt: bei ' + e.hilfen.aufgaben + ' von ' + e.gesamt + ' Aufgaben (Denkanstoß ' + e.hilfen.eins + ' Mal, Fundstelle ' + e.hilfen.zwei + ' Mal).'
      : 'Hilfen genutzt: keine.') + '</p>';
    html += '</div>';

    var liste = Object.keys(e.bereiche).map(function (k) { var b = e.bereiche[k]; return { k: k, r: b.r, n: b.n, lese: b.lese }; });
    liste.sort(function (a, b) { return (a.r / a.n) - (b.r / b.n) || b.n - a.n; });

    html += '<div class="karte"><h2>Ergebnis nach Bereichen</h2><p class="schwellen">Sortiert vom schwächsten zum stärksten Bereich. Ab 80 Prozent: sicher. 50 bis 79 Prozent: nachlesen. Unter 50 Prozent: gründlich wiederholen. In Bereichen mit weniger als vier Aufgaben bedeutet jeder Fehler: nachlesen.</p>';
    liste.forEach(function (b) {
      var st = statusVon(b.r, b.n);
      html += '<section class="bereich"><div class="bereich-kopf"><h3>' + esc(BEREICHE[b.k]) + '</h3><span class="status ' + st + '">' + STATUSTEXT[st] + '</span></div>';
      html += '<div class="balken-zeile"><div class="balken" role="img" aria-label="' + b.r + ' von ' + b.n + ' richtig"><span class="' + st + '" style="width:' + Math.max(prozent(b.r, b.n), b.r ? 2 : 0) + '%"></span></div><span class="anteil">' + b.r + ' von ' + b.n + '</span></div>';
      if (e.vorher && e.vorher.bereiche && e.vorher.bereiche[b.k]) {
        var v = e.vorher.bereiche[b.k];
        var diff = prozent(b.r, b.n) - prozent(v.r, v.n);
        var tendenz = diff > 0 ? "jetzt besser" : (diff < 0 ? "jetzt schwächer" : "unverändert");
        html += '<p class="vergleich">' + (vollVergleich
          ? vorherName + ': ' + v.r + ' von ' + v.n + ' (' + tendenz + ')'
          : 'Im letzten Versuch: ' + v.r + ' von ' + v.n + ' in diesem Bereich') + '</p>';
      }
      if (st !== "sicher" && b.lese.length) {
        var lese = b.lese.slice().sort(function (x, y) { return seitenZahl(x) - seitenZahl(y) || (x < y ? -1 : 1); });
        html += '<p class="leseliste-titel">Nachlesen im Heft</p><ul class="leseliste">' + lese.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join("") + '</ul>';
      }
      html += '</section>';
    });
    html += '</div>';

    html += '<div class="btn-reihe"><button class="btn" id="wiederholen">Test wiederholen</button>' +
      '<button class="btn zweit" id="falsche"' + (e.falsch.length ? "" : " disabled") + '>Nur falsche Fragen wiederholen' + (e.falsch.length ? " (" + e.falsch.length + ")" : "") + '</button></div>';
    html += '<p class="klein leise" style="margin-top:18px">Die richtigen Lösungen werden bewusst nicht angezeigt. Lies die angegebenen Stellen im Heft nach und versuche es dann erneut. Deine Ergebnisse bleiben nur auf diesem Gerät.</p>';
    main.innerHTML = html;
    document.getElementById("wiederholen").onclick = function () { neuerDurchgang(FRAGEN.map(function (f) { return f.id; }), "voll"); };
    var fb = document.getElementById("falsche");
    if (fb && e.falsch.length) fb.onclick = function () { neuerDurchgang(e.falsch.slice(), "falsche"); };
    window.scrollTo(0, 0);
    fokus("titel");
  }

  /* ---------- Start ---------- */
  if (stand && stand.phase === "ergebnis" && stand.ergebnis) zeigeErgebnis();
  else zeigeStart();
})();
