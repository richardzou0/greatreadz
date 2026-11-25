"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import { useDialogFocus } from "./useDialogFocus";

/**
 * A simple pop-up: slides up from the bottom on phones, a centred card on desktop.
 * Closes on Escape, on the ✕, or by tapping outside. Keeps keyboard focus inside.
 */
export function Sheet({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "lg:max-w-[480px]",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref);

  // Latest close handler, so the setup below runs once per open
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const target = ref.current?.querySelector<HTMLElement>("[data-autofocus]") ?? ref.current;
    target?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-backdrop lg:items-center lg:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-sheet lg:animate-modal flex max-h-[88dvh] w-full flex-col overflow-y-auto rounded-t-[28px] bg-bg px-5 pb-6 pt-3 shadow-modal outline-none lg:rounded-[24px] lg:p-7 ${maxWidth}`}
      >
        <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-line lg:hidden" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-[24px] font-medium leading-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-colors hover:bg-accent-soft"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
