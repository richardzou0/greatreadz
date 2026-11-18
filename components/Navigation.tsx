"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shelves } from "@/lib/data";
import { BooksIcon, CompassIcon, HomeIcon } from "./Icons";
import { useReading } from "./ReadingProvider";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/discover", label: "Discover", Icon: CompassIcon },
  { href: "/my-books", label: "My books", Icon: BooksIcon },
];

// Book pages count as part of Home, like in the phone designs.
function useActive() {
  const path = usePathname();
  return (href: string) => (href === "/" ? path === "/" || path.startsWith("/book") : path.startsWith(href));
}

/** Left column on laptops and desktops. */
export function Sidebar() {
  const isActive = useActive();
  const { onShelf } = useReading();
  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-line bg-surface px-[18px] pb-7 pt-6 lg:flex">
      <Link href="/" className="flex items-baseline gap-3 px-2.5">
        <span className="font-serif text-[24px] font-semibold tracking-tight">Greatreadz</span>
        <span className="text-[11px] font-semibold text-muted">concept</span>
      </Link>

      <nav aria-label="Main" className="mt-7 flex flex-col gap-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors ${
                active ? "bg-accent-soft font-semibold text-accent" : "font-medium hover:bg-accent-soft/60"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-9 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Shelves</p>
      <ul className="mt-2.5">
        {shelves.slice(0, 3).map((s) => (
          <li key={s.key}>
            <Link
              href={`/my-books?shelf=${s.key}`}
              className="flex h-11 items-center justify-between rounded-lg px-3 text-[14px] transition-colors hover:bg-accent-soft/60"
            >
              {s.label}
              <span className="text-muted">{onShelf(s.key).length}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <p className="mb-5 px-2.5 text-[11px] leading-relaxed text-muted">
          Unsolicited Goodreads redesign concept. Not affiliated with Goodreads or Amazon. Covers and ratings from{" "}
          <a href="https://openlibrary.org" className="underline underline-offset-2 hover:text-ink">
            Open Library
          </a>
          .
        </p>
        <div className="flex items-center justify-between px-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-[16px] font-semibold text-accent">R</span>
            <span className="text-[14px] font-semibold">Rich</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

/** Tab bar along the bottom on phones and tablets. */
export function BottomNav() {
  const isActive = useActive();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[84px] grid-cols-3 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1.5 pt-3 text-[11px] transition-colors ${
              active ? "font-semibold text-accent" : "font-medium text-muted"
            }`}
          >
            <Icon size={22} className={active ? "" : "text-ink"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
