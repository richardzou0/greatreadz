// All the sample content for the concept lives here.
// Change a title, colour or review below and every screen picks it up.

export type Book = {
  slug: string;
  title: string;
  author: string;
  shortAuthor: string;
  year: number;
  pages: number;
  cover: string; // cover background colour
  coverInk: string; // text colour on the cover
  moods: string[];
  blurb: string;
};

export const books: Record<string, Book> = {
  middlemarch: {
    slug: "middlemarch",
    title: "Middlemarch",
    author: "George Eliot",
    shortAuthor: "G. Eliot",
    year: 1871,
    pages: 880,
    cover: "#3e5c76",
    coverInk: "#f4efe6",
    moods: ["Reflective", "Slow-paced", "Character-driven"],
    blurb:
      "A small English town, a clever young woman who marries the wrong man, and a doctor whose ambitions run into money. Eliot follows a dozen lives at once and is kind to all of them.",
  },
  villette: {
    slug: "villette",
    title: "Villette",
    author: "Charlotte Brontë",
    shortAuthor: "C. Brontë",
    year: 1853,
    pages: 572,
    cover: "#5e7f6e",
    coverInk: "#f4f1e8",
    moods: ["Reflective", "Emotional", "Slow-paced", "Classic"],
    blurb:
      "Lucy Snowe, alone and with almost no money, crosses the sea to the town of Villette and finds work at a girls' school. She watches everyone closely and tells the reader far less than she knows.",
  },
  "jane-eyre": {
    slug: "jane-eyre",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    shortAuthor: "C. Brontë",
    year: 1847,
    pages: 532,
    cover: "#8c3b3b",
    coverInk: "#f6ede3",
    moods: ["Emotional", "Dark", "Reflective", "Classic"],
    blurb:
      "An orphan becomes a governess at Thornfield Hall, falls for its moody owner and refuses to give up herself to keep him.",
  },
  "moby-dick": {
    slug: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    shortAuthor: "H. Melville",
    year: 1851,
    pages: 720,
    cover: "#24435a",
    coverInk: "#eaf0f2",
    moods: ["Adventurous", "Dark", "Slow-paced"],
    blurb:
      "A whaling captain chases the white whale that took his leg, and drags his whole crew along with him.",
  },
  persuasion: {
    slug: "persuasion",
    title: "Persuasion",
    author: "Jane Austen",
    shortAuthor: "J. Austen",
    year: 1817,
    pages: 272,
    cover: "#9fb4c7",
    coverInk: "#1b2836",
    moods: ["Hopeful", "Reflective", "Classic"],
    blurb:
      "Eight years after she was talked out of marrying him, Anne Elliot meets Captain Wentworth again. Austen's quietest and most grown-up book.",
  },
  "dorian-gray": {
    slug: "dorian-gray",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    shortAuthor: "O. Wilde",
    year: 1890,
    pages: 254,
    cover: "#4b3a5c",
    coverInk: "#f0e8f5",
    moods: ["Dark", "Funny", "Tense"],
    blurb:
      "A beautiful young man stays young while his portrait ages and rots in the attic.",
  },
  "monte-cristo": {
    slug: "monte-cristo",
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    shortAuthor: "A. Dumas",
    year: 1844,
    pages: 1276,
    cover: "#6b4f2e",
    coverInk: "#f3e9d8",
    moods: ["Adventurous", "Tense"],
    blurb:
      "Framed and jailed for fourteen years, Edmond Dantès escapes, finds a fortune and comes back for everyone who put him there.",
  },
  "wuthering-heights": {
    slug: "wuthering-heights",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    shortAuthor: "E. Brontë",
    year: 1847,
    pages: 416,
    cover: "#4a4f45",
    coverInk: "#ece6d8",
    moods: ["Dark", "Emotional", "Tense"],
    blurb: "Two families on the Yorkshire moors, and a love that ruins both of them.",
  },
  "age-of-innocence": {
    slug: "age-of-innocence",
    title: "The Age of Innocence",
    author: "Edith Wharton",
    shortAuthor: "E. Wharton",
    year: 1920,
    pages: 368,
    cover: "#c9a66b",
    coverInk: "#2a2118",
    moods: ["Reflective", "Slow-paced"],
    blurb:
      "A New York lawyer about to marry the right woman falls for her unconventional cousin.",
  },
  "room-with-a-view": {
    slug: "room-with-a-view",
    title: "A Room with a View",
    author: "E. M. Forster",
    shortAuthor: "E. M. Forster",
    year: 1908,
    pages: 256,
    cover: "#e2b66f",
    coverInk: "#2a2016",
    moods: ["Hopeful", "Funny", "Reflective"],
    blurb: "A trip to Florence shakes a sheltered young Englishwoman out of her good manners.",
  },
  "little-women": {
    slug: "little-women",
    title: "Little Women",
    author: "Louisa May Alcott",
    shortAuthor: "L. M. Alcott",
    year: 1868,
    pages: 449,
    cover: "#a3b18a",
    coverInk: "#1f2a1a",
    moods: ["Hopeful", "Emotional"],
    blurb: "Four sisters grow up in Massachusetts while their father is away at war.",
  },
  frankenstein: {
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    shortAuthor: "M. Shelley",
    year: 1818,
    pages: 280,
    cover: "#2b2b2b",
    coverInk: "#e8e2d6",
    moods: ["Dark", "Reflective"],
    blurb: "A young scientist builds a living creature and then abandons it.",
  },
  dracula: {
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    shortAuthor: "B. Stoker",
    year: 1897,
    pages: 418,
    cover: "#5a1f24",
    coverInk: "#f3e4e0",
    moods: ["Dark", "Tense"],
    blurb: "Letters and diaries tell how a Transylvanian count comes to London.",
  },
};

