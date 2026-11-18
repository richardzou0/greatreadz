"use client";

import { useState } from "react";
import { ratingBreakdown } from "@/lib/data";
import { ProgressBar } from "../ProgressBar";

/** Star distribution with a "verified readers" switch that filters out review-bombing. */
export function RatingBreakdown() {
  const [verified, setVerified] = useState(true);
  const data = verified ? ratingBreakdown.verified : ratingBreakdown.all;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <p className="font-serif text-[30px] font-medium leading-none tabular-nums">{data.avg.toFixed(1)}</p>
          <p className="max-w-[150px] pt-1 text-[12px] leading-snug text-muted">
            {verified ? "from readers who logged it" : "from every account, unfiltered"}
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <span className="max-w-[64px] text-[12px] font-semibold leading-tight">Verified readers</span>
          <button
            role="switch"
            aria-checked={verified}
            aria-label="Only show verified readers"
            onClick={() => setVerified((v) => !v)}
            className={`relative h-6 w-[39px] rounded-full transition-colors ${verified ? "bg-accent" : "bg-track"}`}
          >
            <span
              className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-on-accent transition-transform duration-200 ${
                verified ? "translate-x-[18px]" : "translate-x-[3px]"
              } left-0`}
            />
          </button>
        </label>
      </div>

      <ul className="mt-4 space-y-2.5">
        {data.bars.map((pct, i) => (
          <li key={i} className="flex items-center gap-3 text-[11px] text-muted">
            <span className="w-2">{5 - i}</span>
            <ProgressBar value={pct} height={6} className="flex-1" />
            <span className="w-7 text-right tabular-nums">{pct}%</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        {verified
          ? "Only counts accounts that shelved and logged this book. A burst of one-star ratings from new accounts last week is hidden."
          : "Showing every rating, including a burst of one-star ratings from new accounts last week."}
      </p>
    </div>
  );
}
