# Goodreads, reimagined

> An unsolicited redesign concept of Goodreads: a calmer feed, finer ratings, one search and a true dark mode. Not affiliated with Goodreads or Amazon.

This is a portfolio piece, built from the design files in `public/` (5 screens × desktop/phone × light/dark) and the concept brief.

## Brand Identity
- **Personality:** modern and cozy. Keeps the warm, bookish feel and drops the clutter and the brown.
- **Colors (light):** paper background `#f7f2ea`, card white `#fffcf7`, ink `#1e1a16`, muted text `#665d52`, lines `#e4dbcd`, one forest-green accent `#2f6b50` (soft version `#e2ede5`).
- **Colors (dark):** background `#14120f`, cards `#1f1c18`, text `#f1eadf`, muted `#a79e91`, mint accent `#82c9a6`.
- **Fonts:** Newsreader (serif, for titles and numbers) + Inter (for everything else).
- **Book covers:** plain coloured "stand-in" covers with the title in serif. Each book's colour lives in `lib/data.ts`.

## Pages
- **Home** (`/`) — greeting, the book you're reading with a progress bar, friends' recently finished books, one "picked for your taste" suggestion, the reading challenge and three friend updates with a Cheer button.
- **Book page** (`/book/villette`, and every other book) — big cover, a "Want to read" button with a shelf menu, "Rate or log it", where to get it, a rating breakdown with a **Verified readers** switch, a readers' summary, reviews from people you follow and similar books.
- **Discover** (`/discover`) — one search box (try typing "Austen"), mood buttons and a pace switch that change the picks, genres and community cards.
- **My books** (`/my-books`) — shelf tabs (Reading, Want to read, Read, Didn't finish), your 2026 stats, a pages-per-month chart, reading taste, the friends challenge, an achievement and a reading diary.
- **Log and rate** — not a separate page: it pops up when you press **Update progress**, **Mark as finished**, **Rate or log it** or **Log**. On phones it slides up from the bottom; on bigger screens it's a centred card.

## Components
- **Sidebar** (`components/Navigation.tsx`) — logo, Home / Discover / My books, shelf counts, the "unsolicited concept" note, and the light/dark switch. Shown on laptops and desktops.
- **Bottom tab bar** (same file) — Home / Discover / My books on phones and tablets.
- **Book cover** (`components/BookCover.tsx`) — draws any book's cover at any size.
- **Log sheet** (`components/LogSheet.tsx`) — status, ±10 pages, half-star taps, quarter-star slider, a note that auto-saves as a draft.
- **Reading memory** (`components/ReadingProvider.tsx`) — remembers your progress, rating and shelves in your browser so the pages stay in sync.
- **Light/dark switch** (`components/ThemeToggle.tsx`) — follows the device by default, remembers your choice once you press it.

## Interactions worth showing in the case study
- Stars fill as you tap: tap once for a whole star, tap the same star again for a half. The slider does quarter stars.
- Progress bars ease to their new value when you log pages.
- The bar chart grows in when My books opens.
- Mood and pace selections reorder the Discover picks.
- Everything respects "reduce motion" on the device.

## Recent Changes
- 2026-11-18: Built all five screens from the design files, for phones and desktops, in light and dark mode. Added the working log-and-rate flow.

## How to Customize
- **Change colours:** edit the values at the top of `app/globals.css` (light first, then dark).
- **Change books, friends, stats or reviews:** edit `lib/data.ts`. Every screen reads from there.
- **Add a new book:** copy one of the entries in `lib/data.ts`, give it a new short name (like `"emma"`), and it gets its own page at `/book/emma` automatically.
- **Design files:** the original SVG designs are in `public/`. The brief and research PDFs are kept on this computer only and are not uploaded to GitHub.