export const getBook = (slug: string) => books[slug];

export const currentlyReading = { slug: "middlemarch", page: 412 };

export const friendsFinished = [
  { friend: "Maya", slug: "jane-eyre", rating: 4.5 },
  { friend: "Jonah", slug: "moby-dick", rating: 4 },
  { friend: "Priya", slug: "persuasion", rating: 5 },
  { friend: "Sam", slug: "dorian-gray", rating: 3.5 },
  { friend: "Lena", slug: "monte-cristo", rating: 4.5 },
];

export const friendsActivity = [
  { initial: "M", name: "Maya", text: "started Middlemarch with the Victorian Novels Club" },
  { initial: "J", name: "Jonah", text: "finished Frankenstein and rated it 4.75" },
  { initial: "P", name: "Priya", text: "hit 40 books in her 2026 challenge" },
];

export const shelves = [
  { key: "reading", label: "Reading", count: 1 },
  { key: "want", label: "Want to read", count: 24 },
  { key: "read", label: "Read", count: 61 },
  { key: "dnf", label: "Didn’t finish", count: 3 },
] as const;

export const challenge = { goal: 50, read: 38, ahead: 2 };

export const pagesPerMonth = [
  { m: "J", v: 91 },
  { m: "F", v: 104 },
  { m: "M", v: 122 },
  { m: "A", v: 84 },
  { m: "M", v: 134 },
  { m: "J", v: 110 },
  { m: "J", v: 150 },
  { m: "A", v: 131 },
  { m: "S", v: 97 },
  { m: "O", v: 116 },
  { m: "N", v: 105 },
];

export const readingTaste = [
  { label: "Reflective", pct: 42, color: "var(--accent)" },
  { label: "Dark", pct: 26, color: "var(--taste-2)" },
  { label: "Hopeful", pct: 18, color: "var(--taste-3)" },
  { label: "Other", pct: 14, color: "var(--taste-4)" },
];

export const challengeFriends = [
  { name: "Priya", read: 41 },
  { name: "Rich", read: 38, you: true },
  { name: "Maya", read: 33 },
  { name: "Jonah", read: 27 },
];

export const diary = [
  { month: "NOV", day: "12", slug: "frankenstein", rating: 4.5, note: "Sadder than I expected. The creature is the most human person in it." },
  { month: "NOV", day: "03", slug: "little-women", rating: 4, note: "Comfort read. Jo forever." },
  { month: "OCT", day: "27", slug: "dracula", rating: 3.5, note: "Great first act, drags in the middle." },
  { month: "OCT", day: "15", slug: "persuasion", rating: 5, note: "The letter." },
];

export const shelfBooks: Record<string, string[]> = {
  reading: ["middlemarch"],
  want: ["villette", "age-of-innocence", "room-with-a-view", "monte-cristo", "wuthering-heights", "moby-dick"],
  dnf: ["moby-dick", "dorian-gray", "monte-cristo"],
};

export const moods = ["Reflective", "Adventurous", "Funny", "Dark", "Hopeful", "Tense"];
export const paces = ["Slow", "Medium", "Fast"];
export const genres = ["Classics", "Literary fiction", "Mystery", "Sci-fi", "Fantasy", "Romance", "Poetry", "History", "Memoir"];

/** Rough pace for the Discover filter, read from each book's mood tags. */
export const paceOf = (b: Book) =>
  b.moods.includes("Slow-paced") ? "Slow" : b.moods.some((m) => m === "Adventurous" || m === "Tense") ? "Fast" : "Medium";

export const discoverPicks = [
  { slug: "villette", match: 96 },
  { slug: "age-of-innocence", match: 92 },
  { slug: "middlemarch", match: 88 },
  { slug: "persuasion", match: 73 },
  { slug: "room-with-a-view", match: 70 },
  { slug: "jane-eyre", match: 67 },
  { slug: "wuthering-heights", match: 64 },
  { slug: "frankenstein", match: 61 },
  { slug: "dracula", match: 58 },
  { slug: "monte-cristo", match: 55 },
  { slug: "dorian-gray", match: 52 },
  { slug: "moby-dick", match: 49 },
  { slug: "little-women", match: 47 },
];

// Book page extras (only Villette has the full set in this concept)
export const ratingBreakdown = {
  verified: { avg: 4.0, bars: [38, 34, 18, 6, 4] },
  all: { avg: 3.6, bars: [33, 29, 15, 5, 18] },
};

export const followReviews = [
  { initial: "M", name: "Maya", rating: 5, text: "Quieter than Jane Eyre and stranger. Lucy Snowe stays with you long after the last page." },
  { initial: "J", name: "Jonah", rating: 4, text: "Slow first hundred pages, then I could not put it down. Read it in winter." },
  { initial: "S", name: "Sam", rating: 4.5, text: "The last chapter rewires the whole book. Don't let anyone spoil it." },
];

export const alsoLoved = ["wuthering-heights", "persuasion", "age-of-innocence", "room-with-a-view", "jane-eyre", "little-women"];
