# Security & Datenschutz — SQL VIBE

Sicherheits- und Datenschutzkonzept der SQL VIBE Lernplattform.

---

## Inhaltsverzeichnis

1. [Architektur-Sicherheit](#architektur-sicherheit)
2. [Client-Side Security](#client-side-security)
3. [CodeMirror 6 Editor Security](#codemirror-6-editor-security)
4. [Datenschutz (DSGVO)](#datenschutz-dsgvo)
5. [Datenhaltung](#datenhaltung)
6. [Supply Chain](#supply-chain)
7. [Threat Model](#threat-model)

---

## Architektur-Sicherheit

### Zero-Server-Architektur

SQL VIBE ist ein **reiner Static Export** — es gibt:

- ❌ Keine API-Routen
- ❌ Keine Server-seitige Logik
- ❌ Keine Datenbank auf dem Server
- ❌ Keine Authentifizierung
- ❌ Keine Sessions/Cookies (außer Theme)

**Vorteil:** Keine serverseitigen Angriffsvektoren (SQL Injection, SSRF, RCE, Auth Bypass).

### Deployment

- **Plattform:** Vercel (Static Hosting)
- **Build:** `next build` mit `output: "export"`
- **Auslieferung:** Statische HTML/JS/CSS/WASM-Dateien über CDN
- **Domain:** https://sql-vibe.vercel.app

---

## Client-Side Security

### XSS Prevention

| Mechanismus | Status |
|------------|--------|
| React JSX Escaping | ✅ Standard (alle `{value}` werden escaped) |
| `dangerouslySetInnerHTML` | ⚠️ Nur in statischen Kontexten (ThemeScript, JSON-LD, SCOPED_CSS) und `renderMarkdown` (mit `escapeHtml` für Code-Blöcke und Tabellen-Zellen) |
| `eval()` | ❌ Nicht verwendet |
| `innerHTML` | ⚠️ Nur in `scrambleText` (anime.js, mit `sanitizeForScramble()` gegen XSS geschützt) |

### XSS-Schutzmaßnahmen

1. **`renderMarkdown()`** in `ArticlePageClient.tsx`:
   - Code-Blöcke werden mit `escapeHtml()` escaped
   - Tabellen-Zellen werden mit `escapeHtml()` escaped
   - Kommentare werden mit `escapeHtml()` escaped

2. **`scrambleText`** in `storyIntro.tsx` und `introOverlay.tsx`:
   - Alle Texte werden vor der Übergabe an anime.js `scrambleText()` mit `sanitizeForScramble()` bereinigt
   - `sanitizeForScramble()` entfernt HTML-Tags und escaped `&`, `<`, `>`
   - `introOverlay.tsx` verwendet ausschließlich hartcodierte Texte (kein Risiko)

3. **Statische `dangerouslySetInnerHTML`**:
   - ThemeScript: Hardcoded JS, keine User-Inputs
   - JSON-LD: `JSON.stringify()` produziert sicheres JSON
   - SCOPED_CSS: Hardcoded CSS-Konstanten

### SQL-Injection im Playground

Der Playground führt **User-SQL** in einer **isolierten In-Memory sql.js-Datenbank** aus:

- Die Datenbank existiert nur im Browser-Tab
- Keine Verbindung zu externen Datenbanken
- sql.js ist ein Read-Only-WASM-Modul ohne Netzwerkzugriff
- `PRAGMA foreign_key_list` und `PRAGMA table_info` sind read-only
- Tabellennamen in PRAGMA-Queries werden mit `escapeIdentifier()` gequoted

**Risiko:** Keines — selbst destruktives SQL (`DROP TABLE`, `DELETE`) betrifft nur die lokale In-Memory-DB.

### Sandbox-Import

Die Sandbox bietet drei Import-Wege für SQL-Daten:

1. **Dropdown (18 vordefinierte Datensätze):** Statische SQL-Strings aus dem Codebase — kein Risiko.
2. **Datei-Upload (`.sql`-Datei):** User wählt Datei über `<input type="file" accept=".sql">`.
3. **Drag & Drop (`.sql`-Datei):** User zieht Datei in die Drop-Zone.

**Sicherheitsmaßnahmen:**

| Maßnahme | Details |
|----------|---------|
| Dateityp-Check | Nur `.sql`-Dateien akzeptiert (Upload + Drag & Drop) |
| Dateigrößen-Limit | Max. 5 MB — verhindert Browser-Tab-Freeze bei riesigen Dumps |
| Dateiname-Sanitizing | Illegale Zeichen (`<>:"/\|?*`), führende Punkte und Whitespace werden entfernt; max. 100 Zeichen; Fallback-Name bei leerem Ergebnis |
| SQL-Ausführung | Nur in sql.js WASM-Sandbox — kein Dateisystem-, Netzwerk- oder Systemzugriff |
| Fehlerbehandlung | SQL-Fehler werden als Fehlermeldung angezeigt, nicht als Exception |
| Kein Code-Execution | SQL-Strings werden nie durch `eval()`, `new Function()` oder `dangerouslySetInnerHTML` geschleust |

### WASM Sandbox

sql.js läuft in der Browser-WASM-Sandbox:
- Kein Dateisystem-Zugriff
- Kein Netzwerk-Zugriff
- Kein DOM-Zugriff
- Speicher ist auf den Tab beschränkt

---

## CodeMirror 6 Editor Security

### Architektur

Der SQL-Editor basiert auf **CodeMirror 6** mit folgenden Erweiterungen:

| Erweiterung | Zweck | Sicherheitsrelevanz |
|-------------|-------|---------------------|
| `@codemirror/lang-sql` | SQL-Syntax-Highlighting | ✅ Nur Darstellung, keine Ausführung |
| `@codemirror/autocomplete` | Auto-Vervollständigung | ✅ Text-basiert, kein HTML-Rendering |
| `@codemirror/commands` | Tastatur-Commands | ✅ Standard-Befehle |
| `@codemirror/search` | Suchen/Ersetzen | ✅ Standard-Suche |
| `@codemirror/view` | Editor-View | ✅ Inline-Styles (hardcoded) |
| `@codemirror/state` | Editor-State | ✅ State-Management |
| `@codemirror/language` | Bracket Matching | ✅ Nur Darstellung |

### Autocompletion Security

Die Auto-Vervollständigung verwendet eine **benutzerdefinierte Completion-Source** (`sqlCompletionSource`):

- **Keyword-Filter:** Nur ~80 SQL-Schlüsselwörter (UPPERCASE) werden vorgeschlagen
- **Schema-Aware:** Tabellen- und Spaltennamen aus der aktuellen Datenbank
- **Prefix-Matching:** Vorschläge werden nach dem aktuellen Präfix gefiltert
- **String-Erkennung:** Keine Autovervollständigung innerhalb von Strings
- **Rendering:** CodeMirror rendert Tooltips als **Text-Content**, nicht als HTML → kein XSS-Risiko
- **Toggle-Prop:** `autocompleteEnabled` erlaubt das Deaktivieren der Autovervollständigung

### Theme Security

- Alle CSS-Werte im CodeMirror-Theme sind **hardcoded** (keine dynamischen Werte)
- `position: "fixed"` und `zIndex: "9999"` auf Autocomplete-Tooltips verhindern Clipping durch Container-Overflow
- Keine injizierbaren CSS-Werte

### Linting

- `@codemirror/lint` wird **nicht** aktiv verwendet (kein `linter()` konfiguriert)
- Das `lintKeymap` wurde entfernt, da es ohne aktive Lint-Erweiterung nur tote Keybindings registriert

---

## Datenschutz (DSGVO)

### Personenbezogene Daten

| Daten | Erfasst? | Begründung |
|-------|---------|-----------|
| Name | ❌ | Kein Login |
| E-Mail | ❌ | Kein Login |
| IP-Adresse | ❌ | Static Hosting (kein Server-Logging) |
| Standort | ❌ | Kein Geo-Tracking |
| Geräte-Fingerprint | ❌ | Kein Analytics |
| Lernfortschritt | ⚠️ | Nur `localStorage` (Client-seitig) |

### Cookies & Tracking

| Typ | Verwendet? |
|-----|-----------|
| Session-Cookies | ❌ |
| Tracking-Cookies | ❌ |
| Analytics (GA, Plausible) | ❌ |
| Third-Party CDN | ❌ (Fonts sind lokal) |
| `localStorage` | ✅ `sql-trainer-progress`, `sql-trainer-theme` |

### Rechtsgrundlage

Da **keine personenbezogenen Daten** verarbeitet werden, ist keine Einwilligung erforderlich. Die `localStorage`-Nutzung fällt unter die **ePrivacy-Ausnahme** für technisch notwendige Speicherung.

---

## Datenhaltung

### localStorage Schema

```typescript
// sql-trainer-progress
{
  exercises: Record<string, {
    completed: boolean;
    bestAttempts: number;
    pointsEarned: number;
    completedAt: string | null;
  }>;
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: string[];
}

// sql-trainer-theme
"dark" | "light"
```

### Datenlöschung

- **Automatisch:** Browser-Cache-Leerung löscht `localStorage`
- **Manuell:** `useProgress().resetProgress()` löscht alle Fortschrittsdaten
- **Theme:** ThemeToggle setzt nur `"dark"` / `"light"`

---

## Supply Chain

### Dependencies

| Kategorie | Pakete | Risiko |
|-----------|--------|--------|
| **Framework** | next, react, react-dom | Niedrig (etabliert, Vercel/Meta) |
| **Styling** | tailwindcss, clsx, tailwind-merge | Niedrig |
| **Animation** | framer-motion, animejs | Niedrig |
| **SQL** | sql.js | Niedrig (WASM, keine Netzwerk-I/O) |
| **Editor** | @codemirror/autocomplete, @codemirror/commands, @codemirror/lang-sql, @codemirror/search, @codemirror/state, @codemirror/view, @codemirror/language, codemirror | Niedrig (etabliert, keine Netzwerk-I/O) |
| **Graph** | @xyflow/react, dagre | Niedrig |
| **i18n** | next-intl | Niedrig |
| **Fonts** | Inter (lokal), JetBrains Mono (lokal) | Kein (lokal gehostet, kein CDN) |
| **Testing** | vitest, playwright, testing-library | Dev-only |

### Audit

```bash
npm audit          # Regelmäßig ausführen
npm audit fix      # Auto-Fix für bekannte CVEs
```

---

## Threat Model

### Angriffsvektoren (STRIDE)

| Kategorie | Vektor | Risiko | Mitigation |
|-----------|--------|--------|-----------|
| **Spoofing** | — | Kein | Kein Login |
| **Tampering** | Manipulation localStorage | Niedrig | Nur Client-seitig, kein Schaden |
| **Repudiation** | — | Kein | Keine Aktionen die Logging erfordern |
| **Information Disclosure** | Source Code | Niedrig | Keine Secrets im Code |
| **Denial of Service** | Große WASM-Allokation / SQL-Import | Niedrig | Browser-Tab-Limit; 5 MB Import-Limit; Dateityp-Check |
| **Elevation of Privilege** | — | Kein | Keine Rollen/Rechte |
| **XSS via Markdown** | `renderMarkdown` Tabellen | Behoben | `escapeHtml()` auf alle Tabellen-Zellen |
| **XSS via anime.js** | `scrambleText` innerHTML | Behoben | `sanitizeForScramble()` entfernt HTML-Tags und escaped Sonderzeichen |

### Fazit

SQL VIBE hat eine **minimale Angriffsfläche**:
- Kein Server → keine Server-Angriffe
- Keine Auth → keine Auth-Angriffe
- Keine externen APIs → keine Supply-Chain-Angriffe zur Laufzeit
- WASM-Sandbox → isolierte SQL-Ausführung
- CodeMirror 6 → Text-basiertes Rendering, kein XSS-Risiko
- Alle `innerHTML`/`dangerouslySetInnerHTML` → statisch oder sanitized
