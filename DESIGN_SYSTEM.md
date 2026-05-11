# SQL-Trainer Design-System

Dieses Dokument beschreibt das Design-System der SQL-Trainer MySQL-Lernplattform. Es ist als **lebendige Referenz** fuer Entwickler und Designer gedacht und wird mit jeder Komponenten-Aenderung aktualisiert.

> **Status:** Aktuell | **Sprache:** TypeScript / React / Tailwind CSS v4

---

## Inhaltsverzeichnis

1. [Philosophie](#philosophie)
2. [Farbpalette](#farbpalette)
3. [Typografie](#typografie)
4. [Komponenten](#komponenten)
5. [Animationen](#animationen)
6. [Testing-Strategie](#testing-strategie)
7. [Getting Started](#getting-started)

---

## Philosophie

- **Minimal aber differenzierend:** Das UI unterscheidet sich von Lernplattformen wie SQL-ZOO durch moderne Interaktionen, sanfte Animationen und eine aufgeraeumte visuelle Hierarchie.
- **Gamification-ready:** Animationen (FadeIn, ScaleOnHover, AnimatedList) sind so konzipiert, dass sie Belohnungsmomente und Fortschrittsfeedback unterstuetzen koennen.
- **Local-Storage-First:** Kein Login-Fluss; UI-Zustaende (Theme, Fortschritt) werden im Browser persistiert.
- **Vercel-ready:** Statischer Export (`output: "export"`) fuer serverloses Deployment.

---

## Farbpalette

Alle Farben sind als **CSS-Custom-Properties** im Design-System hinterlegt und werden ueber Tailwind-Utility-Klassen konsumiert.

### Primaer (Indigo)

`primary-50` … `primary-950` – Wird fuer Haupt-CTAs, aktive Navigationselemente und Fokusringe verwendet.

### Akzent (Teal)

`accent-50` … `accent-950` – Wird fuer Erfolgszustaende, Highlights und gamifizierte Belohnungen genutzt.

### Surface & Ink

| Token            | Verwendung                                      |
| ---------------- | ----------------------------------------------- |
| `bg-surface`     | Haupt-Seitenhintergrund                         |
| `bg-surface-dim` | Sekundaere Flaechen (Karten, Button-Secondary)  |
| `text-ink`       | Primaerer Text                                  |
| `text-ink-muted` | Beschreibungen, Platzhalter, sekundaere Inhalte |

### Semantische Farben

| Token     | Bedeutung          | Beispielverwendung                  |
| --------- | ------------------ | ----------------------------------- |
| `success` | Erfolg / Bestanden | Level-Abschluss, korrekte Antwort   |
| `warning` | Warnung            | Unvollstaendiger Fortschritt        |
| `error`   | Fehler             | Validierungsfehler, falsche Antwort |
| `info`    | Information        | Hinweistexte, Tooltips              |

---

## Typografie

- **Schriftart:** [Inter](https://rsms.me/inter/) (via `next/font/local`, selbstgehostet)
- **Gewichte:** 400–900
- **Strategie:** Enger Zeichenabstand (`tracking-tight`) fuer Ueberschriften; lockere Zeilenhoehe fuer Fliesstext.
- **HTML-Locale:** `lang="de"` im Root-Layout fuer korrekte Silbentrennung und Screenreader.

---

## Komponenten

### `Button`

Hauptinteraktionskomponente mit vier Varianten und drei Groessen.

- **Varianten:** `primary` | `secondary` | `accent` | `ghost`
- **Groessen:** `sm` | `md` | `lg`
- **States:** `disabled`, `isLoading` (rendert Spinner, deaktiviert Button)
- **Barrierefreiheit:** Fokusring via `focus-visible`, ARIA-Label wird automatisch vom Kind-Text uebernommen.

**Verwendung:**

```tsx
import { Button } from "@/components/button";

<Button variant="accent" size="lg" onClick={handleStart}>
  Uebung starten
</Button>;
```

### `Input`

Formularfeld mit Label, Fehler-Status und Hilfstext.

- **Props:** `label`, `error`, `helperText`
- **Barrierefreiheit:** Automatische `id` (via `React.useId`), `aria-invalid`, `aria-describedby`

**Verwendung:**

```tsx
<Input
  label="E-Mail"
  placeholder="max@beispiel.de"
  error={!isValid}
  helperText={!isValid ? "Bitte gib eine gueltige E-Mail ein." : undefined}
/>
```

### `Card`

Container fuer Inhaltsbloecke mit drei Varianten.

- **Varianten:** `default` (mit Schatten), `flat` (kein Schatten), `outlined` (farbiger Rahmen)

**Verwendung:**

```tsx
<Card variant="outlined">
  <h4>Level 3</h4>
  <p>JOIN-Abfragen meistern</p>
</Card>
```

### `Container`

Max-Width-Wrapper mit responsivem Padding.

- **Standard:** `max-w-7xl`, `px-4 sm:px-6 lg:px-8`
- **Polymorph:** Unterstuetzung von `as`-Prop (`section`, `article`, etc.)

### `Logo`

Statisches Logo mit kompaktem Modus.

```tsx
<Logo compact />   // Zeigt nur "V" (Mobile-Header)
<Logo />            // Zeigt "SQL-Trainer" (Desktop-Header)
```

---

## Animationen

Alle Animationen basieren auf [Framer Motion](https://www.framer.com/motion/) und sind als "use client"-Komponenten ausgefuehrt.

### `FadeIn`

Fade + Slide beim Scrollen in den Viewport (einmalig, `viewport.once`).

**Parameter:** `direction` (up/down/left/right), `delay`, `duration`

### `ScaleOnHover`

Subtile Skalierung bei Hover/Tap – ideal fuer klickbare Karten oder Belohnungsbadges.

**Parameter:** `scale` (Standard: `1.02`)

### `AnimatedList`

Stagger-Animation fuer listenartige Inhalte. Jedes Kind erscheint nacheinander mit `staggerChildren`.

**Parameter:** `stagger` (Standard: `0.08`)

---

## Testing-Strategie

| Ebene     | Tool                             | Abdeckung                                                       |
| --------- | -------------------------------- | --------------------------------------------------------------- |
| Unit      | Vitest + jsdom + Testing Library | Komponenten (`Button`, `Input`, `Card`, …) und Utilities (`cn`) |
| E2E/Smoke | Playwright (Chromium)            | Landing-Page-Render, visuelle Integritaet                       |
| Lint      | ESLint (Next.js Flat-Config)     | Codequalitaet, Regelverstoesse                                  |

### Test-Skripte

```bash
npm run test        # Unit-Tests (Vitest)
npm run test:e2e    # E2E-Smoke-Tests (Playwright)
npm run lint        # ESLint
npm run build       # Statischer Export + TypeScript-Check
```

### Vitest-Konfiguration

- **Environment:** `jsdom` (DOM ohne echten Browser)
- **Globals:** `describe` / `it` / `expect` ohne Import verfuegbar
- **Setup-File:** `vitest.setup.ts` laedt `@testing-library/jest-dom` Matchers (`toBeInTheDocument`, `toBeDisabled`, ...)
- **Coverage:** V8-Reporter mit Text/HTML/JSON-Ausgabe

### Playwright-Konfiguration

- **Server:** Automatischer Start via `npx serve out -l 4000`
- **Screenshot:** Bei Fehler automatisch (trace on first retry)
- **CI-Modus:** `forbidOnly`, `retries: 2`, `workers: 1`

---

## Getting Started

### Abhaengigkeiten installieren

```bash
npm install
```

### Unit-Tests ausfuehren

```bash
npm run test
```

### E2E-Tests ausfuehren (erfordert vorherigen Build)

```bash
npm run build
npm run test:e2e
```

### Statischen Export bauen

```bash
npm run build   # Output: ./out/
```

---

## Aenderungshistorie

| Datum      | Autor | Aenderung                                       |
| ---------- | ----- | ----------------------------------------------- |
| 2026-05-05 | CTO   | DESIGN_SYSTEM.md erstellt und Tests finalisiert |
