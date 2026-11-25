"use client";

import { useState } from "react";

/**
 * Shares the current page with the phone's share sheet, or copies the link where that
 * isn't available. Pass `text` to share a message with the link.
 */
export function ShareButton({
  title,
  text,
  className = "",
  children,
  doneLabel = "Link copied",
  label,
}: {
  title: string;
  text?: string;
  className?: string;
  children: React.ReactNode;
  doneLabel?: React.ReactNode;
  /** Accessible name, for icon-only buttons */
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(text ? `${text} ${url}` : url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button onClick={share} aria-label={copied ? undefined : label} aria-live="polite" className={className}>
      {copied ? doneLabel : children}
    </button>
  );
}
