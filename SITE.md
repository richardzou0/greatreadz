# Greatreadz

> A calmer feed, finer ratings, one search and a true dark mode. An unsolicited Goodreads redesign concept, not affiliated with Goodreads or Amazon.

This is a portfolio piece, built from the design files in `public/` (5 screens × desktop/phone × light/dark) and the concept brief.

## Brand Identity
- **Personality:** modern and cozy. Keeps the warm, bookish feel and drops the clutter and the brown.
- **Colors (light):** paper background `#f7f2ea`, card white `#fffcf7`, ink `#1e1a16`, muted text `#665d52`, lines `#e4dbcd`, one forest-green accent `#2f6b50` (soft version `#e2ede5`).
- **Colors (dark):** background `#14120f`, cards `#1f1c18`, text `#f1eadf`, muted `#a79e91`, mint accent `#82c9a6`.
- **Fonts:** Newsreader (serif, for titles and numbers) + Inter (for everything else).
- **Book covers:** real covers from Open Library, saved in `public/covers/`. Any book without one falls back to a plain coloured cover with the title in serif (colours live in `lib/data.ts`).

## Real vs sample content
- **Real (Rich's own):** every book on the shelves, Rich's ratings, current page in Morning Star (82%) and Empire of the Vampire (5%), and the Want to read list (the rest of Red Rising and all of A Song of Ice and Fire).
- **Worked out from that:** books read, pages turned, average rating, reading taste, the "6 by Stephen King" tag, the Different Seasons achievement and the recommendation match %.
- **Real public data:** book years, page counts (common first editions; the four novellas are their share of *Different Seasons*) and the star breakdowns, which come from Open Library readers.
- **Placeholders to change:** the 2026 reading goal (set to 12 in `lib/data.ts`, `CHALLENGE_GOAL`), and the assumption that all nine books were read in 2026.
- **Sample:** friends (Maya, Jonah, Priya, Sam, Lena), their ratings, reviews and challenge numbers, and the "Verified readers" one-star burst, which is a demo of the idea.

## Pages
- **Home** (`/`) — greeting, Morning Star with its progress bar plus a smaller "also reading" row for Empire of the Vampire, friends' recently finished books, one pick for your taste (The Long Walk), the reading challenge and three friend updates with a Cheer button.
- **Book page** (`/book/the-long-walk`, `/book/golden-son` and every other book) — big cover, a shelf button, "Rate or log it", where to get it, your rating if you've read it, real Open Library star breakdown with a **Verified readers** switch, a summary worked out from those ratings, friends' reviews (sample, only on a couple of books) and similar books you haven't read.
- **Discover** (`/discover`) — one search box (try typing "Austen"), mood buttons and a pace switch that change the picks, genres and community cards.
- **My books** (`/my-books`) — shelf tabs (Reading, Want to read, Read, Didn't finish), your stats, a pages-per-book chart (there are no finish dates, so no monthly chart), reading taste, the friends challenge, the Different Seasons achievement and the Finished list in the order you read them.
- **Log and rate** — not a separate page: it pops up when you press **Update progress**, **Mark as finished**, **Rate or log it** or **Log**. On phones it slides up from the bottom; on bigger screens it's a centred card.

## Components
- **Sidebar** (`components/Navigation.tsx`) — Greatreadz logo, Home / Discover / My books, shelf counts, the "unsolicited concept" note, and the light/dark switch. Shown on laptops and desktops.
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
- 2026-11-18: Renamed the app to Greatreadz. "Buy on Amazon" is now "Buy on Yamazon" and Kindle is "Quindle". The real names stay only in the "not affiliated" notes.
- 2026-11-18: Added real book covers for all 32 books (English editions, checked by eye), with Open Library credited in the sidebar.
- 2026-11-18: Swapped the placeholder books for Rich's real shelves and ratings. All stats are now worked out from them. Added real Open Library ratings, per-book progress (two books on the go) and more real recommendations.
- 2026-11-18: Built all five screens from the design files, for phones and desktops, in light and dark mode. Added the working log-and-rate flow.

## How to Customize
- **Change colours:** edit the values at the top of `app/globals.css` (light first, then dark).
- **Change books or ratings:** edit `lib/data.ts`. Each book has a `shelf` ("reading", "want", "read" or "dnf"), a `myRating` and, for books in progress, a `page`. The stats update by themselves.
- **Add a new book:** copy one of the entries in `lib/data.ts` and give it a new short name (like `"emma"`). It gets its own page at `/book/emma` automatically. Leave out `shelf` and it becomes a possible recommendation instead.
- **Go back to coloured covers:** set `USE_REAL_COVERS` to `false` in `lib/data.ts`.
- **Add a cover for a new book:** save it as `public/covers/<short-name>.jpg` and add the short name to the `COVERS` list in `lib/data.ts`.
- **Set your reading goal:** change `CHALLENGE_GOAL` in `lib/data.ts`.
- **Design files:** the original SVG designs are in `public/`. The brief and research PDFs are kept on this computer only and are not uploaded to GitHub.
