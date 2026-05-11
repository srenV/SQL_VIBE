/**
 * PageShell – Wiederverwendbare Seiten-Huelle mit Header und optionalem Container.
 *
 * Konsolidiert das in 8+ Seiten duplizierte Muster:
 *   <div className="min-h-screen flex flex-col" id="main-content">
 *     <Header />
 *     <main className="flex-1 ...">
 *       <Container className="...">...</Container>  // optional
 *     </main>
 *   </div>
 *
 * Props:
 *  - children:          Seiteninhalt
 *  - mainClassName:      Klassen fuer <main> (Default: "flex-1")
 *  - containerClassName: Wenn gesetzt, wird <Container> um children gewrappt
 *  - id:                ID des aeusseren div (Default: "main-content")
 *  - outerClassName:     Klassen fuer aeusseres div (Default: "min-h-screen flex flex-col")
 */
import React from "react";
import { Header } from "@/components/header";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";

export interface PageShellProps {
  /** Seiteninhalt */
  children: React.ReactNode;
  /** Klassen fuer <main> (Default: "flex-1") */
  mainClassName?: string;
  /** Wenn gesetzt, wird <Container> um children gewrappt */
  containerClassName?: string;
  /** ID des aeusseren div (Default: "main-content") */
  id?: string;
  /** Klassen fuer aeusseres div (Default: "min-h-screen flex flex-col") */
  outerClassName?: string;
}

/**
 * PageShell – Seiten-Huelle mit Header und optionalem Container.
 *
 * @example
 * // Einfache Seite
 * <PageShell mainClassName="flex-1 py-12" containerClassName="space-y-10">
 *   <h1>Titel</h1>
 * </PageShell>
 *
 * // Ohne Container
 * <PageShell mainClassName="flex-1">
 *   <CustomLayout />
 * </PageShell>
 */
export function PageShell({
  children,
  mainClassName = "flex-1",
  containerClassName,
  id = "main-content",
  outerClassName = "min-h-screen flex flex-col",
}: PageShellProps) {
  return (
    <div className={cn(outerClassName)} id={id}>
      <Header />
      <main className={cn(mainClassName)}>
        {containerClassName ? (
          <Container className={containerClassName}>{children}</Container>
        ) : (
          children
        )}
      </main>
    </div>
  );
}