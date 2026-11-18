"use client";

import { useEffect, useRef, useState } from "react";
import { friendsFinished } from "@/lib/data";
import { BackIcon, ChevronRightIcon } from "../Icons";
import { ShelfBook } from "../ShelfBook";
import { ShelfReveal } from "../ShelfReveal";
import { Eyebrow, Rating } from "../ui";

// A sideways-scrolling shelf of what friends just finished.
// Swipe on phones; on desktop the arrows next to the heading page through it.
export function FriendsFinished() {
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

  return (
    <section aria-labelledby="friends" className="mt-6 lg:mt-12">
      <div className="mb-3 flex items-center justify-between lg:mb-4">
        <Eyebrow>
          <span id="friends">Friends just finished</span>
        </Eyebrow>
        <div className="hidden gap-2 lg:flex">
          <ArrowButton label="Scroll back" disabled={edges.start} onClick={() => page(-1)}>
            <BackIcon size={16} />
          </ArrowButton>
          <ArrowButton label="Scroll forward" disabled={edges.end} onClick={() => page(1)}>
            <ChevronRightIcon size={16} />
          </ArrowButton>
        </div>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar -mx-5 snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-3 lg:mx-0 lg:scroll-px-0 lg:px-0"
        // Soft fade on whichever side has more books to scroll to
        style={{
          maskImage: `linear-gradient(90deg, ${edges.start ? "#000" : "transparent"}, #000 40px, #000 calc(100% - 40px), ${
            edges.end ? "#000" : "transparent"
          })`,
        }}
      >
        <ShelfReveal replayKey="friends" className="flex gap-3.5 lg:gap-5">
          {friendsFinished.map((f) => (
            <li key={`${f.friend}-${f.slug}`} data-shelf-item className="w-[107px] shrink-0 snap-start lg:w-[126px]">
              <ShelfBook slug={f.slug} />
              <p data-shelf-caption className="mt-2 flex items-center justify-between text-[13px] lg:mt-3 lg:text-[14px]">
                <span className="font-semibold">{f.friend}</span>
                <Rating value={f.rating} className="text-[12px] text-muted lg:text-[13px]" />
              </p>
            </li>
          ))}
        </ShelfReveal>
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
