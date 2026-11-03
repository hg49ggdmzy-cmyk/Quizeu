/*
  Fragenkatalog: Die EU-Institutionen im Selbsttest
  Grundlage: Informationen zur politischen Bildung 366 "Europäische Union", S. 16 bis 27 und S. 30 f.

  So ist eine Frage aufgebaut
  ---------------------------
  id           eindeutige Kennung (F01 bis F50)
  bereich      Schlüssel aus BEREICHE (unten)
  format       "einfach"        Einfachauswahl, genau eine Option mit richtig: true
               "mehrfach"       Mehrfachauswahl, mehrere Optionen mit richtig: true
               "fall"           Fallzuordnung: Text in "fall", sonst wie "einfach"
               "zuordnen"       elemente (mit ziel) werden den ziele zugeordnet; zusätzliche Ziele sind Ablenker
               "reihenfolge"    schritte stehen hier in der RICHTIGEN Reihenfolge, das Quiz mischt sie
               "richtigfalsch"  aussage + aussageRichtig (true/false) + begruendungen (genau eine richtig: true)
  afb          Anforderungsbereich "I", "II" oder "III"
  frage        Aufgabenstellung
  hilfe1       Denkanstoß oder Begriffsklärung (verrät die Lösung nicht)
  hilfe2       Fundstelle im Heft
  seite        Heftseite für die Leseliste
  lesehinweis  Stichwort für die Leseliste, erscheint als "S. 24: Klagearten am EuGH"

  Achtung: Im sichtbaren Text keine Gedankenstriche verwenden.
*/

const BEREICHE = {
  grundlagen: "Grundlagen und Prinzipien",
  er: "Europäischer Rat",
  kommission: "Europäische Kommission",
  parlament: "Europäisches Parlament",
  rat: "Rat der EU",
  gerichtshof: "Gerichtshof der EU",
  ezb: "Europäische Zentralbank",
  rechnungshof: "Europäischer Rechnungshof",
  eusta: "Europäische Staatsanwaltschaft",
  ausschuesse: "WSA und Ausschuss der Regionen",
  agenturen: "Agenturen"
};

