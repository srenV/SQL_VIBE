import React from "react";
import { cn } from "@/lib/utils";

/**
 * Container – Maximalbreite Wrapper fuer konsistente Seitenraender.
 *
 * - Standardmaessig als `div` gerendert.
 * - Unterstuetzt `as`-Prop fuer semantische HTML-Tags (z.B. `section`).
 * - Responsive Padding (px-4 sm:px-6 lg:px-8).
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = "Container";
