"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./Icons";

type Theme = "light" | "dark";
const KEY = "gr-concept-theme";
const EVENT = "gr-theme-change";

function readTheme(): Theme {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {}
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

// Starts from the device setting, then remembers the reader's choice.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);

  // Keep the page in step with a saved choice (the CSS handles "follow the device").
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) document.documentElement.dataset.theme = saved;
    } catch {}
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink ${className}`}
    >
      {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
    </button>
  );
}
