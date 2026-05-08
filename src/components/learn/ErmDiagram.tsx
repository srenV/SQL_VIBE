"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ErmDiagram – Interaktives Entity-Relationship-Diagramm.
 *
 * Zeigt Entitaeten als Rechtecke, Beziehungen als Linien mit
 * Kardinalitaeten. Hover zeigt Attribute, Klick zeigt Details.
 *
 * English: Interactive Entity-Relationship diagram widget.
 * Shows entities as rectangles, relationships as lines with
 * cardinalities. Hover shows attributes, click shows details.
 */

export interface ErmEntity {
  id: string;
  name: string;
  attributes: ErmAttribute[];
  x: number;
  y: number;
}

export interface ErmAttribute {
  name: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface ErmRelationship {
  id: string;
  name: string;
  fromEntityId: string;
  toEntityId: string;
  fromCardinality: "1" | "n" | "m";
  toCardinality: "1" | "n" | "m";
}

export interface ErmDiagramData {
  entities: ErmEntity[];
  relationships: ErmRelationship[];
}

export interface ErmDiagramProps {
  data: ErmDiagramData;
  className?: string;
}

const CARD_W = 160;
const CARD_H_MIN = 60;

function getCardHeight(entity: ErmEntity): number {
  const headerH = 32;
  const attrH = 20;
  const padding = 8;
  return headerH + entity.attributes.length * attrH + padding;
}

export function ErmDiagram({ data, className }: ErmDiagramProps) {
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const viewBoxWidth = 700;
  const viewBoxHeight = 400;

  // Calculate relationship lines
  const relationshipLines = data.relationships.map((rel) => {
    const fromEntity = data.entities.find((e) => e.id === rel.fromEntityId);
    const toEntity = data.entities.find((e) => e.id === rel.toEntityId);
    if (!fromEntity || !toEntity) return null;

    const fromX = fromEntity.x + CARD_W / 2;
    const fromY = fromEntity.y + getCardHeight(fromEntity) / 2;
    const toX = toEntity.x + CARD_W / 2;
    const toY = toEntity.y + getCardHeight(toEntity) / 2;

    // Midpoint for relationship label
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    return { rel, fromX, fromY, toX, toY, midX, midY };
  });

  const selectedEntityData = selectedEntity
    ? data.entities.find((e) => e.id === selectedEntity)
    : null;

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto rounded-lg border border-surface-dim dark:border-dark-dim bg-surface"
        style={{ minHeight: "280px" }}
      >
        {/* Relationship lines */}
        {relationshipLines.map((line) =>
          line ? (
            <g key={line.rel.id}>
              <line
                x1={line.fromX}
                y1={line.fromY}
                x2={line.toX}
                y2={line.toY}
                className="stroke-ink-muted dark:stroke-dark-muted"
                strokeWidth={2}
                strokeDasharray={line.rel.fromCardinality === "m" || line.rel.toCardinality === "m" ? "6,3" : "none"}
              />
              {/* Relationship diamond */}
              <polygon
                points={`${line.midX},${line.midY - 12} ${line.midX + 16},${line.midY} ${line.midX},${line.midY + 12} ${line.midX - 16},${line.midY}`}
                className="fill-accent-100 dark:fill-accent-900 stroke-accent-500"
                strokeWidth={1.5}
              />
              <text
                x={line.midX}
                y={line.midY + 4}
                textAnchor="middle"
                className="text-[10px] fill-ink font-medium"
              >
                {line.rel.name}
              </text>
              {/* Cardinality labels */}
              <text
                x={line.fromX + (line.toX > line.fromX ? -20 : 20)}
                y={line.fromY + (line.toY > line.fromY ? -8 : 8)}
                textAnchor="middle"
                className="text-xs fill-primary-600 dark:fill-primary-400 font-bold"
              >
                {line.rel.fromCardinality}
              </text>
              <text
                x={line.toX + (line.fromX > line.toX ? -20 : 20)}
                y={line.toY + (line.fromY > line.toY ? -8 : 8)}
                textAnchor="middle"
                className="text-xs fill-primary-600 dark:fill-primary-400 font-bold"
              >
                {line.rel.toCardinality}
              </text>
            </g>
          ) : null
        )}

        {/* Entity cards */}
        {data.entities.map((entity) => {
          const h = getCardHeight(entity);
          const isHovered = hoveredEntity === entity.id;
          const isSelected = selectedEntity === entity.id;

          return (
            <g
              key={entity.id}
              onMouseEnter={() => setHoveredEntity(entity.id)}
              onMouseLeave={() => setHoveredEntity(null)}
              onClick={() => setSelectedEntity(isSelected ? null : entity.id)}
              className="cursor-pointer"
            >
              {/* Card background */}
              <rect
                x={entity.x}
                y={entity.y}
                width={CARD_W}
                height={h}
                rx={8}
                className={cn(
                  "transition-all duration-150",
                  isSelected
                    ? "fill-primary-50 dark:fill-primary-900/30 stroke-primary-500"
                    : isHovered
                      ? "fill-surface stroke-primary-400"
                      : "fill-surface stroke-surface-dim dark:stroke-dark-dim"
                )}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.5}
              />
              {/* Header bar */}
              <rect
                x={entity.x}
                y={entity.y}
                width={CARD_W}
                height={28}
                rx={8}
                className={cn(
                  "transition-colors duration-150",
                  isSelected
                    ? "fill-primary-500"
                    : isHovered
                      ? "fill-primary-400"
                      : "fill-primary-600 dark:fill-primary-500"
                )}
              />
              {/* Clip bottom corners of header */}
              <rect
                x={entity.x}
                y={entity.y + 20}
                width={CARD_W}
                height={8}
                className={cn(
                  "transition-colors duration-150",
                  isSelected
                    ? "fill-primary-500"
                    : isHovered
                      ? "fill-primary-400"
                      : "fill-primary-600 dark:fill-primary-500"
                )}
              />
              {/* Entity name */}
              <text
                x={entity.x + CARD_W / 2}
                y={entity.y + 19}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
              >
                {entity.name}
              </text>
              {/* Attributes */}
              {entity.attributes.map((attr, i) => (
                <text
                  key={attr.name}
                  x={entity.x + 10}
                  y={entity.y + 44 + i * 20}
                  className={cn(
                    "text-[11px]",
                    attr.isPrimaryKey
                      ? "fill-primary-600 dark:fill-primary-400 font-bold underline decoration-2 underline-offset-2"
                      : attr.isForeignKey
                        ? "fill-accent-600 dark:fill-accent-400 italic"
                        : "fill-ink dark:fill-ink"
                  )}
                >
                  {attr.isPrimaryKey ? "PK " : attr.isForeignKey ? "FK " : ""}
                  {attr.name}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Detail panel for selected entity */}
      {selectedEntityData && (
        <div className="mt-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <h4 className="text-sm font-semibold text-ink mb-2">
            {selectedEntityData.name}
          </h4>
          <div className="space-y-1">
            {selectedEntityData.attributes.map((attr) => (
              <div key={attr.name} className="flex items-center gap-2 text-xs">
                {attr.isPrimaryKey && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 font-medium">
                    PK
                  </span>
                )}
                {attr.isForeignKey && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 font-medium">
                    FK
                  </span>
                )}
                {!attr.isPrimaryKey && !attr.isForeignKey && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-dim dark:bg-dark-dim text-ink-muted font-medium">
                    Attr
                  </span>
                )}
                <span className="text-ink">{attr.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-xs text-ink-muted text-center">
        Klicke auf eine Entität, um Details zu sehen.
      </p>
    </div>
  );
}