"use client";

import { useLayoutEffect, type RefObject } from "react";

// Timing, in milliseconds
const APPEAR = 180; // spines fade in, all together, packed at the left
const HOLD = 380; // pause on the packed shelf
const SPREAD = 760; // each book slides to its spot while swinging open
const MAX_STAGGER = 70; // gap between neighbours leaving, shrunk for long rows...
const MAX_STAGGER_TOTAL = 520; // ...so a row never staggers longer than this
const GAP = 2; // px between spines on the packed shelf
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Lists that have already played since the page loaded. Lives in memory,
// so reloading the page plays them again.
const played = new Set<string>();

/**
 * Shelf reveal: each row starts as a packed shelf of spines on the left, then fans out like a
 * hand of cards. The rightmost book leaves first and sits on top; each book to its left follows,
 * hidden underneath until it has fanned out, so no spine ever sits on top of an open cover.
 * Every book slides and swings open in one smooth motion.
 *
 * Mark each book with `data-shelf-item`, the 3D book with `data-shelf-cover` (see <ShelfBook>,
 * whose `data-spine` gives the spine's thickness), and text underneath with `data-shelf-caption`.
 * Each `key` plays once per page load: coming back to a list it has already shown
 * skips straight to the covers. Usually used through <ShelfReveal>.
 */
export function useShelfReveal(ref: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    // Covers are hidden until this point (see globals.css), so release them now
    list.dataset.shelfReveal = "running";
    if (played.has(key)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      played.add(key);
      return;
    }

    const items = [...list.querySelectorAll<HTMLElement>("[data-shelf-item]")];
    // Group by row, so a wrapped grid gets one shelf per row
    const rows = new Map<number, HTMLElement[]>();
    for (const el of items) rows.set(el.offsetTop, [...(rows.get(el.offsetTop) ?? []), el]);

    const running: Animation[] = [];
    for (const row of rows.values()) {
      const rowStart = row[0].offsetLeft;
      const stagger = Math.min(MAX_STAGGER, MAX_STAGGER_TOTAL / Math.max(1, row.length - 1));
      let shelfX = rowStart; // where the next spine goes on the packed shelf

      row.forEach((el, col) => {
        const book = el.querySelector<HTMLElement>("[data-shelf-cover]") ?? el;
        const thickness = book.offsetWidth * Number(book.dataset.spine ?? 0.06);
        // Turned sideways, a book hinges on its left edge and its spine sits just left of
        // that hinge, so shift by one spine width to line the spine up on the shelf.
        const dx = shelfX + thickness - el.offsetLeft;
        shelfX += thickness + GAP;

        // Rightmost leaves first; later books in the row are drawn on top of earlier ones,
        // so each book stays covered by its right-hand neighbour until it has fanned out.
        const leaveAt = APPEAR + HOLD + (row.length - 1 - col) * stagger;
        const duration = leaveAt + SPREAD;
        // Move first, then add depth, so every book is seen head-on from where it sits
        const sideways = `translateX(${dx}px) perspective(1000px) rotateY(90deg)`;

        book.style.transformOrigin = "left center";
        el.style.position = "relative";
        el.style.zIndex = String(col + 1);
        running.push(
          book.animate(
            [
              { transform: sideways, offset: 0 },
              { transform: sideways, offset: leaveAt / duration, easing: EASE },
              { transform: "translateX(0) perspective(1000px) rotateY(0deg)", offset: 1 },
            ],
            { duration, fill: "backwards" }
          ),
          // Fade on the outer item: fading the 3D book itself would flatten it
          el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: APPEAR, fill: "backwards" })
        );

        const caption = el.querySelector<HTMLElement>("[data-shelf-caption]");
        if (caption) {
          running.push(
            caption.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
              duration: 300,
              delay: duration - 220,
              easing: "ease-out",
              fill: "backwards",
            })
          );
        }
      });
    }

    // Only count it as played once it finishes. Leaving mid-way means it plays again next time.
    const reset = () => items.forEach((el) => (el.style.zIndex = ""));
    Promise.all(running.map((a) => a.finished)).then(
      () => {
        played.add(key);
        reset();
      },
      () => {}
    );

    return () => {
      running.forEach((a) => a.cancel());
      reset();
    };
    // Only re-check when the list changes, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
