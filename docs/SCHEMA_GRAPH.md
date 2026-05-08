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
  sandboxMode?: boolean;                        // Sandbox-Modus (Drop Table, Insert, Create)
  onDropTable?: (tableName: string) => void;    // Tabelle droppen (nur Sandbox)
  onInsertTemplate?: (tableName: string) => void; // INSERT-Template in Editor
  onCreateTableTemplate?: () => void;           // CREATE TABLE-Template in Editor
  viewMode?: "rm" | "data" | "schema";          // Extern gesteuerter Anzeigemodus
  hideTabs?: boolean;                           // Tab-Leiste ausblenden (wenn extern gesteuert)
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
              │     ├── referencedColumns Map berechnen
              │     ├── Edges mit per-column Handles registrieren
              │     ├── Parallele Edges gruppieren → curvature verteilen
              │     ├── dagre.layout(g)
              │     └── → { nodes: Node[], edges: Edge[] }
              │
              └── ReactFlow
                    ├── nodes (controlled props)
                    ├── edges (controlled props)
                    ├── nodeTypes: { tableNode: TableNode }
                    ├── edgeTypes: { fkEdge: FkEdge }
                    ├── Background (Dots)
                    └── Controls (Zoom, Fit)
```

### TableNode (Custom Node)

Jede Tabelle wird als Custom Node mit **per-column Handles** gerendert. Jede FK-Spalte bekommt einen eigenen Source-Handle (rechts), jede PK- oder referenzierte Spalte bekommt einen eigenen Target-Handle (links):

```
┌──────────────────────────┐
│  Tabellenname            │  ← Header (primary-100 bg)
├──────────────────────────┤
│  PK  id        INTEGER   │ ← target-handle "target-id" (links)
│  FK  kunde_id  INTEGER   │ ← source-handle "source-kunde_id" (rechts)
│      name      VARCHAR   │
│      ...                 │
└──────────────────────────┘
```

**Per-Column Handles:**
- **Source-Handle** (rechts): Für jede FK-Spalte → `id="source-{colName}"`, `position={Position.Right}`
- **Target-Handle** (links): Für jede PK-Spalte oder referenzierte Spalte → `id="target-{colName}"`, `position={Position.Left}`
- **Y-Positionierung:** `top: getColumnY(colIndex)` + `transform: "translateY(-50%)"` platziert den Handle exakt auf der Zeilenmitte
- **CSS-Override:** ReactFlow setzt standardmäßig `transform: translate(±50%, -50%)` auf Handles. Dies wird überschrieben mit `transform: "translateY(-50%)"` und `right: -4` / `left: -4`, damit Handles am Node-Rand ausgerichtet sind.

**referencedColumns Map:**
Da nicht nur PK-Spalten Ziel von FK-Beziehungen sein können, wird eine `referencedColumns: Map<TableName, Set<string>>` berechnet. Diese Map enthält alle Spalten, die von einer FK-Beziehung referenziert werden, unabhängig davon ob sie PK sind oder nicht.

**Spalten-Badges:**
- **PK:** Gelb (`amber-100`) — `col.isPrimaryKey === true`
- **FK:** Indigo (`indigo-100`) — Spalte erscheint in `table.foreignKeys`
- **Normal:** Kein Badge, Spacer (`w-8`)

### Custom FkEdge (Bezier mit konfigurierbarer Krümmung)

Statt der Standard-`smoothstep`-Kanten wird eine **eigene Edge-Komponente** (`FkEdge`) verwendet, die `getBezierPath` aus `@xyflow/react` mit konfigurierbarem `curvature`-Parameter nutzt:

```typescript
function FkEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, ... }: EdgeProps) {
  const curvature = (data?.curvature as number) ?? 0.25;
  const [path, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    curvature,
  });
  return <BaseEdge path={path} labelX={labelX} labelY={labelY} ... />;
}
```

**Parallele Kanten (gleicher Source→Target-Paar):**
Wenn mehrere FK-Kanten denselben Source-Target-Paar haben, werden sie durch unterschiedliche `curvature`-Werte visuell getrennt:
- **Einzelne Kante:** `curvature = 0.25` (leichte Kurve)
- **Mehrere Kanten:** Symmetrische Verteilung, z.B. bei 3 Kanten: `-0.18, 0, 0.18`

**Edge-Definition:**
```typescript
{
  id: `${sourceTable}-${fk.column}->${fk.referencedTable}-${fk.referencedColumn}`,
  type: "fkEdge",                    // Custom Edge-Komponente
  source: sourceTable,
  sourceHandle: `source-${fk.column}`,    // Per-Column Handle
  target: fk.referencedTable,
  targetHandle: `target-${fk.referencedColumn}`, // Per-Column Handle
  animated: true,
  label: `${fk.column} → ${fk.referencedColumn}`,  // "kunde_id → id"
  data: { curvature },               // Bezier-Krümmung
  style: { stroke: "#6366f1", strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 18, height: 18,
    color: "#6366f1"
  },
  labelStyle: { fontSize: 9, fill: "#475569", fontWeight: 600 },
  labelBgStyle: { fill: "#ffffff", fillOpacity: 0.92 },
  labelBgPadding: [4, 3] as [number, number],
  labelBgBorderRadius: 3,
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
2. **Remount bei Tabellen-Wechsel:** `key={remountKey}` verhindert inkrementelle Updates, ist aber robuster
3. **Kein Dark Mode für Edge-Labels:** `labelBgStyle.fill: "#ffffff"` ist hartkodiert — im Dark Mode leicht inkonsistent
4. **Keine manuelle Kanten:** `nodesConnectable={false}` — User können keine eigenen Kanten ziehen
