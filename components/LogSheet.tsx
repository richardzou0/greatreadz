"use client";

import { useEffect, useRef, useState } from "react";
import { getBook } from "@/lib/data";
import { BookCover } from "./BookCover";
import { CheckIcon, CloseIcon, StarFill } from "./Icons";
import { ProgressBar } from "./ProgressBar";
import type { Log, Status } from "./ReadingProvider";

const STATUSES: { key: Status; label: string }[] = [
  { key: "reading", label: "Reading" },
  { key: "finished", label: "Finished" },
  { key: "dnf", label: "Didn’t finish" },
];

const draftKey = (slug: string) => `gr-concept-draft-${slug}`;

function readDraft(slug: string) {
  try {
    return localStorage.getItem(draftKey(slug)) ?? "";
  } catch {
    return "";
  }
}

// The two-tap log: pick a status, nudge the page, tap a star. Everything else is optional.
// Phone: slides up from the bottom. Desktop: a centred card.
export function LogSheet({
  slug,
  initial,
  onClose,
  onSave,
}: {
  slug: string;
  initial: Log;
  onClose: () => void;
  onSave: (log: Log) => void;
}) {
  const book = getBook(slug);
  const [status, setStatus] = useState<Status>(initial.status);
  const [page, setPage] = useState(initial.page);
  const [rating, setRating] = useState(initial.rating);
  const [note, setNote] = useState(() => initial.note || readDraft(slug));
  const [draftSaved, setDraftSaved] = useState(false);
  const [popped, setPopped] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const pages = book?.pages ?? 1;
  const shownPage = status === "finished" ? pages : page;
  const pct = Math.round((shownPage / pages) * 100);

  // Close on Escape, and stop the page behind from scrolling.
  // Latest close handler, so the setup below runs once per open (not on every re-render).
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  // Autosave the note as you type.
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(slug), note);
        setDraftSaved(true);
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [note, slug]);

  if (!book) return null;

  const tapStar = (i: number) => {
    // Tap once for a whole star; tap the same star again for a half.
    const next = rating === i ? i - 0.5 : i;
    setRating(next);
    setPopped(i);
  };

  const save = () => {
    try {
      localStorage.removeItem(draftKey(slug));
    } catch {}
    onSave({ slug, page: shownPage, status, rating, note });
  };

  const nudge = (d: number) => {
    if (status === "finished") setStatus("reading");
    setPage((p) => Math.max(0, Math.min(pages, (status === "finished" ? pages : p) + d)));
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-backdrop lg:items-center lg:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Log and rate ${book.title}`}
        tabIndex={-1}
        className="animate-sheet lg:animate-modal relative flex max-h-[94dvh] w-full flex-col overflow-y-auto rounded-t-[28px] bg-bg px-5 pb-6 pt-3 shadow-modal outline-none lg:max-w-[880px] lg:rounded-[24px] lg:p-8"
      >
        {/* drag handle (phone) */}
        <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-line lg:hidden" />

        {/* Header */}
        <div className="flex items-start gap-3.5 lg:gap-[18px]">
          <BookCover slug={slug} href={null} size="sm" className="w-11 shrink-0 lg:w-[60px]" />
          <div className="min-w-0 flex-1 pt-1.5 lg:pt-3">
            <h2 className="font-serif text-[21px] font-medium leading-tight lg:text-[30px]">{book.title}</h2>
            <p className="mt-1 text-[12px] text-muted lg:text-[14px]">
              {book.author} · {book.pages} pages<span className="hidden lg:inline">{book.series && ` · ${book.series}`}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-colors hover:bg-accent-soft lg:mt-6"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-x-9 lg:mt-7 lg:grid-cols-2">
          {/* Left: status + progress */}
          <div>
            <div role="radiogroup" aria-label="Status" className="relative grid grid-cols-3 rounded-[24px] border border-line bg-surface p-1">
              <span
                aria-hidden
                className="absolute bottom-1 top-1 rounded-[20px] bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: "calc((100% - 8px) / 3)",
                  left: 4,
                  transform: `translateX(${STATUSES.findIndex((s) => s.key === status) * 100}%)`,
                }}
              />
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  role="radio"
                  aria-checked={status === s.key}
                  onClick={() => setStatus(s.key)}
                  className={`relative z-10 h-11 rounded-[20px] text-[14px] font-semibold transition-colors ${
                    status === s.key ? "text-on-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted lg:mt-9">
              {status === "dnf" ? "Where did you stop?" : status === "finished" ? "All done" : "Where are you?"}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <StepButton label="−10" onClick={() => nudge(-10)} />
              <div className="text-center">
                <p className="font-serif text-[48px] font-medium leading-none tabular-nums lg:text-[56px]">{shownPage}</p>
                <p className="mt-1.5 text-[13px] text-muted">
                  of {pages} · {pct}%
                </p>
              </div>
              <StepButton label="+10" onClick={() => nudge(10)} />
            </div>
            <ProgressBar value={pct} className="mt-3" />
          </div>

          {/* Right: rating + note */}
          <div className="mt-6 lg:mt-0">
            <div className="flex items-baseline justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
                Rate it <span className="font-medium normal-case tracking-normal">(optional)</span>
              </p>
              <p className="font-serif text-[22px] font-medium tabular-nums" aria-live="polite">
                {rating ? `${rating} / 5` : "—"}
              </p>
            </div>
            <div className="mt-2 flex gap-2" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => tapStar(i)}
                  onAnimationEnd={() => setPopped(null)}
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  className={`-m-1 p-1 ${popped === i ? "animate-pop" : ""}`}
                >
                  <span className="block lg:hidden">
                    <StarFill id={`m-star-${i}`} size={44} fill={rating - (i - 1)} />
                  </span>
                  <span className="hidden lg:block">
                    <StarFill id={`d-star-${i}`} size={52} fill={rating - (i - 1)} />
                  </span>
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.25}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              aria-label="Rating in quarter stars"
              className="rating-slider mt-4 w-[252px] lg:w-[292px]"
              style={{ ["--fill" as string]: `${(rating / 5) * 100}%` }}
            />
            <p className="mt-3 text-[12px] text-muted">Slide for quarter stars</p>

            <label htmlFor="quick-thoughts" className="mt-6 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
              Quick thoughts <span className="font-medium normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id="quick-thoughts"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setDraftSaved(false);
              }}
              placeholder="A line for future you…"
              className="mt-2 h-[84px] w-full resize-none rounded-[14px] border border-line bg-surface px-4 py-3 text-[15px] placeholder:text-muted focus:border-accent focus:outline-none lg:h-[120px]"
            />
            <p className="mt-2 flex items-center gap-2 text-[12px] text-muted">
              <CheckIcon size={13} className={draftSaved ? "text-accent" : ""} />
              <span className="lg:hidden">Draft saved on this phone. Syncs when you&apos;re online.</span>
              <span className="hidden lg:inline">Draft saved on this device. Syncs when you&apos;re online.</span>
            </p>

            <div className="mt-8 hidden justify-end gap-2.5 lg:flex">
              <button onClick={onClose} className="h-12 rounded-full border border-line px-[22px] text-[15px] font-semibold transition-colors hover:bg-surface">
                Cancel
              </button>
              <button onClick={save} className="h-12 rounded-full bg-accent px-7 text-[15px] font-semibold text-on-accent transition-transform hover:scale-[1.03] active:scale-[0.98]">
                Save
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={save}
          className="mt-10 h-[52px] w-full shrink-0 rounded-full bg-accent text-[16px] font-semibold text-on-accent transition-transform active:scale-[0.98] lg:hidden"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function StepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line bg-surface text-[15px] font-semibold transition-all hover:border-accent active:scale-90"
    >
      {label}
    </button>
  );
}
