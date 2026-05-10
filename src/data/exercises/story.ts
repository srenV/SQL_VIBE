/**
 * Story/Game-Modus: SQL Agent – Ermittlungs-Faelle.
 *
 * Jeder Fall hat ein narratives Szenario mit mehreren Kapiteln.
 * Die Lernenden muessen SQL-Queries schreiben, um Hinweise zu finden
 * und den Fall zu loesen. Die Kapitel werden nacheinander freigeschaltet.
 */
import { makeStoryExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";

export const storyExercises: Exercise[] = [];
resetCounter();

storyExercises.push(
  makeStoryExercise("str", {
    title: "Der Fall des verschwundenen Entwicklers",
    description:
      "Ein Senior Developer ist spurlos verschwunden. Durchsuche die HR-Datenbank, um Hinweise zu finden und den Fall zu klaeren.",
    difficulty: "junior",
    category: "Story",
    datasetId: "hr",
    scenarioTitle: "Der Fall des verschwanden Entwicklers",
    intro:
      "Es ist Montagmorgen, 8:00 Uhr. Anna Schmidt, Senior Developer der Entwicklung, hat sich seit drei Tagen nicht gemeldet. Keine E-Mails, keine Slack-Nachrichten, ihr Buero ist leer. Das Management ist besorgt – sie hatte Zugang zu kritischen Systemen. Die Polizei braucht deine Hilfe: Durchsuche die HR-Datenbank nach Hinweisen. Wer war zuletzt mit ihr in Kontakt? Gibt es Auffaelligkeiten in ihren Urlaubsantraegen? Finde heraus, was passiert ist.",
    chapters: [
      {
        title: "Die erste Spur",
        narrative:
          "Dein erster Auftrag: Finde heraus, wer Anna Schmidt ist und in welcher Abteilung sie arbeitet. Wie heisst ihr Vorgesetzter? Schreibe eine Query, die Annas Mitarbeiterdaten und die dazugehoerige Abteilung anzeigt.",
        referenceQuery:
          "SELECT m.name AS mitarbeiter, a.name AS abteilung, m.position, m.gehalt FROM mitarbeiter m JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.name = 'Anna Schmidt';",
        hiddenTestQuery:
          "SELECT m.name AS mitarbeiter, a.name AS abteilung FROM mitarbeiter m JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.name = 'Anna Schmidt';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Anna Schmidt, Senior Developer in der Entwicklung. Ihr Gehalt: 72.000 Euro. Aber wer ist ihr Vorgesetzter? Die manager_id-Spalte zeigt, dass sie keine direkte Fuehrungskraft hat – sie steht ganz oben in der Hierarchie der Entwicklung. Vielleicht gibt es jemanden, der ihr nahe steht...",
        hints: [
          "Verbinde die Tabelle mitarbeiter mit abteilungen ueber die abteilung_id.",
          "Filtere auf den Namen 'Anna Schmidt'.",
        ],
        points: 20,
      },
      {
        title: "Der Kollege unter Verdacht",
        narrative:
          "Interessant: Anna hat keine manager_id, aber Ben Mueller (id=2) hat manager_id=1 – er scheint Anna direkt unterstellt zu sein. Pruefe: Hat Ben in letzter Zeit Urlaub beantragt? Und wurden seine Antraege genehmigt oder abgelehnt? Finde alle Urlaubsantraege von Ben Mueller.",
        referenceQuery:
          "SELECT u.*, m.name AS mitarbeiter FROM urlaub u JOIN mitarbeiter m ON u.mitarbeiter_id = m.id WHERE m.name = 'Ben Mueller' ORDER BY u.startdatum;",
        hiddenTestQuery:
          "SELECT u.startdatum, u.enddatum, u.tage, u.genehmigt FROM urlaub u JOIN mitarbeiter m ON u.mitarbeiter_id = m.id WHERE m.name = 'Ben Mueller';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Auffaellig: Ben Mueller hat einen Urlaubsantrag vom 15.07.2024 bis 20.07.2024 (6 Tage), der genehmigt wurde. Aber Anna verschwand am Wochenende davor! Hat Ben vielleicht gewusst, dass Anna nicht kommen wuerde? Wir muessen genauer pruefen...",
        hints: [
          "Verbinde urlaub mit mitarbeiter ueber mitarbeiter_id.",
          "Filtere auf Bens Namen und sortiere nach Datum.",
        ],
        points: 25,
      },
      {
        title: "Verdaechtige Bewerbungen",
        narrative:
          "Die Ermittlungen werden intensiver: Anna hatte Zugang zu kritischen Systemen. Falls jemand ihren Platz einnehmen wollte, haette derjenige sich kurz vor ihrem Verschwinden beworben. Finde alle Bewerbungen fuer die Abteilung 'Entwicklung' (id=1), die nach dem 01.01.2024 eingegangen sind, sortiert nach Datum.",
        referenceQuery:
          "SELECT b.name, b.email, b.bewerbungsdatum, b.status, a.name AS abteilung FROM bewerbungen b JOIN abteilungen a ON b.abteilung_id = a.id WHERE b.abteilung_id = 1 AND b.bewerbungsdatum >= '2024-01-01' ORDER BY b.bewerbungsdatum;",
        hiddenTestQuery:
          "SELECT b.name, b.bewerbungsdatum, b.status FROM bewerbungen b WHERE b.abteilung_id = 1 AND b.bewerbungsdatum >= '2024-01-01' ORDER BY b.bewerbungsdatum;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drei Bewerbungen fuer die Entwicklung: Paul Schmitz (eingegangen am 10.01.), Tom Meier (abgelehnt am 01.02.) und Noah Berger (angebot am 20.04.). Noah Berger hat ein Angebot erhalten – genau in dem Zeitraum, als Anna verschwand. Zufall? Der Fall spitzt sich zu...",
        hints: [
          "Filtere bewerbungen auf abteilung_id = 1 (Entwicklung).",
          "Begrenze auf Bewerbungsdatum >= '2024-01-01' und sortiere aufsteigend.",
        ],
        points: 25,
      },
      {
        title: "Die Aufloesung",
        narrative:
          "Du hast alle Hinweise zusammengetragen. Finde heraus, wie viele Mitarbeiter der Entwicklung (abteilung_id=1) aktuell im Unternehmen sind und wie viel Gehalt insgesamt in diese Abteilung fliesst. Ist die Abteilung unterbesetzt?",
        referenceQuery:
          "SELECT COUNT(*) AS anzahl, SUM(gehalt) AS gesamtgehalt FROM mitarbeiter WHERE abteilung_id = 1;",
        hiddenTestQuery:
          "SELECT COUNT(*) AS anzahl, SUM(gehalt) AS gesamtgehalt FROM mitarbeiter WHERE abteilung_id = 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Fall geloest! Die Entwicklung hat 3 Mitarbeiter mit einem Gesamtgehalt von 175.000 Euro. Anna ist verschwunden, aber es gibt keine Anzeichen fuer ein Verbrechen – ihre Urlaubsantraege zeigen, dass ihr letzter Urlaub genehmigt war... und wartet, sie hat gar keinen Urlaub beantragt! Vielleicht ist Anna einfach im Homeoffice. Fall vorlaeufig geschlossen, aber die Ermittlungen gehen weiter...",
        hints: [
          "Zaehle die Mitarbeiter in der Entwicklung mit COUNT(*) und summiere die Gehaelter mit SUM(gehalt).",
          "Filtere auf abteilung_id = 1.",
        ],
        points: 30,
      },
    ],
    outro:
      "Herzlichen Glueckwunsch! Du hast den Fall des verschwundenen Entwicklers geloest – obwohl er nicht ganz so dramatisch endete wie erwartet. Anna ist wahrscheinlich nur im Homeoffice. Aber du hast bewiesen, dass du mit SQL Ermittlungen anstellen kannst!\n\nIm naechsten Fall wird es spannender...",
    tags: ["Story", "JOIN", "WHERE", "Aggregation"],
  }),

  makeStoryExercise("str", {
    title: "Der Betrugsfall im Online-Shop",
    description:
      "Verdaechtige Zahlungen sind im Online-Shop aufgetaucht. Finde den Betrogenen und den Tater durch SQL-Abfragen.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "shop",
    scenarioTitle: "Der Betrugsfall im Online-Shop",
    intro:
      "Die Buchhaltung hat Alarm geschlagen: Mehrere Storno-Bestellungen und ungewoehnliche Zahlungen. Der Shop-Besitzer vermutet insider-Betrug. Jemand hat Scheinbestellungen aufgegeben und Zahlungen manipuliert. Du bekommst Zugang zur Shop-Datenbank – finde den Tater!",
    chapters: [
      {
        title: "Verdaechtige Stornos",
        narrative:
          "Erste Hinweise: Es gibt Bestellungen mit dem Status 'storniert'. Finde alle stornierten Bestellungen mit Kundenname, Bestelldatum und Gesamtbetrag. Wer hat storniert?",
        referenceQuery:
          "SELECT b.id AS bestellung_id, k.name AS kunde, b.datum, b.gesamtbetrag FROM bestellungen b JOIN kunden k ON b.kunde_id = k.id WHERE b.status = 'storniert' ORDER BY b.gesamtbetrag DESC;",
        hiddenTestQuery:
          "SELECT k.name, b.datum, b.gesamtbetrag FROM bestellungen b JOIN kunden k ON b.kunde_id = k.id WHERE b.status = 'storniert';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Sarah Keller hat eine stornierte Bestellung ueber 599 Euro (Bestellung #8, datiert 08.03.2024). Und es gab eine dazugehoerige Kreditkartenzahlung. Aber warum storniert, wenn die Zahlung bereits erfolgt war? Das riecht nach Betrug...",
        hints: [
          "Verbinde bestellungen mit kunden ueber kunde_id.",
          "Filtere auf status = 'storniert' und sortiere nach gesamtbetrag absteigend.",
        ],
        points: 25,
      },
      {
        title: "Folge dem Geld",
        narrative:
          "Verdaechtig: Die Zahlung zur stornierten Bestellung wurde trotzdem durchgefuehrt. Finde alle Zahlungen fuer Bestellungen, die storniert wurden – mit Zahlungsmittel und Betrag.",
        referenceQuery:
          "SELECT z.id, z.bestellung_id, z.betrag, z.zahlungsmittel, z.zahlungsdatum FROM zahlungen z JOIN bestellungen b ON z.bestellung_id = b.id WHERE b.status = 'storniert';",
        hiddenTestQuery:
          "SELECT z.betrag, z.zahlungsmittel, z.bestellung_id FROM zahlungen z JOIN bestellungen b ON z.bestellung_id = b.id WHERE b.status = 'storniert';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Genau! Die Kreditkartenzahlung ueber 599 Euro fuer Sarahs stornierte Bestellung wurde am gleichen Tag abgebucht, aber die Bestellung wurde auch storniert. Das Geld ist verschwunden! Wer hat Zugang zu diesen Daten?",
        hints: [
          "Verbinde zahlungen mit bestellungen ueber bestellung_id.",
          "Filtere auf bestellungen mit status 'storniert'.",
        ],
        points: 25,
      },
      {
        title: "Das Gesamtbild",
        narrative:
          "Jetzt muss das Gesamtbild analysiert werden: Wie hoch ist der Gesamtumsatz pro Zahlungsart, und wie viel davon ist storniert? Finde den Umsatz pro Zahlungsart und den Anteil der Stornos.",
        referenceQuery:
          "SELECT b.status, z.zahlungsmittel, SUM(z.betrag) AS umsatz, COUNT(*) AS anzahl FROM bestellungen b JOIN zahlungen z ON b.id = z.bestellung_id GROUP BY b.status, z.zahlungsmittel ORDER BY umsatz DESC;",
        hiddenTestQuery:
          "SELECT b.status, z.zahlungsmittel, SUM(z.betrag) AS umsatz FROM bestellungen b JOIN zahlungen z ON b.id = z.bestellung_id GROUP BY b.status, z.zahlungsmittel;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Fall geloest! Der Betrug war ein Insider-Angriff: Jemand mit Zugang zum Zahlungssystem hat Bestellungen storniert, aber die Zahlungen nicht zurueckerstattet. Kreditkarten-Zahlungen ueber 599 Euro wurden doppelt gebucht. Die Spur fuehrt zu einer Person mit Admin-Zugang. Der Fall wird an die Polizei uebergeben!",
        hints: [
          "Verbinde bestellungen mit zahlungen und gruppiere nach status und zahlungsmittel.",
          "Benutze SUM(betrag) und COUNT(*), aggregiert nach status und zahlungsmittel.",
        ],
        points: 30,
      },
    ],
    outro:
      "Hervorragende Arbeit, Detektiv! Du hast den Betrugsfall im Online-Shop aufgeklaert. Durch geschicktes Verbinden von Bestellungs-, Zahlungs- und Kundendaten hast du den Tater ueberfuehrt. Die Geschaeftsfuehrung dankt dir!\n\nBereit fuer den naechsten Fall?",
    tags: ["Story", "JOIN", "Aggregation", "GROUP BY"],
  }),

  makeStoryExercise("str", {
    title: "Sabotage im Ticketsystem",
    description:
      "Jemand manipuliert die Support-Tickets. Finde den Tater und beweise die Sabotage mit SQL.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "tickets",
    scenarioTitle: "Sabotage im Ticketsystem",
    intro:
      "Der IT-Support steht Kopf: Kritische Tickets werden ploetzlich geschlossen, Prioritaeten werden geaendert, und Kommentare verschwinden. Die Teamleitung vermutet Sabotage von innen. Jemand mischt das Ticketsystem durcheinander, um wichtige Probleme zu vertuschen. Du hast Zugriff auf die Tickets-Datenbank – finde heraus, wer dahintersteckt!",
    chapters: [
      {
        title: "Verdaechtige Tickets",
        narrative:
          "Erster Hinweis: Alle kritischen Tickets muessen gefunden werden. Zeige alle Tickets mit Prioritaet 'kritisch' – wie viele sind es und welcher Status haben sie?",
        referenceQuery:
          "SELECT id, titel, status, prioritaet, kategorie_id FROM tickets WHERE prioritaet = 'kritisch' ORDER BY id;",
        hiddenTestQuery:
          "SELECT id, titel, status, prioritaet FROM tickets WHERE prioritaet = 'kritisch';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Fuenf Tickets mit Prioritaet 'kritisch' – aber drei davon sind bereits geschlossen oder in Bearbeitung. Das sind ungewoehnlich viele kritische Tickets, die so schnell bearbeitet wurden. Wer hat sie geschlossen?",
        hints: [
          "Filtere tickets auf prioritaet = 'kritisch'.",
          "Ordne nach id, um einen klaren Ueberblick zu bekommen.",
        ],
        points: 20,
      },
      {
        title: "Die Spur der Kommentare",
        narrative:
          "Jemand hat Kommentare hinterlassen, die auf Sabotage hindeuten. Finde alle Kommentare, die von einem Autor erstellt wurden, der mehr als 2 Kommentare verfasst hat. Wer kommentiert am haefigsten?",
        referenceQuery:
          "SELECT autor, COUNT(*) AS anzahl FROM kommentare GROUP BY autor HAVING COUNT(*) > 2 ORDER BY anzahl DESC;",
        hiddenTestQuery:
          "SELECT autor, COUNT(*) AS anzahl FROM kommentare GROUP BY autor HAVING COUNT(*) > 2;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Aha! Tom Billing hat die meisten Kommentare verfasst – er ist sowohl beim Zahlungswesen als auch bei kritischen Tickets aktiv. Und seine Kommentare erscheinen oft genau dann, wenn wichtige Tickets geaendert werden. Ist Tom der Saboteur?",
        hints: [
          "Gruppiere kommentare nach autor und zaehle mit COUNT(*).",
          "Filtere mit HAVING auf mehr als 2 Kommentare.",
        ],
        points: 25,
      },
      {
        title: "Das Alibi pruefen",
        narrative:
          "Um Tom Billings Schuld zu beweisen oder zu widerlegen: Zeige alle Tickets mit ihren Kommentaren (LEFT JOIN), sortiert nach Ticket-ID. Welche Tickets haben Kommentare von Tom?",
        referenceQuery:
          "SELECT t.id AS ticket_id, t.titel, t.status, k.autor, k.nachricht FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id ORDER BY t.id, k.id;",
        hiddenTestQuery:
          "SELECT t.id, t.titel, t.status FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id ORDER BY t.id;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Tom Billings Kommentare konzentrieren sich auf genau die kritischen Tickets, die auffaellig schnell geaendert wurden! Er hat auf 3 von 5 kritischen Tickets kommentiert. Die Evidenz ist erdrueckend: Tom hat versucht, kritische Probleme zu vertuschen, indem er sie kommentarlos schloss oder Prioritaetsaenderungen vornahm.",
        hints: [
          "Verbinde tickets mit kommentare ueber id resp. ticket_id.",
          "Benutze LEFT JOIN, um auch Tickets ohne Kommentare zu zeigen.",
        ],
        points: 30,
      },
    ],
    outro:
      "Fall aufgeklaert! Tom Billing hat systematisch kritische Tickets manipuliert, um Probleme zu vertuschen. Die Teamleitung wird Massnahmen ergreifen. Deine SQL-Skills haben geholfen, Sabotage nachzuweisen!\n\nDu bist jetzt ein echter SQL-Detektiv. Versuche die anderen Story-Faelle, falls du noch welche verpasst hast!",
    tags: ["Story", "WHERE", "JOIN", "GROUP BY", "HAVING"],
  })
);