# Greatreadz

**Unsolicited Goodreads redesign concept. Not monetized and not affiliated with Goodreads or Amazon.**

**Live site: [greatreadz.designsbyrich.com](https://greatreadz.designsbyrich.com)**

Greatreadz is a book-tracking app concept, built as a working Next.js prototype. It covers six sections in light and dark mode, on phones and desktops. Together they make one loop: find a book, log it, see your progress.

| Screen | What it fixes |
| --- | --- |
| Home | A calm feed: what you're reading, friends' finished books, one smart pick |
| Book page | Cover first, one clear shelf button, people you follow before strangers, review-bombing filtered out |
| Log and rate | Status, pages and a rating in two taps, with half and quarter stars and an autosaved note |
| My shelf | Every shelf at a glance, one tab per shelf, and a Stats tab: books, pages, moods, challenge |
| Discover | One search entry point, browse by mood and pace |
| Community | Friends' activity without an algorithm, book clubs and the challenge, surfaced instead of buried under "More" |

## Design decisions
- **One accent colour + warm neutrals.** Paper tones replace the old brown and beige. The forest green turns mint in dark mode, and text passes WCAG AA in both themes.
- **Serif for titles, sans for interface.** Newsreader + Inter.
- **Light-touch social.** Friend activity with a Cheer button, no endless feed.
- **Recommendations explain themselves.** "Matched to the 7 books you rated 4 stars or higher, not to what's trending."
- **Motion with a job.** Stars pop as they fill, progress bars ease to their new value, and shelves reveal themselves: books start as spines, then fan out to their covers. All of it switches off with reduced motion.

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:3000. Try **Update progress** on Home, the **Verified readers** switch on `/book/red-rising`, and the mood buttons on `/discover`.

## Stack
Next.js (App Router), React, Tailwind CSS v4. No backend: the shelves (real books and ratings; friends are sample content) live in `lib/data.ts`, and any changes a visitor makes are saved in their browser.

The original design files are in `public/` as SVGs.

## Credits
Book covers, page counts and reader ratings come from [Open Library](https://openlibrary.org). Cover artwork belongs to the books' publishers and is used here only to illustrate the concept.
