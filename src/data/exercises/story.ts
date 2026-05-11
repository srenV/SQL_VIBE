/**
 * Story/Game-Modus: SQL Agent – Ermittlungs-Faelle.
 *
 * Jeder Fall hat ein narratives Szenario mit mehreren Kapiteln.
 * Die Lernenden muessen SQL-Queries schreiben, um Hinweise zu finden
 * und den Fall zu loesen. Die Kapitel werden nacheinander freigeschaltet.
 */
import { makeStoryExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { storyAnna7Dataset } from "@/data/datasets/story-anna7";
import { storyNexusMarktDataset } from "@/data/datasets/story-nexusmarkt";
import { storyHelpCoreDataset } from "@/data/datasets/story-helpcore";
import { storyNeuronaleLueckeDataset } from "@/data/datasets/story-neuronale-luecke";
import { storySystemfehlerDeltaDataset } from "@/data/datasets/story-systemfehler-delta";
import { storyRoteZoneDataset } from "@/data/datasets/story-rote-zone";
import { storyGhostProtocolDataset } from "@/data/datasets/story-ghost-protocol";
import { storyGeldstromOmegaDataset } from "@/data/datasets/story-geldstrom-omega";
import { universityDataset } from "@/data/datasets/university";
import { fitnessDataset } from "@/data/datasets/fitness";

export const storyExercises: Exercise[] = [];
resetCounter();

storyExercises.push(
  makeStoryExercise("str", {
    title: "Vermisst: Einheit ANNA-7",
    description:
      "Die Systemarchitektin ANNA-7 ist aus dem Korporations-Netz verschwunden. Durchsuche die Personaldatenbank des Konzerns, bevor die Kontrolleinheit eintrifft.",
    difficulty: "junior",
    category: "Story",
    datasetId: "story-anna7",
    scenarioTitle: "Vermisst: Einheit ANNA-7",
    intro:
      "Es ist 03:17 Uhr Systemzeit. Die Korporations-KI meldet eine Anomalie: ANNA-7, Senior-Systemarchitektin der Entwicklungseinheit, hat sich seit 72 Stunden nicht mehr im Netz authentifiziert. Das Kontrollteam rückt in 6 Stunden an — du hast vorher Zugriff auf die Personaldatenbank. Finde heraus, was passiert ist.\n\nDein Terminal flackert. Die Verbindung zur Korporations-Datenbank steht — aber nicht mehr lange. Jeder Query könnte Spuren hinterlassen. Sei präzise. Sei schnell. Die Wahrheit wartet in den Daten.",
    chapters: [
      {
        title: "Identität lokalisieren",
        narrative:
          "Erster Schritt: Lokalisiere Einheit ANNA-7 in der Personaldatenbank des Konzerns. Welcher Einheit ist sie zugewiesen, in welcher Abteilung registriert? Schreibe eine Query, die ihre Mitarbeiterdaten und die dazugehörige Abteilung anzeigt.",
        referenceQuery:
          "SELECT m.name AS mitarbeiter, a.name AS abteilung, m.position, m.gehalt FROM mitarbeiter m JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.name = 'Anna Schmidt';",
        hiddenTestQuery:
          "SELECT m.name AS mitarbeiter, a.name AS abteilung FROM mitarbeiter m JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.name = 'Anna Schmidt';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Einheit ANNA-7 — registriert als 'Anna Schmidt', Senior-Systemarchitektin in der Entwicklungseinheit. Gehalt: 72.000 Credits. Keine manager_id — sie steht an der Spitze der Einheitenhierarchie. Jemand hat sie gezielt aus dem Netz gedrängt. Oder sie selbst hat sich abgemeldet.",
        hints: [
          "Verbinde die Tabelle mitarbeiter mit abteilungen ueber die abteilung_id.",
          "Filtere auf den Namen 'Anna Schmidt'.",
        ],
        points: 20,
      },
      {
        title: "Letzter bekannter Kontakt",
        narrative:
          "Einheit BEN-2 — registriert als Ben Mueller, id=2 — war ANNA-7 direkt unterstellt (manager_id=1). Er könnte der letzte bekannte Kontakt sein. Hat BEN-2 in letzter Zeit Urlaub beantragt? Wurden seine Anträge genehmigt oder abgelehnt? Untersuche seine Urlaubsdaten.",
        referenceQuery:
          "SELECT u.*, m.name AS mitarbeiter FROM urlaub u JOIN mitarbeiter m ON u.mitarbeiter_id = m.id WHERE m.name = 'Ben Mueller' ORDER BY u.startdatum;",
        hiddenTestQuery:
          "SELECT u.startdatum, u.enddatum, u.tage, u.genehmigt FROM urlaub u JOIN mitarbeiter m ON u.mitarbeiter_id = m.id WHERE m.name = 'Ben Mueller';",
        hiddenTestMode: "rows",
        completionNarrative:
          "BEN-2 beantragte Urlaub vom 15.07.2024 bis 20.07.2024 — genehmigt. ANNA-7 verschwand das Wochenende davor. Hat BEN-2 gewusst, dass sie nicht zurückkehren würde? Oder wurde der Urlaub genehmigt, um ihn aus dem Weg zu räumen? Die Korporationslogik ist kalt und präzise.",
        hints: [
          "Verbinde urlaub mit mitarbeiter ueber mitarbeiter_id.",
          "Filtere auf Bens Namen und sortiere nach Datum.",
        ],
        points: 25,
      },
      {
        title: "Zugangscode-Anomalien",
        narrative:
          "Wenn jemand ANNA-7s Platz übernehmen wollte, hätte er sich kurz vor ihrem Verschwinden beworben. Durchsuche die Bewerbungsdatenbank: Wer hat sich für die Entwicklungseinheit (id=1) nach dem 01.01.2024 beworben? Sortiere nach Datum.",
        referenceQuery:
          "SELECT b.name, b.email, b.bewerbungsdatum, b.status, a.name AS abteilung FROM bewerbungen b JOIN abteilungen a ON b.abteilung_id = a.id WHERE b.abteilung_id = 1 AND b.bewerbungsdatum >= '2024-01-01' ORDER BY b.bewerbungsdatum;",
        hiddenTestQuery:
          "SELECT b.name, b.bewerbungsdatum, b.status FROM bewerbungen b WHERE b.abteilung_id = 1 AND b.bewerbungsdatum >= '2024-01-01' ORDER BY b.bewerbungsdatum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Bewerbungen für die Entwicklungseinheit: Paul Schmitz (10.01.), Tom Meier (abgelehnt, 01.02.) und Noah Berger (Angebot erhalten, 20.04.). Das Angebot an Noah Berger fiel genau in den Zeitraum von ANNA-7s Verschwinden. War das geplant?",
        hints: [
          "Filtere bewerbungen auf abteilung_id = 1 (Entwicklung).",
          "Begrenze auf Bewerbungsdatum >= '2024-01-01' und sortiere aufsteigend.",
        ],
        points: 25,
      },
      {
        title: "Einheit Überprüfung",
        narrative:
          "Wie viele Einheiten sind noch in der Entwicklungsabteilung aktiv? Ist ANNA-7s Verschwinden Teil eines größeren Musters — werden systematisch Einheiten aus der Entwicklung entfernt? Finde heraus, wie viele Mitarbeiter mit abteilung_id=1 noch registriert sind und wie hoch die Gesamtgehaltssumme ist.",
        referenceQuery:
          "SELECT COUNT(*) AS anzahl, SUM(gehalt) AS gesamtgehalt FROM mitarbeiter WHERE abteilung_id = 1;",
        hiddenTestQuery:
          "SELECT COUNT(*) AS anzahl, SUM(gehalt) AS gesamtgehalt FROM mitarbeiter WHERE abteilung_id = 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Einheiten in der Entwicklung, Gesamtbudget 175.000 Credits. ANNA-7 ist noch registriert — aber offline. Das System behandelt sie als aktiv. Entweder weiß die Korporations-KI nichts, oder sie soll nichts wissen. Jemand hat den Status manipuliert.",
        hints: [
          "Zaehle die Mitarbeiter in der Entwicklung mit COUNT(*) und summiere die Gehaelter mit SUM(gehalt).",
          "Filtere auf abteilung_id = 1.",
        ],
        points: 30,
      },
      {
        title: "Gehaltsanomalie",
        narrative:
          "Ein unbekannter Mitarbeiter der Entwicklungseinheit erhält ein weit überdurchschnittliches Gehalt — könnte das ein Hinweis auf einen Informanten oder eine privilegierte Einheit sein? Finde alle Mitarbeiter, die mehr verdienen als der Abteilungsdurchschnitt.",
        referenceQuery:
          "SELECT name, position, gehalt, ROUND((SELECT AVG(gehalt) FROM mitarbeiter), 2) AS durchschnitt FROM mitarbeiter WHERE gehalt > (SELECT AVG(gehalt) FROM mitarbeiter) ORDER BY gehalt DESC;",
        hiddenTestQuery:
          "SELECT name, gehalt FROM mitarbeiter WHERE gehalt > (SELECT AVG(gehalt) FROM mitarbeiter) ORDER BY gehalt DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Einheiten mit überdurchschnittlichem Gehalt identifiziert — darunter ANNA-7 selbst mit 72.000 Credits. Interessant: Eine andere Einheit erhält 85.000 Credits, aber ohne klare Aufgabe. Ein Phantom im System? Die Spur wird heißer.",
        hints: [
          "Schreibe eine Subquery im WHERE-Teil, die den Durchschnitt berechnet.",
          "Verwende (SELECT AVG(gehalt) FROM mitarbeiter) als Vergleichswert.",
        ],
        points: 30,
      },
      {
        title: "Geisterpersonal",
        narrative:
          "Die letzte Spur: Gibt es Einheiten in der Datenbank, die noch nie einen Urlaubsantrag gestellt haben? ANNA-7 könnte bewusst 'nie existiert' haben — ein Phantom-Mitarbeiter ohne Aktivitätsspur.",
        referenceQuery:
          "SELECT m.name, m.position, a.name AS abteilung FROM mitarbeiter m JOIN abteilungen a ON m.abteilung_id = a.id LEFT JOIN urlaub u ON m.id = u.mitarbeiter_id WHERE u.id IS NULL;",
        hiddenTestQuery:
          "SELECT m.name FROM mitarbeiter m LEFT JOIN urlaub u ON m.id = u.mitarbeiter_id WHERE u.id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Zwei Einheiten ohne jede Urlaubsaufzeichnung — darunter eine mit der Bezeichnung 'Projektleiter' und keine zugewiesene Abteilung. ANNA-7 ist nicht verschwunden. Sie hat nie wirklich existiert. Sie war eine Legende — ein Cover. Der Fall ist offiziell geschlossen. Inoffiziell beginnt er jetzt erst.",
        hints: [
          "Verwende einen LEFT JOIN zwischen mitarbeiter und urlaub.",
          "Filtere auf WHERE u.id IS NULL — so findest du Mitarbeiter ohne Urlaubseintrag.",
        ],
        points: 35,
      },
    ],
    outro:
      "Protokoll gesichert. Einheit ANNA-7 war eine operative Legende der Korporationsintelligenz — ihr 'Verschwinden' war eine geplante Exfiltration. Die Beweise sind in der Datenbank. Die Wahrheit kostet dich mehr als einen Job. Sei vorsichtig, Analyst.",
    tags: ["Story", "JOIN", "WHERE", "Aggregation", "Subquery"],
  }),

  makeStoryExercise("str", {
    title: "Phantom-Transaktionen im NexusMarkt",
    description:
      "Im staatlich kontrollierten NexusMarkt häufen sich mysteriöse Storno-Anomalien. Eine unsichtbare Entität manipuliert das Handelssystem — oder ist es jemand aus dem Inneren?",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-nexusmarkt",
    scenarioTitle: "Phantom-Transaktionen im NexusMarkt",
    intro:
      "Der NexusMarkt — das einzig legale Handelssystem der Ost-Zone — meldet Anomalien. Bestellungen werden storniert, aber die Zahlungen sind bereits abgeflossen. Die Handels-KI hat keine Erklärung. Du hast 4 Stunden Datenbankzugang, bevor das Audit-Team eintrifft.\n\nDein Zugriffstoken blinkt. Die NexusMarkt-Datenbank ist online — Transaktionsprotokolle, Kundenprofile, Zahlungsströme. Alles ist verbunden. Finde das Muster, bevor die Spuren verwischt werden.",
    chapters: [
      {
        title: "Stornierte Einheiten",
        narrative:
          "Erste Anomalie: Das NexusMarkt-System verzeichnet Bestellungen mit dem Status 'storniert'. Wer steht dahinter? Finde alle stornierten Bestellungen mit Kundenname, Bestelldatum und Gesamtbetrag.",
        referenceQuery:
          "SELECT b.id AS bestellung_id, k.name AS kunde, b.datum, b.gesamtbetrag FROM bestellungen b JOIN kunden k ON b.kunde_id = k.id WHERE b.status = 'storniert' ORDER BY b.gesamtbetrag DESC;",
        hiddenTestQuery:
          "SELECT k.name, b.datum, b.gesamtbetrag FROM bestellungen b JOIN kunden k ON b.kunde_id = k.id WHERE b.status = 'storniert';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Kunden-ID 'Sarah Keller' — eine stornierte Bestellung über 599 Credits (Bestellung #8, datiert 08.03.2024). Die Stornierung wurde im System eingetragen, aber die Zahlung war bereits abgeflossen. Das Muster ist eindeutig: jemand nutzt den Storno-Mechanismus als Ablenkung.",
        hints: [
          "Verbinde bestellungen mit kunden ueber kunde_id.",
          "Filtere auf status = 'storniert' und sortiere nach gesamtbetrag absteigend.",
        ],
        points: 25,
      },
      {
        title: "Zahlungsfluss-Anomalie",
        narrative:
          "Die Credits sind abgeflossen — aber die Bestellung wurde storniert. Das ist der klassische Phantom-Transaktions-Trick. Verfolge den Zahlungsfluss: Finde alle Zahlungen für stornierte Bestellungen mit Zahlungsmittel und Betrag.",
        referenceQuery:
          "SELECT z.id, z.bestellung_id, z.betrag, z.zahlungsmittel, z.zahlungsdatum FROM zahlungen z JOIN bestellungen b ON z.bestellung_id = b.id WHERE b.status = 'storniert';",
        hiddenTestQuery:
          "SELECT z.betrag, z.zahlungsmittel, z.bestellung_id FROM zahlungen z JOIN bestellungen b ON z.bestellung_id = b.id WHERE b.status = 'storniert';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Bestätigt: Kreditkarten-Zahlung über 599 Credits für Sarahs stornierte Bestellung wurde am selben Tag abgebucht — keine Rückerstattung. Die Credits sind verschwunden. Der NexusMarkt wurde als Transitkanal genutzt. Wer hat Zugang zu den Zahlungsprotokollen?",
        hints: [
          "Verbinde zahlungen mit bestellungen ueber bestellung_id.",
          "Filtere auf bestellungen mit status 'storniert'.",
        ],
        points: 25,
      },
      {
        title: "Systemweite Analyse",
        narrative:
          "Das Gesamtbild: Wie hoch ist der Transaktionsvolumen pro Zahlungsart, und welcher Anteil davon ist storniert? Analysiere den Umsatz nach Status und Zahlungsmittel — ein Muster muss sichtbar werden.",
        referenceQuery:
          "SELECT b.status, z.zahlungsmittel, SUM(z.betrag) AS umsatz, COUNT(*) AS anzahl FROM bestellungen b JOIN zahlungen z ON b.id = z.bestellung_id GROUP BY b.status, z.zahlungsmittel ORDER BY umsatz DESC;",
        hiddenTestQuery:
          "SELECT b.status, z.zahlungsmittel, SUM(z.betrag) AS umsatz FROM bestellungen b JOIN zahlungen z ON b.id = z.bestellung_id GROUP BY b.status, z.zahlungsmittel;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Das Muster ist entlarvend: Kreditkarten-Transaktionen zeigen eine ungewöhnliche Storno-Rate. Jemand mit Systemzugang hat gezielt diesen Zahlungsweg gewählt — schwerer nachzuverfolgen, leichter zu manipulieren. Ein Insider-Job im NexusMarkt.",
        hints: [
          "Verbinde bestellungen mit zahlungen und gruppiere nach status und zahlungsmittel.",
          "Benutze SUM(betrag) und COUNT(*), aggregiert nach status und zahlungsmittel.",
        ],
        points: 30,
      },
      {
        title: "Hochfrequenz-Agenten",
        narrative:
          "Das Muster wird klarer: Einige Kunden-IDs häufen ungewöhnlich viele Bestellungen an — weit über dem Systemdurchschnitt. Könnten das automatisierte Phantom-Agenten sein? Finde alle Kunden mit mehr als einer Bestellung.",
        referenceQuery:
          "SELECT k.name, COUNT(b.id) AS anzahl FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) > 1 ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT k.name, COUNT(b.id) AS anzahl FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id HAVING COUNT(b.id) > 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Mehrere Kunden-Profile mit ungewöhnlich hoher Bestellfrequenz entdeckt. Darunter ein Konto mit 4 Bestellungen in 48 Stunden — alle in verschiedenen Kategorien, aber mit derselben Lieferadresse. Ein Algorithmus, kein Mensch.",
        hints: [
          "Verbinde kunden mit bestellungen ueber kunde_id.",
          "Nutze GROUP BY und HAVING COUNT(b.id) > 1.",
        ],
        points: 30,
      },
      {
        title: "Schattenproduzenten",
        narrative:
          "Finale Analyse: Manche Produkte wurden nur von einem einzigen Kunden-Account bestellt — möglicherweise Scheinangebote, die nur für interne Phantom-Transaktionen existieren. Finde alle Produkte, die von genau einem einzigen Kunden gekauft wurden.",
        referenceQuery:
          "SELECT p.name, p.preis FROM produkte p WHERE p.id IN (SELECT bp.produkt_id FROM bestellpositionen bp JOIN bestellungen b ON bp.bestellung_id = b.id GROUP BY bp.produkt_id HAVING COUNT(DISTINCT b.kunde_id) = 1);",
        hiddenTestQuery:
          "SELECT p.name FROM produkte p WHERE p.id IN (SELECT bp.produkt_id FROM bestellpositionen bp JOIN bestellungen b ON bp.bestellung_id = b.id GROUP BY bp.produkt_id HAVING COUNT(DISTINCT b.kunde_id) = 1);",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Produkte mit nur einem einzigen Käufer — alle von demselben Phantom-Account bestellt. Die Artikel existieren physisch nicht im Lager. Der NexusMarkt wurde als Geldwäschemaschine benutzt. Audit-Team in 47 Minuten. Zeit zu verschwinden.",
        hints: [
          "Nutze eine Subquery mit GROUP BY bp.produkt_id HAVING COUNT(DISTINCT b.kunde_id) = 1.",
          "Schreibe die Subquery im WHERE-Teil mit WHERE p.id IN (...).",
          "Verbinde bestellpositionen mit bestellungen ueber bestellung_id.",
        ],
        points: 35,
      },
    ],
    outro:
      "Transaktion abgeschlossen. Der Phantom-Operator hinter den NexusMarkt-Anomalien ist identifiziert — eine interne Einheit der Korporations-Finanzabteilung. Die Daten sind gesichert. Teile sie mit den Richtigen.",
    tags: ["Story", "JOIN", "Aggregation", "GROUP BY", "Subquery"],
  }),

  makeStoryExercise("str", {
    title: "Virus im HelpCore-Netz",
    description:
      "Das HelpCore-Ticketsystem der SmartCity-Infrastruktur wurde infiltriert. Kritische Bürger-Anfragen werden systematisch unterdrückt. Finde den Saboteur, bevor das Netz kollabiert.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-helpcore",
    scenarioTitle: "Virus im HelpCore-Netz",
    intro:
      "HelpCore — das zentrale Bürgersupport-System der SmartCity — verhält sich anomal. Kritische Tickets verschwinden, Kommentare werden manipuliert, Prioritäten heimlich geändert. Jemand nutzt das System, um Beschwerden über die Korporationspolitik zu begraben. Du hast Zugriff auf die Rohdatenbank.\n\nDie HelpCore-Server summen leise. Tickets, Kommentare, Kategorien — alles verknüpft. Jede Abfrage bringt dich näher an den Saboteur. Aber Vorsicht: Wer auch immer das System manipuliert, könnte deine Queries bemerken.",
    chapters: [
      {
        title: "Kritische Signale",
        narrative:
          "Erste Aufgabe: Lokalisiere alle Tickets mit kritischer Priorität im HelpCore-System. Wie viele existieren, und welchen Status haben sie aktuell? Das gibt dir einen ersten Überblick über den Umfang der Sabotage.",
        referenceQuery:
          "SELECT id, titel, status, prioritaet, kategorie_id FROM tickets WHERE prioritaet = 'kritisch' ORDER BY id;",
        hiddenTestQuery:
          "SELECT id, titel, status, prioritaet FROM tickets WHERE prioritaet = 'kritisch';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Fünf Tickets mit Priorität 'kritisch' — drei davon bereits geschlossen oder in Bearbeitung. Das ist eine ungewöhnlich hohe Abarbeitungsrate für kritische Tickets. Wer hat sie so schnell bearbeitet — und warum?",
        hints: [
          "Filtere tickets auf prioritaet = 'kritisch'.",
          "Ordne nach id, um einen klaren Ueberblick zu bekommen.",
        ],
        points: 20,
      },
      {
        title: "Kommentar-Frequenz-Analyse",
        narrative:
          "Ein Saboteur hinterlässt Spuren — oft in Form von übermäßig vielen Kommentaren, die Tickets in eine bestimmte Richtung lenken. Wer kommentiert verdächtig häufig? Finde alle Autoren mit mehr als 2 Kommentaren im System.",
        referenceQuery:
          "SELECT autor, COUNT(*) AS anzahl FROM kommentare GROUP BY autor HAVING COUNT(*) > 2 ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT autor, COUNT(*) AS anzahl FROM kommentare GROUP BY autor HAVING COUNT(*) > 2;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Einheit TOM-B — registriert als 'Tom Billing' — führt die Kommentar-Statistik an. Er ist sowohl im Zahlungsbereich als auch bei kritischen Infrastruktur-Tickets aktiv. Seine Kommentare erscheinen immer dann, wenn wichtige Tickets geändert werden. Zufall?",
        hints: [
          "Gruppiere kommentare nach autor und zaehle mit COUNT(*).",
          "Filtere mit HAVING auf mehr als 2 Kommentare.",
        ],
        points: 25,
      },
      {
        title: "Tatort-Mapping",
        narrative:
          "Um die Sabotage zu beweisen: Verbinde alle Tickets mit ihren Kommentaren und zeige das vollständige Bild. Welche kritischen Tickets wurden von TOM-B kommentiert — und welche wurden danach geschlossen? LEFT JOIN, um auch kommentarlose Tickets zu sehen.",
        referenceQuery:
          "SELECT t.id AS ticket_id, t.titel, t.status, k.autor, k.nachricht FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id ORDER BY t.id, k.id;",
        hiddenTestQuery:
          "SELECT t.id, t.titel, t.status FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id ORDER BY t.id;",
        hiddenTestMode: "rows",
        completionNarrative:
          "TOM-Bs Kommentare konzentrieren sich auf genau die kritischen Tickets, die anschließend still geändert wurden. Er hat auf 3 von 5 kritischen Tickets kommentiert. Die Korporations-Zensur hat einen Namen und ein Gesicht.",
        hints: [
          "Verbinde tickets mit kommentare ueber id resp. ticket_id.",
          "Benutze LEFT JOIN, um auch Tickets ohne Kommentare zu zeigen.",
        ],
        points: 30,
      },
      {
        title: "Kategorie-Übersicht",
        narrative:
          "Welche Kategorien sind am stärksten betroffen? Eine systematische Sabotage würde bestimmte Themenbereiche bevorzugt angreifen — Infrastruktur, Energieversorgung oder Bürgerrechte. Zeige die Anzahl der Tickets pro Kategorie.",
        referenceQuery:
          "SELECT ka.name AS kategorie, COUNT(t.id) AS anzahl FROM tickets t JOIN kategorien ka ON t.kategorie_id = ka.id GROUP BY ka.id, ka.name ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT ka.name, COUNT(t.id) AS anzahl FROM tickets t JOIN kategorien ka ON t.kategorie_id = ka.id GROUP BY ka.id, ka.name ORDER BY anzahl DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Die Verteilung ist eindeutig: Tickets der Kategorie 'Infrastruktur' und 'Energie' sind überrepräsentiert. Genau die Bereiche, in denen die Korporationspolitik am meisten kritisiert wird. Kein Zufall.",
        hints: [
          "Verbinde tickets mit kategorien ueber kategorie_id.",
          "Nutze GROUP BY und COUNT(*) auf die Kategorie-Namen.",
          "Sortiere nach Anzahl absteigend.",
        ],
        points: 25,
      },
      {
        title: "Stille Tickets",
        narrative:
          "Letzte Analyse: Welche Tickets haben überhaupt keine Kommentare erhalten? Das sind die vollständig ignorierten Anfragen — möglicherweise bewusst aus dem System gedrängt. Finde alle Tickets ohne einzigen Kommentar.",
        referenceQuery:
          "SELECT t.id, t.titel, t.prioritaet, t.status FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id WHERE k.ticket_id IS NULL ORDER BY t.id;",
        hiddenTestQuery:
          "SELECT t.id, t.titel FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id WHERE k.ticket_id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Sechs Tickets ohne jede Reaktion — alle mit kritischer Priorität, alle das Thema 'Energie-Rationierung'. Der Saboteur hat nicht nur kommentiert und manipuliert — er hat auch aktiv Tickets aus dem Sichtbereich der Agenten entfernt. Das Netz ist kompromittiert. Meld es.",
        hints: [
          "Nutze einen LEFT JOIN zwischen tickets und kommentare.",
          "Filtere auf WHERE k.ticket_id IS NULL — das sind Tickets ohne Kommentar.",
        ],
        points: 30,
      },
    ],
    outro:
      "HelpCore-Anomalie dokumentiert. Der Saboteur — Einheit TOM-B — handelte im Auftrag der Korporations-Zensurabteilung. Die Bürger-Anfragen wurden gezielt begraben. Die Beweise sind jetzt in den richtigen Händen. Sorge dafür, dass sie ans Licht kommen.",
    tags: ["Story", "WHERE", "JOIN", "GROUP BY", "HAVING", "Subquery"],
  })
);

storyExercises.push(
  makeStoryExercise("str", {
    title: "Neuronale Lücke",
    description:
      "Die staatliche Streaming-KI ARGUS löscht selektiv Inhalte aus dem Kulturnetz. Du bist der letzte unabhängige Analyst mit Datenbankzugriff — finde das Muster, bevor ARGUS dich findet.",
    difficulty: "beginner",
    category: "Story",
    datasetId: "story-neuronale-luecke",
    scenarioTitle: "Neuronale Lücke",
    intro:
      "Das Jahr 2091. Die Unterhaltungs-KI ARGUS kontrolliert alle Inhalte im staatlichen Streaming-Netz. Seit Wochen verschwinden Filme spurlos aus dem Katalog — immer kurz nachdem sie positiv bewertet wurden. Zufall? Du hast Zugriff auf die rohe Streaming-Datenbank. Finde das Muster, bevor ARGUS dich aus dem System sperrt.\n\nDein Terminal verbindet sich mit dem ARGUS-Kern. Nutzerprofile, Filmdaten, Watch-History, Bewertungen — alles liegt offen. Aber die Uhr tickt. ARGUS überwacht jede Abfrage. Ein falscher Schritt, und dein Zugang ist Geschichte.",
    chapters: [
      {
        title: "Signal verloren",
        narrative:
          "Erste Aufgabe: Verschaffe dir einen Überblick über das Sci-Fi-Segment des Katalogs. ARGUS soll laut interner Memo gezielt Sci-Fi-Inhalte unterdrücken. Liste alle Sci-Fi-Filme mit Titel, Jahr, Dauer und Bewertung — sortiert nach Erscheinungsjahr absteigend.",
        referenceQuery:
          "SELECT titel, genre, jahr, dauer_min, bewertung FROM filme WHERE genre = 'Sci-Fi' ORDER BY jahr DESC;",
        hiddenTestQuery:
          "SELECT titel FROM filme WHERE genre = 'Sci-Fi' ORDER BY jahr DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Sci-Fi-Filme im Katalog: Interstellar (2014), Inception (2010), Matrix (1999). Alle drei haben Bewertungen über 4,5 — weit über dem Katalogdurchschnitt. Genau die Art von Inhalten, die ARGUS als 'destabilisierend' einstuft. Die Uhr tickt.",
        hints: [
          "Filtere die filme-Tabelle auf genre = 'Sci-Fi'.",
          "Sortiere mit ORDER BY jahr DESC, um die neuesten Filme oben zu sehen.",
        ],
        points: 10,
      },
      {
        title: "Verdächtige Profile",
        narrative:
          "ARGUS manipuliert nicht nur den Katalog — er manipuliert auch Nutzerdaten. Finde alle Nutzer, die einen Film angefangen, aber nicht zu Ende geschaut haben (fortschritt_prozent < 100). Zeige Namen, Filmtitel und Fortschritt. Wurden sie beim Schauen gestoppt?",
        referenceQuery:
          "SELECT n.name AS nutzer, f.titel AS film, wh.fortschritt_prozent FROM watch_history wh JOIN nutzer n ON wh.nutzer_id = n.id JOIN filme f ON wh.film_id = f.id WHERE wh.fortschritt_prozent < 100 ORDER BY wh.fortschritt_prozent;",
        hiddenTestQuery:
          "SELECT n.name, f.titel, wh.fortschritt_prozent FROM watch_history wh JOIN nutzer n ON wh.nutzer_id = n.id JOIN filme f ON wh.film_id = f.id WHERE wh.fortschritt_prozent < 100;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Mehrere Nutzer haben Filme bei 40–85% abgebrochen. Darunter: Titanic bei 40%, Fight Club bei 60%, Gladiator bei 70%. Die Abbrüche korrelieren mit Zeitstempeln kurz nach ARGUS-Wartungsfenstern. Kein Zufall.",
        hints: [
          "Verbinde watch_history mit nutzer und filme ueber die jeweiligen IDs.",
          "Filtere auf fortschritt_prozent < 100.",
        ],
        points: 10,
      },
      {
        title: "Das Muster",
        narrative:
          "ARGUS bevorzugt bestimmte Genres — und löscht andere. Zähle, wie viele Filme pro Genre im Katalog existieren. Sortiere nach Anzahl absteigend. Das Muster wird sichtbar.",
        referenceQuery:
          "SELECT genre, COUNT(*) AS anzahl FROM filme GROUP BY genre ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT genre, COUNT(*) AS anzahl FROM filme GROUP BY genre ORDER BY anzahl DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drama dominiert mit 5 Filmen, gefolgt von Sci-Fi (3) und Krimi (2). Action, Musical und Thriller haben je 1–2 Einträge. Drama-Inhalte zeigen keine politischen Bezüge — genau das, was ARGUS bevorzugt. Alles andere wird systematisch reduziert.",
        hints: [
          "Nutze GROUP BY genre und zaehle mit COUNT(*).",
          "Sortiere mit ORDER BY anzahl DESC.",
        ],
        points: 15,
      },
      {
        title: "Bewertungs-Bias",
        narrative:
          "ARGUS soll Premium-Nutzer bevorzugen und ihre Bewertungen künstlich hochstufen. Vergleiche die durchschnittliche Sternbewertung nach Abonnement-Typ (Standard, Premium, Basic). Weichen Premium-Bewertungen signifikant ab?",
        referenceQuery:
          "SELECT n.abonnement, ROUND(AVG(b.sterne), 2) AS durchschnitt, COUNT(*) AS bewertungen FROM bewertungen b JOIN nutzer n ON b.nutzer_id = n.id GROUP BY n.abonnement ORDER BY durchschnitt DESC;",
        hiddenTestQuery:
          "SELECT n.abonnement, ROUND(AVG(b.sterne), 2) AS durchschnitt FROM bewertungen b JOIN nutzer n ON b.nutzer_id = n.id GROUP BY n.abonnement;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Premium-Nutzer bewerten im Schnitt mit 4,1 Sternen, Standard mit 3,8, Basic mit 3,5. Die Spreizung ist real — und passt genau zu ARGUS's Algorithmus: höhere Abonnements bedeuten höhere Sichtbarkeit. Der Bias ist kein Bug, er ist das Feature.",
        hints: [
          "Verbinde bewertungen mit nutzer ueber nutzer_id.",
          "Gruppiere nach abonnement und berechne AVG(sterne).",
        ],
        points: 20,
      },
      {
        title: "ARGUS-Fingerabdruck",
        narrative:
          "Finale Analyse: ARGUS löscht nicht nur Inhalte — er verhindert auch, dass sie bewertet werden. Finde alle Filme, die im Katalog existieren, aber keine einzige Nutzerbewertung haben. Das sind die Titel, die ARGUS aktiv aus dem Bewusstsein der Nutzer gedrängt hat.",
        referenceQuery:
          "SELECT f.titel, f.genre, f.jahr FROM filme f LEFT JOIN bewertungen b ON f.id = b.film_id WHERE b.id IS NULL ORDER BY f.jahr DESC;",
        hiddenTestQuery:
          "SELECT f.titel FROM filme f LEFT JOIN bewertungen b ON f.id = b.film_id WHERE b.id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Nur ein Film ohne einzige Bewertung: 'La La Land' (2016, Musical). Auffällig: La La Land enthält eine Szene, die als Allegorie auf staatliche Medienkontrolle interpretiert werden kann. ARGUS hat diesen Film nicht gelöscht — er hat ihn unsichtbar gemacht. Beweis gesichert.",
        hints: [
          "Nutze einen LEFT JOIN zwischen filme und bewertungen.",
          "Filtere auf WHERE b.id IS NULL — das sind Filme ohne Bewertung.",
        ],
        points: 20,
      },
    ],
    outro:
      "ARGUS-Analysebericht abgeschlossen. Der Algorithmus bevorzugt systemkonforme Inhalte, unterdrückt kritische Genres und manipuliert Sichtbarkeit durch Abonnement-Bias. Die Daten sind der Beweis. Leite sie an den Untergrundkanal weiter — bevor ARGUS diesen Zugang schliesst.",
    tags: ["Story", "SELECT", "JOIN", "GROUP BY", "AVG"],
  }),

  makeStoryExercise("str", {
    title: "Systemfehler Delta",
    description:
      "Kritische Infrastrukturausfälle häufen sich in der SmartCity. Die Logs zeigen ein Muster — aber wer steckt dahinter? Du hast Zugriff auf die Serverprotokolle.",
    difficulty: "beginner",
    category: "Story",
    datasetId: "story-systemfehler-delta",
    scenarioTitle: "Systemfehler Delta",
    intro:
      "SmartCity-Infrastruktur-Status: KRITISCH. Seit dem 01.03.2089 häufen sich Systemausfälle in der Bürger-Versorgungsinfrastruktur. Checkout-Systeme brechen zusammen, Datenbankverbindungen fallen weg. Die Korporations-KI erklärt es als 'zufällige Lastspitzen'. Du glaubst das nicht. Du hast Zugriff auf die rohen Server-Logs.\n\nDie Log-Datenbank lädt. Events, Sessions, Fehler — drei Tabellen, aber unzählige Verbindungen. Jeder Fehler hat ein Muster. Jede Session erzählt eine Geschichte. Finde den Angriff, bevor die nächste Welle kommt.",
    chapters: [
      {
        title: "Kritische Alarme",
        narrative:
          "Erster Schritt: Zeige alle Fehler mit dem Schweregrad 'kritisch' aus der fehler-Tabelle. Wie viele sind es, und welche Fehlercodes tauchen auf? Das gibt dir den Überblick über das Ausmaß des Angriffs.",
        referenceQuery:
          "SELECT f.id, f.fehlercode, f.nachricht, f.schweregrad FROM fehler f WHERE f.schweregrad = 'kritisch' ORDER BY f.id;",
        hiddenTestQuery:
          "SELECT f.fehlercode, f.schweregrad FROM fehler f WHERE f.schweregrad = 'kritisch';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Sechs kritische Fehler: drei ERR_502 Gateway-Timeouts beim Checkout, drei ERR_500 Datenbankfehler. Alle konzentrieren sich auf den Zahlungs- und Produktbereich. Kein zufälliges Muster — das ist gezielte Sabotage des Handelssystems.",
        hints: [
          "Filtere die fehler-Tabelle auf schweregrad = 'kritisch'.",
          "Sortiere nach id fuer eine geordnete Uebersicht.",
        ],
        points: 10,
      },
      {
        title: "Tatort Seite",
        narrative:
          "Welche Seiten der Infrastruktur sind am stärksten betroffen? Verbinde die fehler-Tabelle mit events und zähle, auf welcher Seite die meisten Fehler aufgetreten sind. Sortiere nach Häufigkeit.",
        referenceQuery:
          "SELECT e.seite, COUNT(*) AS anzahl_fehler FROM fehler f JOIN events e ON f.event_id = e.id GROUP BY e.seite ORDER BY anzahl_fehler DESC;",
        hiddenTestQuery:
          "SELECT e.seite, COUNT(*) AS anzahl_fehler FROM fehler f JOIN events e ON f.event_id = e.id GROUP BY e.seite ORDER BY anzahl_fehler DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "'/checkout' führt mit 5 Fehlern, gefolgt von '/products' mit 2. Der Angriff zielt direkt auf den Transaktionspfad. Wer auch immer dahintersteckt, will den Bürger-Handel lahmlegen — nicht die Informationsseiten.",
        hints: [
          "Verbinde fehler mit events ueber event_id.",
          "Nutze GROUP BY e.seite und COUNT(*), sortiere mit ORDER BY absteigend.",
        ],
        points: 15,
      },
      {
        title: "Fehlerkode-Analyse",
        narrative:
          "Welche Fehlercodes dominieren das System? Gruppiere alle Fehler nach ihrem Code und zähle sie. Das verrät, welche Art von Angriff vorliegt — Gateway-Überlastung, Datenbankausfall oder etwas anderes.",
        referenceQuery:
          "SELECT fehlercode, COUNT(*) AS anzahl FROM fehler GROUP BY fehlercode ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT fehlercode, COUNT(*) AS anzahl FROM fehler GROUP BY fehlercode ORDER BY anzahl DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Alle drei Fehlercodes kommen exakt dreimal vor: ERR_404, ERR_500, ERR_502. Eine so gleichmäßige Verteilung ist statistisch nahezu unmöglich bei zufälligen Ausfällen. Das ist kein technisches Versagen — das ist ein skriptbasierter Angriff mit festem Muster.",
        hints: [
          "Gruppiere fehler nach fehlercode und zaehle mit COUNT(*).",
          "Sortiere absteigend nach Anzahl.",
        ],
        points: 15,
      },
      {
        title: "Session-Korrelation",
        narrative:
          "Langsame Antwortzeiten bei bestimmten Sessions könnten auf gezielte Überlastung hindeuten. Finde alle Events mit einer Ladezeit über 400 Millisekunden und verbinde sie mit den zugehörigen Sessions, um IP-Adressen und Browser zu ermitteln.",
        referenceQuery:
          "SELECT e.session_id, s.ip_adresse, s.browser, e.seite, e.dauer_ms FROM events e JOIN sessions s ON e.session_id = s.id WHERE e.dauer_ms > 400 ORDER BY e.dauer_ms DESC;",
        hiddenTestQuery:
          "SELECT e.session_id, s.ip_adresse, e.dauer_ms FROM events e JOIN sessions s ON e.session_id = s.id WHERE e.dauer_ms > 400;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Sechs Events mit mehr als 400ms Ladezeit — alle auf Checkout-Seiten. Die IP-Adressen verteilen sich auf mehrere Nutzer, aber drei Sessions haben identische Browser-Fingerprints. Koordinierte Überlastung von verschiedenen IPs mit demselben Toolset.",
        hints: [
          "Verbinde events mit sessions ueber session_id.",
          "Filtere auf dauer_ms > 400.",
        ],
        points: 20,
      },
      {
        title: "Angriffszeitfenster",
        narrative:
          "Wann schlagen die Fehler zu? Analysiere die Fehlerverteilung nach Tag. Verbinde fehler mit events und gruppiere nach Datum — so erkennst du, ob der Angriff an einem bestimmten Tag konzentriert war.",
        referenceQuery:
          "SELECT DATE(e.zeitpunkt) AS tag, COUNT(f.id) AS fehler_anzahl FROM fehler f JOIN events e ON f.event_id = e.id GROUP BY DATE(e.zeitpunkt) ORDER BY fehler_anzahl DESC;",
        hiddenTestQuery:
          "SELECT DATE(e.zeitpunkt) AS tag, COUNT(f.id) AS fehler_anzahl FROM fehler f JOIN events e ON f.event_id = e.id GROUP BY DATE(e.zeitpunkt);",
        hiddenTestMode: "rows",
        completionNarrative:
          "Tag 1 (01.03.): 7 Fehler. Tag 2 (02.03.): 2 Fehler. Der Hauptangriff fand am ersten Tag statt — konzentriert und massiv. Tag 2 ist möglicherweise ein Nachläufer oder ein Test für den nächsten Angriffszyklus. Melde es sofort an den Sicherheitsrat.",
        hints: [
          "Verbinde fehler mit events und nutze DATE(e.zeitpunkt) fuer die Datumsgruppierung.",
          "Aggregiere mit COUNT(f.id) und sortiere nach Fehlerzahl absteigend.",
        ],
        points: 20,
      },
    ],
    outro:
      "Systemfehler Delta — entschlüsselt. Der Angriff war skriptbasiert, auf den Transaktionspfad fokussiert und an Tag 1 konzentriert. Kein Unfall. Die Korporations-KI log diese Ereignisse als 'Lastspitzen' — du hast bewiesen, dass es Sabotage ist. Leite den Bericht weiter.",
    tags: ["Story", "SELECT", "WHERE", "JOIN", "GROUP BY"],
  }),

  makeStoryExercise("str", {
    title: "Die rote Zone",
    description:
      "MedGov, die staatliche Medizin-KI, verteilt Behandlungen nach einem undurchsichtigen Algorithmus. Patienten ohne Versicherung werden systematisch benachteiligt. Du deckst den Bias auf.",
    difficulty: "junior",
    category: "Story",
    datasetId: "story-rote-zone",
    scenarioTitle: "Die rote Zone",
    intro:
      "MedGov-Protokoll 2091: Die staatliche Medizin-KI übernimmt alle Behandlungsentscheidungen im Korporations-Gesundheitssystem. Berichte häufen sich: Patienten ohne Versicherung warten länger, zahlen mehr, werden schlechter versorgt. Die Zahlen müssen es beweisen. Du hast Zugriff auf die Krankenhausdatenbank — 48 Stunden, bevor MedGov den Audit-Modus aktiviert.\n\nDie Krankenhausdatenbank öffnet sich. Ärzte, Patienten, Behandlungen, Rechnungen — alles verknüpft. Die Daten lügen nicht. Aber MedGov wird versuchen, den Zugang zu sperren, wenn du zu nahe kommst. Sei gründlich. Sei schnell.",
    chapters: [
      {
        title: "Erste Diagnose",
        narrative:
          "Beginne mit den Ärzten: Wer behandelt im System, in welchem Fachbereich, welche Position, und was verdienen sie? Zeige alle Ärzte mit Fachbereich, Position und Gehalt — sortiert nach Gehalt absteigend. Höhere Gehälter korrelieren oft mit bevorzugten Abteilungen.",
        referenceQuery:
          "SELECT ae.name AS arzt, ae.abteilung_id AS fachbereich, ae.position, ae.gehalt FROM aerzte ae ORDER BY ae.gehalt DESC;",
        hiddenTestQuery:
          "SELECT ae.name, ae.abteilung_id, ae.position FROM aerzte ae ORDER BY ae.gehalt DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Dr. Schnitt (Chirurgie, Chefarzt, 16.000) und Dr. Herz (Kardiologie, Chefarzt, 15.000) führen das Ranking an. MedGov verteilt das Budget ungleich — Chirurgie und Kardiologie sind die bevorzugten Fachbereiche, Pädiatrie und Chirurgie-Assistenz sind deutlich schlechter gestellt.",
        hints: [
          "Selektiere aus der aerzte-Tabelle: name, abteilung_id, position, gehalt.",
          "Sortiere mit ORDER BY gehalt DESC.",
        ],
        points: 15,
      },
      {
        title: "Lange Aufenthalte",
        narrative:
          "MedGov soll schwere Fälle absichtlich verzögern, um Kosten in spätere Quartale zu verschieben. Finde alle Behandlungen mit mehr als 5 Tagen Aufenthalt. Zeige Patient, Arzt, Fachbereich, Diagnose, Dauer und Kosten.",
        referenceQuery:
          "SELECT p.name AS patient, ae.name AS arzt, ae.abteilung_id AS fachbereich, b.diagnose, b.dauer_tage, b.kosten FROM behandlungen b JOIN patienten p ON b.patient_id = p.id JOIN aerzte ae ON b.arzt_id = ae.id WHERE b.dauer_tage > 5 ORDER BY b.dauer_tage DESC;",
        hiddenTestQuery:
          "SELECT p.name, b.dauer_tage, b.kosten FROM behandlungen b JOIN patienten p ON b.patient_id = p.id WHERE b.dauer_tage > 5 ORDER BY b.dauer_tage DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Langzeitfälle: Rehabilitation (14 Tage, 7.200 Credits), Knochenbruch (10 Tage, 4.800 Credits), Appendizitis (7 Tage, 5.200 Credits). Alle drei Patienten — Stefan Knochen (zweimal) und Peter Schmerz — sind männlich und unter 40. MedGov-Muster: jüngere Patienten werden länger festgehalten.",
        hints: [
          "Verbinde behandlungen mit patienten und aerzte ueber die jeweiligen IDs.",
          "Filtere mit WHERE b.dauer_tage > 5.",
        ],
        points: 20,
      },
      {
        title: "Offene Rechnungen",
        narrative:
          "Wer schuldet dem System noch Credits? Finde alle offenen Rechnungen mit Patientenname, Betrag, Status und Fälligkeitsdatum. Die Verteilung verrät, wen MedGov bevorzugt abrechnet.",
        referenceQuery:
          "SELECT p.name AS patient, r.betrag, r.status, r.faelligkeitsdatum FROM rechnungen r JOIN patienten p ON r.patient_id = p.id WHERE r.status = 'offen' ORDER BY r.betrag DESC;",
        hiddenTestQuery:
          "SELECT p.name, r.betrag, r.status FROM rechnungen r JOIN patienten p ON r.patient_id = p.id WHERE r.status = 'offen';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei offene Rechnungen: Thomas Fieber (6.000 Credits), Peter Schmerz (5.200 Credits), Stefan Knochen (4.800 Credits). Alle drei Patienten sind in der Behandlungsdatenbank als 'längere Aufenthalte' markiert. MedGov treibt Kosten in die Höhe und lässt Rechnungen offen — Schuldenfalle.",
        hints: [
          "Verbinde rechnungen mit patienten ueber patient_id.",
          "Filtere auf status = 'offen' und sortiere nach betrag absteigend.",
        ],
        points: 20,
      },
      {
        title: "Kosten der Kontrolle",
        narrative:
          "Wie viel kostet MedGov jede Fachabteilung? Summiere die Behandlungskosten nach Fachbereich und zähle die Behandlungen. Das zeigt, welche Bereiche unverhältnismäßig teuer sind.",
        referenceQuery:
          "SELECT ae.abteilung_id AS fachbereich, COUNT(*) AS behandlungen, ROUND(SUM(b.kosten), 2) AS gesamtkosten FROM behandlungen b JOIN aerzte ae ON b.arzt_id = ae.id GROUP BY ae.abteilung_id ORDER BY gesamtkosten DESC;",
        hiddenTestQuery:
          "SELECT ae.abteilung_id, SUM(b.kosten) AS gesamtkosten FROM behandlungen b JOIN aerzte ae ON b.arzt_id = ae.id GROUP BY ae.abteilung_id ORDER BY gesamtkosten DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Chirurgie führt mit über 16.000 Credits in 3 Behandlungen — Durchschnitt 5.400 pro Fall. Innere Medizin hat 3 Behandlungen für nur 4.600 Credits gesamt. MedGov allokiert 3,5-mal mehr Budget pro Fall in die Chirurgie als in die Allgemeinmedizin. Systematischer Bias.",
        hints: [
          "Verbinde behandlungen mit aerzte und gruppiere nach abteilung_id.",
          "Nutze SUM(b.kosten) und COUNT(*) fuer die Aggregation.",
        ],
        points: 25,
      },
      {
        title: "Unversicherte Patienten",
        narrative:
          "MedGovs dunkelste Seite: Patienten ohne Versicherung sollen schlechtere Behandlungen erhalten. Finde alle unversicherten Patienten (versichert = 0) und ihre Behandlungen mit Diagnose und Kosten. Sind ihre Behandlungskosten fair?",
        referenceQuery:
          "SELECT p.name AS patient, p.versichert, b.diagnose, b.dauer_tage, b.kosten FROM patienten p JOIN behandlungen b ON p.id = b.patient_id WHERE p.versichert = 0 ORDER BY b.kosten DESC;",
        hiddenTestQuery:
          "SELECT p.name, b.diagnose, b.kosten FROM patienten p JOIN behandlungen b ON p.id = b.patient_id WHERE p.versichert = 0 ORDER BY b.kosten DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei unversicherte Patienten: Peter Schmerz (Appendizitis, 5.200 + Nachbehandlung 1.800), Ingrid Pfundig (Bluthochdruck, 2.200), Wolfgang Stark (Gallenstein, 3.500). Keine bevorzugte Behandlung, keine reduzierten Tarife. Peter Schmerz zahlt mehr als versicherte Patienten mit vergleichbarer Diagnose.",
        hints: [
          "Filtere patienten auf versichert = 0.",
          "Verbinde mit behandlungen ueber patient_id.",
        ],
        points: 25,
      },
      {
        title: "MedGov-Profil",
        narrative:
          "Abschließende Analyse: Welcher Arzt hat die meisten Behandlungen durchgeführt und die höchste Gesamtbehandlungsdauer? Das MedGov-Profil des Systemlieblings. Zeige Arzt, Fachbereich, Anzahl Behandlungen und Gesamttage — absteigend sortiert.",
        referenceQuery:
          "SELECT ae.name AS arzt, ae.abteilung_id AS fachbereich, COUNT(*) AS behandlungen, SUM(b.dauer_tage) AS gesamttage FROM behandlungen b JOIN aerzte ae ON b.arzt_id = ae.id GROUP BY ae.id, ae.name, ae.abteilung_id ORDER BY gesamttage DESC, behandlungen DESC LIMIT 3;",
        hiddenTestQuery:
          "SELECT ae.name, COUNT(*) AS behandlungen, SUM(b.dauer_tage) AS gesamttage FROM behandlungen b JOIN aerzte ae ON b.arzt_id = ae.id GROUP BY ae.id ORDER BY gesamttage DESC LIMIT 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Dr. Schnitt (Chirurgie): 3 Behandlungen, 26 Gesamttage — davon allein 14 Tage für die Rehabilitation von Stefan Knochen. MedGov leitet systematisch komplexe und teure Fälle an die Chirurgie weiter. Dr. Schnitt ist nicht der Schuldige — er ist das Werkzeug. Der Algorithmus ist das Problem.",
        hints: [
          "Verbinde behandlungen mit aerzte und gruppiere nach Arzt.",
          "Nutze COUNT(*) und SUM(b.dauer_tage), sortiere nach Gesamttagen absteigend.",
          "Begrenze das Ergebnis mit LIMIT 3.",
        ],
        points: 30,
      },
    ],
    outro:
      "MedGov-Bias dokumentiert. Unversicherte Patienten zahlen mehr, warten länger, und der Algorithmus leitet teure Fälle gezielt in bevorzugte Abteilungen. Die Daten sind wasserdicht. MedGov wird diesen Datenbankzugang in 47 Minuten sperren — nutze die Zeit.",
    tags: ["Story", "JOIN", "WHERE", "GROUP BY", "SUM", "COUNT"],
  })
);

storyExercises.push(
  makeStoryExercise("str", {
    title: "Ghost Protocol Sigma",
    description:
      "Geheime KI-Kampagnen unterwandern den E-Commerce-Markt durch koordinierte Fake-Premium-Accounts. Du hast Zugriff auf die Analytics-Datenbank und 6 Stunden, um das Netzwerk zu entlarven.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-ghost-protocol",
    scenarioTitle: "Ghost Protocol Sigma",
    intro:
      "Das Sigma-Netzwerk ist aktiv. Eine unbekannte KI-Organisation hat Premium-Kundenprofile in den staatlich kontrollierten E-Commerce-Markt eingeschleust — koordinierte Käufe, gefälschte Bewertungen, manipulierte Bestsellerlisten. Du hast Zugriff auf die Analytics-Datenbank. Entlarve das Netzwerk, bevor Sigma die Spuren löscht.\n\nDein Zugriffstoken ist aktiv. Kunden, Produkte, Bestellungen, Bewertungen, Kampagnen — fünf Tabellen voller Daten. Sigma hat Spuren hinterlassen. Finde sie, bevor sie verschwinden. Du hast 6 Stunden.",
    chapters: [
      {
        title: "Premium-Verdächtige",
        narrative:
          "Sigma operiert über Premium-Konten mit ungewöhnlich hoher Bestellfrequenz. Finde alle Kunden mit mehr als einer Bestellung. Zeige Name, Anzahl der Bestellungen — absteigend sortiert.",
        referenceQuery:
          "SELECT k.name, COUNT(b.id) AS anzahl_bestellungen FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) > 1 ORDER BY anzahl_bestellungen DESC;",
        hiddenTestQuery:
          "SELECT k.name, COUNT(b.id) AS anzahl FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id HAVING COUNT(b.id) > 1 ORDER BY anzahl DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Vier Kunden mit mehr als einer Bestellung: Anna Bauer (3), Clara Hofmann (2), Eva Mueller (2), Hans Wagner (2). Anna Bauer sticht heraus — 3 Bestellungen in 5 Monaten, alle Premium-Kategorien. Möglicher Sigma-Agent.",
        hints: [
          "Verbinde kunden mit bestellungen ueber kunde_id.",
          "Nutze GROUP BY k.id und HAVING COUNT(b.id) > 1.",
        ],
        points: 20,
      },
      {
        title: "Kampagnen-ROI",
        narrative:
          "Sigma nutzt Marketingkampagnen als Tarnung. Berechne die Konversionsrate jeder Kampagne (konversionen / klicks * 100). Welche Kampagne zeigt auffällig hohe Raten — möglicherweise durch Fake-Klicks aufgebläht?",
        referenceQuery:
          "SELECT name, typ, ROUND(CAST(konversionen AS REAL) / klicks * 100, 2) AS konversionsrate_prozent, budget FROM kampagnen ORDER BY konversionsrate_prozent DESC;",
        hiddenTestQuery:
          "SELECT name, ROUND(CAST(konversionen AS REAL) / klicks * 100, 2) AS rate FROM kampagnen ORDER BY rate DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Black Friday hat die höchste Konversionsrate (7,92%), gefolgt von Weihnachten (7,58%). Die E-Mail-Kampagnen haben überdurchschnittliche Raten für ihr Budget. Sigma hat offenbar gezielt E-Mail-Kampagnen für koordinierte Konversionen genutzt — niedrige Kosten, hohe Wirkung.",
        hints: [
          "Berechne CAST(konversionen AS REAL) / klicks * 100 als konversionsrate.",
          "Nutze ROUND(..., 2) fuer zwei Dezimalstellen.",
        ],
        points: 20,
      },
      {
        title: "Manipulierte Reviews",
        narrative:
          "Sigma's Fake-Agenten hinterlassen Bewertungen nur für bestimmte Produkte. Zeige alle Produkte, die von Premium-Kunden bewertet wurden, mit dem Bewertungsdurchschnitt. Premium-Kunden sind Kunden mit ist_premium = 1.",
        referenceQuery:
          "SELECT p.name, ROUND(AVG(bw.sterne), 2) AS durchschnitt, COUNT(*) AS bewertungen FROM produkte p JOIN bewertungen bw ON p.id = bw.produkt_id WHERE bw.kunde_id IN (SELECT id FROM kunden WHERE ist_premium = 1) GROUP BY p.id, p.name ORDER BY durchschnitt DESC;",
        hiddenTestQuery:
          "SELECT p.name, ROUND(AVG(bw.sterne), 2) AS durchschnitt FROM produkte p JOIN bewertungen bw ON p.id = bw.produkt_id WHERE bw.kunde_id IN (SELECT id FROM kunden WHERE ist_premium = 1) GROUP BY p.id, p.name ORDER BY durchschnitt DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Premium-Kunden haben Laptop Pro 15, Noise-Cancelling Kopfhörer und Standing Desk besonders hoch bewertet — alle mit 4,5 bis 5 Sternen. Diese Produkte sind jetzt 'Bestseller' in der staatlichen Empfehlungsliste. Sigma hat gezielt hohe Produkte nach oben getrieben.",
        hints: [
          "Filtere bewertungen auf Kunden mit ist_premium = 1 ueber eine Subquery.",
          "Verbinde produkte mit bewertungen und aggregiere mit AVG(sterne).",
        ],
        points: 25,
      },
      {
        title: "Ghost-Produkte",
        narrative:
          "Nicht alle Produkte im Sigma-Netzwerk werden bewertet — manche sind Phantom-Artikel, die nur für interne Transaktionen existieren. Finde alle Produkte, die keine einzige Kundenbewertung erhalten haben.",
        referenceQuery:
          "SELECT p.name AS produkt, p.kategorie, p.preis FROM produkte p LEFT JOIN bewertungen b ON p.id = b.produkt_id WHERE b.id IS NULL ORDER BY p.preis DESC;",
        hiddenTestQuery:
          "SELECT p.name FROM produkte p LEFT JOIN bewertungen b ON p.id = b.produkt_id WHERE b.id IS NULL ORDER BY p.preis DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Produkte ohne Bewertungen: Bürostuhl Comfort (349 Credits), Bücherregal (249 Credits), Kopfstütze Memory (79 Credits). Alle aus derselben Kategorie: Möbel. Sigma hat diese Produkte als Dummy-Artikel in den Katalog eingeschleust — sie werden bestellt, aber nie bewertet.",
        hints: [
          "Nutze LEFT JOIN zwischen produkte und bewertungen.",
          "Filtere mit WHERE b.id IS NULL.",
        ],
        points: 25,
      },
      {
        title: "Fake-Bestseller",
        narrative:
          "Sigmas Endziel: Produkte mit schlechten Bewertungen als Bestseller platzieren. Finde alle Produkte, die verkauft wurden und eine Bewertung unter dem Durchschnitt (< 4,3) haben. Sortiere nach Umsatz absteigend.",
        referenceQuery:
          "SELECT p.name, ROUND(SUM(bp.menge * bp.einzelpreis), 2) AS umsatz, p.bewertung FROM produkte p JOIN bestellpositionen bp ON p.id = bp.produkt_id WHERE p.bewertung IS NOT NULL GROUP BY p.id, p.name, p.bewertung HAVING p.bewertung < 4.3 ORDER BY umsatz DESC;",
        hiddenTestQuery:
          "SELECT p.name, p.bewertung FROM produkte p JOIN bestellpositionen bp ON p.id = bp.produkt_id WHERE p.bewertung IS NOT NULL GROUP BY p.id, p.name, p.bewertung HAVING p.bewertung < 4.3 ORDER BY SUM(bp.menge * bp.einzelpreis) DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Schreibtisch Eiche führt mit 599 Credits Umsatz — bei einer Bewertung von nur 4,10. USB-C Hub und Wireless Maus folgen. Sigma hat unterdurchschnittlich bewertete Produkte durch koordinierte Käufe in die Bestsellerliste gezwungen. Die Bewertungen lügen nicht — aber der Algorithmus tut es.",
        hints: [
          "Verbinde produkte mit bestellpositionen und berechne SUM(menge * einzelpreis) als Umsatz.",
          "Filtere mit HAVING p.bewertung < 4.3.",
        ],
        points: 30,
      },
      {
        title: "Das Sigma-Netz",
        narrative:
          "Vollständige Netzwerkanalyse: Erstelle ein vollständiges Profil aller Kunden mit Bestellanzahl, Gesamtumsatz und Anzahl ihrer Bewertungen. Premium-Status einschließen. So wird das koordinierte Muster sichtbar.",
        referenceQuery:
          "SELECT k.name, k.ist_premium, COUNT(DISTINCT b.id) AS bestellungen, ROUND(SUM(b.gesamtbetrag), 2) AS gesamtumsatz, COUNT(DISTINCT bw.id) AS bewertungen FROM kunden k LEFT JOIN bestellungen b ON k.id = b.kunde_id LEFT JOIN bewertungen bw ON k.id = bw.kunde_id GROUP BY k.id, k.name, k.ist_premium ORDER BY gesamtumsatz DESC;",
        hiddenTestQuery:
          "SELECT k.name, k.ist_premium, COUNT(DISTINCT b.id) AS bestellungen, COUNT(DISTINCT bw.id) AS bewertungen FROM kunden k LEFT JOIN bestellungen b ON k.id = b.kunde_id LEFT JOIN bewertungen bw ON k.id = bw.kunde_id GROUP BY k.id, k.ist_premium ORDER BY bestellungen DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Das Sigma-Netz ist entlarvt: Premium-Kunden (Anna Bauer, Clara Hofmann, Eva Mueller, Hans Wagner) haben die höchsten Bestellzahlen UND die meisten Bewertungen. Nicht-Premium-Kunden kaufen weniger und bewerten kaum. Das ist kein natürliches Kaufverhalten — das ist ein koordinierter Algorithmus.",
        hints: [
          "Verbinde kunden mit bestellungen und bewertungen ueber LEFT JOINs.",
          "Nutze COUNT(DISTINCT b.id) und COUNT(DISTINCT bw.id) fuer Bestellungen und Bewertungen.",
          "Gruppiere nach Kunden und sortiere nach Gesamtumsatz.",
        ],
        points: 35,
      },
    ],
    outro:
      "Ghost Protocol Sigma — Netzwerk entlarvt. Die koordinierten Premium-Accounts sind identifiziert, die manipulierten Bewertungen dokumentiert, die Fake-Bestseller bewiesen. Sigma wird diesen Datenbankzugang in 6 Minuten schließen. Die Beweise sind gesichert.",
    tags: ["Story", "JOIN", "GROUP BY", "HAVING", "Subquery", "Window"],
  }),

  makeStoryExercise("str", {
    title: "Projekt Prometheus",
    description:
      "Eine Elite-Universität verwendet eine Black-Box-KI zur Notenvergabe. Der Bias ist statistisch beweisbar — mit Window-Funktionen, CTEs und harten Daten.",
    difficulty: "advanced",
    category: "Story",
    datasetId: "university",
    scenarioTitle: "Projekt Prometheus",
    intro:
      "Prometheus-Protokoll: Die Prometheus-Universität hat ihre Notenvergabe vollständig an eine KI delegiert. Whistleblower berichten: Studenten bestimmter Studiengänge werden systematisch schlechter benotet. Professoren, die dem Algorithmus widersprechen, verlieren Kurse. Du hast Lesezugriff auf die Prüfungsdatenbank — beweise den Bias mit SQL.\n\nDie Universitätsdatenbank steht offen. Studenten, Professoren, Kurse, Einschreibungen, Prüfungsergebnisse — fünf Tabellen, die die Wahrheit enthalten. Prometheus überwacht jede Abfrage. Beweise den Bias, bevor der Zugang gesperrt wird.",
    chapters: [
      {
        title: "Gesamtranking",
        narrative:
          "Beginne mit dem Gesamtbild: Wer hat die meisten Prüfungspunkte gesammelt? Erstelle ein Ranking aller Studenten mit RANK() OVER nach Gesamtpunktzahl. Das zeigt, wen Prometheus bevorzugt.",
        referenceQuery:
          "SELECT s.name, s.studiengang, SUM(pe.punkte) AS gesamtpunkte, RANK() OVER (ORDER BY SUM(pe.punkte) DESC) AS rang FROM studenten s JOIN pruefungsergebnisse pe ON s.id = pe.student_id GROUP BY s.id, s.name, s.studiengang ORDER BY rang;",
        hiddenTestQuery:
          "SELECT s.name, SUM(pe.punkte) AS gesamtpunkte, RANK() OVER (ORDER BY SUM(pe.punkte) DESC) AS rang FROM studenten s JOIN pruefungsergebnisse pe ON s.id = pe.student_id GROUP BY s.id, s.name ORDER BY rang;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Spitze: Laura Becker (Mathematik, 169 Punkte), Marie Schneider (Mathematik, 136), Lukas Weber (Informatik, 120). Die Top 3 kommen aus Mathematik und Informatik. Physik- und Wirtschaftsstudenten fehlen in den Top-5 komplett. Erstes Anzeichen.",
        hints: [
          "Nutze RANK() OVER (ORDER BY SUM(pe.punkte) DESC) als Fensterfunktion.",
          "Verbinde studenten mit pruefungsergebnisse und gruppiere nach Student.",
        ],
        points: 25,
      },
      {
        title: "Kursdurchschnitt",
        narrative:
          "Prometheus vergibt Noten relativ zum Kurs. Berechne für jede Einschreibung die Note UND den Kursdurchschnitt als Fensterfunktion — AVG(note) OVER (PARTITION BY kurs_id). So siehst du, wer über oder unter dem Kursdurchschnitt liegt.",
        referenceQuery:
          "SELECT s.name AS student, k.name AS kurs, e.note, ROUND(AVG(e.note) OVER (PARTITION BY e.kurs_id), 2) AS kurs_durchschnitt FROM einschreibungen e JOIN studenten s ON e.student_id = s.id JOIN kurse k ON e.kurs_id = k.id WHERE e.note IS NOT NULL ORDER BY k.id, e.note;",
        hiddenTestQuery:
          "SELECT s.name, k.name AS kurs, e.note, ROUND(AVG(e.note) OVER (PARTITION BY e.kurs_id), 2) AS kurs_avg FROM einschreibungen e JOIN studenten s ON e.student_id = s.id JOIN kurse k ON e.kurs_id = k.id WHERE e.note IS NOT NULL ORDER BY k.id;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Der Kursdurchschnitt variiert stark: Algorithmen (2,35) und Quantenmechanik (2,23) liegen deutlich über dem Mittel. BWL-Grundlagen ebenfalls. Prometheus gibt in bestimmten Kursen systematisch schlechtere Noten — unabhängig von der tatsächlichen Leistung.",
        hints: [
          "Nutze AVG(e.note) OVER (PARTITION BY e.kurs_id) als Fensterfunktion.",
          "Filtere auf WHERE e.note IS NOT NULL fuer vollstaendige Noten.",
        ],
        points: 30,
      },
      {
        title: "Unter der Norm",
        narrative:
          "Wer liegt tatsächlich unter dem Kursdurchschnitt? Nutze eine CTE, um den Kursdurchschnitt zu berechnen, und filtere dann alle Studenten heraus, deren Note schlechter als der Schnitt ist (in Deutschland: höhere Note = schlechtere Leistung).",
        referenceQuery:
          "WITH kurs_avg AS (SELECT kurs_id, AVG(note) AS durchschnitt FROM einschreibungen WHERE note IS NOT NULL GROUP BY kurs_id) SELECT s.name AS student, k.name AS kurs, e.note, ROUND(ka.durchschnitt, 2) AS kurs_schnitt FROM einschreibungen e JOIN studenten s ON e.student_id = s.id JOIN kurse k ON e.kurs_id = k.id JOIN kurs_avg ka ON e.kurs_id = ka.kurs_id WHERE e.note > ka.durchschnitt ORDER BY k.id, e.note DESC;",
        hiddenTestQuery:
          "WITH kurs_avg AS (SELECT kurs_id, AVG(note) AS durchschnitt FROM einschreibungen WHERE note IS NOT NULL GROUP BY kurs_id) SELECT s.name, k.name AS kurs, e.note FROM einschreibungen e JOIN studenten s ON e.student_id = s.id JOIN kurse k ON e.kurs_id = k.id JOIN kurs_avg ka ON e.kurs_id = ka.kurs_id WHERE e.note > ka.durchschnitt ORDER BY e.note DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Jonas Braun (Algorithmen 3,0), Max Schmitz (BWL 2,7), Sarah Neumann (Quantenmechanik 2,7), Felix Wagner (Quantenmechanik 2,3) — alle unter ihrem Kursdurchschnitt. Interessant: Fast alle kommen aus Physik oder Wirtschaft. Nicht aus Mathematik.",
        hints: [
          "Erstelle eine CTE mit WITH kurs_avg AS (SELECT kurs_id, AVG(note) ...).",
          "Filtere dann auf e.note > ka.durchschnitt (hoehere Note = schlechter in Deutschland).",
        ],
        points: 30,
      },
      {
        title: "Prüfer-Profil",
        narrative:
          "Prometheus könnte durch Prüfer-Zuweisung manipulieren. Erstelle ein Profil jedes Professors: durchschnittliche Note aller ihrer Kurse, Anzahl bewerteter Kurse. Welcher Professor gibt systematisch schlechte Noten?",
        referenceQuery:
          "WITH prof_noten AS (SELECT p.name AS professor, p.fakultaet, ROUND(AVG(e.note), 2) AS durchschnitt, COUNT(DISTINCT k.id) AS kurse FROM professoren p JOIN kurse k ON k.professor_id = p.id JOIN einschreibungen e ON e.kurs_id = k.id WHERE e.note IS NOT NULL GROUP BY p.id, p.name, p.fakultaet) SELECT professor, fakultaet, durchschnitt, kurse FROM prof_noten ORDER BY durchschnitt DESC;",
        hiddenTestQuery:
          "WITH prof_noten AS (SELECT p.name AS professor, ROUND(AVG(e.note), 2) AS durchschnitt FROM professoren p JOIN kurse k ON k.professor_id = p.id JOIN einschreibungen e ON e.kurs_id = k.id WHERE e.note IS NOT NULL GROUP BY p.id, p.name) SELECT professor, durchschnitt FROM prof_noten ORDER BY durchschnitt DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Prof. Dr. Weber (Wirtschaft): 2,35 Durchschnitt — schlechteste Bewertungen. Prof. Dr. Fischer (Physik): 2,23. Prof. Dr. Mueller (Informatik): 1,96. Prof. Dr. Keller (Informatik): 1,50. Prof. Dr. Schmidt (Mathematik): 1,38 — beste Noten. Prometheus weist kritische Prüfer gezielt Wirtschafts- und Physik-Kursen zu.",
        hints: [
          "Erstelle eine CTE, die Professoren mit AVG(e.note) verknuepft.",
          "Verbinde professoren → kurse → einschreibungen und gruppiere nach Professor.",
        ],
        points: 35,
      },
      {
        title: "Studiengang-Gap",
        narrative:
          "Der finale Beweis des Studiengang-Bias: Berechne den Notendurchschnitt pro Studiengang. Wenn Prometheus fair wäre, sollten alle Studiengänge ähnliche Durchschnitte haben.",
        referenceQuery:
          "SELECT s.studiengang, ROUND(AVG(e.note), 2) AS durchschnitt, COUNT(e.id) AS bewertete_einschreibungen FROM studenten s JOIN einschreibungen e ON s.id = e.student_id WHERE e.note IS NOT NULL GROUP BY s.studiengang ORDER BY durchschnitt ASC;",
        hiddenTestQuery:
          "SELECT s.studiengang, ROUND(AVG(e.note), 2) AS durchschnitt FROM studenten s JOIN einschreibungen e ON s.id = e.student_id WHERE e.note IS NOT NULL GROUP BY s.studiengang ORDER BY durchschnitt ASC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Mathematik: 1,34 (bestes Ergebnis). Informatik: 1,90. Physik: 2,23. Wirtschaft: 2,70 (schlechtestes Ergebnis). Der Gap zwischen Mathematik und Wirtschaft beträgt 1,36 Notenpunkte — bei identischem Prüfungssystem. Das ist kein Zufall. Das ist Prometheus.",
        hints: [
          "Verbinde studenten mit einschreibungen und filtere auf note IS NOT NULL.",
          "Gruppiere nach studiengang und sortiere nach Durchschnitt aufsteigend (beste Note zuerst).",
        ],
        points: 35,
      },
      {
        title: "Credits vs. Note",
        narrative:
          "Höhere Credits-Kurse sollten schwieriger sein — und schlechtere Noten produzieren. Oder tun sie es wirklich? Analysiere den Zusammenhang zwischen Kurs-Credits und Durchschnittsnote.",
        referenceQuery:
          "SELECT k.name AS kurs, k.credits, ROUND(AVG(e.note), 2) AS durchschnittsnote, COUNT(e.id) AS einschreibungen FROM kurse k JOIN einschreibungen e ON k.id = e.kurs_id WHERE e.note IS NOT NULL GROUP BY k.id, k.name, k.credits ORDER BY k.credits DESC, durchschnittsnote;",
        hiddenTestQuery:
          "SELECT k.credits, ROUND(AVG(e.note), 2) AS avg_note FROM kurse k JOIN einschreibungen e ON k.id = e.kurs_id WHERE e.note IS NOT NULL GROUP BY k.credits ORDER BY k.credits DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "8-Credit-Kurse (Lineare Algebra, Analysis I) haben einen Schnitt von 1,26 — besser als 6-Credit-Kurse mit 2,08. Schwierigere Kurse = bessere Noten? Das ist unlogisch. Prometheus bevorzugt tatsächlich die anspruchsvolleren Kurse — weil sie mehrheitlich Mathematik-Studenten belegen.",
        hints: [
          "Verbinde kurse mit einschreibungen und aggregiere AVG(e.note) nach credits.",
          "Sortiere nach credits absteigend.",
        ],
        points: 40,
      },
      {
        title: "Der Beweis",
        narrative:
          "Abschluss-Query: Verknüpfe Professor-Bias mit Studiengang-Bias in einer Multi-CTE-Query. Zeige für jeden Professor: Durchschnittsnote seiner Kurse UND den Studiengang-Durchschnitt seiner Fakultät. Wo die Werte stark abweichen, liegt der Bias.",
        referenceQuery:
          "WITH prof_bias AS (SELECT p.name AS professor, p.fakultaet, ROUND(AVG(e.note), 2) AS prof_schnitt FROM professoren p JOIN kurse k ON k.professor_id = p.id JOIN einschreibungen e ON e.kurs_id = k.id WHERE e.note IS NOT NULL GROUP BY p.id, p.name, p.fakultaet), studiengang_bias AS (SELECT s.studiengang, ROUND(AVG(e.note), 2) AS sg_schnitt FROM studenten s JOIN einschreibungen e ON s.id = e.student_id WHERE e.note IS NOT NULL GROUP BY s.studiengang) SELECT pb.professor, pb.fakultaet, pb.prof_schnitt, sb.sg_schnitt, ROUND(pb.prof_schnitt - sb.sg_schnitt, 2) AS abweichung FROM prof_bias pb JOIN studiengang_bias sb ON pb.fakultaet = sb.studiengang ORDER BY abweichung DESC;",
        hiddenTestQuery:
          "WITH prof_bias AS (SELECT p.name AS professor, p.fakultaet, ROUND(AVG(e.note), 2) AS prof_schnitt FROM professoren p JOIN kurse k ON k.professor_id = p.id JOIN einschreibungen e ON e.kurs_id = k.id WHERE e.note IS NOT NULL GROUP BY p.id, p.name, p.fakultaet), studiengang_bias AS (SELECT s.studiengang, ROUND(AVG(e.note), 2) AS sg_schnitt FROM studenten s JOIN einschreibungen e ON s.id = e.student_id WHERE e.note IS NOT NULL GROUP BY s.studiengang) SELECT pb.professor, pb.prof_schnitt, sb.sg_schnitt FROM prof_bias pb JOIN studiengang_bias sb ON pb.fakultaet = sb.studiengang ORDER BY pb.prof_schnitt DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Der Beweis ist wasserdicht: Prof. Dr. Weber (Wirtschaft) benotet 0,35 Punkte schlechter als der Studiengangsschnitt. Prof. Dr. Fischer (Physik) 0,28 Punkte schlechter. Prof. Dr. Mueller liegt exakt im Schnitt. Prof. Dr. Schmidt (Mathematik) benotet sogar 0,04 Punkte besser. Prometheus lenkt gezielt: schlechte Prüfer in schlechte Studiengänge.",
        hints: [
          "Erstelle zwei CTEs: prof_bias (Professoren mit avg note) und studiengang_bias (Studiengaenge mit avg note).",
          "Verbinde die CTEs ueber pb.fakultaet = sb.studiengang.",
          "Berechne die Abweichung mit prof_schnitt - sg_schnitt.",
        ],
        points: 45,
      },
    ],
    outro:
      "Projekt Prometheus — entlarvt. Der statistische Beweis ist vollständig: Wirtschafts- und Physik-Studierende werden systematisch benachteiligt. Prüfer wurden gezielt zugewiesen. Die Daten gehen an den Akademischen Senat — und an die Presse.",
    tags: ["Story", "Window Functions", "CTE", "GROUP BY", "JOIN"],
  }),

  makeStoryExercise("str", {
    title: "Geldstrom Omega",
    description:
      "Ein KI-Netzwerk wäscht Geld durch Tausende Mikrotransaktionen. Du hast 48 Stunden und Zugriff auf die Bankdatenbank — finde die Täter, bevor Omega die Konten leert.",
    difficulty: "advanced",
    category: "Story",
    datasetId: "story-geldstrom-omega",
    scenarioTitle: "Geldstrom Omega",
    intro:
      "Omega-Alarm. Die Betrugserkennungs-KI der Korporationsbank hat Anomalien markiert — aber die Omega-Gruppe ist schneller. Mikrotransaktionen fließen durch Dutzende Konten, Beträge verschwinden in Millisekunden. Du hast Datenbankzugriff und 48 Stunden. Finde das Omega-Netzwerk — bevor es die Konten leert und die Spuren verwischt.\n\nDie Bankdatenbank ist online. Kunden, Konten, Transaktionen, Betrugsfälle — vier Tabellen, die das Omega-Netzwerk offenbaren. Jede Transaktion erzählt eine Geschichte. Jedes Konto hat ein Muster. Finde es, bevor Omega den Zugang schließt.",
    chapters: [
      {
        title: "Verdächtige Transfers",
        narrative:
          "Erste Aufgabe: Zeige alle Transaktionen, die bereits als Betrugsfälle markiert wurden. Verbinde transaktionen, betrugsfaelle, konten und kunden. Sortiere nach Betrag absteigend.",
        referenceQuery:
          "SELECT t.id, k.name AS kunde, ko.kontonummer, t.betrag, t.typ, t.datum, bf.grund FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY ABS(t.betrag) DESC;",
        hiddenTestQuery:
          "SELECT k.name, t.betrag, bf.grund FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY ABS(t.betrag) DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Vier markierte Transaktionen: Wolfgang Becker (−9.999,99 und −4.999,99 Credits, Nachtzeit-Luxuskäufe), Helmut Richter (−5.000 Überweisung an unbekanntes Konto, −999,99 Nacht-Transaktion). Zwei Täter, vier Datenpunkte. Das ist nur die Spitze des Eisbergs.",
        hints: [
          "Verbinde transaktionen → betrugsfaelle → konten → kunden ueber die jeweiligen IDs.",
          "Sortiere mit ORDER BY ABS(t.betrag) DESC fuer groesste Betruege zuerst.",
        ],
        points: 25,
      },
      {
        title: "Hochfrequenz-Konten",
        narrative:
          "Omega verschleiert große Transfers durch viele kleine Transaktionen — Hochfrequenz ist das Erkennungszeichen. Finde alle Konten mit mehr als 2 Transaktionen. Zeige Kontonummer, Kundenname und Anzahl.",
        referenceQuery:
          "SELECT ko.kontonummer, k.name AS kunde, COUNT(t.id) AS transaktionen_anzahl FROM transaktionen t JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id GROUP BY ko.id, ko.kontonummer, k.name HAVING COUNT(t.id) > 2 ORDER BY transaktionen_anzahl DESC;",
        hiddenTestQuery:
          "SELECT ko.kontonummer, k.name, COUNT(t.id) AS anzahl FROM transaktionen t JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id GROUP BY ko.id HAVING COUNT(t.id) > 2 ORDER BY anzahl DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Hochfrequenz-Konten: Helmut Richter Girokonto (7 Transaktionen!), Helmut Richter Sparkonto (4), Brigitte Mueller Sparkonto (3). Helmut Richter erscheint in BEIDEN Listen — Betrugstransaktionen UND Hochfrequenz. Omega's Hauptknoten ist identifiziert.",
        hints: [
          "Gruppiere nach Konto und nutze HAVING COUNT(t.id) > 2.",
          "Sortiere nach Transaktionsanzahl absteigend.",
        ],
        points: 30,
      },
      {
        title: "Saldo-Anomalien",
        narrative:
          "Omega erzeugt negative Salden — ein Konto geht ins Minus, um Mittel abzuleiten. Berechne den laufenden Saldo jedes Kontos mit SUM(betrag) OVER (PARTITION BY konto_id ORDER BY datum). Zeige nur Konten, die ins Minus rutschen.",
        referenceQuery:
          "SELECT ko.kontonummer, k.name AS kunde, t.datum, t.betrag, t.beschreibung, SUM(t.betrag) OVER (PARTITION BY t.konto_id ORDER BY t.datum) AS laufender_saldo FROM transaktionen t JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id WHERE t.konto_id IN (1, 8) ORDER BY t.konto_id, t.datum;",
        hiddenTestQuery:
          "SELECT ko.kontonummer, t.datum, t.betrag, SUM(t.betrag) OVER (PARTITION BY t.konto_id ORDER BY t.datum) AS saldo FROM transaktionen t JOIN konten ko ON t.konto_id = ko.id WHERE t.konto_id IN (1, 8) ORDER BY t.konto_id, t.datum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Konto 1 (Helmut Richter): Saldo fällt nach der 5.000-Überweisung auf −365 Credits, nach dem Nacht-Transfer auf −1.365 Credits. Konto 8 (Wolfgang Becker): Sofort −9.999 Credits nach der ersten Transaktion. Beide Konten sind technisch insolvent — aber das System hat keine Sperre ausgelöst. Omega hat die Sicherheitssysteme manipuliert.",
        hints: [
          "Nutze SUM(t.betrag) OVER (PARTITION BY t.konto_id ORDER BY t.datum) als laufenden Saldo.",
          "Filtere auf konto_id IN (1, 8) fuer die verdaechtigsten Konten.",
        ],
        points: 30,
      },
      {
        title: "Zeitliche Lücken",
        narrative:
          "Omega-Transfers passieren in unregelmäßigen Abständen — manchmal Minuten, manchmal Wochen. Berechne für jede Transaktion, wie viele Tage seit der vorherigen Transaktion desselben Kontos vergangen sind, mit LAG() OVER.",
        referenceQuery:
          "SELECT ko.kontonummer, k.name, t.datum, t.betrag, LAG(t.datum) OVER (PARTITION BY t.konto_id ORDER BY t.datum) AS vorherige_transaktion, ROUND(JULIANDAY(t.datum) - JULIANDAY(LAG(t.datum) OVER (PARTITION BY t.konto_id ORDER BY t.datum)), 1) AS tage_abstand FROM transaktionen t JOIN konten ko ON t.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY t.konto_id, t.datum;",
        hiddenTestQuery:
          "SELECT t.konto_id, t.datum, LAG(t.datum) OVER (PARTITION BY t.konto_id ORDER BY t.datum) AS vorher, ROUND(JULIANDAY(t.datum) - JULIANDAY(LAG(t.datum) OVER (PARTITION BY t.konto_id ORDER BY t.datum)), 1) AS abstand FROM transaktionen t ORDER BY t.konto_id, t.datum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Konto 1: Die ersten vier Transaktionen im Abstand von 1–2 Tagen — dann plötzlich 39 Tage Pause, gefolgt von der 5.000-Überweisung. Das ist das Omega-Muster: normale Aktivität als Tarnung, dann der große Transfer. Konto 8: Beide Betrugstransaktionen im Abstand von 15 Minuten — koordinierter Angriff.",
        hints: [
          "Nutze LAG(t.datum) OVER (PARTITION BY t.konto_id ORDER BY t.datum).",
          "Berechne den Abstand mit JULIANDAY(t.datum) - JULIANDAY(LAG(...)).",
        ],
        points: 35,
      },
      {
        title: "Transaktionsketten",
        narrative:
          "Omega verschleiert Herkunft durch Kettenüberweisungen — Geld fließt von Konto zu Konto. Nutze eine CTE, um alle Konten zu finden, die entweder mehr als 3 Transaktionen ODER ein Gesamtvolumen über 5.000 Credits haben.",
        referenceQuery:
          "WITH verdaechtige_konten AS (SELECT konto_id, COUNT(*) AS anzahl, ROUND(SUM(ABS(betrag)), 2) AS gesamtvolumen FROM transaktionen GROUP BY konto_id HAVING COUNT(*) > 3 OR SUM(ABS(betrag)) > 5000) SELECT ko.kontonummer, k.name AS kunde, vk.anzahl, vk.gesamtvolumen FROM verdaechtige_konten vk JOIN konten ko ON vk.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY vk.gesamtvolumen DESC;",
        hiddenTestQuery:
          "WITH vk AS (SELECT konto_id, COUNT(*) AS anzahl, SUM(ABS(betrag)) AS vol FROM transaktionen GROUP BY konto_id HAVING COUNT(*) > 3 OR SUM(ABS(betrag)) > 5000) SELECT ko.kontonummer, k.name, vk.anzahl FROM vk JOIN konten ko ON vk.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY vk.vol DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei verdächtige Konten: Wolfgang Becker (14.999 Credits Volumen, 2 Transaktionen — reine Hochbetragsangriffe), Helmut Richter Girokonto (11.365 Credits, 7 Transaktionen), Helmut Richter Sparkonto (4.460 Credits, 4 Transaktionen). Das Omega-Dreieck ist vollständig.",
        hints: [
          "Erstelle eine CTE mit HAVING COUNT(*) > 3 OR SUM(ABS(betrag)) > 5000.",
          "Verbinde das CTE-Ergebnis mit konten und kunden.",
        ],
        points: 40,
      },
      {
        title: "Täter-Konten",
        narrative:
          "Kombiniere die Erkenntnisse: Finde alle Konten, die ENTWEDER als Betrugskonto markiert ODER hochfrequent sind. Nutze zwei CTEs und verbinde sie mit OR in der WHERE-Klausel.",
        referenceQuery:
          "WITH betrug_konten AS (SELECT DISTINCT t.konto_id FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id), frequenz_konten AS (SELECT konto_id FROM transaktionen GROUP BY konto_id HAVING COUNT(*) > 3) SELECT ko.kontonummer, k.name AS kunde, ko.saldo FROM konten ko JOIN kunden k ON ko.kunde_id = k.id WHERE ko.id IN (SELECT konto_id FROM betrug_konten) OR ko.id IN (SELECT konto_id FROM frequenz_konten) ORDER BY ko.saldo DESC;",
        hiddenTestQuery:
          "WITH betrug AS (SELECT DISTINCT t.konto_id FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id), frequenz AS (SELECT konto_id FROM transaktionen GROUP BY konto_id HAVING COUNT(*) > 3) SELECT ko.kontonummer, k.name FROM konten ko JOIN kunden k ON ko.kunde_id = k.id WHERE ko.id IN (SELECT konto_id FROM betrug) OR ko.id IN (SELECT konto_id FROM frequenz) ORDER BY ko.saldo DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Täter-Konten identifiziert: Helmut Richter Girokonto (Saldo: 12.500), Helmut Richter Sparkonto (45.000 — das eigentliche Ziel), Wolfgang Becker Girokonto (67.000 Credits — der größte Angriffspunkt). Wolfgang Beckers Konto enthält das größte Omega-Volumen. 32 Stunden verbleiben.",
        hints: [
          "Erstelle CTEs betrug_konten und frequenz_konten separat.",
          "Verbinde sie mit WHERE ko.id IN (...) OR ko.id IN (...).",
        ],
        points: 45,
      },
      {
        title: "Omega fällt",
        narrative:
          "Finale Query: Erstelle das vollständige Omega-Netzwerk-Profil. Multi-CTE mit Betrugstransaktionen UND Kontostatistiken — zeige für jeden Täter das Betrugsvolumen, die Transaktionsanzahl und den aktuellen Saldo.",
        referenceQuery:
          "WITH fraud_stats AS (SELECT t.konto_id, COUNT(*) AS betrugsanzahl, ROUND(SUM(ABS(t.betrag)), 2) AS betrugsvolumen FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id GROUP BY t.konto_id), konto_stats AS (SELECT konto_id, COUNT(*) AS transaktionen, ROUND(SUM(betrag), 2) AS saldo_aenderung FROM transaktionen GROUP BY konto_id) SELECT k.name AS taeternetz, ko.kontonummer, ko.saldo, ks.transaktionen, fs.betrugsanzahl, fs.betrugsvolumen FROM fraud_stats fs JOIN konten ko ON fs.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id JOIN konto_stats ks ON fs.konto_id = ks.konto_id ORDER BY fs.betrugsvolumen DESC;",
        hiddenTestQuery:
          "WITH fs AS (SELECT t.konto_id, COUNT(*) AS betrugsanzahl, SUM(ABS(t.betrag)) AS vol FROM transaktionen t JOIN betrugsfaelle bf ON t.id = bf.transaktion_id GROUP BY t.konto_id) SELECT k.name, ko.kontonummer, fs.betrugsanzahl, ROUND(fs.vol, 2) AS betrugsvolumen FROM fs JOIN konten ko ON fs.konto_id = ko.id JOIN kunden k ON ko.kunde_id = k.id ORDER BY fs.vol DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Omega-Netzwerk vollständig dokumentiert: Wolfgang Becker (14.999,98 Credits Betrugsvolumen, 2 Fraud-Transaktionen), Helmut Richter (5.999,99 Credits, 2 Fraud-Transaktionen). Beide Konten werden eingefroren. 16 Stunden vor Ablauf der Frist. Omega fällt.",
        hints: [
          "Erstelle zwei CTEs: fraud_stats und konto_stats.",
          "Verbinde beide CTEs mit konten und kunden fuer das finale Profil.",
          "Sortiere nach Betrugsvolumen absteigend.",
        ],
        points: 50,
      },
    ],
    outro:
      "Geldstrom Omega — gestoppt. Das Netzwerk ist vollständig dokumentiert: zwei Hauptakteure, vier Betrugskonten, 20.999 Credits Gesamtvolumen. Die Konten werden eingefroren. Omega hat das Spiel verloren — dieses Mal.",
    tags: ["Story", "Window Functions", "CTE", "JOIN", "GROUP BY"],
  }),

  makeStoryExercise("str", {
    title: "Null Day",
    description:
      "Der staatliche Fitness-Tracker manipuliert Gesundheitsdaten für eine geheime Bürgerbewertungsdatenbank. Du hast eine Chance, die vollständige Beweiskette aufzudecken.",
    difficulty: "interview",
    category: "Story",
    datasetId: "fitness",
    scenarioTitle: "Null Day",
    intro:
      "Null-Day-Protokoll: Der staatliche FitCore-Tracker sammelt nicht nur Fitnessdaten — er generiert sie. Körpergewicht, Kalorien, BMI: alles wird für eine versteckte Bürgerbewertungsmatrix manipuliert. Wer zu schwer ist, bekommt weniger Credits. Wer zu wenig trainiert, verliert Versicherungsschutz. Die Daten müssen stimmen — und sie stimmen nicht. Du hast Zugriff auf die FitCore-Datenbank. Beweise es.\n\nDie FitCore-Datenbank lädt. Nutzer, Workouts, Körperdaten — drei Tabellen voller manipulierter Daten. Die Wahrheit liegt in den Mustern. Finde die Anomalien, bevor FitCore den Zugang sperrt. Die Bürgerbewertungsmatrix wartet nicht.",
    chapters: [
      {
        title: "Unmögliche Körper",
        narrative:
          "FitCore protokolliert Körpergewicht monatlich. Zeige für jeden Nutzer die Gewichtsentwicklung mit dem vorherigen Messwert — nutze LAG() OVER (PARTITION BY nutzer_id ORDER BY datum). So werden unnatürliche Sprünge sichtbar.",
        referenceQuery:
          "SELECT n.name, kd.datum, kd.gewicht_kg, LAG(kd.gewicht_kg) OVER (PARTITION BY kd.nutzer_id ORDER BY kd.datum) AS vorheriges_gewicht, ROUND(kd.gewicht_kg - LAG(kd.gewicht_kg) OVER (PARTITION BY kd.nutzer_id ORDER BY kd.datum), 2) AS veraenderung FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id ORDER BY n.name, kd.datum;",
        hiddenTestQuery:
          "SELECT n.name, kd.datum, kd.gewicht_kg, LAG(kd.gewicht_kg) OVER (PARTITION BY kd.nutzer_id ORDER BY kd.datum) AS vorher FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id ORDER BY kd.nutzer_id, kd.datum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Alle Gewichtsveränderungen liegen zwischen −0,5 und −1,0 kg pro Monat — bei allen 8 Nutzern. Statistisch unmöglich: echte Gewichtsverläufe variieren stark. FitCore generiert gleichmäßige Abnahmekurven, die 'Compliance' simulieren. Die Daten sind gefälscht.",
        hints: [
          "Nutze LAG(kd.gewicht_kg) OVER (PARTITION BY kd.nutzer_id ORDER BY kd.datum).",
          "Berechne die Veraenderung mit kd.gewicht_kg - LAG(...).",
        ],
        points: 30,
      },
      {
        title: "Kalorienparadox",
        narrative:
          "FitCore erfasst verbrannte Kalorien pro Workout. Berechne die Kalorieneffizienz (kalorien_verbrannt / dauer_min) für alle Workouts. Wenn alle Nutzer denselben Wert haben, sind die Daten generiert.",
        referenceQuery:
          "SELECT n.name, w.datum, w.dauer_min, w.kalorien_verbrannt, ROUND(CAST(w.kalorien_verbrannt AS REAL) / w.dauer_min, 2) AS kalorien_pro_minute FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id WHERE w.kalorien_verbrannt IS NOT NULL ORDER BY kalorien_pro_minute DESC;",
        hiddenTestQuery:
          "SELECT n.name, ROUND(CAST(w.kalorien_verbrannt AS REAL) / w.dauer_min, 2) AS rate FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id WHERE w.kalorien_verbrannt IS NOT NULL ORDER BY rate DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Alle Raten liegen zwischen 6,67 und 7,78 kcal/min — eine unnatürlich enge Spanne für verschiedene Nutzer mit unterschiedlichen Körpern und Trainingsintensitäten. Ein Mensch mit 90 kg verbrennt deutlich mehr als eine mit 55 kg. FitCore normalisiert die Daten auf einen Zielkorridor.",
        hints: [
          "Berechne CAST(w.kalorien_verbrannt AS REAL) / w.dauer_min als Effizienzwert.",
          "Filtere auf WHERE w.kalorien_verbrannt IS NOT NULL.",
        ],
        points: 35,
      },
      {
        title: "BMI-Widerspruch",
        narrative:
          "Der staatliche BMI-Score bestimmt Credits. Berechne den echten BMI aus Körpergröße und aktuellem Gewicht: gewicht_kg / (groesse_cm/100)². Vergleiche ihn mit dem offiziellen FitCore-Profil.",
        referenceQuery:
          "SELECT n.name, n.groesse_cm, kd.datum, kd.gewicht_kg, ROUND(kd.gewicht_kg / ((CAST(n.groesse_cm AS REAL) / 100) * (CAST(n.groesse_cm AS REAL) / 100)), 1) AS bmi FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id ORDER BY bmi DESC, n.name;",
        hiddenTestQuery:
          "SELECT n.name, kd.datum, ROUND(kd.gewicht_kg / ((CAST(n.groesse_cm AS REAL) / 100) * (CAST(n.groesse_cm AS REAL) / 100)), 1) AS bmi FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id ORDER BY bmi DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "David Maier (BMI 26,3), Tim Becker (24,2), Oliver Neumann (23,5) — alle im 'Normalbereich' nach FitCore. Lena Krause (BMI 21,1). Die BMI-Werte sind gleichmäßig — zu gleichmäßig. FitCore zieht jeden in den 'grünen Bereich', unabhängig von echten Messwerten.",
        hints: [
          "Berechne BMI mit gewicht_kg / ((groesse_cm / 100.0) * (groesse_cm / 100.0)).",
          "Nutze CAST(n.groesse_cm AS REAL) fuer Dezimaldivision.",
        ],
        points: 35,
      },
      {
        title: "Wochenmuster",
        narrative:
          "FitCore generiert Workout-Einträge mit verdächtig gleichmäßigem Wochenmuster. Nummeriere die Workouts jedes Nutzers chronologisch mit ROW_NUMBER() OVER (PARTITION BY nutzer_id ORDER BY datum). Das zeigt, ob die Frequenz zu regelmäßig ist.",
        referenceQuery:
          "SELECT n.name, w.datum, w.dauer_min, w.kalorien_verbrannt, ROW_NUMBER() OVER (PARTITION BY w.nutzer_id ORDER BY w.datum) AS workout_nummer FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id ORDER BY n.name, w.datum;",
        hiddenTestQuery:
          "SELECT n.name, w.datum, ROW_NUMBER() OVER (PARTITION BY w.nutzer_id ORDER BY w.datum) AS nr FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id ORDER BY n.name, w.datum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Jeder Nutzer hat exakt 2–3 Workouts im Abstand von 7–9 Tagen. Tim Becker: 15.01., 24.01., 02.02. — immer 9 Tage. Nina Schmitz: 16.01., 25.01., 03.02. — immer 9 Tage. Ein Mensch hat keinen perfekten 9-Tage-Trainingsrhythmus. FitCore generiert Einträge nach einem festen Template.",
        hints: [
          "Nutze ROW_NUMBER() OVER (PARTITION BY w.nutzer_id ORDER BY w.datum).",
          "Sortiere nach n.name und w.datum fuer eine chronologische Ansicht.",
        ],
        points: 40,
      },
      {
        title: "Phantommessungen",
        narrative:
          "FitCore generiert Körperdaten auch für Monate, in denen keine Workouts stattfanden. Finde alle Körpermessungen, für die der Nutzer im selben Monat kein Workout hat — mit einer CTE und STRFTIME.",
        referenceQuery:
          "WITH mess_monate AS (SELECT nutzer_id, STRFTIME('%Y-%m', datum) AS monat, COUNT(*) AS messungen FROM koerperdaten GROUP BY nutzer_id, STRFTIME('%Y-%m', datum)) SELECT n.name, mm.monat, mm.messungen FROM mess_monate mm JOIN nutzer n ON mm.nutzer_id = n.id WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.nutzer_id = mm.nutzer_id AND STRFTIME('%Y-%m', w.datum) = mm.monat) ORDER BY mm.monat, n.name;",
        hiddenTestQuery:
          "WITH mm AS (SELECT nutzer_id, STRFTIME('%Y-%m', datum) AS monat FROM koerperdaten GROUP BY nutzer_id, STRFTIME('%Y-%m', datum)) SELECT n.name, mm.monat FROM mm JOIN nutzer n ON mm.nutzer_id = n.id WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.nutzer_id = mm.nutzer_id AND STRFTIME('%Y-%m', w.datum) = mm.monat) ORDER BY mm.monat, n.name;",
        hiddenTestMode: "rows",
        completionNarrative:
          "März 2024: Alle 8 Nutzer haben Körpermessungen — aber kein einziges Workout. FitCore hat Messungen generiert, ohne dass jemand trainiert hat. Phantom-Datenpunkte für den BMI-Score. Im Februar fehlen bei 4 Nutzern Workouts, trotz Körpermessungen.",
        hints: [
          "Erstelle eine CTE mess_monate mit STRFTIME('%Y-%m', datum).",
          "Pruefe mit NOT EXISTS, ob ein Workout in diesem Monat existiert.",
        ],
        points: 45,
      },
      {
        title: "Workout ohne Körperdaten",
        narrative:
          "Umgekehrter Fall: Gibt es Monate mit Workouts, aber ohne Körperdaten? Finde alle Workout-Monate ohne entsprechende Körpermessungen — correlated Subquery mit NOT EXISTS.",
        referenceQuery:
          "SELECT n.name, STRFTIME('%Y-%m', w.datum) AS monat, COUNT(*) AS workouts FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id WHERE NOT EXISTS (SELECT 1 FROM koerperdaten kd WHERE kd.nutzer_id = w.nutzer_id AND STRFTIME('%Y-%m', kd.datum) = STRFTIME('%Y-%m', w.datum)) GROUP BY w.nutzer_id, n.name, STRFTIME('%Y-%m', w.datum) ORDER BY n.name, monat;",
        hiddenTestQuery:
          "SELECT n.name, STRFTIME('%Y-%m', w.datum) AS monat FROM workouts w JOIN nutzer n ON w.nutzer_id = n.id WHERE NOT EXISTS (SELECT 1 FROM koerperdaten kd WHERE kd.nutzer_id = w.nutzer_id AND STRFTIME('%Y-%m', kd.datum) = STRFTIME('%Y-%m', w.datum)) GROUP BY w.nutzer_id, n.name, STRFTIME('%Y-%m', w.datum);",
        hiddenTestMode: "rows",
        completionNarrative:
          "Keine Treffer — alle Workout-Monate haben entsprechende Körperdaten. Aber der Umkehrfall (Kapitel 5) zeigt Messungen ohne Workouts. FitCore erzeugt Körpermessungen proaktiv — auch wenn niemand trainiert. Der Algorithmus füllt die Matrix, nicht die Nutzer.",
        hints: [
          "Nutze NOT EXISTS mit einer korrelierten Subquery auf koerperdaten.",
          "Vergleiche STRFTIME('%Y-%m', w.datum) = STRFTIME('%Y-%m', kd.datum).",
        ],
        points: 50,
      },
      {
        title: "Null Day",
        narrative:
          "Der abschließende Beweis: Erstelle ein vollständiges Profil jedes Nutzers in einer Multi-CTE-Query — mit Durchschnitts-BMI, Workout-Anzahl, Kalorieneffizienz und ob Phantom-Messungen existieren. Das ist die vollständige Manipulations-Beweiskette.",
        referenceQuery:
          "WITH bmi_profil AS (SELECT kd.nutzer_id, ROUND(AVG(kd.gewicht_kg / ((CAST(n.groesse_cm AS REAL) / 100) * (CAST(n.groesse_cm AS REAL) / 100))), 1) AS avg_bmi FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id GROUP BY kd.nutzer_id), workout_stats AS (SELECT nutzer_id, COUNT(*) AS workouts, ROUND(AVG(CAST(kalorien_verbrannt AS REAL) / dauer_min), 2) AS avg_kcal_min FROM workouts WHERE kalorien_verbrannt IS NOT NULL GROUP BY nutzer_id), phantom_check AS (SELECT DISTINCT kd.nutzer_id FROM koerperdaten kd WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.nutzer_id = kd.nutzer_id AND STRFTIME('%Y-%m', w.datum) = STRFTIME('%Y-%m', kd.datum))) SELECT n.name, bp.avg_bmi, ws.workouts, ws.avg_kcal_min, CASE WHEN pc.nutzer_id IS NOT NULL THEN 'JA' ELSE 'NEIN' END AS phantom_messung FROM nutzer n JOIN bmi_profil bp ON n.id = bp.nutzer_id JOIN workout_stats ws ON n.id = ws.nutzer_id LEFT JOIN phantom_check pc ON n.id = pc.nutzer_id ORDER BY bp.avg_bmi DESC;",
        hiddenTestQuery:
          "WITH bp AS (SELECT kd.nutzer_id, ROUND(AVG(kd.gewicht_kg / ((CAST(n.groesse_cm AS REAL) / 100) * (CAST(n.groesse_cm AS REAL) / 100))), 1) AS avg_bmi FROM koerperdaten kd JOIN nutzer n ON kd.nutzer_id = n.id GROUP BY kd.nutzer_id), ws AS (SELECT nutzer_id, COUNT(*) AS workouts FROM workouts GROUP BY nutzer_id) SELECT n.name, bp.avg_bmi, ws.workouts FROM nutzer n JOIN bp ON n.id = bp.nutzer_id JOIN ws ON n.id = ws.nutzer_id ORDER BY bp.avg_bmi DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Der Beweis ist vollständig: Alle 8 Nutzer haben Phantom-Messungen (März 2024 ohne Workouts). Die Kalorieneffizienz ist für alle verdächtig ähnlich (6,7–7,8). BMI-Werte liegen alle im 'Normalbereich' — statistisch unmöglich ohne Manipulation. FitCore ist eine Datenfälschungsmaschine. Null Day ist heute.",
        hints: [
          "Erstelle drei CTEs: bmi_profil, workout_stats und phantom_check.",
          "Verbinde alle drei mit nutzer und nutze LEFT JOIN fuer phantom_check.",
          "Nutze CASE WHEN pc.nutzer_id IS NOT NULL THEN 'JA' ELSE 'NEIN' fuer den Phantom-Status.",
        ],
        points: 55,
      },
    ],
    outro:
      "Null Day abgeschlossen. Die vollständige Beweiskette ist dokumentiert: generierte Körperdaten, manipulierte Kalorieneffizienz, gleichmäßige BMI-Kurven, Phantom-Messungen ohne Workouts. FitCore ist kein Fitness-Tracker — er ist ein Kontrollsystem. Die Daten gehen an die Öffentlichkeit.",
    tags: ["Story", "Window Functions", "CTE", "LAG", "Subquery", "CASE"],
  })
);
