# SQL-Trainer – MySQL-Lernplattform (Deutsche Dokumentation)

Interaktive MySQL-Lernplattform mit Uebungen, Erklaerungen und Gamification-Funktionen. Ohne Login, ohne Server – Fortschritte werden ausschliesslich im Browser-`localStorage` gespeichert.

## Einrichtung

```bash
npm install
npm run dev
# Oeffne http://localhost:3000
```

## Skripte

| Skript                 | Beschreibung                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Entwicklungsserver (Next.js + Turbopack)         |
| `npm run build`        | Produktions-Build mit Statischem Export (`out/`) |
| `npm run lint`         | ESLint Pruefung                                  |
| `npm run lint:fix`     | Automatische Lint-Fixes                          |
| `npm run format`       | Prettier Formatierung                            |
| `npm run check-format` | Prettier Format-Check                            |
| `npm run test`         | Vitest Test-Suite                                |

## Projektstruktur

- `src/app` : Next.js App Router (Seiten, Layout, globales CSS)
- `src/components` : Wiederverwendbare React-Komponenten (Button, Card, Input, etc.)
- `src/lib` : Utility-Funktionen (`cn`-Helper, String-Validierung)
- `src/types` : Zentrale TypeScript-Typdefinitionen
- `e2e` : Playwright-End-to-End-Tests (visueller Smoke-Test)

## Security & Datenschutz

- Keine API-Routen – reiner Static Export.
- Keine Secrets oder API-Keys im Client-Code.
- Kein `dangerouslySetInnerHTML` oder `eval()` auf Benutzereingaben.
- Zero-PII: Es werden keine personenbezogenen Daten erfasst.

## Build & Test

```bash
npm run build   # Statischer Export nach out/
npm run lint    # 0 Fehler erwartet
npm run test    # 100% gruen
```

## Deployment

Ziel-Plattform: **Vercel**

Konfiguration in `next.config.ts`:

- `output: 'export'` – erzeugt statische HTML-Dateien.
- `images.unoptimized: true` – notwendig bei Static Export ohne Image-Optimization-Server.

## Abhaengigkeiten (wichtigste)

- `next` – React-Framework
- `react` / `react-dom` – UI-Layer
- `framer-motion` – Animationen
- `tailwindcss` – Utility-First CSS
- `clsx` + `tailwind-merge` – Klassen-String-Verwaltung
- `vitest` + `@testing-library/jest-dom` – Unit-Tests
- `@playwright/test` – E2E-Tests

## Lizenz

Privat – SQL-Trainer Intern.
