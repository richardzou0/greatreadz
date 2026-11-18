"use client";

import { friendsFinished } from "@/lib/data";
import { ScrollShelf } from "../ScrollShelf";
import { ShelfBook } from "../ShelfBook";
import { Eyebrow, Rating } from "../ui";

// A sideways-scrolling shelf of what friends just finished.
export function FriendsFinished() {
  return (
    <ScrollShelf
      className="mt-6 lg:mt-12"
      replayKey="friends"
      heading={
        <Eyebrow>
          <span id="friends">Friends just finished</span>
        </Eyebrow>
      }
    >
      {friendsFinished.map((f) => (
        <li key={`${f.friend}-${f.slug}`} data-shelf-item className="w-[107px] shrink-0 snap-start lg:w-[126px]">
          <ShelfBook slug={f.slug} />
          <p data-shelf-caption className="mt-2 flex items-center justify-between text-[13px] lg:mt-3 lg:text-[14px]">
            <span className="font-semibold">{f.friend}</span>
            <Rating value={f.rating} className="text-[12px] text-muted lg:text-[13px]" />
          </p>
        </li>
      ))}
    </ScrollShelf>
  );
}
