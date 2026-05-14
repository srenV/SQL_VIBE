"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  type Node,
  type Edge,
  type EdgeProps,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import type { SchemaTable, ForeignKey } from "@/types/playground";

// ── constants ─────────────────────────────────────────────────

const NODE_WIDTH = 220;
const NODE_ROW_HEIGHT = 26;
const NODE_HEADER_HEIGHT = 32;

function getNodeHeight(table: SchemaTable): number {
  return NODE_HEADER_HEIGHT + table.columns.length * NODE_ROW_HEIGHT + 4;
}

/** Y-center of a column row relative to the top of the node. */
function getColumnY(colIndex: number): number {
  return NODE_HEADER_HEIGHT + colIndex * NODE_ROW_HEIGHT + NODE_ROW_HEIGHT / 2;
}

// ── dagre layout ──────────────────────────────────────────────

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
    ranksep: hasEdges ? 160 : 100,
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

  // ── Collect which columns are referenced by FKs (need target handles) ──
  const referencedColumns = new Map<string, Set<string>>();
  for (const table of tables) {
    if (!table.foreignKeys) continue;
    for (const fk of table.foreignKeys) {
      if (!tables.find((t) => t.name === fk.referencedTable)) continue;
      if (!referencedColumns.has(fk.referencedTable)) {
        referencedColumns.set(fk.referencedTable, new Set());
      }
      referencedColumns.get(fk.referencedTable)!.add(fk.referencedColumn);
    }
  }

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
      data: { table, referencedColumns: referencedColumns.get(table.name) ?? new Set<string>() },
    };
  });

  // ── Build edges with per-column handles ──────────────────────
  // Group parallel edges (same source→target pair) to assign stepPosition offsets
  const edgeGroups = new Map<string, { fk: ForeignKey; sourceTable: string }[]>();

  for (const table of tables) {
    if (!table.foreignKeys) continue;
    for (const fk of table.foreignKeys) {
      if (!tables.find((t) => t.name === fk.referencedTable)) continue;
      const key = `${table.name}->${fk.referencedTable}`;
      if (!edgeGroups.has(key)) edgeGroups.set(key, []);
      edgeGroups.get(key)!.push({ fk, sourceTable: table.name });
    }
  }

  const edges: Edge[] = [];
  for (const [, group] of edgeGroups) {
    const total = group.length;
    for (let i = 0; i < total; i++) {
      const { fk, sourceTable } = group[i];
      const edgeId = `${sourceTable}-${fk.column}->${fk.referencedTable}-${fk.referencedColumn}`;

      // Spread parallel edges by varying curvature
      // Single edge: slight curve (0.25). Multiple: alternate curvature sign and magnitude
      let curvature: number;
      if (total === 1) {
        curvature = 0.25;
      } else {
        // Distribute curvatures symmetrically around 0, e.g. for 3 edges: -0.3, 0, 0.3
        curvature = ((i + 1) / (total + 1) - 0.5) * 0.6;
      }

      edges.push({
        id: edgeId,
        source: sourceTable,
        sourceHandle: `source-${fk.column}`,
        target: fk.referencedTable,
        targetHandle: `target-${fk.referencedColumn}`,
        type: "fkEdge",
        animated: true,
        label: `${fk.column} → ${fk.referencedColumn}`,
        data: { curvature },
        style: { stroke: "#6366f1", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: "#6366f1",
        },
        labelStyle: { fontSize: 9, fill: "#475569", fontWeight: 600 },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.92 },
        labelBgPadding: [4, 3] as [number, number],
        labelBgBorderRadius: 3,
      });
    }
  }

  return { nodes, edges };
}

// ── Custom Table Node ─────────────────────────────────────────

