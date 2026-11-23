# Greatreadz

> A calmer feed, finer ratings, one search and a true dark mode. An unsolicited Goodreads redesign concept. Not monetized and not affiliated with Goodreads or Amazon.

This is a portfolio piece, built from the design files in `public/` (5 screens × desktop/phone × light/dark) and the concept brief.

## Brand Identity
- **Personality:** modern and cozy. Keeps the warm, bookish feel and drops the clutter and the brown.
- **Colors (light):** paper background `#f7f2ea`, card white `#fffcf7`, ink `#1e1a16`, muted text `#665d52`, lines `#e4dbcd`, one forest-green accent `#2f6b50` (soft version `#e2ede5`).
- **Colors (dark):** background `#14120f`, cards `#1f1c18`, text `#f1eadf`, muted `#a79e91`, mint accent `#82c9a6`.
- **Fonts:** Newsreader (serif, for titles and numbers) + Inter (for everything else).
- **Book covers:** real covers from Open Library, saved in `public/covers/`. Any book without one falls back to a plain coloured cover with the title in serif (colours live in `lib/data.ts`).

## Real vs sample content
- **Real (Rich's own):** every book on the shelves, Rich's ratings, current page in Morning Star (82%) and Empire of the Vampire (5%), where he stopped in Between Two Kingdoms (50%), and the Want to read list (the rest of Red Rising and all of A Song of Ice and Fire).
- **Worked out from that:** books read, pages turned, average rating, reading taste, the "6 by Stephen King" tag, the Different Seasons achievement and the recommendation match %.
- **Real public data:** book years, page counts (common first editions; the four novellas are their share of *Different Seasons*) and the star breakdowns, which come from Open Library readers.
- **Placeholders to change:** the 2026 reading goal (set to 12 in `lib/data.ts`, `CHALLENGE_GOAL`), and the assumption that all 13 finished books were read in 2026.
- **Sample:** friends (Maya, Jonah, Priya, Sam, Lena), their ratings, reviews, Community updates, replies and book clubs, challenge numbers, and the "Verified readers" one-star burst, which is a demo of the idea.

## Pages
- **Home** (`/`) — greeting, Morning Star with its progress bar plus a smaller "also reading" row for Empire of the Vampire, friends' recently finished books (a sideways-scrolling shelf), one pick for your taste (The Long Walk), the reading challenge and three friend updates with a Cheer button.
- **Book page** (`/book/the-long-walk`, `/book/golden-son` and every other book) — big cover, a shelf button, "Rate or log it", where to get it, your rating if you've read it, real Open Library star breakdown with a **Verified readers** switch, a summary worked out from those ratings, friends' reviews (sample, only on a couple of books) and similar books you haven't read.
- **Community** (`/community`) — friends' activity feed (filter by friend, Cheer, reply), your friends, book clubs to join, and the challenge leaderboard. Sample social content; the books are real.
- **Discover** (`/discover`) — one search box (try typing "Austen"), mood buttons and a pace switch that change the picks, genres and community cards.
- **My shelf** (`/my-books`) — tabs: **All** (opens first: every shelf as its own scrolling row on a shelf ledge, with "See all"), then **Reading**, **Want to read**, **Read** (covers with your ratings) and **Didn't finish** as full shelves with an add button at the end, then **Stats** (your numbers, pages per book, reading taste, the friends challenge and the Different Seasons achievement). A **Covers / Spines** toggle switches any of the shelf tabs to a bookcase view with books shown spine-out.
- **Log and rate** — not a separate page: it pops up when you press **Update progress**, **Mark as finished**, **Rate or log it** or **Log**. On phones it slides up from the bottom; on bigger screens it's a centred card.

## Components
- **Sidebar** (`components/Navigation.tsx`) — Greatreadz logo (no "concept" tag), Home / My shelf / Discover / Community, the "unsolicited concept" note, and the light/dark switch. Shown on laptops and desktops.
- **Bottom tab bar** (same file) — Home / My shelf / Discover / Community on phones and tablets.
- **Book cover** (`components/BookCover.tsx`) — draws any book's cover at any size.
- **Shelf reveal** (`components/ShelfReveal.tsx`) — a row or grid of books that plays the spine-to-cover animation.
- **Scroll shelf** (`components/ScrollShelf.tsx`) — a sideways-scrolling row of books with arrows on desktop and an optional shelf ledge; used for Home's friends row and the rows on My shelf.
- **Bookcase** (`components/my-books/Bookcase.tsx`) — the spine view on My shelf: books spine-out on planks. Spine design is shared with the reveal in `components/Spine.tsx`.
- **Shelf book** (`components/ShelfBook.tsx`) — a cover with a spine attached, used in those rows. Spine colours live in `lib/spines.ts` (sampled from the covers); thickness comes from the page count.
- **Add books sheet** (`components/my-books/AddBooksSheet.tsx`) — opened from the add button on any shelf; search the catalogue, then add straight away (Want to read) or log the page or rating (the other shelves).
- **Log sheet** (`components/LogSheet.tsx`) — status, ±10 pages, half-star taps, quarter-star slider, a note that auto-saves as a draft.
- **Reading memory** (`components/ReadingProvider.tsx`) — remembers your progress, rating and shelves in your browser so the pages stay in sync.
- **Light/dark switch** (`components/ThemeToggle.tsx`) — follows the device by default, remembers your choice once you press it.

## Interactions worth showing in the case study
- Stars fill as you tap: tap once for a whole star, tap the same star again for a half. The slider does quarter stars.
- Progress bars ease to their new value when you log pages.
- The bar chart grows in when My books opens.
- Mood and pace selections reorder the Discover picks.
- The shelf reveal: spines first, then covers fanning out like a hand of cards (rightmost on top), once per list per visit (`components/useShelfReveal.ts`; timings are at the top of that file).
- Everything respects "reduce motion" on the device.

## Recent Changes
- 2026-11-23: Fixed Community opening zoomed out on phones. The friend filter chips were stretching the page wider than the screen; they now scroll inside their own row.
- 2026-11-19: Added a **Covers / Spines** toggle on My shelf. Spines shows every shelf as a real bookcase: books stand spine-out on planks, coloured from their real covers, thicker for longer books and slightly varied in height. Hover lifts a book with its title (and rating or progress); click opens it. Books you're reading get a bookmark ribbon. The choice is remembered in the browser.
- 2026-11-19: Added **Community** (`/community`), a new section under Discover in the sidebar and phone tab bar. It has a calm friends' activity feed (Today / Yesterday / This week) with Cheer and replies and a filter by friend, a Your friends list (what each is reading, books this year, books you've both read), book clubs you can join, and a compact challenge leaderboard. Discover's community cards and Home's friends' activity now link to it. Friends, updates, replies and clubs are sample content.
- 2026-11-19: The disclosure now says "Not monetized and not affiliated with Goodreads or Amazon" everywhere.
- 2026-11-18: Removed the "Shelves" list from the sidebar. It repeated the My shelf tabs, so the sidebar is now just Home, My shelf and Discover.
- 2026-11-18: "My books" is now **My shelf**, and sits under Home and above Discover in the sidebar and phone tab bar. Its first tab, **All**, shows every shelf at once as stacked, sideways-scrolling rows standing on a shelf ledge, each with "See all" and an add tile. Tabs: All · Reading · Want to read · Read · Didn't finish · Stats.
- 2026-11-18: Stats is now its own tab on My books, first and open by default. The Read tab is a book shelf like the others (covers with your ratings, in reading order, plus a "Log a finished book" tile), and the old Finished list was removed from Stats in favour of a "See all books you've read" link.
- 2026-11-18: Reworked the shelf reveal into one smooth motion that fans out like a hand of cards: the rightmost book leaves the packed shelf first and sits on top, and each book to its left follows from underneath, so no spine ever sits on top of an open cover. The total stagger is capped, so long rows don't drag.
- 2026-11-18: The shelf reveal now plays once per list per visit. Coming back to a tab skips it, and reloading the page plays it again. Discover plays it on first view, not on every filter change.
- 2026-11-18: "Friends just finished" on Home now has 12 books (sample friends) in a sideways-scrolling shelf, with arrow buttons on desktop and a soft fade on the edge that has more books.
- 2026-11-18: The shelf reveal now shows real spines instead of squashed covers. Each book is a small 3D object: the spine uses a colour sampled from the left edge of its real cover, shows the title and author's surname, and is thicker for longer books.
- 2026-11-18: Added the "shelf reveal" animation. Books start as spines packed at the left like a bookshelf, then slide out to the right one by one, swinging open to show their covers. It plays when switching shelf tabs on My books, when changing mood or pace on Discover, and when Home or a book page loads. It's skipped for visitors who turn on "reduce motion".
- 2026-11-18: Every shelf on My books now has an add button: "Add a book" (Want to read), "Start a book" (Reading), "Log a finished book" (end of the Finished list) and "Log a book" (Didn't finish). The last three open the log sheet so you can set the page or rating, and can also move books from another shelf. The stats on My books and the Home challenge card now update as soon as a book is logged.
- 2026-11-18: Added an "Add a book" tile at the end of the Want to read shelf. It opens a search of the catalogue (best matches first) where you can add or undo books. Additions are saved in each visitor's own browser; to add a book for everyone, add it to `lib/data.ts`.
- 2026-11-18: Added Be Useful (3.75), Greenlights (3), Living with a SEAL (4.5) and Can't Hurt Me (2.5) to Read, and Between Two Kingdoms to Didn't finish at 50%, all with real covers. Read is now 13, which passes the placeholder goal of 12, so the challenge shows "Goal reached".
- 2026-11-18: Removed the "concept" tag next to the logo, lined the logo up with the page greeting, and moved the "Picked for your taste" label above its card so it lines up with "Currently reading". Site is live on Vercel at greatreadz.designsbyrich.com.
- 2026-11-18: Renamed the app to Greatreadz. "Buy on Amazon" is now "Buy on Yamazon" and Kindle is "Quindle". The real names stay only in the "not affiliated" notes.
- 2026-11-18: Added real book covers for all 32 books (English editions, checked by eye), with Open Library credited in the sidebar.
- 2026-11-18: Swapped the placeholder books for Rich's real shelves and ratings. All stats are now worked out from them. Added real Open Library ratings, per-book progress (two books on the go) and more real recommendations.
- 2026-11-18: Built all five screens from the design files, for phones and desktops, in light and dark mode. Added the working log-and-rate flow.

## How to Customize
- **Change colours:** edit the values at the top of `app/globals.css` (light first, then dark).
- **Change Community content:** edit `lib/social.ts` (friends, updates, replies and clubs).
- **Change books or ratings:** edit `lib/data.ts`. Each book has a `shelf` ("reading", "want", "read" or "dnf"), a `myRating` and, for books in progress, a `page`. The stats update by themselves.
- **Add a new book:** copy one of the entries in `lib/data.ts` and give it a new short name (like `"emma"`). It gets its own page at `/book/emma` automatically. Leave out `shelf` and it becomes a possible recommendation instead.
- **Go back to coloured covers:** set `USE_REAL_COVERS` to `false` in `lib/data.ts`.
- **Add a cover for a new book:** save it as `public/covers/<short-name>.jpg` and add the short name to the `COVERS` list in `lib/data.ts`.
- **Set your reading goal:** change `CHALLENGE_GOAL` in `lib/data.ts`.
- **Design files:** the original SVG designs are in `public/`. The brief and research PDFs are kept on this computer only and are not uploaded to GitHub.
