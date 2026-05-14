"use client";

/**
 * AnimeLayoutModal – Reusable modal component with smooth open/close
 * animations using CSS transitions and native `<dialog>` element.
 *
 * Uses CSS transitions for backdrop fade and content scale/fade instead of
 * anime.js createLayout (which is designed for layout animations, not modal
 * open/close). This provides reliable, performant animations.
 *
 * Features:
 * - Native `<dialog>` element with showModal() / close()
 * - CSS transitions for backdrop fade and content scale/fade
 * - Escape key handling via dialog's built-in cancel event
 * - Backdrop click to close (clicking outside .modal-content)
 * - Focus management (focus close button on open, restore on close)
 * - Respects prefers-reduced-motion
 * - aria-modal, role="dialog" for accessibility
 */

import React, { useEffect, useRef, useCallback, useState } from "react";

export interface AnimeLayoutModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Additional CSS classes for the dialog content area */
  className?: string;
  /** Accessible label for the dialog */
  ariaLabel?: string;
  /** Max width class (default: "max-w-2xl") */
  maxWidthClass?: string;
}

export function AnimeLayoutModal({
  isOpen,
  onClose,
  children,
  className = "",
  ariaLabel = "Dialog",
  maxWidthClass = "max-w-2xl",
}: AnimeLayoutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  // Initialize reduced-motion state
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // React to runtime preference changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Handle open
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    // Reset closing flag
    closingRef.current = false;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Show the dialog (sets [open] attribute, element becomes visible but
    // content starts at opacity: 0 via CSS)
    dialog.showModal();

    // Wait one frame so the browser paints the initial (hidden) state,
    // then add .modal-open to trigger the CSS transition to visible.
    // Without this, the browser skips the transition because it never
    // rendered the "from" state.
    requestAnimationFrame(() => {
      dialog.classList.add("modal-open");
      closeRef.current?.focus();
    });
  }, [isOpen]);

  // Handle close with animation
  const handleClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closingRef.current) return;

    closingRef.current = true;

    if (reducedMotion) {
      dialog.close();
      closingRef.current = false;
      previousFocusRef.current?.focus();
      return;
    }

    // Remove open class and add closing class to trigger CSS close animation
    dialog.classList.remove("modal-open");
    dialog.classList.add("modal-closing");

    // Wait for CSS transition to finish, then close the dialog
    const handleAnimationEnd = () => {
      dialog.classList.remove("modal-closing");
      dialog.close();
      closingRef.current = false;
      previousFocusRef.current?.focus();
      dialog.removeEventListener("transitionend", handleAnimationEnd);
    };

    dialog.addEventListener("transitionend", handleAnimationEnd);

    // Fallback: if transitionend doesn't fire, close after duration
    setTimeout(() => {
      if (closingRef.current) {
        dialog.classList.remove("modal-closing");
        dialog.close();
        closingRef.current = false;
        previousFocusRef.current?.focus();
        dialog.removeEventListener("transitionend", handleAnimationEnd);
      }
    }, 300);
  }, [reducedMotion]);

  // Sync isOpen prop with dialog state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!isOpen && dialog.open && !closingRef.current) {
      handleClose();
    }
  }, [isOpen, handleClose]);

  // Handle Escape via dialog's built-in cancel event
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  // Handle backdrop click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      // Only close if clicking directly on the dialog (backdrop area),
      // not on child elements like .modal-content
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <dialog
      ref={dialogRef}
      className={`sql-vibe-modal ${className}`}
      aria-label={ariaLabel}
      aria-modal="true"
      role="dialog"
      onClick={handleClick}
    >
      {/* Content */}
      <div className={`modal-content ${maxWidthClass}`}>
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="modal-close"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </dialog>
  );
}