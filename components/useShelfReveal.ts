"use client";

import { useLayoutEffect, type RefObject } from "react";

// Timing, in milliseconds
const APPEAR = 160; // spines fade in, all together
const HOLD = 380; // pause on the packed shelf before spreading
const STAGGER = 55; // each book leaves a little after the one to its left
const SPREAD = 700; // time to slide out and swing open
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Shelf reveal: books start as spines packed tightly at the left of each row,
 * then slide out to the right one by one, swinging open to show their covers.
 *
 * Mark each book with `data-shelf-item`, the part that swings with `data-shelf-cover`,
 * and any text underneath with `data-shelf-caption`. Runs again whenever `key` changes.
 * Usually used through <ShelfReveal>, which wires this up for a list.
 */
export function useShelfReveal(ref: RefObject<HTMLElement | null>, key: unknown) {
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    // Covers are hidden until this point (see globals.css), so release them now
    list.dataset.shelfReveal = "running";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = [...list.querySelectorAll<HTMLElement>("[data-shelf-item]")];
    // Group by row, so a wrapped grid gets one shelf per row
    const rows = new Map<number, HTMLElement[]>();
    for (const el of items) rows.set(el.offsetTop, [...(rows.get(el.offsetTop) ?? []), el]);

    const running: Animation[] = [];
    for (const row of rows.values()) {
      const rowStart = row[0].offsetLeft;
      row.forEach((el, col) => {
        const cover = el.querySelector<HTMLElement>("[data-shelf-cover]") ?? el;
        const spine = cover.offsetWidth * 0.17;
        const dx = rowStart + col * spine - el.offsetLeft;
        const leaveAt = APPEAR + HOLD + col * STAGGER;
        const duration = leaveAt + SPREAD;
        // Move first, then add depth, so every spine is seen head-on from where it sits
        const closed = `translateX(${dx}px) perspective(900px) rotateY(80deg)`;

        cover.style.transformOrigin = "left center";
        running.push(
          cover.animate(
            [
              { transform: closed, opacity: 0, filter: "brightness(0.7)", offset: 0 },
              { transform: closed, opacity: 1, filter: "brightness(0.7)", offset: APPEAR / duration },
              { transform: closed, opacity: 1, filter: "brightness(0.7)", offset: leaveAt / duration, easing: EASE },
              { transform: "translateX(0) perspective(900px) rotateY(0deg)", opacity: 1, filter: "brightness(1)", offset: 1 },
            ],
            { duration, fill: "backwards" }
          )
        );

        const caption = el.querySelector<HTMLElement>("[data-shelf-caption]");
        if (caption) {
          running.push(
            caption.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
              duration: 320,
              delay: duration - 180,
              easing: "ease-out",
              fill: "backwards",
            })
          );
        }
      });
    }

    return () => running.forEach((a) => a.cancel());
    // Only replay when the shelf changes, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
