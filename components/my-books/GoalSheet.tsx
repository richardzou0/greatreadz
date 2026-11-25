"use client";

import { useState } from "react";
import { useReading } from "../ReadingProvider";
import { Sheet } from "../Sheet";

/** Set the yearly reading goal. Saved in this browser. */
export function GoalSheet({ onClose }: { onClose: () => void }) {
  const { goal, setGoal, onShelf } = useReading();
  const [draft, setDraft] = useState(goal);
  const read = onShelf("read").length;
  const clamp = (n: number) => Math.max(1, Math.min(365, Math.round(n) || 1));

  return (
    <Sheet title="Your 2026 goal" subtitle={`You've read ${read} so far this year`} onClose={onClose} maxWidth="lg:max-w-[400px]">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setDraft((d) => clamp(d - 1))}
          aria-label="One fewer book"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line bg-surface text-[20px] font-semibold transition-all hover:border-accent active:scale-90"
        >
          −
        </button>
        <label className="text-center">
          <input
            data-autofocus
            type="number"
            inputMode="numeric"
            min={1}
            max={365}
            value={draft}
            onChange={(e) => setDraft(clamp(Number(e.target.value)))}
            aria-label="Books to read this year"
            className="w-28 bg-transparent text-center font-serif text-[56px] font-medium leading-none tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="mt-1 block text-[13px] text-muted">books this year</span>
        </label>
        <button
          onClick={() => setDraft((d) => clamp(d + 1))}
          aria-label="One more book"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line bg-surface text-[20px] font-semibold transition-all hover:border-accent active:scale-90"
        >
          +
        </button>
      </div>
      <p className="mt-4 text-center text-[13px] text-muted">
        {read >= draft ? "You've already hit this. Nice." : `${draft - read} to go, about ${Math.ceil((draft - read) / 1.2)} a month`}
      </p>
      <button
        onClick={() => {
          setGoal(draft);
          onClose();
        }}
        className="mt-6 h-12 w-full rounded-full bg-accent text-[15px] font-semibold text-on-accent transition-transform active:scale-[0.98]"
      >
        Save goal
      </button>
    </Sheet>
  );
}
