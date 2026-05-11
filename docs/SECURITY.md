# Security & Datenschutz — SQL-Trainer

Sicherheits- und Datenschutzkonzept der SQL-Trainer MySQL-Lernplattform.

---

## Inhaltsverzeichnis

1. [Architektur-Sicherheit](#architektur-sicherheit)
2. [Client-Side Security](#client-side-security)
3. [Datenschutz (DSGVO)](#datenschutz-dsgvo)
4. [Datenhaltung](#datenhaltung)
5. [Supply Chain](#supply-chain)
6. [Threat Model](#threat-model)

---

## Architektur-Sicherheit

### Zero-Server-Architektur

Der SQL-Trainer ist ein **reiner Static Export** — es gibt:

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
| `dangerouslySetInnerHTML` | ⚠️ Nur in `ThemeScript` (statisches JS, keine User-Inputs) und `renderMarkdown` (statische Lerninhalte, mit `escapeHtml`) |
| `eval()` | ❌ Nicht verwendet |
| `innerHTML` | ⚠️ Nur in `scrambleText` (anime.js, statische Texte) |

### SQL-Injection im Playground

Der Playground führt **User-SQL** in einer **isolierten In-Memory sql.js-Datenbank** aus:

- Die Datenbank existiert nur im Browser-Tab
- Keine Verbindung zu externen Datenbanken
- sql.js ist ein Read-Only-WASM-Modul ohne Netzwerkzugriff
- `PRAGMA foreign_key_list` und `PRAGMA table_info` sind read-only

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
| **Animation** | framer-motion | Niedrig |
| **SQL** | sql.js | Niedrig (WASM, keine Netzwerk-I/O) |
| **Graph** | @xyflow/react, dagre | Niedrig |
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

### Fazit

Der SQL-Trainer hat eine **minimale Angriffsfläche**:
- Kein Server → keine Server-Angriffe
- Keine Auth → keine Auth-Angriffe
- Keine externen APIs → keine Supply-Chain-Angriffe zur Laufzeit
- WASM-Sandbox → isolierte SQL-Ausführung
