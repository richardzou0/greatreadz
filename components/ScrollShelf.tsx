"use client";

import { useEffect, useRef, useState } from "react";
import { BackIcon, ChevronRightIcon } from "./Icons";
import { ShelfReveal } from "./ShelfReveal";

/**
 * A sideways-scrolling row of books with the shelf reveal.
 * Swipe on phones; on desktop the arrows in the header page through it.
 * Children are the <li data-shelf-item> books.
 */
export function ScrollShelf({
  heading,
  action,
  replayKey,
  ledgeTop,
  className = "",
  children,
}: {
  /** Left side of the header row (usually an Eyebrow or a title) */
  heading: React.ReactNode;
  /** Optional extra control shown before the arrows, e.g. a "See all" link */
  action?: React.ReactNode;
  replayKey: string;
  /**
   * Draw a shelf ledge the covers stand on. Pass its distance from the top of the row,
   * i.e. the cover height, as Tailwind classes (e.g. "top-[160px] lg:top-[189px]").
   */
  ledgeTop?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const scrollable = !(edges.start && edges.end);

  return (
    <section className={className}>
      <div className="mb-3 flex min-h-9 items-center justify-between gap-4 lg:mb-4">
        {heading}
        <div className="flex items-center gap-3">
          {action}
          {scrollable && (
            <div className="hidden gap-2 lg:flex">
              <ArrowButton label="Scroll back" disabled={edges.start} onClick={() => page(-1)}>
                <BackIcon size={16} />
              </ArrowButton>
              <ArrowButton label="Scroll forward" disabled={edges.end} onClick={() => page(1)}>
                <ChevronRightIcon size={16} />
              </ArrowButton>
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        {/* The shelf ledge, drawn behind the books so it shows right at the base of the covers */}
        {ledgeTop && (
          <div
            aria-hidden
            className={`pointer-events-none absolute -inset-x-5 h-1.5 rounded-sm bg-line shadow-[0_5px_10px_rgb(0_0_0/0.22)] lg:-inset-x-2 ${ledgeTop}`}
          />
        )}
        <div
          ref={scroller}
          className="no-scrollbar relative -mx-5 snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-3 lg:mx-0 lg:scroll-px-0 lg:px-0"
          // Soft fade on whichever side has more books to scroll to
          style={{
            maskImage: `linear-gradient(90deg, ${edges.start ? "#000" : "transparent"}, #000 40px, #000 calc(100% - 40px), ${
              edges.end ? "#000" : "transparent"
            })`,
          }}
        >
          <ShelfReveal replayKey={replayKey} className="flex gap-3.5 lg:gap-5">
            {children}
          </ShelfReveal>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface transition-all hover:border-accent hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