const TableNode = React.memo(({ data }: { data: { table: SchemaTable; referencedColumns: Set<string> } }) => {
  const { table, referencedColumns } = data;

  const isView = table.type === "view";

  // Pre-compute which columns are FK for badge rendering
  const fkColumns = new Set(table.foreignKeys?.map((fk) => fk.column));

  return (
    <div
      className={`rounded-lg shadow-lg ${
        isView
          ? "border-2 border-dashed border-accent-400 dark:border-accent-500 bg-surface dark:bg-slate-800"
          : "border-2 border-primary-300 dark:border-primary-600 bg-surface dark:bg-slate-800"
      }`}
      style={{ width: NODE_WIDTH, fontSize: 12, position: "relative", overflow: "visible" }}
    >
      {/* ── Handles placed at node level with absolute positioning ── */}
      {table.columns.map((col, colIndex) => {
        const yCenter = getColumnY(colIndex);
        const isFk = fkColumns.has(col.name);
        return (
          <React.Fragment key={col.name}>
            {/* FK source handle on the right — edge goes FROM this FK column */}
            {isFk && (
              <Handle
                type="source"
                position={Position.Right}
                id={`source-${col.name}`}
                style={{
                  top: yCenter,
                  right: -4,
                  transform: "translateY(-50%)",
                  background: "#6366f1",
                  width: 8,
                  height: 8,
                  border: "2px solid white",
                }}
              />
            )}
            {/* Target handle on the left — edge arrives AT this PK or referenced column */}
            {(col.isPrimaryKey || referencedColumns.has(col.name)) && (
              <Handle
                type="target"
                position={Position.Left}
                id={`target-${col.name}`}
                style={{
                  top: yCenter,
                  left: -4,
                  transform: "translateY(-50%)",
                  background: col.isPrimaryKey ? "#f59e0b" : "#6366f1",
                  width: 8,
                  height: 8,
                  border: "2px solid white",
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      <div className={`px-3 py-2 border-b ${
        isView
          ? "bg-accent-100 dark:bg-accent-500/30 border-accent-200 dark:border-accent-400/30"
          : "bg-primary-100 dark:bg-primary-500/30 border-primary-200 dark:border-primary-400/30"
      }`}>
        <span className={`font-bold text-sm ${
          isView
            ? "text-accent-800 dark:text-accent-200"
            : "text-primary-800 dark:text-white"
        }`}>
          {table.name}
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {table.columns.map((col) => {
          const isFk = fkColumns.has(col.name);
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

// ── Custom FK Edge (bezier with configurable curvature for parallel offset) ──

function FkEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  style,
  markerEnd,
  markerStart,
  interactionWidth,
  data,
}: EdgeProps) {
  // curvature from data: 0 = straight, higher = more curve
  // For parallel edges, each gets a different curvature sign/magnitude
  const curvature = (data?.curvature as number) ?? 0.25;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      labelX={labelX}
      labelY={labelY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
      style={style}
      markerEnd={markerEnd}
      markerStart={markerStart}
      interactionWidth={interactionWidth}
    />
  );
}

// ── Inner Graph Component ─────────────────────────────────────

const nodeTypes = { tableNode: TableNode };
const edgeTypes = { fkEdge: FkEdge };

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
        edgeTypes={edgeTypes}
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
      </ReactFlow>
    </div>
  );
}

// ── Public Graph Component ────────────────────────────────────

export interface SchemaGraphProps {
  tables: SchemaTable[];
  /** If true, the graph fills its parent's height instead of using a fixed 550px. */
  fullHeight?: boolean;
}

export function SchemaGraph({ tables, fullHeight }: SchemaGraphProps) {
  const t = useTranslations("sandbox");

  if (tables.length === 0) {
    return (
      <p className="text-sm text-ink-muted p-4">
        {t("noTablesInDatabase")}
      </p>
    );
  }

  return (
    <div
      className={`w-full border border-surface-dim dark:border-slate-700 rounded-lg overflow-hidden ${fullHeight ? "h-full" : ""}`}
      style={fullHeight ? undefined : { height: 550 }}
    >
      <ReactFlowProvider>
        <SchemaGraphInner tables={tables} />
      </ReactFlowProvider>
    </div>
  );
}
