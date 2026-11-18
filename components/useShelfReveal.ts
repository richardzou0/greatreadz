"use client";

import { useLayoutEffect, type RefObject } from "react";

// Timing, in milliseconds
const APPEAR = 180; // spines fade in, all together
const HOLD = 420; // pause on the packed shelf before spreading
const STAGGER = 60; // each book leaves a little after the one to its left
const SPREAD = 750; // time to slide out and swing open
const GAP = 2; // px between spines on the shelf
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Lists that have already played since the page loaded. Lives in memory,
// so reloading the page plays them again.
const played = new Set<string>();

/**
 * Shelf reveal: each row starts as a packed shelf of spines on the left,
 * then the books slide out to the right one by one, swinging open to show their covers.
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
      let shelfX = rowStart; // where the next spine goes
      row.forEach((el, col) => {
        const book = el.querySelector<HTMLElement>("[data-shelf-cover]") ?? el;
        const thickness = book.offsetWidth * Number(book.dataset.spine ?? 0.06);
        // Turned sideways, the book hinges on its left edge and its spine sits just left of
        // that hinge, so shift by one spine width to line it up on the shelf.
        const dx = shelfX + thickness - el.offsetLeft;
        shelfX += thickness + GAP;

        const leaveAt = APPEAR + HOLD + col * STAGGER;
        const duration = leaveAt + SPREAD;
        // Move first, then add depth, so every book is seen head-on from where it sits
        const sideways = `translateX(${dx}px) perspective(1000px) rotateY(90deg)`;

        book.style.transformOrigin = "left center";
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
              duration: 320,
              delay: duration - 200,
              easing: "ease-out",
              fill: "backwards",
            })
          );
        }
      });
    }

    // Only count it as played once it finishes. Leaving mid-way means it plays again next time.
    Promise.all(running.map((a) => a.finished)).then(
      () => played.add(key),
      () => {}
    );

    return () => running.forEach((a) => a.cancel());
    // Only re-check when the list changes, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
