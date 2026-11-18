"use client";

import { useState } from "react";
import type { Book } from "@/lib/data";
import { ProgressBar } from "../ProgressBar";

// For the concept demo: what an unfiltered burst of one-star ratings would do.
function withBurst(c: NonNullable<Book["community"]>) {
  const burst = Math.max(3, Math.round(c.count * 0.18));
  const counts = c.bars.map((p) => (p / 100) * c.count);
  counts[4] += burst;
  const total = c.count + burst;
  const avg = (c.avg * c.count + burst) / total;
  return { avg, count: total, bars: counts.map((n) => Math.round((n / total) * 100)), burst };
}

/** Star distribution with a "verified readers" switch that filters out review-bombing. */
export function RatingBreakdown({ community }: { community: Book["community"] }) {
  const [verified, setVerified] = useState(true);

  if (!community || community.count < 10) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 text-[14px] text-muted">
        <p className="font-serif text-[22px] font-medium text-ink">Not enough ratings yet</p>
        <p className="mt-2">We show a breakdown once at least 10 readers have rated it.</p>
      </div>
    );
  }

  const burst = withBurst(community);
  const data = verified ? community : burst;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <p className="font-serif text-[30px] font-medium leading-none tabular-nums">{data.avg.toFixed(1)}</p>
          <p className="max-w-[160px] pt-1 text-[12px] leading-snug text-muted">
            from {data.count} {verified ? "Open Library readers" : "accounts, unfiltered"}
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
              className={`absolute left-0 top-[3px] h-[18px] w-[18px] rounded-full bg-on-accent transition-transform duration-200 ${
                verified ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
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
          ? `Real ratings from Open Library. Turn the switch off to see how ${burst.burst} one-star ratings from brand-new accounts would drag the score down.`
          : `Concept demo: ${burst.burst} one-star ratings from new accounts added. The verified view filters these out.`}
      </p>
    </div>
  );
}
