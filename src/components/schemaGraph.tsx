"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import type { SchemaTable } from "@/types/playground";

// ── dagre layout ──────────────────────────────────────────────

const NODE_WIDTH = 220;
const NODE_ROW_HEIGHT = 26;
const NODE_HEADER_HEIGHT = 32;

function getNodeHeight(table: SchemaTable): number {
  return NODE_HEADER_HEIGHT + table.columns.length * NODE_ROW_HEIGHT + 4;
}

function layoutWithDagre(tables: SchemaTable[]): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  const dagreEdges: { source: string; target: string }[] = [];
  for (const table of tables) {
    if (!table.foreignKeys) continue;
    for (const fk of table.foreignKeys) {
      if (!tables.find((t) => t.name === fk.referencedTable)) continue;
      dagreEdges.push({ source: table.name, target: fk.referencedTable });
    }
  }

  const hasEdges = dagreEdges.length > 0;

  g.setGraph({
    rankdir: hasEdges ? "LR" : "TB",
    nodesep: hasEdges ? 100 : 140,
    ranksep: hasEdges ? 140 : 100,
    marginx: 60,
    marginy: 60,
  });

  for (const table of tables) {
    const h = getNodeHeight(table);
    g.setNode(table.name, { width: NODE_WIDTH, height: h });
  }

  for (const { source, target } of dagreEdges) {
    g.setEdge(source, target);
  }

  dagre.layout(g);

  const nodes: Node[] = tables.map((table) => {
    const dagreNode = g.node(table.name);
    const h = getNodeHeight(table);
    return {
      id: table.name,
      type: "tableNode",
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - h / 2,
      },
      data: { table },
    };
  });

  const edges: Edge[] = [];
  for (const table of tables) {
    if (!table.foreignKeys) continue;
    for (const fk of table.foreignKeys) {
      if (!tables.find((t) => t.name === fk.referencedTable)) continue;
      const edgeId = `${table.name}-${fk.column}->${fk.referencedTable}-${fk.referencedColumn}`;
      edges.push({
        id: edgeId,
        source: table.name,
        target: fk.referencedTable,
        type: "smoothstep",
        animated: true,
        label: fk.column,
        style: { stroke: "#6366f1", strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 22,
          height: 22,
          color: "#6366f1",
        },
        labelStyle: { fontSize: 10, fill: "#475569", fontWeight: 600 },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 3,
      });
    }
  }

  return { nodes, edges };
}

// ── Custom Table Node ─────────────────────────────────────────

const TableNode = React.memo(({ data }: { data: { table: SchemaTable } }) => {
  const { table } = data;

  return (
    <div
      className="rounded-lg border-2 border-primary-300 dark:border-primary-600 bg-white dark:bg-slate-800 shadow-lg overflow-hidden"
      style={{ width: NODE_WIDTH, fontSize: 12 }}
    >
      {/* Source handle (right side) — edges go FROM this table */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#6366f1", width: 10, height: 10, border: "2px solid white" }}
      />
      {/* Target handle (left side) — edges go TO this table */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#6366f1", width: 10, height: 10, border: "2px solid white" }}
      />

      <div className="bg-primary-100 dark:bg-primary-500/30 px-3 py-2 border-b border-primary-200 dark:border-primary-400/30">
        <span className="font-bold text-primary-800 dark:text-white text-sm">
          {table.name}
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {table.columns.map((col) => {
          const isFk = table.foreignKeys?.some((fk) => fk.column === col.name);
          return (
            <div key={col.name} className="flex items-center gap-1.5 px-3 py-1.5">
              {col.isPrimaryKey && (
                <span className="shrink-0 inline-flex items-center justify-center rounded bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 w-8">
                  PK
                </span>
              )}
              {isFk && !col.isPrimaryKey && (
                <span className="shrink-0 inline-flex items-center justify-center rounded bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 w-8">
                  FK
                </span>
              )}
              {!col.isPrimaryKey && !isFk && <span className="shrink-0 w-8" />}

              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {col.name}
              </span>

              <span className="text-slate-400 dark:text-slate-500 ml-auto text-[10px] shrink-0">
                {col.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
TableNode.displayName = "TableNode";

// ── Inner Graph Component ─────────────────────────────────────

const nodeTypes = { tableNode: TableNode };

function SchemaGraphInner({ tables }: { tables: SchemaTable[] }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const { nodes, edges } = useMemo(
    () => layoutWithDagre(tables),
    [tables]
  );

  // Force remount when tables change to avoid stale edge state
  const remountKey = useMemo(
    () => tables.map(t => t.name).join("|") + "|" + edges.length,
    [tables, edges.length]
  );

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      const timers = [100, 300, 600].map((delay) =>
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.25, duration: 200, maxZoom: 1.2 });
        }, delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [reactFlowInstance, nodes.length]);

  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        key={remountKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        minZoom={0.05}
        maxZoom={2}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        style={{ background: "var(--color-surface, #f8fafc)" }}
        className="dark:[--color-surface:#0f172a]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#94a3b8"
        />
        <Controls
          showZoom
          showFitView
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}

// ── Public Graph Component ────────────────────────────────────

export interface SchemaGraphProps {
  tables: SchemaTable[];
}

export function SchemaGraph({ tables }: SchemaGraphProps) {
  if (tables.length === 0) {
    return (
      <p className="text-sm text-ink-muted p-4">
        Keine Tabellen in der aktuellen Datenbank.
      </p>
    );
  }

  return (
    <div className="w-full border border-surface-dim dark:border-slate-700 rounded-lg overflow-hidden" style={{ height: 550 }}>
      <ReactFlowProvider>
        <SchemaGraphInner tables={tables} />
      </ReactFlowProvider>
    </div>
  );
}
