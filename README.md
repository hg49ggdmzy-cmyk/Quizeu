# Die EU-Institutionen im Selbsttest

Interaktiver Selbsttest für den Sozialkunde-Leistungskurs (Jahrgangsstufe 12) zu Aufbau, Zielen und Aufgaben der EU-Institutionen.
Grundlage: Informationen zur politischen Bildung 366 „Europäische Union“, S. 16 bis 27 und S. 30 f.

## Dateien

- `index.html`: Seite und Gestaltung
- `fragen.js`: alle 50 Aufgaben als Daten. Der Aufbau einer Aufgabe ist oben in der Datei erklärt.
- `quiz.js`: Ablauf, Speicherung im Browser, Auswertung
- `fonts/`: Schrift Carlito (metrisch gleich mit Calibri, SIL Open Font License, siehe `fonts/OFL.txt`)
- `tests/`: Prüfskripte

## Aufgaben ändern

`fragen.js` auf GitHub öffnen, auf den Stift klicken, Text ändern, unten „Commit changes“ wählen. Nach ein bis zwei Minuten ist die Änderung online.
Danach am besten `node tests/pruefe-fragen.js` laufen lassen (prüft Anzahl, Verteilung, Pflichtfelder und Gedankenstriche).

## Datenschutz

Statische Seite ohne Server, Anmeldung, Cookies, Tracking oder externe Schriften und Skripte. Der Zwischenstand liegt nur im Browser der Schülerin oder des Schülers (localStorage).
