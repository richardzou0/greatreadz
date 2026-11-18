# Goodreads, reimagined

**Unsolicited concept. Not affiliated with Goodreads or Amazon.**

A redesign concept for Goodreads, built as a working Next.js prototype. It covers five screens in light and dark mode, on phones and desktops. Together they make one loop: find a book, log it, see your progress.

| Screen | What it fixes |
| --- | --- |
| Home | A calm feed: what you're reading, friends' finished books, one smart pick |
| Book page | Cover first, one clear shelf button, people you follow before strangers, review-bombing filtered out |
| Log and rate | Status, pages and a rating in two taps, with half and quarter stars and an autosaved note |
| My books | Shelves plus a year in reading: books, pages, moods, challenge, diary |
| Discover | One search entry point, browse by mood and pace, community out in the open |

## Design decisions
- **One accent colour + warm neutrals.** Paper tones replace the old brown and beige. The forest green turns mint in dark mode, and text passes WCAG AA in both themes.
- **Serif for titles, sans for interface.** Newsreader + Inter.
- **Light-touch social.** Friend activity with a Cheer button, no endless feed.
- **Recommendations explain themselves.** "Matched to the 23 books you rated 4 stars or higher, not to what's trending."
- **Motion with a job.** Stars pop as they fill, progress bars ease to their new value, and the chart grows in. All of it switches off with reduced motion.

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:3000. Try **Update progress** on Home, the **Verified readers** switch on `/book/villette`, and the mood buttons on `/discover`.

## Stack
Next.js (App Router), React, Tailwind CSS v4. No backend: sample data lives in `lib/data.ts`, and your progress is saved in the browser.

The original design files are in `public/` as SVGs.
