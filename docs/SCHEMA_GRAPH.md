# Schema-Explorer & RM-Graph — SQL-Trainer

Detaillierte Dokumentation des Schema-Explorers und des interaktiven ER-Graphen.

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [SchemaExplorer](#schemaexplorer)
3. [SchemaGraph](#schemagraph)
4. [FK-Merge-Strategie](#fk-merge-strategie)
5. [dagre Auto-Layout](#dagre-auto-layout)
6. [React Flow Integration](#react-flow-integration)
7. [Bekannte Einschränkungen](#bekannte-einschränkungen)

---

## Überblick

Der Schema-Explorer visualisiert das Datenbank-Schema einer Übung in drei Ansichten:

```
SchemaExplorer
├── Tab: RM (Relationales Modell)
│     └── SchemaGraph (React Flow + dagre)
├── Tab: Daten
│     └── Live-Daten-Vorschau (max. 10 Zeilen/Tabelle)
└── Tab: Schema
      └── Strukturierte Tabellen-Details (Spalten, Typen, PKs, FKs)
```

---

## SchemaExplorer

### Props

```typescript
interface SchemaExplorerProps {
  tables: SchemaTable[];                        // Schema-Daten
  db?: import("sql.js").Database | null;        // Für Daten-Vorschau
}
```

### State

```typescript
viewMode: "rm" | "data" | "schema"             // Aktiver Tab
tableData: Record<string, TableDataCache>       // Gecachte Daten-Vorschau
loadingTables: Set<string>                      // Lade-Indikatoren
```

### Daten-Vorschau

- **Lazy Loading:** Daten werden erst geladen, wenn der "Daten"-Tab aktiv ist
- **Caching:** Einmal geladene Daten werden gecached
- **Limit:** Max. 10 Zeilen pro Tabelle (`peekTableData(db, tableName, 10)`)
- **Loading State:** "Laden..." während der Abfrage

---

## SchemaGraph

### Architektur

```
SchemaGraph (Public API)
  └── ReactFlowProvider
        └── SchemaGraphInner
              ├── layoutWithDagre(tables)
              │     ├── dagre.graphlib.Graph
              │     ├── Nodes registrieren
              │     ├── Edges registrieren
              │     ├── dagre.layout(g)
              │     └── → { nodes: Node[], edges: Edge[] }
              │
              └── ReactFlow
                    ├── nodes (controlled props)
                    ├── edges (controlled props)
                    ├── nodeTypes: { tableNode: TableNode }
                    ├── Background (Dots)
                    └── Controls (Zoom, Fit)
```

### TableNode (Custom Node)

Jede Tabelle wird als Custom Node mit folgender Struktur gerendert:

```
┌──────────────────────────┐
│  Handle (source, right)  │  ← Ausgehende Kanten
├──────────────────────────┤
│  Tabellenname            │  ← Header (primary-100 bg)
├──────────────────────────┤
│  PK  id        INTEGER   │  ← Spalten mit PK/FK-Badges
│  FK  kunde_id  INTEGER   │
│      name      VARCHAR   │
│      ...                 │
├──────────────────────────┤
│  Handle (target, left)   │  ← Eingehende Kanten
└──────────────────────────┘
```

**Handle-Komponenten:**
- `type="source"`, `position={Position.Right}` — Kanten gehen VON dieser Tabelle aus
- `type="target"`, `position={Position.Left}` — Kanten gehen ZU dieser Tabelle
- **Wichtig:** Keine explizite `id` (defaultet auf `null`) — kompatibel mit Edges ohne `sourceHandle`/`targetHandle`

**Spalten-Badges:**
- **PK:** Gelb (`amber-100`) — `col.isPrimaryKey === true`
- **FK:** Indigo (`indigo-100`) — Spalte erscheint in `table.foreignKeys`
- **Normal:** Kein Badge, Spacer (`w-8`)

### Edge-Styling

```typescript
{
  type: "smoothstep",           // Rechtwinklige Kanten mit Kurven
  animated: true,               // Fließende Animation
  style: {
    stroke: "#6366f1",          // Indigo
    strokeWidth: 2.5            // Dick genug für Sichtbarkeit
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 22, height: 22,     // Pfeilspitze
    color: "#6366f1"
  },
  label: fk.column,            // FK-Spaltenname als Label
  labelStyle: {
    fontSize: 10,
    fill: "#475569",
    fontWeight: 600
  },
  labelBgStyle: {
    fill: "#ffffff",
    fillOpacity: 0.95           // Halbtransparenter Hintergrund
  }
}
```

### Background

- **Typ:** `BackgroundVariant.Dots`
- **Farbe:** `#94a3b8` (slate-400)
- **Gap:** 20px
- **Theme-aware:** CSS-Variable `--color-surface` für den Canvas-Hintergrund

---

## FK-Merge-Strategie

### Das Problem

Die SQL-DDL in den Datasets deklariert **keine** `FOREIGN KEY`-Constraints:

```sql
-- Dataset-DDL (KEINE FK-Constraints!)
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL  -- Kein REFERENCES!
);
```

`PRAGMA foreign_key_list('bestellungen')` liefert daher **leer**.

### Die Lösung: `mergeSchemaWithFKs()`

```typescript
function mergeSchemaWithFKs(
  liveSchema: SchemaTable[],     // Aus introspectSchema(db)
  staticSchema: SchemaTable[]    // Aus exercise.schemaTables
): SchemaTable[]
```

**Algorithmus:**
1. Baue Map `staticFKMap: Map<TableName, ForeignKey[]>` aus `staticSchema`
2. Für jede Tabelle in `liveSchema`:
   - Wenn `staticFKMap` FKs für diese Tabelle hat → übernehmen
   - Sonst → `liveTable.foreignKeys` behalten (könnte aus PRAGMA kommen)

**Ergebnis:** Spalten aus der Live-DB (akkurat), FKs aus den Dataset-Metadaten (vollständig).

### Datenfluss

```
Dataset (ColumnDef.references)
  │
  ▼
buildSchemaTables() in playgroundAdapter.ts
  │ SchemaTable[] mit foreignKeys
  ▼
exercise.schemaTables
  │
  ▼
usePlayground.initDb()
  │
  ├── introspectSchema(db)  → liveSchema (Spalten, keine FKs)
  └── mergeSchemaWithFKs(liveSchema, exercise.schemaTables)
        │
        ▼
      liveSchema (Spalten + FKs)
        │
        ▼
      SchemaGraph
```

---

## dagre Auto-Layout

### Konfiguration

```typescript
g.setGraph({
  rankdir: hasEdges ? "LR" : "TB",
  nodesep: hasEdges ? 100 : 140,
  ranksep: hasEdges ? 140 : 100,
  marginx: 60,
  marginy: 60,
});
```

### Layout-Strategie

| Situation | `rankdir` | Effekt |
|-----------|-----------|--------|
| **Mit Kanten** | `"LR"` (left-to-right) | ER-Diagramm: Tabellen fließen von links nach rechts |
| **Ohne Kanten** | `"TB"` (top-to-bottom) | Verhindert Stacking: Tabellen untereinander |

### Node-Dimensionen

```typescript
NODE_WIDTH = 220px
NODE_HEADER_HEIGHT = 32px
NODE_ROW_HEIGHT = 26px
nodeHeight = HEADER + columns.length × ROW + 4
```

---

## React Flow Integration

### Version

`@xyflow/react` v12.10.2

### Controlled Props (nicht useNodesState/useEdgesState)

```typescript
// Direkt als Props — kein useState/useNodesState
<ReactFlow
  nodes={nodes}     // Aus useMemo
  edges={edges}     // Aus useMemo
  nodeTypes={nodeTypes}
/>
```

**Grund:** `useNodesState`/`useEdgesState` in v12 kann zu Race-Conditions führen, wenn Nodes/Edges asynchron aktualisiert werden. Direkte Props sind deterministischer.

### Remount-Strategie

```typescript
const remountKey = useMemo(
  () => tables.map(t => t.name).join("|") + "|" + edges.length,
  [tables, edges.length]
);

<ReactFlow key={remountKey} ... />
```

**Grund:** Erzwingt kompletten Remount bei Tabellen-Änderungen. Verhindert stale Edge-Zustände.

### Fit View

```typescript
// Mehrere Versuche mit steigendem Delay
[100, 300, 600].map(delay =>
  setTimeout(() => {
    reactFlowInstance.fitView({
      padding: 0.25,
      duration: 200,
      maxZoom: 1.2
    });
  }, delay)
);
```

**Grund:** React Flow braucht Zeit, um Nodes zu rendern und Dimensionen zu berechnen. Mehrere Attempts stellen sicher, dass `fitView` die finalen Positionen erwischt.

---

## Bekannte Einschränkungen

1. **Keine FK-Constraints in DDL:** FKs kommen aus Metadaten, nicht aus SQLite — `mergeSchemaWithFKs()` fixt das
2. **Keine Handle-IDs:** Handles ohne `id` (default `null`) — Edges ohne `sourceHandle`/`targetHandle` funktionieren nur so
3. **Remount bei Tabellen-Wechsel:** `key={remountKey}` verhindert inkrementelle Updates, ist aber robuster
4. **Kein Dark Mode für Edge-Labels:** `labelBgStyle.fill: "#ffffff"` ist hartkodiert — im Dark Mode leicht inkonsistent
5. **Keine manuelle Kanten:** `nodesConnectable={false}` — User können keine eigenen Kanten ziehen