const FRAGEN = [

  /* ===================== GRUNDLAGEN UND PRINZIPIEN (7) ===================== */

  {
    id: "F01", bereich: "grundlagen", format: "einfach", afb: "II",
    frage: "Die EU beruht auf zwei Legitimierungslogiken. Welche Aussage beschreibt ihr Verhältnis zutreffend?",
    optionen: [
      { id: "a", richtig: true,  text: "Regierungen handeln Interessen zwischenstaatlich aus, EU-Organe überstaatlich; beide Logiken sind im hybriden Aufbau der EU miteinander verwoben." },
      { id: "b", richtig: false, text: "Die Regierungen handeln Interessen überstaatlich aus, die EU-Organe setzen die Ergebnisse anschließend zwischenstaatlich in den Mitgliedstaaten um." },
      { id: "c", richtig: false, text: "Die beiden Logiken lösen einander zeitlich ab: Bis 2009 arbeitete die EU zwischenstaatlich, seitdem arbeiten alle Organe überstaatlich." },
      { id: "d", richtig: false, text: "Die zwischenstaatliche Logik gilt nur für die Außenpolitik, die überstaatliche Logik für alle übrigen Politikfelder, sodass sich beide nicht berühren." }
    ],
    hilfe1: "„Intergouvernemental“ heißt zwischenstaatlich, „supranational“ überstaatlich. Überlege, ob die beiden Logiken nebeneinander oder nacheinander wirken.",
    hilfe2: "Heft S. 16, Abschnitt „Zwei Legitimierungslogiken“.",
    seite: "S. 16", lesehinweis: "Zwei Legitimierungslogiken"
  },

  {
    id: "F02", bereich: "grundlagen", format: "zuordnen", afb: "I",
    frage: "Ordne jedem Grundsatz die passende Beschreibung zu. Eine Beschreibung bleibt übrig.",
    elemente: [
      { id: "a", ziel: "w", text: "Subsidiaritätsprinzip" },
      { id: "b", ziel: "x", text: "Proportionalität" },
      { id: "c", ziel: "y", text: "Vorrang des EU-Rechts" },
      { id: "d", ziel: "z", text: "Direkte Wirkung des EU-Rechts" }
    ],
    ziele: [
      { id: "w", text: "Entschieden wird auf der Ebene, auf der sich ein Problem am besten lösen lässt." },
      { id: "x", text: "Eine Regelung darf nicht weiter gehen, als es das konkrete Problem erfordert." },
      { id: "y", text: "In den Mitgliedstaaten dürfen keine Regeln gelten, die dem EU-Recht widersprechen." },
      { id: "z", text: "Staaten, Unternehmen sowie Bürgerinnen und Bürger sind unmittelbar gebunden und haften bei Verstößen." },
      { id: "v", text: "Entscheidungen der Staats- und Regierungsspitzen fallen grundsätzlich einstimmig." }
    ],
    hilfe1: "Zwei Grundsätze dienen dem Ausbalancieren staatlicher und gemeinschaftlicher Interessen, zwei Rechtsprinzipien hat der Europäische Gerichtshof durch Urteile festgeschrieben. Achte auf die Wörter „Ebene“, „Ziel“, „widersprechen“ und „gebunden“.",
    hilfe2: "Heft S. 17, die ersten beiden Absätze.",
    seite: "S. 17", lesehinweis: "Subsidiarität, Proportionalität, Vorrang und direkte Wirkung"
  },

  {
    id: "F03", bereich: "grundlagen", format: "fall", afb: "III",
    fall: "Die Kommission legt einen Gesetzesvorschlag vor, der genau festlegt, wie Städte ihre Wertstoffhöfe organisieren sollen. In mehreren Mitgliedstaaten halten die Abgeordneten der nationalen Parlamente den Vorschlag für überzogen, weil die Kommunen diese Frage selbst besser lösen könnten.",
    frage: "Welches Verfahren sieht das Heft für diesen Fall vor?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Parlamente der Mitgliedstaaten prüfen den Vorschlag und können ihn mehrheitlich zurückweisen." },
      { id: "b", richtig: false, text: "Der Ausschuss der Regionen legt gegen den Vorschlag ein verbindliches Veto im Namen der Kommunen ein." },
      { id: "c", richtig: false, text: "Der Europäische Rat hebt den Vorschlag im Konsens auf, bevor Rat und Parlament ihn beraten." },
      { id: "d", richtig: false, text: "Die nationalen Gerichte erklären den Vorschlag vorab für unanwendbar, weil staatliches Recht Vorrang hat." }
    ],
    hilfe1: "Welche beiden Grundsätze sind hier berührt? Überlege dann, wer laut Heft über ihre Einhaltung wacht.",
    hilfe2: "Heft S. 17, Absatz zu Subsidiarität und Proportionalität.",
    seite: "S. 17", lesehinweis: "Subsidiarität und Proportionalität"
  },

  {
    id: "F04", bereich: "grundlagen", format: "einfach", afb: "III",
    frage: "Ein Regierungsmitglied sagt: „Nach dem Subsidiaritätsprinzip müssen Entscheidungen möglichst immer bei den Mitgliedstaaten bleiben.“ Welche Beurteilung ist nach dem Heft am besten begründet?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Aussage greift zu kurz: Maßgeblich ist die Ebene mit der besten Problemlösung, und das kann auch die EU sein, etwa bei Einfuhrzöllen." },
      { id: "b", richtig: false, text: "Die Aussage trifft zu: Das Prinzip sichert den Staaten ihre Zuständigkeit, solange die nationalen Parlamente einer Übertragung nicht zustimmen." },
      { id: "c", richtig: false, text: "Die Aussage greift zu kurz: Das Prinzip verlangt vor allem, dass eine Regelung verhältnismäßig ist und nicht über das Ziel hinausschießt." },
      { id: "d", richtig: false, text: "Die Aussage trifft zu: Nach dem Prinzip hat staatliches Recht im Zweifel Vorrang, damit Entscheidungen nah an den Bürgerinnen und Bürgern bleiben." }
    ],
    hilfe1: "Das Prinzip nennt kein festes Ziel „nach unten“ oder „nach oben“, sondern ein Kriterium. Welches?",
    hilfe2: "Heft S. 17, Beispiele zum Subsidiaritätsprinzip.",
    seite: "S. 17", lesehinweis: "Subsidiaritätsprinzip"
  },

  {
    id: "F05", bereich: "grundlagen", format: "richtigfalsch", afb: "II",
    aussage: "Organe und weitere Institutionen der EU unterscheiden sich nur in der Bezeichnung, ihre Funktion im System ist dieselbe.",
    aussageRichtig: false,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Organe sind die tragenden Säulen, die Recht setzen, umsetzen und sprechen; weitere Institutionen ergänzen das System." },
      { id: "b", richtig: false, text: "Organe sind direkt gewählt, während die weiteren Institutionen von den Regierungen der Mitgliedstaaten ernannt werden." },
      { id: "c", richtig: false, text: "Organe sind nur die Einrichtungen, die an der Gesetzgebung beteiligt sind; alle übrigen gelten als weitere Institutionen." },
      { id: "d", richtig: false, text: "Die Verträge verwenden beide Begriffe gleichbedeutend, eine Abgrenzung ergibt sich erst aus dem jeweiligen Amtssitz." }
    ],
    hilfe1: "Denk an den Gerichtshof, die EZB und den Rechnungshof: Sind sie gewählt? Sind sie an der Gesetzgebung beteiligt? Sind sie trotzdem Organe?",
    hilfe2: "Heft S. 17, Abschnitt „Die EU-Organe und -Institutionen“, dazu die Übersicht auf S. 30 f.",
    seite: "S. 17", lesehinweis: "Organe und weitere Institutionen"
  },

  {
    id: "F06", bereich: "grundlagen", format: "mehrfach", afb: "II",
    frage: "Welche Aussagen zum Mehrebenensystem und zur Politikverflechtung treffen nach dem Heft zu? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Der Begriff Mehrebenensystem erfasst, dass die EU kein Staat mit Regierung, aber ein funktionsfähiges politisches Handlungssystem ist." },
      { id: "b", richtig: true,  text: "Politikverflechtung sorgt dafür, dass möglichst viele Interessen in Entscheidungen einfließen." },
      { id: "c", richtig: true,  text: "Die Verflechtung kann eine effektive Entscheidungsfindung behindern und die Korrektur schwacher Entscheidungen erschweren." },
      { id: "d", richtig: false, text: "Im Mehrebenensystem schafft die EU-Ebene Politiken allein, regionale und kommunale Ebenen setzen sie nur noch um." },
      { id: "e", richtig: false, text: "Politikverflechtung bedeutet, dass einzelne große Mitgliedstaaten die Entscheidungen dauerhaft bestimmen." }
    ],
    hilfe1: "Politikverflechtung ist im Heft ein anderer Begriff für Regieren über mehrere Ebenen hinweg. Das Heft nennt Vorteile und Nachteile.",
    hilfe2: "Heft S. 16 f., Abschnitt „Die EU als Mehrebenensystem“.",
    seite: "S. 16 f.", lesehinweis: "Mehrebenensystem und Politikverflechtung"
  },

  {
    id: "F07", bereich: "grundlagen", format: "einfach", afb: "I",
    frage: "Das System der EU beruht auf der Logik einer doppelten Legitimation. Wer repräsentiert dabei wessen Interessen?",
    optionen: [
      { id: "a", richtig: true,  text: "Demokratisch legitimierte Regierungen vertreten die Mitgliedstaaten, das direkt gewählte Parlament die Bürgerinnen und Bürger." },
      { id: "b", richtig: false, text: "Die Kommission vertritt die Interessen der Mitgliedstaaten, das direkt gewählte Parlament die der Bürgerinnen und Bürger." },
      { id: "c", richtig: false, text: "Die Regierungen vertreten die Bürgerinnen und Bürger, die Kommission vertritt die gemeinsamen Interessen der Mitgliedstaaten." },
      { id: "d", richtig: false, text: "Der Europäische Rat vertritt die Mitgliedstaaten, der Gerichtshof die Rechte der Bürgerinnen und Bürger." }
    ],
    hilfe1: "„Doppelt“ meint zwei Quellen der Legitimation. Welche Organe sind demokratisch gewählt oder getragen?",
    hilfe2: "Heft S. 17, Abschnitt „Die EU-Organe und -Institutionen“.",
    seite: "S. 17", lesehinweis: "Doppelte Legitimation"
  },

  /* ===================== EUROPÄISCHER RAT (5) ===================== */

  {
    id: "F08", bereich: "er", format: "einfach", afb: "I",
    frage: "Wer kommt im Europäischen Rat zusammen?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Staats- und Regierungsspitzen, die Präsidentschaft des Europäischen Rates, die Kommissionspräsidentschaft und bei außenpolitischen Fragen die Hohe Vertreterin oder der Hohe Vertreter." },
      { id: "b", richtig: false, text: "Die Staats- und Regierungsspitzen, die Präsidentschaft des Europäischen Rates, die Präsidentschaft des Parlaments und bei Fragen der Währung die Präsidentschaft der EZB." },
      { id: "c", richtig: false, text: "Die Fachministerinnen und -minister, die Präsidentschaft des Europäischen Rates, die Kommissionspräsidentschaft und bei außenpolitischen Fragen der jeweilige Ratsvorsitz." },
      { id: "d", richtig: false, text: "Die Staats- und Regierungsspitzen, die Kommissionspräsidentschaft, der halbjährlich wechselnde Ratsvorsitz und bei außenpolitischen Fragen die Ständigen Vertreterinnen und Vertreter." }
    ],
    hilfe1: "Die Formel „27 + 3“ hilft: 27 Mitglieder aus den Staaten und drei weitere Personen, eine davon nur bei bestimmten Themen.",
    hilfe2: "Heft S. 17, Grafik „Zusammensetzung und Aufgaben des Europäischen Rates“.",
    seite: "S. 17", lesehinweis: "Zusammensetzung des Europäischen Rates"
  },

  {
    id: "F09", bereich: "er", format: "richtigfalsch", afb: "III",
    aussage: "Der Europäische Rat ist kein Legislativorgan, obwohl strittige Fragen aus der Gesetzgebung immer wieder an ihn „hochgereicht“ werden.",
    aussageRichtig: true,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Entscheidend sind am Ende die Abstimmungen der Fachministerinnen und -minister gemeinsam mit dem Parlament." },
      { id: "b", richtig: false, text: "Er besitzt zwar Gesetzgebungsrechte, nutzt sie aber wegen des Konsenszwangs in der Praxis nur sehr selten." },
      { id: "c", richtig: false, text: "Er ist erst seit 2009 Organ und hat Gesetzgebungsrechte bisher nur für Krisenfälle wie die Pandemie erhalten." },
      { id: "d", richtig: false, text: "Hochgereichte Fragen entscheidet er endgültig, deshalb wirkt er in der Praxis eben doch als Gesetzgeber." }
    ],
    hilfe1: "Unterscheide zwischen politischem Einfluss auf eine Frage und der formalen Abstimmung über einen Gesetzesakt.",
    hilfe2: "Heft S. 18, Absatz über Konsens und Gesetzgebung.",
    seite: "S. 18", lesehinweis: "Europäischer Rat: kein Legislativorgan"
  },

  {
    id: "F10", bereich: "er", format: "mehrfach", afb: "II",
    frage: "Welche Aussagen treffen auf den Europäischen Rat zu? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Er formuliert die politischen Leitlinien und generellen Ziele der EU." },
      { id: "b", richtig: true,  text: "Er entscheidet in der Regel im Konsens, Mehrheitsentscheidungen sind die Ausnahme." },
      { id: "c", richtig: true,  text: "Bei Vertragsänderungen und beim Mehrjährigen Finanzrahmen spielt er eine zentrale Rolle." },
      { id: "d", richtig: false, text: "Er war von Beginn an ein offizielles Organ der EU und tagt in festen Fachformationen." },
      { id: "e", richtig: false, text: "Er genehmigt den jährlichen Haushaltsplan der EU gemeinsam mit dem Parlament." },
      { id: "f", richtig: false, text: "Er bringt Änderungsvorschläge zu Gesetzesakten ein und stimmt über sie ab." }
    ],
    hilfe1: "Achte auf typische Verwechslungen mit dem Rat der EU, in dem die Fachministerinnen und -minister sitzen.",
    hilfe2: "Heft S. 17 f., Abschnitt „Europäischer Rat“ und Infokasten auf S. 18.",
    seite: "S. 17 f.", lesehinweis: "Aufgaben und Arbeitsweise des Europäischen Rates"
  },

  {
    id: "F11", bereich: "er", format: "zuordnen", afb: "II",
    frage: "Ordne jede Beschreibung dem passenden Amt zu. Ein Amt bleibt übrig.",
    elemente: [
      { id: "a", ziel: "w", text: "Sorgt mit einer verlängerbaren Amtszeit von zweieinhalb Jahren für Kontinuität bei der Koordinierung der Regierungsspitzen." },
      { id: "b", ziel: "x", text: "Wechselt alle sechs Monate zwischen den Mitgliedstaaten; die Fachministerinnen und -minister des Landes leiten die Sitzungen." },
      { id: "c", ziel: "y", text: "Ist mit einer Vizepräsidentschaft der Kommission verbunden und leitet den Rat für Auswärtige Angelegenheiten." },
      { id: "d", ziel: "z", text: "Stellt vor Beginn der Amtszeit politische Leitlinien vor, die an die Strategische Agenda anknüpfen." }
    ],
    ziele: [
      { id: "w", text: "Präsidentschaft des Europäischen Rates" },
      { id: "x", text: "Vorsitz im Rat der EU" },
      { id: "y", text: "Hohe Vertreterin oder Hoher Vertreter" },
      { id: "z", text: "Präsidentschaft der Kommission" },
      { id: "v", text: "Präsidentschaft der EZB" }
    ],
    hilfe1: "„Präsidentschaft des Europäischen Rates“ und „Vorsitz im Rat der EU“ klingen ähnlich. Eine ist auf Dauer angelegt, einer rotiert.",
    hilfe2: "Heft S. 17 f. (Europäischer Rat), S. 18 und S. 20 (Kommission), S. 22 (Rat der EU).",
    seite: "S. 18 und 22", lesehinweis: "Präsidentschaft des Europäischen Rates und Ratsvorsitz"
  },

  {
    id: "F12", bereich: "er", format: "reihenfolge", afb: "II",
    frage: "Bringe die Schritte, mit denen die EU ihre politischen Prioritäten festlegt, in die richtige zeitliche Reihenfolge.",
    schritte: [
      "Die Bürgerinnen und Bürger wählen das Europäische Parlament.",
      "Der Europäische Rat beschließt die Strategische Agenda.",
      "Die Kommissionspräsidentschaft stellt ihre politischen Leitlinien für die Amtszeit vor.",
      "In der Rede zur Lage der Union im September werden die Initiativen des kommenden Jahres angekündigt.",
      "Die Kommission veröffentlicht ihr jährliches Arbeitsprogramm mit konkreten Gesetzgebungsvorhaben."
    ],
    hilfe1: "Vom Allgemeinen zum Konkreten: Welches Dokument ist das allgemeinste, an welches knüpfen die anderen an?",
    hilfe2: "Heft S. 18 (Kommission, zweiter Absatz) und der Kasten „Aushandlung politischer Ziele in der EU“ auf S. 19.",
    seite: "S. 18 f.", lesehinweis: "Strategische Agenda, Leitlinien und Arbeitsprogramme"
  },

  /* ===================== EUROPÄISCHE KOMMISSION (7) ===================== */

  {
    id: "F13", bereich: "kommission", format: "einfach", afb: "I",
    frage: "Wie wird das Kollegium der Europäischen Kommission bestellt?",
    optionen: [
      { id: "a", richtig: true,  text: "Jeder Mitgliedstaat schlägt ein Mitglied vor; nach ausführlichen Anhörungen bestätigt das Parlament die Kandidatinnen und Kandidaten." },
      { id: "b", richtig: false, text: "Das Parlament wählt aus seinen Abgeordneten ein Mitglied pro Staat; der Europäische Rat bestätigt anschließend das Kollegium." },
      { id: "c", richtig: false, text: "Jeder Mitgliedstaat ernennt ein Mitglied in eigener Verantwortung; eine Bestätigung durch ein anderes Organ ist nicht vorgesehen." },
      { id: "d", richtig: false, text: "Der Rat der EU wählt die Mitglieder mit qualifizierter Mehrheit; das Parlament wird zu den Kandidaturen nur angehört." }
    ],
    hilfe1: "Das Heft spricht von einer gemeinsamen Bestellung. Wer ist also beteiligt?",
    hilfe2: "Heft S. 18, Beginn des Abschnitts „Europäische Kommission“.",
    seite: "S. 18", lesehinweis: "Bestellung der Kommission"
  },

  {
    id: "F14", bereich: "kommission", format: "richtigfalsch", afb: "III",
    aussage: "Weil jeder Mitgliedstaat ein Kommissionsmitglied vorschlägt, vertreten die Kommissarinnen und Kommissare die Interessen ihres Herkunftslandes.",
    aussageRichtig: false,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Die Kommission dient ausdrücklich nicht staatlichen oder parteipolitischen Interessen, sondern dem Gesamtwohl der Union." },
      { id: "b", richtig: false, text: "Die Mitglieder werden vom Parlament bestätigt und vertreten deshalb die Interessen der Fraktion, die sie gewählt hat." },
      { id: "c", richtig: false, text: "Die Kommission vertritt die Interessen der Bürgerinnen und Bürger, weil sie als einziges Organ direkt gewählt wird." },
      { id: "d", richtig: false, text: "Das Vorschlagsrecht der Staaten bindet die Mitglieder an die Weisungen der Regierung, die sie entsandt hat." }
    ],
    hilfe1: "Trenne zwei Fragen: Wer schlägt jemanden vor? Und wem ist die Person im Amt verpflichtet?",
    hilfe2: "Heft S. 18, zweiter Absatz zur Kommission, und Infokasten auf S. 20.",
    seite: "S. 18", lesehinweis: "Kommission und Gesamtwohl der Union"
  },

  {
    id: "F15", bereich: "kommission", format: "mehrfach", afb: "II",
    frage: "Welche Aussagen zum Initiativrecht der Kommission treffen zu? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Nur die Kommission kann Gesetzgebungsvorschläge einbringen." },
      { id: "b", richtig: true,  text: "Im Entscheidungsprozess selbst hat die Kommission kein Stimmrecht." },
      { id: "c", richtig: true,  text: "So soll keine Seite, weder staatliche noch EU-weite Interessen, übervorteilt werden." },
      { id: "d", richtig: false, text: "Die Kommission entscheidet gemeinsam mit dem Rat abschließend über ihre Vorschläge." },
      { id: "e", richtig: false, text: "Mit dem Initiativrecht kann sie Gesetze ohne Zustimmung von Rat und Parlament erlassen." }
    ],
    hilfe1: "Das Heft nennt das Initiativrecht das „machtvollste Instrument“ der Kommission. Frage dich, wo diese Macht endet.",
    hilfe2: "Heft S. 18, Absatz „Das machtvollste Instrument …“.",
    seite: "S. 18", lesehinweis: "Initiativrecht der Kommission"
  },

  {
    id: "F16", bereich: "kommission", format: "fall", afb: "II",
    fall: "Es gibt deutliche Hinweise, dass ein Mitgliedstaat Gelder aus dem EU-Haushalt entgegen den Gemeinschaftszielen verwendet. Bis zur Klärung sollen weitere Zahlungen an diesen Staat gestoppt werden.",
    frage: "Welche Institution kann laut Heft Zahlungen an den Staat zurückhalten?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Europäische Kommission" },
      { id: "b", richtig: false, text: "Der Europäische Rechnungshof" },
      { id: "c", richtig: false, text: "Die Europäische Staatsanwaltschaft" },
      { id: "d", richtig: false, text: "Der Rat der EU" }
    ],
    hilfe1: "Gesucht ist die Institution, die den EU-Haushalt verwaltet. Prüfen und berichten ist nicht dasselbe wie Zahlungen anhalten.",
    hilfe2: "Heft S. 18, letzter Absatz zur Kommission, und S. 26 zum Rechnungshof.",
    seite: "S. 18", lesehinweis: "Kommission: Überwachung und Haushalt"
  },

  {
    id: "F17", bereich: "kommission", format: "einfach", afb: "II",
    frage: "Das Heft bezeichnet das Amt der Hohen Vertreterin oder des Hohen Vertreters für Außen- und Sicherheitspolitik als eigenständig. Warum?",
    optionen: [
      { id: "a", richtig: true,  text: "Es ist zugleich in der Kommission und im Rat der EU angesiedelt, um die Außen- und Sicherheitspolitik beider Institutionen zu verzahnen." },
      { id: "b", richtig: false, text: "Es ist keinem Organ zugeordnet und handelt außenpolitisch allein auf der Grundlage eines Mandats des Europäischen Parlaments." },
      { id: "c", richtig: false, text: "Es ist mit der Präsidentschaft des Europäischen Rates verbunden und kann deshalb das Veto einzelner Staaten überwinden." },
      { id: "d", richtig: false, text: "Es wird mit dem Ratsvorsitz halbjährlich neu besetzt und liegt jeweils beim Außenministerium des Vorsitzlandes." }
    ],
    hilfe1: "Das Heft spricht von einer „Doppelrolle“. Zwischen welchen beiden Institutionen?",
    hilfe2: "Heft S. 20, Absatz zur Hohen Vertreterin oder zum Hohen Vertreter.",
    seite: "S. 20", lesehinweis: "Hohe Vertreterin oder Hoher Vertreter"
  },

  {
    id: "F18", bereich: "kommission", format: "mehrfach", afb: "III",
    frage: "Die Kommission wird manchmal als „Regierung der EU“ bezeichnet. Welche Merkmale aus dem Heft sprechen gegen diese Bezeichnung? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Sie hat bei Gesetzen kein Stimmrecht und steuert über Vorschläge, Koordinierung und die Überwachung von Recht." },
      { id: "b", richtig: true,  text: "Die Verwaltungen der Mitgliedstaaten setzen EU-Politik um und erhalten von ihr keine direkten Anweisungen." },
      { id: "c", richtig: true,  text: "Im Parlament gibt es keine Regierungsfraktionen, die sie tragen, weil aus dem Parlament keine Regierung benannt wird." },
      { id: "d", richtig: false, text: "Sie verwaltet den EU-Haushalt und kann bei Rechtsbrüchen Gerichtsverfahren gegen Mitgliedstaaten einleiten." },
      { id: "e", richtig: false, text: "Sie entwickelt in ihren Leitlinien und Arbeitsprogrammen die Kernprojekte der EU für die Amtszeit." }
    ],
    hilfe1: "Manche Aussagen sind sachlich richtig, sprechen aber eher für als gegen den Vergleich mit einer Regierung. Prüfe jede Aussage auf beides.",
    hilfe2: "Heft S. 18 (Kommission) und S. 21 (Parlament, Absatz zu Ausschüssen und Plenum).",
    seite: "S. 18", lesehinweis: "Warum die Kommission keine Regierung ist"
  },

  {
    id: "F19", bereich: "kommission", format: "fall", afb: "II",
    fall: "In der Welthandelsorganisation wird über neue Regeln für den internationalen Warenverkehr verhandelt. Die EU tritt dort mit einer gemeinsamen Position auf.",
    frage: "Welche Institution vertritt die EU in diesem Politikfeld nach außen?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Europäische Kommission" },
      { id: "b", richtig: false, text: "Die Präsidentschaft des Europäischen Rates" },
      { id: "c", richtig: false, text: "Der jeweilige Vorsitz im Rat der EU" },
      { id: "d", richtig: false, text: "Das Europäische Parlament" }
    ],
    hilfe1: "Welche Politikbereiche nennt das Heft, in denen die EU für die Politikgestaltung zuständig ist?",
    hilfe2: "Heft S. 20, Absatz „Vertretung der EU nach außen“.",
    seite: "S. 20", lesehinweis: "Vertretung der EU nach außen"
  },

  /* ===================== EUROPÄISCHES PARLAMENT (7) ===================== */

  {
    id: "F20", bereich: "parlament", format: "einfach", afb: "I",
    frage: "Welche Angabe zum Europäischen Parlament ist korrekt?",
    optionen: [
      { id: "a", richtig: true,  text: "720 Abgeordnete, seit 1979 alle fünf Jahre direkt gewählt, Tagungen in Brüssel und Straßburg" },
      { id: "b", richtig: false, text: "720 Abgeordnete, seit 1993 alle fünf Jahre direkt gewählt, Tagungen in Brüssel und Luxemburg" },
      { id: "c", richtig: false, text: "720 Abgeordnete, seit 1979 alle vier Jahre direkt gewählt, Tagungen in Straßburg und Frankfurt" },
      { id: "d", richtig: false, text: "329 Abgeordnete, seit 1979 alle fünf Jahre direkt gewählt, Tagungen in Brüssel und Straßburg" }
    ],
    hilfe1: "Vergleiche die Angaben Stück für Stück: Zahl, Jahr, Rhythmus, Orte. Eine Zahl gehört zu den beratenden Ausschüssen.",
    hilfe2: "Heft S. 20 f., Abschnitt „Europäisches Parlament“.",
    seite: "S. 20 f.", lesehinweis: "Europäisches Parlament: Wahl und Sitze"
  },

  {
    id: "F21", bereich: "parlament", format: "zuordnen", afb: "II",
    frage: "Ordne jedes Recht des Parlaments dem passenden Aufgabenbereich zu. Ein Bereich kann mehrfach passen, einer passt gar nicht.",
    elemente: [
      { id: "a", ziel: "w", text: "Stimmt über internationale Abkommen und Erweiterungen der EU mit ab." },
      { id: "b", ziel: "x", text: "Muss der Vorlage zum Mehrjährigen Finanzrahmen zustimmen." },
      { id: "c", ziel: "y", text: "Nimmt Petitionen von Bürgerinnen und Bürgern entgegen." },
      { id: "d", ziel: "y", text: "Muss der Besetzung des Kommissionskollegiums zustimmen." }
    ],
    ziele: [
      { id: "w", text: "Gesetzgebung" },
      { id: "x", text: "Haushalt" },
      { id: "y", text: "Demokratische Kontrolle" },
      { id: "v", text: "Rechtsprechung" }
    ],
    hilfe1: "Die Grafik zum Parlament ordnet die Aufgaben in drei Felder. Überlege, wem gegenüber das Parlament jeweils handelt.",
    hilfe2: "Heft S. 21, Grafik „Aufbau und Aufgaben des Europäischen Parlaments“ und der Text daneben.",
    seite: "S. 21", lesehinweis: "Aufgaben des Parlaments"
  },

  {
    id: "F22", bereich: "parlament", format: "richtigfalsch", afb: "II",
    aussage: "Das Europäische Parlament kann eine amtierende Kommission zu Fall bringen.",
    aussageRichtig: true,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Es kann der Kommission das Vertrauen entziehen; schon die Androhung führte 1999 zum Rücktritt der gesamten Kommission." },
      { id: "b", richtig: false, text: "Es wählt die Kommissionsmitglieder aus den eigenen Reihen und kann sie deshalb jederzeit einzeln wieder abberufen." },
      { id: "c", richtig: false, text: "Es kann die Kommission beim Gerichtshof verklagen, der sie 1999 auf diesem Weg erstmals ihres Amtes enthoben hat." },
      { id: "d", richtig: false, text: "Die Kommission ist allein den Regierungen verantwortlich, die ihre Mitglieder vorgeschlagen haben, nicht dem Parlament." }
    ],
    hilfe1: "Welches Kontrollrecht hat das Parlament gegenüber der Kommission über die Zustimmung zur Besetzung hinaus?",
    hilfe2: "Heft S. 21, Absatz zum Kontrollrecht gegenüber der Kommission.",
    seite: "S. 21", lesehinweis: "Kontrollrechte und Vertrauensentzug"
  },

  {
    id: "F23", bereich: "parlament", format: "mehrfach", afb: "II",
    frage: "Welche Aussagen beschreiben die Arbeitsweise des Europäischen Parlaments zutreffend? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Es gibt keine Aufteilung in Regierungs- und Oppositionsfraktionen, weil aus dem Parlament keine Regierung hervorgeht." },
      { id: "b", richtig: true,  text: "Abgeordnete sind weniger eng an Parteipositionen gebunden als in staatlichen Parlamenten, Mehrheiten sind flexibler." },
      { id: "c", richtig: true,  text: "In den Fraktionen arbeiten Europaparteien zusammen, also Zusammenschlüsse programmatisch ähnlicher staatlicher Parteien." },
      { id: "d", richtig: false, text: "Die Mehrheit zur Wahl der Kommissionspräsidentin 2024 bildet eine stabile Koalition wie in staatlichen Parlamenten." },
      { id: "e", richtig: false, text: "Beschlüsse werden direkt im Plenum erarbeitet; die Ausschüsse sind vor allem für Petitionen zuständig." },
      { id: "f", richtig: false, text: "Politische Kontroversen verlaufen nur zwischen den Fraktionen, niemals innerhalb einer Fraktion." }
    ],
    hilfe1: "Vergleiche mit dem Bundestag: Was fehlt im Europäischen Parlament, weil keine Regierung aus ihm hervorgeht?",
    hilfe2: "Heft S. 20 bis 22, besonders S. 21 unten und S. 22 oben.",
    seite: "S. 21 f.", lesehinweis: "Fraktionen, Ausschüsse und flexible Mehrheiten"
  },

  {
    id: "F24", bereich: "parlament", format: "fall", afb: "II",
    fall: "Ein Bürger möchte ein Anliegen unmittelbar an die EU-Ebene richten. Er will weder klagen noch den Weg über seine Regierung gehen.",
    frage: "Welche Möglichkeit nennt das Heft für ihn?",
    optionen: [
      { id: "a", richtig: true,  text: "Eine Petition an das Parlament richten oder sich an die Ombudsperson wenden" },
      { id: "b", richtig: false, text: "Beim Gerichtshof selbst eine Vorabentscheidung zu seinem Anliegen beantragen" },
      { id: "c", richtig: false, text: "Beim Ausschuss der Regionen eine verbindliche Stellungnahme anfordern" },
      { id: "d", richtig: false, text: "Sich an den Rechnungshof wenden, der die zuständige Stelle anweisen kann" }
    ],
    hilfe1: "Das Heft beschreibt ein Organ als „direkten Ansprechpartner“ für Bürgerinnen und Bürger.",
    hilfe2: "Heft S. 21, Ende des Absatzes zu den Kontrollrechten.",
    seite: "S. 21", lesehinweis: "Petitionen und Ombudsperson"
  },

  {
    id: "F25", bereich: "parlament", format: "reihenfolge", afb: "I",
    frage: "Bringe die Ereignisse in die richtige zeitliche Reihenfolge, beginnend mit dem frühesten.",
    schritte: [
      "Die Abgeordneten des Europäischen Parlaments werden erstmals direkt gewählt.",
      "Die gesamte Kommission tritt erstmals zurück, nachdem ein Vertrauensentzug angedroht wurde.",
      "Der Europäische Rat wird durch den Vertrag von Lissabon ein offizielles Organ der EU.",
      "EVP, Sozialdemokraten, Liberale und Grüne bilden eine Mehrheit zur Wahl der Kommissionspräsidentin."
    ],
    hilfe1: "Denk in Jahrzehnten: Ein Ereignis gehört in die 1970er-Jahre, eines liegt erst kurz zurück.",
    hilfe2: "Heft S. 18 (Infokasten Europäischer Rat), S. 20 bis 22 (Parlament).",
    seite: "S. 20 bis 22", lesehinweis: "Wichtige Daten zum Parlament"
  },

  {
    id: "F26", bereich: "parlament", format: "einfach", afb: "I",
    frage: "Welche Rolle hat das Europäische Parlament beim EU-Haushalt?",
    optionen: [
      { id: "a", richtig: true,  text: "Es ist an der Aufstellung des jährlichen Haushaltsplans direkt beteiligt und muss dem Mehrjährigen Finanzrahmen zustimmen." },
      { id: "b", richtig: false, text: "Es beschließt den jährlichen Haushaltsplan allein und handelt den Mehrjährigen Finanzrahmen im Konsens mit den Staaten aus." },
      { id: "c", richtig: false, text: "Es wird zum jährlichen Haushaltsplan angehört; über den Mehrjährigen Finanzrahmen entscheidet der Europäische Rat allein." },
      { id: "d", richtig: false, text: "Es verwaltet den Haushalt und kann Zahlungen an Mitgliedstaaten zurückhalten, wenn Gelder zweckwidrig verwendet werden." }
    ],
    hilfe1: "Unterscheide den jährlichen Haushaltsplan vom Mehrjährigen Finanzrahmen. Wer legt die Vorlage für den Finanzrahmen vor?",
    hilfe2: "Heft S. 21, Absatz zur Gesetzgebung und zum Haushalt.",
    seite: "S. 21", lesehinweis: "Parlament und Haushalt"
  },

  /* ===================== RAT DER EU (7) ===================== */

  {
    id: "F27", bereich: "rat", format: "einfach", afb: "I",
    frage: "Wann ist im Rat der EU eine qualifizierte Mehrheit erreicht?",
    optionen: [
      { id: "a", richtig: true,  text: "Mindestens 55 Prozent der Mitgliedstaaten stimmen zu, und diese repräsentieren mindestens 65 Prozent der EU-Bevölkerung." },
      { id: "b", richtig: false, text: "Mindestens 65 Prozent der Mitgliedstaaten stimmen zu, und diese repräsentieren mindestens 55 Prozent der EU-Bevölkerung." },
      { id: "c", richtig: false, text: "Entweder stimmen 55 Prozent der Mitgliedstaaten zu oder die Zustimmenden repräsentieren 65 Prozent der EU-Bevölkerung." },
      { id: "d", richtig: false, text: "Mindestens zwei Drittel der Mitgliedstaaten stimmen zu, unabhängig davon, welchen Anteil der Bevölkerung sie vertreten." }
    ],
    hilfe1: "Das Heft spricht von einer „doppelten Mehrheit“. Beide Bedingungen beziehen sich auf etwas anderes.",
    hilfe2: "Heft S. 22, Absatz zu den Ratsformationen.",
    seite: "S. 22", lesehinweis: "Qualifizierte Mehrheit im Rat"
  },

  {
    id: "F28", bereich: "rat", format: "einfach", afb: "III",
    frage: "Bei einer Abstimmung im Rat der EU stimmen 16 Mitgliedstaaten zu, die zusammen 58 Prozent der EU-Bevölkerung repräsentieren. Wie ist das Ergebnis zu beurteilen?",
    optionen: [
      { id: "a", richtig: true,  text: "Der Vorschlag ist abgelehnt: Die Mehrheit der Staaten ist erreicht, die Schwelle bei der Bevölkerung aber nicht." },
      { id: "b", richtig: false, text: "Der Vorschlag ist angenommen: Mit 16 von 27 Staaten ist die Schwelle von 55 Prozent der Staaten überschritten." },
      { id: "c", richtig: false, text: "Der Vorschlag ist angenommen: Für eine qualifizierte Mehrheit genügt es, wenn eine der beiden Schwellen erreicht ist." },
      { id: "d", richtig: false, text: "Der Vorschlag ist abgelehnt: Es fehlt die Schwelle von 65 Prozent der Staaten, die Bevölkerung ist ausreichend vertreten." }
    ],
    hilfe1: "Prüfe beide Bedingungen der doppelten Mehrheit einzeln. 15 von 27 Staaten entsprechen 55 Prozent.",
    hilfe2: "Heft S. 22, Absatz zur qualifizierten Mehrheit.",
    seite: "S. 22", lesehinweis: "Qualifizierte Mehrheit im Rat"
  },

  {
    id: "F29", bereich: "rat", format: "zuordnen", afb: "II",
    frage: "Ordne jede Beschreibung dem passenden Gremium oder Amt im Rat der EU zu. Ein Begriff bleibt übrig.",
    elemente: [
      { id: "a", ziel: "w", text: "Verhandelt alle Ratsentscheidungen vor; einigt er sich, müssen die Ministerinnen und Minister die Sachfrage nicht mehr diskutieren." },
      { id: "b", ziel: "x", text: "Unterstützen in über 150 Gruppen die Vorbereitung der Ratstagungen." },
      { id: "c", ziel: "y", text: "Gruppen von Fachministerinnen und -ministern, die themenbezogen beraten und beschließen, etwa zu Umwelt." },
      { id: "d", ziel: "z", text: "Wechselt halbjährlich; die Fachministerinnen und -minister des jeweiligen Landes leiten die Sitzungen." }
    ],
    ziele: [
      { id: "w", text: "Ausschuss der Ständigen Vertreter (AStV)" },
      { id: "x", text: "Ratsarbeitsgruppen" },
      { id: "y", text: "Ratsformationen" },
      { id: "z", text: "Vorsitz im Rat" },
      { id: "v", text: "Europäischer Rat" }
    ],
    hilfe1: "Der AStV ist auch unter der französischen Abkürzung COREPER bekannt. Seine Mitglieder sind mit Botschafterinnen und Botschaftern vergleichbar.",
    hilfe2: "Heft S. 22 und die Grafik zum Rat der EU auf S. 23.",
    seite: "S. 22 f.", lesehinweis: "Ratsformationen, AStV und Arbeitsgruppen"
  },

  {
    id: "F30", bereich: "rat", format: "richtigfalsch", afb: "II",
    aussage: "Von einem „German vote“ spricht man, wenn Deutschland im Rat der EU mit Nein stimmt, weil es von den anderen Staaten überstimmt zu werden droht.",
    aussageRichtig: false,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Gemeint ist die Enthaltung, zu der ein Land gezwungen ist, wenn keine einheitliche Regierungsposition zustande kommt." },
      { id: "b", richtig: false, text: "Gemeint ist das besondere Stimmgewicht, das Deutschland bei der doppelten Mehrheit wegen seiner Bevölkerung hat." },
      { id: "c", richtig: false, text: "Gemeint ist ein Vetorecht großer Mitgliedstaaten bei Fragen der gemeinsamen Außen- und Sicherheitspolitik." },
      { id: "d", richtig: false, text: "Gemeint ist eine Gegenstimme, die Deutschland abgibt, wenn sich die beteiligten Ministerien nicht einigen können." }
    ],
    hilfe1: "Der Begriff wird im Heft „ironisch“ genannt. Er beschreibt eine Folge der schwierigen Abstimmung innerhalb der Bundesregierung.",
    hilfe2: "Heft S. 22, letzter Absatz zum Rat der EU.",
    seite: "S. 22", lesehinweis: "Nationale Koordinierung und „German vote“"
  },

  {
    id: "F31", bereich: "rat", format: "mehrfach", afb: "I",
    frage: "Warum ist die Koordinierung der deutschen Position für den Rat der EU laut Heft besonders komplex? Wähle alle zutreffenden Gründe.",
    optionen: [
      { id: "a", richtig: true,  text: "Die Ministerien haben eine große Autonomie." },
      { id: "b", richtig: true,  text: "Es regieren üblicherweise Koalitionsregierungen." },
      { id: "c", richtig: true,  text: "Die föderale Struktur muss berücksichtigt werden." },
      { id: "d", richtig: false, text: "Der Bundestag muss jede Ratsposition vorab bestätigen." },
      { id: "e", richtig: false, text: "Deutschland hat im Rat ein besonderes Vetorecht." }
    ],
    hilfe1: "Die Position eines Landes formuliert dessen Regierung. Überlege, wer in Deutschland innerhalb und neben der Bundesregierung mitredet.",
    hilfe2: "Heft S. 22, Absatz zu den Standpunkten für den AStV.",
    seite: "S. 22", lesehinweis: "Nationale Koordinierung und „German vote“"
  },

  {
    id: "F32", bereich: "rat", format: "mehrfach", afb: "II",
    frage: "Welche Aufgaben hat der Rat der EU? Wähle alle zutreffenden Aufgaben.",
    optionen: [
      { id: "a", richtig: true,  text: "Er verabschiedet EU-Rechtsvorschriften gemeinsam mit dem Parlament auf Grundlage von Kommissionsvorschlägen." },
      { id: "b", richtig: true,  text: "Er koordiniert die politischen Maßnahmen der Mitgliedstaaten." },
      { id: "c", richtig: true,  text: "Er schließt internationale Übereinkünfte zwischen der EU und anderen Staaten oder Organisationen." },
      { id: "d", richtig: true,  text: "Er genehmigt den Haushaltsplan der EU gemeinsam mit dem Parlament." },
      { id: "e", richtig: false, text: "Er beschließt die Strategische Agenda mit den allgemeinen Zielen der EU." },
      { id: "f", richtig: false, text: "Er bringt als einziges Organ Gesetzgebungsvorschläge ein." }
    ],
    hilfe1: "Achte auf Aufgaben, die eigentlich zum Europäischen Rat oder zur Kommission gehören.",
    hilfe2: "Heft S. 22 und die Grafik „Aufbau und Aufgaben des Rates der Europäischen Union“ auf S. 23.",
    seite: "S. 22 f.", lesehinweis: "Aufgaben des Rates der EU"
  },

  {
    id: "F33", bereich: "rat", format: "reihenfolge", afb: "II",
    frage: "Ein Gesetzgebungsvorschlag wird im Rat der EU behandelt. Bringe die Stationen in die richtige Reihenfolge, von der fachlichen Vorbereitung bis zum Beschluss.",
    schritte: [
      "Die Kommission legt einen Gesetzgebungsvorschlag vor.",
      "Ratsarbeitsgruppen bereiten die Beratung fachlich vor.",
      "Der Ausschuss der Ständigen Vertreter verhandelt die Ratsentscheidung vor.",
      "Die Fachministerinnen und -minister beschließen in der zuständigen Ratsformation."
    ],
    hilfe1: "Arbeite dich von der Ebene der Fachleute über die Botschafterinnen und Botschafter bis zur politischen Spitze vor.",
    hilfe2: "Heft S. 22, Absatz zu den Ständigen Vertreterinnen und Vertretern, und Grafik auf S. 23.",
    seite: "S. 22 f.", lesehinweis: "Ratsformationen, AStV und Arbeitsgruppen"
  },

  /* ===================== GERICHTSHOF DER EU (6) ===================== */

  {
    id: "F34", bereich: "gerichtshof", format: "zuordnen", afb: "II",
    frage: "Ordne jeden Fall der passenden Verfahrensart am EuGH zu. Eine Verfahrensart passt mehrfach, eine gar nicht.",
    elemente: [
      { id: "a", ziel: "w", text: "Die Kommission geht gegen einen Mitgliedstaat vor, der EU-Recht nicht pflichtgemäß anwendet." },
      { id: "b", ziel: "w", text: "Ein Unternehmen nimmt Schaden, weil ein Mitgliedstaat EU-Recht nicht einhält, und ruft den EuGH an." },
      { id: "c", ziel: "x", text: "Das Parlament klagt, weil die Kommission einen neuen Mechanismus zum Schutz der Rechtsstaatlichkeit zu zögerlich anwendet." },
      { id: "d", ziel: "y", text: "Ein Mitgliedstaat will einen EU-Rechtsakt streichen lassen, weil die EU ihre Zuständigkeiten überschritten habe." }
    ],
    ziele: [
      { id: "w", text: "Vertragsverletzungsverfahren" },
      { id: "x", text: "Untätigkeitsklage" },
      { id: "y", text: "Nichtigkeitsklage" },
      { id: "v", text: "Vorabentscheidung" }
    ],
    hilfe1: "Frage bei jedem Fall: Gegen wen richtet sich das Verfahren, und geht es um zu wenig oder um zu viel Handeln?",
    hilfe2: "Heft S. 24, Absätze zu Vertragsverletzungsverfahren, Untätigkeitsklage und Nichtigkeitsklage.",
    seite: "S. 24", lesehinweis: "Klagearten am EuGH"
  },

  {
    id: "F35", bereich: "gerichtshof", format: "fall", afb: "III",
    fall: "Ein deutsches Verwaltungsgericht verhandelt über eine Klage. Unklar ist, ob eine EU-Vorschrift auf den Fall überhaupt anwendbar ist und wie sie zu verstehen wäre.",
    frage: "Welches Vorgehen beschreibt das Heft für diesen Fall?",
    optionen: [
      { id: "a", richtig: true,  text: "Das Gericht legt die Frage dem EuGH zur Vorabentscheidung vor; die Antwort ist für alle Mitgliedstaaten verbindlich." },
      { id: "b", richtig: false, text: "Das Gericht legt die Frage dem EuGH zur Vorabentscheidung vor; die Antwort bindet allerdings nur das vorlegende Gericht." },
      { id: "c", richtig: false, text: "Das Gericht setzt das Verfahren aus, bis die Kommission ein Vertragsverletzungsverfahren gegen Deutschland eröffnet." },
      { id: "d", richtig: false, text: "Das Gericht wendet ausschließlich deutsches Recht an, weil nur der EuGH befugt ist, EU-Recht zu sprechen." }
    ],
    hilfe1: "Im Mehrebenensystem sprechen auch nationale Gerichte EU-Recht. Was tun sie, wenn sie unsicher sind, und wie weit reicht die Antwort?",
    hilfe2: "Heft S. 24, Absatz „Im Mehrebenensystem …“.",
    seite: "S. 24", lesehinweis: "Vorabentscheidung und nationale Gerichte"
  },

  {
    id: "F36", bereich: "gerichtshof", format: "einfach", afb: "I",
    frage: "Welche Bedeutung hat das Urteil van Gend & Loos (1963)?",
    optionen: [
      { id: "a", richtig: true,  text: "Es legte die Eigenständigkeit und direkte Wirksamkeit des EU-Rechts fest; auch Einzelne können es vor nationalen Gerichten einklagen." },
      { id: "b", richtig: false, text: "Es öffnete in Deutschland den Wehrdienst für Frauen, weil ihr Ausschluss gegen die Gleichbehandlung von Arbeitnehmerinnen verstieß." },
      { id: "c", richtig: false, text: "Es schuf die Untätigkeitsklage, mit der das Parlament die Kommission bei zu geringer Rechtsanwendung verklagen kann." },
      { id: "d", richtig: false, text: "Es legte fest, dass EU-Recht in einem Mitgliedstaat erst gilt, wenn dessen Parlament es ausdrücklich bestätigt hat." }
    ],
    hilfe1: "Das Urteil gehört zu den Vorabentscheidungen und betrifft das Verhältnis zwischen EU-Recht und Einzelnen.",
    hilfe2: "Heft S. 24, Absatz zu den Vorabentscheidungen.",
    seite: "S. 24", lesehinweis: "van Gend & Loos und direkte Wirksamkeit"
  },

  {
    id: "F37", bereich: "gerichtshof", format: "einfach", afb: "II",
    frage: "Wie wird EU-Recht durchgesetzt, wenn dafür staatlicher Zwang nötig ist, zum Beispiel eine Gefängnisstrafe?",
    optionen: [
      { id: "a", richtig: true,  text: "Durch die Mitgliedstaaten, deren Rechtsorgane Teil der EU-Gerichtsbarkeit sind, weil die EU selbst keine Staatsgewalt besitzt." },
      { id: "b", richtig: false, text: "Durch Vollzugsbeamtinnen und -beamte des EuGH, die in allen Mitgliedstaaten eigene Befugnisse zur Vollstreckung haben." },
      { id: "c", richtig: false, text: "Durch die Kommission, die den nationalen Verwaltungen und Gerichten dafür im Einzelfall direkte Anweisungen erteilt." },
      { id: "d", richtig: false, text: "Durch die Europäische Staatsanwaltschaft, die für die Vollstreckung aller Urteile des Gerichtshofs zuständig ist." }
    ],
    hilfe1: "Besitzt die EU eigene Polizei und Gefängnisse? Wer verfügt in einem Mehrebenensystem über Gewaltbefugnisse?",
    hilfe2: "Heft S. 24, Absatz zur Nichtigkeitsklage, letzte Sätze.",
    seite: "S. 24", lesehinweis: "Durchsetzung von EU-Recht durch die Staaten"
  },

  {
    id: "F38", bereich: "gerichtshof", format: "mehrfach", afb: "II",
    frage: "Welche Aussagen zur Rolle des Gerichtshofs der EU treffen zu? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Er sorgt dafür, dass EU-Recht in allen Mitgliedstaaten einheitlich angewendet wird." },
      { id: "b", richtig: true,  text: "Er prüft auch, ob die EU in einem Bereich überhaupt eine vertraglich festgelegte Kompetenz hat." },
      { id: "c", richtig: true,  text: "Er achtet darauf, dass auch die EU-Institutionen selbst das EU-Recht einhalten." },
      { id: "d", richtig: false, text: "Ohne vertragliche Kompetenz darf die EU handeln, wenn der Europäische Rat dem zustimmt." },
      { id: "e", richtig: false, text: "Er ist an Weisungen der Kommission gebunden, weil diese die Einhaltung des EU-Rechts überwacht." },
      { id: "f", richtig: false, text: "Er entscheidet nur Streitigkeiten zwischen Mitgliedstaaten, nicht solche mit Bürgerinnen und Bürgern." }
    ],
    hilfe1: "EU-Urteile befassen sich laut Heft mit zwei großen Fragen. Welche?",
    hilfe2: "Heft S. 24, die ersten beiden Absätze und der Infokasten.",
    seite: "S. 24", lesehinweis: "Aufgaben des EuGH und Kompetenzen der EU"
  },

  {
    id: "F39", bereich: "gerichtshof", format: "einfach", afb: "II",
    frage: "Wodurch unterscheiden sich Untätigkeitsklage und Nichtigkeitsklage?",
    optionen: [
      { id: "a", richtig: true,  text: "Die Untätigkeitsklage rügt, dass EU-Institutionen zu wenig tun; die Nichtigkeitsklage soll Rechtsakte streichen, die über EU-Zuständigkeiten hinausgehen." },
      { id: "b", richtig: false, text: "Die Untätigkeitsklage soll Rechtsakte streichen, die über EU-Zuständigkeiten hinausgehen; die Nichtigkeitsklage rügt, dass EU-Institutionen zu wenig tun." },
      { id: "c", richtig: false, text: "Die Untätigkeitsklage richtet sich gegen Mitgliedstaaten, die EU-Recht nicht anwenden; die Nichtigkeitsklage gegen Unternehmen, die es missachten." },
      { id: "d", richtig: false, text: "Die Untätigkeitsklage kann nur das Parlament erheben, die Nichtigkeitsklage nur die Kommission; beide richten sich gegen Mitgliedstaaten." }
    ],
    hilfe1: "Das Heft leitet die Nichtigkeitsklage mit „Umgekehrt …“ ein. Wovon ist sie die Umkehrung?",
    hilfe2: "Heft S. 24, zweite Spalte.",
    seite: "S. 24", lesehinweis: "Klagearten am EuGH"
  },

  /* ===================== EUROPÄISCHE ZENTRALBANK (6) ===================== */

  {
    id: "F40", bereich: "ezb", format: "einfach", afb: "II",
    frage: "Das Heft beschreibt die EZB als „Agenten“. Warum werden Aufgaben wie die Geldpolitik solchen Institutionen übertragen?",
    optionen: [
      { id: "a", richtig: true,  text: "Gewählten Amtsträgerinnen und Amtsträgern geht es auch um Wiederwahl, und politische Einflussnahme auf die Geldpolitik wirkt destabilisierend." },
      { id: "b", richtig: false, text: "Agenten werden direkt von den Bürgerinnen und Bürgern gewählt und sind deshalb für langfristige Entscheidungen besonders gut legitimiert." },
      { id: "c", richtig: false, text: "Die Mitgliedstaaten beschließen die Geldpolitik im Konsens, und Agenten führen diese Beschlüsse anschließend nach Weisung aus." },
      { id: "d", richtig: false, text: "Die Kommission gibt Agenten jährlich neue Ziele vor, damit deren Arbeit sich an den aktuellen politischen Mehrheiten ausrichtet." }
    ],
    hilfe1: "Agenten werden von gewählten Vertreterinnen und Vertretern eingesetzt und erhalten ein Mandat. Was soll damit vermieden werden?",
    hilfe2: "Heft S. 24, Abschnitt „Weitere EU-Organe und -Institutionen“.",
    seite: "S. 24", lesehinweis: "Agentenmodell und Unabhängigkeit"
  },

  {
    id: "F41", bereich: "ezb", format: "zuordnen", afb: "I",
    frage: "Ordne jede Beschreibung dem passenden Gremium der EZB zu. Jedes Gremium kann mehrfach vorkommen.",
    elemente: [
      { id: "a", ziel: "x", text: "Wichtigstes Entscheidungsgremium; legt Währungspolitik und Zinssätze fest." },
      { id: "b", ziel: "w", text: "Führt die Tagesgeschäfte, vor allem die Durchführung der Währungspolitik." },
      { id: "c", ziel: "y", text: "Beratende und koordinierende Funktion; bereitet den Beitritt neuer Länder zum Euroraum vor." },
      { id: "d", ziel: "x", text: "Besteht aus dem Direktorium und den Präsidentinnen und Präsidenten der Zentralbanken der Eurozone." },
      { id: "e", ziel: "y", text: "Hier sind die Zentralbanken aller EU-Mitgliedstaaten vertreten." }
    ],
    ziele: [
      { id: "w", text: "Direktorium" },
      { id: "x", text: "EZB-Rat" },
      { id: "y", text: "Erweiterter Rat" }
    ],
    hilfe1: "Achte darauf, ob nur die Eurozone oder alle EU-Staaten beteiligt sind und ob ein Gremium entscheidet, ausführt oder berät.",
    hilfe2: "Heft S. 25, Grafik „Aufbau und Aufgaben der Europäischen Zentralbank“.",
    seite: "S. 25", lesehinweis: "Gremien der EZB"
  },

  {
    id: "F42", bereich: "ezb", format: "mehrfach", afb: "I",
    frage: "Welche Aussagen zum Europäischen System der Zentralbanken und zum Eurosystem treffen zu? Wähle alle zutreffenden Aussagen.",
    optionen: [
      { id: "a", richtig: true,  text: "Die EZB und die Zentralbanken der Mitgliedstaaten bilden gemeinsam das Europäische System der Zentralbanken." },
      { id: "b", richtig: true,  text: "Am Eurosystem sind nur die Zentralbanken der Eurozone beteiligt." },
      { id: "c", richtig: true,  text: "Die Geldpolitik der EZB wirkt über den Euroraum hinaus, weil sich auch andere Länder am Euro orientieren." },
      { id: "d", richtig: false, text: "Eurosystem und Europäisches System der Zentralbanken sind zwei Bezeichnungen für denselben Verbund." },
      { id: "e", richtig: false, text: "Am Europäischen System der Zentralbanken sind nur die Länder beteiligt, die den Euro eingeführt haben." }
    ],
    hilfe1: "Ein Verbund umfasst alle EU-Staaten, der andere nur einen Teil. Welcher ist welcher?",
    hilfe2: "Heft S. 25, erster Absatz zur Europäischen Zentralbank.",
    seite: "S. 25", lesehinweis: "ESZB und Eurosystem"
  },

  {
    id: "F43", bereich: "ezb", format: "mehrfach", afb: "II",
    frage: "Mit welchen Instrumenten steuert die EZB laut Heft die Geldpolitik? Wähle alle zutreffenden Instrumente.",
    optionen: [
      { id: "a", richtig: true,  text: "Sie legt den Zinssatz fest, zu dem sie Geld an Geschäftsbanken ausgibt." },
      { id: "b", richtig: true,  text: "Sie bestimmt, wie viele Rücklagen Banken als Sicherheiten bei ihr einlegen müssen." },
      { id: "c", richtig: true,  text: "Sie kann durch Kauf und Verkauf von Währungsreserven Wechselkursschwankungen entgegenwirken." },
      { id: "d", richtig: false, text: "Sie legt fest, wie hoch die Beitragszahlungen der Mitgliedstaaten zum EU-Haushalt ausfallen." },
      { id: "e", richtig: false, text: "Sie erteilt den Regierungen des Euroraums Weisungen zu deren nationaler Haushaltspolitik." }
    ],
    hilfe1: "Geldpolitik steuert, wie viel Geld zu welchen Bedingungen verfügbar ist. Haushaltspolitik ist etwas anderes.",
    hilfe2: "Heft S. 25 unten und S. 26 oben.",
    seite: "S. 25 f.", lesehinweis: "Instrumente der Geldpolitik"
  },

  {
    id: "F44", bereich: "ezb", format: "richtigfalsch", afb: "III",
    aussage: "Weil die Geldpolitik enormen Einfluss auf die gesamte europäische Wirtschaft hat, darf der Rat der EU der EZB in Krisen politische Weisungen erteilen.",
    aussageRichtig: false,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Die EZB ist unabhängig; weder EU-Organe noch Regierungen dürfen ihr politische Weisungen erteilen." },
      { id: "b", richtig: false, text: "Weisungen an die EZB darf nur der Europäische Rat erteilen, weil er für Grundsatzfragen zuständig ist." },
      { id: "c", richtig: false, text: "Weisungen an die EZB darf nur das Parlament erteilen, weil es als einziges Organ direkt gewählt ist." },
      { id: "d", richtig: false, text: "In Krisen sind schnelle Entscheidungen nötig, deshalb ist die Unabhängigkeit der EZB dann ausgesetzt." }
    ],
    hilfe1: "Erinnere dich an das Agentenmodell: Warum soll gerade die Geldpolitik vor politischer Einflussnahme geschützt sein?",
    hilfe2: "Heft S. 25, Absatz mit der Randnotiz „Keine politische Einflussnahme auf die EZB“.",
    seite: "S. 25", lesehinweis: "Unabhängigkeit der EZB"
  },

  {
    id: "F45", bereich: "ezb", format: "zuordnen", afb: "I",
    frage: "Ordne jede Aufgabe der passenden Säule der Bankenunion zu. Ein Begriff gehört nicht zur Bankenunion.",
    elemente: [
      { id: "a", ziel: "w", text: "Überwacht die größten Banken im Euroraum und schafft Transparenz über ihren Zustand." },
      { id: "b", ziel: "x", text: "Regelt die Sanierung und, falls nötig, die Schließung von Banken." },
      { id: "c", ziel: "y", text: "Schützt Privatvermögen, wenn eine Bank ausfällt." }
    ],
    ziele: [
      { id: "w", text: "Aufsichtsmechanismus" },
      { id: "x", text: "Einheitlicher Abwicklungsmechanismus" },
      { id: "y", text: "Einlageversicherungssystem" },
      { id: "v", text: "Festlegung der Leitzinsen" }
    ],
    hilfe1: "Die Bankenunion ist eine Antwort auf die Bankenkrise 2008. Sie ist von den geldpolitischen Entscheidungen streng getrennt.",
    hilfe2: "Heft S. 26, Absatz mit der Randnotiz „Die drei Säulen der Bankenunion“.",
    seite: "S. 26", lesehinweis: "Bankenunion und ihre drei Säulen"
  },

  /* ===================== RECHNUNGSHOF (1), EUSTA (1) ===================== */

  {
    id: "F46", bereich: "rechnungshof", format: "fall", afb: "III",
    fall: "Bei der Prüfung eines Förderprogramms stellt eine unabhängige EU-Stelle fest, dass Mittel womöglich betrügerisch verwendet wurden. Sie berichtet über die Missstände und meldet den Verdacht weiter. Eigene Befugnisse, in das Handeln der Behörden einzugreifen, hat sie nicht.",
    frage: "Um welche Stelle handelt es sich?",
    optionen: [
      { id: "a", richtig: true,  text: "Europäischer Rechnungshof" },
      { id: "b", richtig: false, text: "Amt für Betrugsbekämpfung (OLAF)" },
      { id: "c", richtig: false, text: "Europäische Staatsanwaltschaft" },
      { id: "d", richtig: false, text: "Europäische Kommission" }
    ],
    hilfe1: "Achte auf die Abfolge im Fall: Wer prüft und meldet, und wer empfängt die Meldung?",
    hilfe2: "Heft S. 26, Abschnitt „Europäischer Rechnungshof“.",
    seite: "S. 26", lesehinweis: "Rechnungshof, OLAF und EuStA"
  },

  {
    id: "F47", bereich: "eusta", format: "zuordnen", afb: "II",
    frage: "Ordne jede Beschreibung der passenden Stelle zu. Eine Stelle bleibt übrig.",
    elemente: [
      { id: "a", ziel: "w", text: "Ahndet unabhängig Straftaten gegen die finanziellen Interessen der EU, etwa grenzüberschreitenden Mehrwertsteuerbetrug." },
      { id: "b", ziel: "x", text: "Kontrolliert, ob EU-Mittel ordnungsgemäß erhoben und korrekt verwendet werden, und legt jährliche Berichte vor." },
      { id: "c", ziel: "y", text: "Ist als Agentur in der Kommission angesiedelt und erhält zum Beispiel Verdachtsmeldungen zu Betrug." }
    ],
    ziele: [
      { id: "w", text: "Europäische Staatsanwaltschaft (EuStA)" },
      { id: "x", text: "Europäischer Rechnungshof (EuRH)" },
      { id: "y", text: "Amt für Betrugsbekämpfung (OLAF)" },
      { id: "v", text: "Gerichtshof der EU (EuGH)" }
    ],
    hilfe1: "Unterscheide prüfen, Verdacht entgegennehmen und Straftaten verfolgen.",
    hilfe2: "Heft S. 26, Abschnitt „Europäischer Rechnungshof“ mit den Absätzen zu OLAF und EuStA.",
    seite: "S. 26", lesehinweis: "Rechnungshof, OLAF und EuStA"
  },

  /* ===================== WSA UND AUSSCHUSS DER REGIONEN (2) ===================== */

  {
    id: "F48", bereich: "ausschuesse", format: "richtigfalsch", afb: "III",
    aussage: "Der Ausschuss der Regionen kann ein Verfahren beim EuGH einleiten, obwohl er kein Entscheidungsorgan ist.",
    aussageRichtig: true,
    frage: "Beurteile die Aussage und wähle die passende Begründung.",
    begruendungen: [
      { id: "a", richtig: true,  text: "Er kann klagen, wenn Kommission, Rat oder Parlament versäumen, seine Stellungnahme einzuholen." },
      { id: "b", richtig: false, text: "Er kann klagen, weil er sich seit seiner Gründung 1994 zu einer gesetzgebenden Kammer entwickelt hat." },
      { id: "c", richtig: false, text: "Er kann klagen, wenn Rat und Parlament seinen verbindlichen Stellungnahmen nicht folgen." },
      { id: "d", richtig: false, text: "Verfahren beim EuGH können nur Entscheidungsorgane und Mitgliedstaaten einleiten." }
    ],
    hilfe1: "Beratende Gremien müssen im Gesetzgebungsverfahren angehört werden. Was passiert, wenn das unterbleibt?",
    hilfe2: "Heft S. 23, Abschnitt zum Ausschuss der Regionen.",
    seite: "S. 23", lesehinweis: "Ausschuss der Regionen"
  },

  {
    id: "F49", bereich: "ausschuesse", format: "einfach", afb: "II",
    frage: "Welche Aussage beschreibt die Stellung des Wirtschafts- und Sozialausschusses und des Ausschusses der Regionen im Gesetzgebungsprozess zutreffend?",
    optionen: [
      { id: "a", richtig: true,  text: "Sie geben Stellungnahmen ab, die nicht bindend sind; Rat und Parlament müssen sie im geregelten Verfahren aber anhören." },
      { id: "b", richtig: false, text: "Sie entscheiden gemeinsam mit Rat und Parlament, haben aber nur bei Themen ihrer Mitglieder ein eigenes Stimmrecht." },
      { id: "c", richtig: false, text: "Ihre Stellungnahmen werden verbindlich, sobald beide Ausschüsse zu einem Vorhaben übereinstimmend Stellung nehmen." },
      { id: "d", richtig: false, text: "Sie werden nur auf Wunsch der Kommission beteiligt und dürfen keine Stellungnahmen aus eigener Initiative verfassen." }
    ],
    hilfe1: "Unterscheide zwischen beratenden Institutionen und Entscheidungsorganen. Wo bleibt die legitimierende Verantwortung?",
    hilfe2: "Heft S. 23, Infokasten unten rechts.",
    seite: "S. 23", lesehinweis: "Beratende Ausschüsse und Entscheidungsorgane"
  },

  /* ===================== AGENTUREN (1) ===================== */

  {
    id: "F50", bereich: "agenturen", format: "einfach", afb: "II",
    frage: "Was kennzeichnet die Agenturen der EU nach dem Heft?",
    optionen: [
      { id: "a", richtig: true,  text: "Sie gehören nicht zu den Organen, folgen aber dem Modell von Agenten, die mit einem Mandat festgelegte Ziele unabhängig umsetzen." },
      { id: "b", richtig: false, text: "Sie gehören zu den Organen der EU und werden von einer Leitung geführt, die das Parlament direkt wählt und kontrolliert." },
      { id: "c", richtig: false, text: "Sie sind beratende Ausschüsse, die im Gesetzgebungsverfahren nicht bindende Stellungnahmen an Rat und Parlament richten." },
      { id: "d", richtig: false, text: "Sie sind Behörden einzelner Mitgliedstaaten, die von der Kommission im Einzelfall mit EU-Aufgaben beauftragt werden." }
    ],
    hilfe1: "Das Heft stellt die Agenturen im Zusammenhang mit EZB und Rechnungshof vor. Welche Eigenschaften teilen sie?",
    hilfe2: "Heft S. 24 f. (Übergang zu den Agenturen) und S. 26 f., dazu der Kasten zu Frontex.",
    seite: "S. 24 f.", lesehinweis: "Agenturen und Agentenmodell"
  }
];

if (typeof module !== "undefined") { module.exports = { FRAGEN, BEREICHE }; }
