// All the content for the concept lives here.
// Rich's shelves and ratings are real. Every stat on the site is worked out from them.
// Friends (Maya, Jonah, Priya, Sam, Lena) and their reviews are sample content.

export type ShelfKey = "reading" | "want" | "read" | "dnf";

export type Book = {
  slug: string;
  title: string;
  author: string;
  shortAuthor: string;
  year: number;
  pages: number; // common first-edition page count
  series?: string; // e.g. "Red Rising #1"
  cover: string; // stand-in cover colour
  coverInk: string; // text colour on the cover
  moods: string[];
  blurb: string;
  /** Rich's shelf, if the book is on one */
  shelf?: ShelfKey;
  /** Rich's rating */
  myRating?: number;
  /** Current page, for books being read */
  page?: number;
  /** Open Library readers: average, number of ratings, and % for 5★…1★ */
  community?: { avg: number; count: number; bars: [number, number, number, number, number] };
  /** One line on why it's recommended (recommendations only) */
  why?: string;
};

// Turns Open Library star counts (1★…5★) into the 5★…1★ percentages the page shows.
function ol(avg: number, counts: [number, number, number, number, number]): Book["community"] {
  const total = counts.reduce((a, b) => a + b, 0);
  const pct = counts.map((c) => Math.round((c / total) * 100)).reverse() as [number, number, number, number, number];
  return { avg, count: total, bars: pct };
}

const list: Book[] = [
  // ——— Reading now ———
  {
    slug: "morning-star", title: "Morning Star", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2016, pages: 524,
    series: "Red Rising #3", cover: "#26344f", coverInk: "#efe7d6", moods: ["Adventurous", "Tense", "Emotional", "Fast-paced"],
    blurb: "Darrow stops hiding. The Rising goes to open war against the Society, and every alliance he built in the first two books gets tested.",
    shelf: "reading", page: 430, community: ol(4.32, [1, 1, 6, 27, 33]),
  },
  {
    slug: "empire-of-the-vampire", title: "Empire of the Vampire", author: "Jay Kristoff", shortAuthor: "J. Kristoff", year: 2021, pages: 736,
    series: "Empire of the Vampire #1", cover: "#1e1e24", coverInk: "#d9dbe0", moods: ["Dark", "Adventurous", "Slow-paced"],
    blurb: "The sun hasn't properly risen in 27 years. Gabriel de León, the last of the silversaints, tells his life story to the vampire who has him prisoner.",
    shelf: "reading", page: 37,
  },

  // ——— Read ———
  {
    slug: "red-rising", title: "Red Rising", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2014, pages: 382,
    series: "Red Rising #1", cover: "#8c2f2b", coverInk: "#f6e7df", moods: ["Adventurous", "Dark", "Tense", "Fast-paced"],
    blurb: "Darrow mines under the surface of Mars, told his people are making it livable. Then he learns the surface was settled generations ago, and he is remade as a Gold to bring the ruling class down from inside.",
    shelf: "read", myRating: 4, community: ol(3.93, [4, 5, 19, 41, 34]),
  },
  {
    slug: "golden-son", title: "Golden Son", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2015, pages: 442,
    series: "Red Rising #2", cover: "#b8893a", coverInk: "#1f1a12", moods: ["Adventurous", "Tense", "Emotional", "Fast-paced"],
    blurb: "Darrow is now a rising star among the Golds, which makes him a target. Surviving their politics and starting a revolution turn out to be the same job.",
    shelf: "read", myRating: 4.5, community: ol(4.25, [0, 1, 5, 32, 22]),
  },
  {
    slug: "billy-summers", title: "Billy Summers", author: "Stephen King", shortAuthor: "S. King", year: 2021, pages: 515,
    cover: "#4d5b6a", coverInk: "#eef0f2", moods: ["Tense", "Reflective", "Dark"],
    blurb: "A hitman who only takes bad men takes one last job. While he waits for the shot, he poses as a writer in a small town and starts writing his own story for real.",
    shelf: "read", myRating: 4, community: ol(3.77, [0, 2, 7, 7, 6]),
  },
  {
    slug: "pet-sematary", title: "Pet Sematary", author: "Stephen King", shortAuthor: "S. King", year: 1983, pages: 374,
    cover: "#3d4a3a", coverInk: "#e9ecdf", moods: ["Dark", "Tense", "Emotional", "Slow-paced"],
    blurb: "A doctor moves his family to rural Maine, next to a pet cemetery. Past it is older ground that brings the dead back, but not as they were.",
    shelf: "read", myRating: 4, community: ol(4.05, [7, 6, 32, 66, 75]),
  },
  {
    slug: "apt-pupil", title: "Apt Pupil", author: "Stephen King", shortAuthor: "S. King", year: 1982, pages: 188,
    series: "Different Seasons · novella", cover: "#5b2a2a", coverInk: "#f1e3dd", moods: ["Dark", "Tense"],
    blurb: "A California teenager works out that an old man in his town is a Nazi war criminal, and blackmails him for stories. Neither of them comes out of it the same.",
    shelf: "read", myRating: 3.5, community: ol(4.11, [0, 0, 3, 2, 4]),
  },
  {
    slug: "the-body", title: "The Body", author: "Stephen King", shortAuthor: "S. King", year: 1982, pages: 146,
    series: "Different Seasons · novella", cover: "#6f7f5c", coverInk: "#f0f1e6", moods: ["Reflective", "Emotional", "Adventurous"],
    blurb: "Four twelve-year-olds walk out of their Maine town to see a dead boy's body. The story behind the film Stand by Me.",
    shelf: "read", myRating: 2.5, community: ol(4.33, [0, 0, 1, 2, 3]),
  },
  {
    slug: "the-breathing-method", title: "The Breathing Method", author: "Stephen King", shortAuthor: "S. King", year: 1982, pages: 90,
    series: "Different Seasons · novella", cover: "#a6b4bf", coverInk: "#18222a", moods: ["Dark", "Reflective"],
    blurb: "At a strange gentlemen's club in New York, an old doctor tells the story of a young woman determined to give birth, no matter what.",
    shelf: "read", myRating: 3.25, community: ol(4.5, [0, 0, 1, 1, 4]),
  },
  {
    slug: "rita-hayworth", title: "Rita Hayworth and Shawshank Redemption", author: "Stephen King", shortAuthor: "S. King", year: 1982, pages: 101,
    series: "Different Seasons · novella", cover: "#c58a63", coverInk: "#24170f", moods: ["Hopeful", "Reflective"],
    blurb: "Andy Dufresne, a banker sent to Shawshank for murders he says he didn't commit, as told by Red, the man inside who can get you things.",
    shelf: "read", myRating: 4.25, community: ol(4.67, [0, 0, 0, 1, 2]),
  },
  {
    slug: "archers-voice", title: "Archer's Voice", author: "Mia Sheridan", shortAuthor: "M. Sheridan", year: 2014, pages: 384,
    cover: "#b8c9cf", coverInk: "#17252b", moods: ["Emotional", "Hopeful", "Slow-paced"],
    blurb: "Bree Prescott moves to a small town in Maine to get away from her past, and meets Archer Hale, a man who hasn't spoken in years.",
    shelf: "read", myRating: 4, community: ol(3.69, [7, 0, 5, 8, 15]),
  },

  // ——— Want to read ———
  {
    slug: "iron-gold", title: "Iron Gold", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2018, pages: 600,
    series: "Red Rising #4", cover: "#6d5a3a", coverInk: "#f3ead8", moods: ["Adventurous", "Tense", "Dark"],
    blurb: "Ten years after the Rising, the new Republic is fraying. Darrow is one of four voices, alongside people his war left behind.",
    shelf: "want", community: ol(4.04, [0, 1, 4, 15, 7]),
  },
  {
    slug: "dark-age", title: "Dark Age", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2019, pages: 757,
    series: "Red Rising #5", cover: "#2e2a2f", coverInk: "#e8e2e8", moods: ["Dark", "Tense", "Adventurous"],
    blurb: "The Republic's war on Mercury goes wrong, and old enemies close in from every side.",
    shelf: "want", community: ol(4.5, [0, 0, 0, 7, 7]),
  },
  {
    slug: "light-bringer", title: "Light Bringer", author: "Pierce Brown", shortAuthor: "P. Brown", year: 2023, pages: 682,
    series: "Red Rising #6", cover: "#c9a24a", coverInk: "#211a0c", moods: ["Adventurous", "Emotional", "Tense"],
    blurb: "Darrow returns to a war the Republic may already be losing.",
    shelf: "want",
  },
  {
    slug: "a-game-of-thrones", title: "A Game of Thrones", author: "George R. R. Martin", shortAuthor: "G. R. R. Martin", year: 1996, pages: 694,
    series: "A Song of Ice and Fire #1", cover: "#4a5a68", coverInk: "#eef1f3", moods: ["Adventurous", "Dark", "Tense", "Slow-paced"],
    blurb: "Noble houses scheme and fight over the Iron Throne of Westeros, while something older wakes beyond the Wall.",
    shelf: "want", community: ol(4.22, [40, 22, 83, 208, 420]),
  },
  {
    slug: "a-clash-of-kings", title: "A Clash of Kings", author: "George R. R. Martin", shortAuthor: "G. R. R. Martin", year: 1998, pages: 761,
    series: "A Song of Ice and Fire #2", cover: "#7b2d2d", coverInk: "#f5e6e2", moods: ["Adventurous", "Dark", "Tense", "Slow-paced"],
    blurb: "Five kings claim one throne, and Westeros splits apart.",
    shelf: "want", community: ol(4.28, [4, 6, 21, 65, 101]),
  },
  {
    slug: "a-storm-of-swords", title: "A Storm of Swords", author: "George R. R. Martin", shortAuthor: "G. R. R. Martin", year: 2000, pages: 973,
    series: "A Song of Ice and Fire #3", cover: "#3b4f6b", coverInk: "#e9eef5", moods: ["Dark", "Tense", "Emotional", "Slow-paced"],
    blurb: "The war of the five kings reaches its bloodiest turns.",
    shelf: "want", community: ol(4.45, [2, 3, 8, 28, 70]),
  },
  {
    slug: "a-feast-for-crows", title: "A Feast for Crows", author: "George R. R. Martin", shortAuthor: "G. R. R. Martin", year: 2005, pages: 753,
    series: "A Song of Ice and Fire #4", cover: "#5c4a3a", coverInk: "#f2e9df", moods: ["Dark", "Reflective", "Slow-paced"],
    blurb: "After the war, the south of Westeros counts the cost and starts circling again.",
    shelf: "want", community: ol(4.08, [1, 7, 29, 61, 59]),
  },
  {
    slug: "a-dance-with-dragons", title: "A Dance with Dragons", author: "George R. R. Martin", shortAuthor: "G. R. R. Martin", year: 2011, pages: 1016,
    series: "A Song of Ice and Fire #5", cover: "#2f4a45", coverInk: "#e6efec", moods: ["Dark", "Adventurous", "Slow-paced"],
    blurb: "Picks up Jon at the Wall and Daenerys across the sea, as the threats to Westeros multiply.",
    shelf: "want", community: ol(4.36, [1, 1, 5, 11, 26]),
  },

  // ——— Recommendations (not on Rich's shelves) ———
  {
    slug: "the-long-walk", title: "The Long Walk", author: "Stephen King", shortAuthor: "S. King", year: 1979, pages: 370,
    cover: "#c9b37a", coverInk: "#221c0e", moods: ["Dark", "Tense", "Fast-paced"],
    blurb: "Every year, a hundred boys start walking. Slow down and you get a warning. After three warnings you're shot. The last one walking wins.",
    community: ol(3.86, [2, 9, 38, 80, 39]),
    why: "A brutal contest, like the Institute in Red Rising, written by the author you've read most.",
  },
  {
    slug: "mistborn", title: "Mistborn: The Final Empire", author: "Brandon Sanderson", shortAuthor: "B. Sanderson", year: 2006, pages: 541,
    series: "Mistborn #1", cover: "#5a3f5e", coverInk: "#f1e7f2", moods: ["Adventurous", "Tense", "Fast-paced"],
    blurb: "In a world of ash ruled by an immortal emperor, a street thief joins a crew planning the biggest heist there is: overthrowing him.",
    why: "An underclass rebellion against a god-like ruling class, like the Red Rising books you rated 4 and 4.5.",
  },
  {
    slug: "the-hunger-games", title: "The Hunger Games", author: "Suzanne Collins", shortAuthor: "S. Collins", year: 2008, pages: 374,
    series: "The Hunger Games #1", cover: "#2b2b2b", coverInk: "#e0b25a", moods: ["Tense", "Adventurous", "Fast-paced"],
    blurb: "Katniss takes her sister's place in a televised fight to the death.",
    community: ol(4.14, [16, 27, 90, 181, 274]),
    why: "Fast and tense, with a rigged system to beat.",
  },
  {
    slug: "the-poppy-war", title: "The Poppy War", author: "R. F. Kuang", shortAuthor: "R. F. Kuang", year: 2018, pages: 530,
    series: "The Poppy War #1", cover: "#9a3b2a", coverInk: "#f7e6df", moods: ["Dark", "Adventurous", "Tense"],
    blurb: "A war orphan tests into the empire's elite military academy and finds a dangerous power that could win the coming war.",
    community: ol(3.8, [4, 2, 9, 27, 14]),
    why: "A military academy story that turns into a war, like Red Rising.",
  },
  {
    slug: "the-stand", title: "The Stand", author: "Stephen King", shortAuthor: "S. King", year: 1978, pages: 823,
    cover: "#8a8f96", coverInk: "#15181c", moods: ["Dark", "Adventurous", "Slow-paced"],
    blurb: "A plague kills most of the world. The survivors drift toward two leaders, one good and one very much not.",
    community: ol(4.31, [4, 1, 9, 28, 52]),
    why: "King's big epic. Long, dark and slow, like the fantasy on your Want to read shelf.",
  },
  {
    slug: "enders-game", title: "Ender's Game", author: "Orson Scott Card", shortAuthor: "O. S. Card", year: 1985, pages: 324,
    cover: "#2e4a5e", coverInk: "#e8f0f5", moods: ["Tense", "Reflective", "Fast-paced"],
    blurb: "A gifted kid is trained at a battle school in orbit to fight an alien war.",
    community: ol(4.35, [7, 9, 39, 144, 228]),
    why: "A strategy-obsessed kid in a school built to make him a weapon.",
  },
  {
    slug: "project-hail-mary", title: "Project Hail Mary", author: "Andy Weir", shortAuthor: "A. Weir", year: 2021, pages: 476,
    cover: "#d98c3f", coverInk: "#24160a", moods: ["Hopeful", "Funny", "Tense", "Fast-paced"],
    blurb: "A science teacher wakes up alone on a spaceship with no memory, and the sun is dying.",
    community: ol(4.54, [1, 5, 11, 52, 132]),
    why: "Hopeful and fast, for when you need a break from Westeros.",
  },
  {
    slug: "fourth-wing", title: "Fourth Wing", author: "Rebecca Yarros", shortAuthor: "R. Yarros", year: 2023, pages: 498,
    series: "The Empyrean #1", cover: "#3a3a46", coverInk: "#e9e4f0", moods: ["Emotional", "Adventurous", "Fast-paced"],
    blurb: "A scholar is forced into a war college for dragon riders, where cadets die every week.",
    community: ol(4.3, [10, 4, 4, 23, 77]),
    why: "A deadly war school plus a slow-burn romance, if you liked Archer's Voice.",
  },
  {
    slug: "misery", title: "Misery", author: "Stephen King", shortAuthor: "S. King", year: 1987, pages: 310,
    cover: "#6e1f2a", coverInk: "#f6e4e6", moods: ["Dark", "Tense", "Fast-paced"],
    blurb: "A novelist wakes up after a car crash in the remote farmhouse of his biggest fan, who is not happy with how his last book ended.",
    community: ol(4.17, [6, 8, 16, 46, 75]),
    why: "King at his most claustrophobic, and short enough to finish in a weekend.",
  },
  {
    slug: "the-shining", title: "The Shining", author: "Stephen King", shortAuthor: "S. King", year: 1977, pages: 447,
    cover: "#3c3f5a", coverInk: "#ecebf3", moods: ["Dark", "Tense", "Slow-paced"],
    blurb: "A recovering alcoholic takes a winter caretaker job at an isolated hotel with his wife and son. The hotel has other plans.",
    community: ol(4.19, [1, 9, 49, 112, 128]),
    why: "A slow-building family horror, like Pet Sematary.",
  },
  {
    slug: "the-blade-itself", title: "The Blade Itself", author: "Joe Abercrombie", shortAuthor: "J. Abercrombie", year: 2006, pages: 515,
    series: "The First Law #1", cover: "#4f4136", coverInk: "#f0e8df", moods: ["Dark", "Funny", "Adventurous"],
    blurb: "A torturer, a barbarian and a vain young officer get pulled into a war none of them believes in.",
    community: ol(4.1, [0, 3, 18, 40, 33]),
    why: "Grim, funny fantasy to sit between Red Rising and Westeros.",
  },
  {
    slug: "the-name-of-the-wind", title: "The Name of the Wind", author: "Patrick Rothfuss", shortAuthor: "P. Rothfuss", year: 2007, pages: 662,
    series: "The Kingkiller Chronicle #1", cover: "#7a3a1e", coverInk: "#f7e7dc", moods: ["Reflective", "Adventurous", "Slow-paced"],
    blurb: "A legendary hero, now hiding as an innkeeper, tells the true story of how he became a legend.",
    community: ol(4.35, [6, 11, 23, 70, 155]),
    why: "A gifted kid, a tough school and a life told looking back, like Empire of the Vampire.",
  },
  {
    slug: "dune", title: "Dune", author: "Frank Herbert", shortAuthor: "F. Herbert", year: 1965, pages: 412,
    series: "Dune #1", cover: "#c98e4d", coverInk: "#24160a", moods: ["Reflective", "Adventurous", "Slow-paced"],
    blurb: "A noble family takes over the most valuable planet in the universe, and gets betrayed on arrival.",
    community: ol(4.31, [6, 15, 47, 158, 238]),
    why: "Pierce Brown has named it as an influence on Red Rising.",
  },
];

export const books: Record<string, Book> = Object.fromEntries(list.map((b) => [b.slug, b]));
export const getBook = (slug: string) => books[slug];

const onShelf = (key: ShelfKey) => list.filter((b) => b.shelf === key);

// ——— Rich's shelves ———
export const shelfBooks: Record<ShelfKey, string[]> = {
  reading: onShelf("reading").map((b) => b.slug),
  want: onShelf("want").map((b) => b.slug),
  read: onShelf("read").map((b) => b.slug),
  dnf: onShelf("dnf").map((b) => b.slug),
};

export const shelves: { key: ShelfKey; label: string; count: number }[] = [
  { key: "reading", label: "Reading", count: shelfBooks.reading.length },
  { key: "want", label: "Want to read", count: shelfBooks.want.length },
  { key: "read", label: "Read", count: shelfBooks.read.length },
  { key: "dnf", label: "Didn’t finish", count: shelfBooks.dnf.length },
];

// ——— Stats, all worked out from the Read shelf ———
const read = onShelf("read");
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

export const stats = {
  booksRead: read.length,
  pages: sum(read.map((b) => b.pages)),
  avgRating: sum(read.map((b) => b.myRating ?? 0)) / read.length,
  avgPages: Math.round(sum(read.map((b) => b.pages)) / read.length),
};

export const formatPages = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

// Most-read author
const byAuthor = read.reduce<Record<string, number>>((acc, b) => ({ ...acc, [b.author]: (acc[b.author] ?? 0) + 1 }), {});
const [topAuthor, topAuthorCount] = Object.entries(byAuthor).sort((a, b) => b[1] - a[1])[0];
export const favouriteAuthor = { name: topAuthor, count: topAuthorCount };

// Mood mix: share of each mood tag across finished books (pace tags left out)
const PACE_TAGS = ["Slow-paced", "Fast-paced"];
const moodCounts = read
  .flatMap((b) => b.moods.filter((m) => !PACE_TAGS.includes(m)))
  .reduce<Record<string, number>>((acc, m) => ({ ...acc, [m]: (acc[m] ?? 0) + 1 }), {});
const moodTotal = sum(Object.values(moodCounts));
const moodRanked = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
const TASTE_COLOURS = ["var(--accent)", "var(--taste-2)", "var(--taste-3)", "var(--taste-4)"];
const top3 = moodRanked.slice(0, 3).map(([label, n]) => ({ label, pct: Math.round((n / moodTotal) * 100) }));
export const readingTaste = [...top3, { label: "Other", pct: 100 - sum(top3.map((t) => t.pct)) }].map((t, i) => ({
  ...t,
  color: TASTE_COLOURS[i],
}));
export const topMood = moodRanked[0][0];

// Reading challenge. The goal is a placeholder: change it to Rich's real goal.
export const CHALLENGE_GOAL = 12;
const today = new Date("2026-11-18");
const yearShare = (today.getTime() - new Date("2026-01-01").getTime()) / (365 * 864e5);
const onPace = Math.round(CHALLENGE_GOAL * yearShare);
export const challenge = {
  goal: CHALLENGE_GOAL,
  read: stats.booksRead,
  // positive = ahead of schedule, negative = behind
  vsPace: stats.booksRead - onPace,
};

// Sample friends' challenge numbers, ranked with Rich's real count
export const challengeFriends = [
  { name: "Priya", read: 11 },
  { name: "Rich", read: stats.booksRead, you: true },
  { name: "Maya", read: 8 },
  { name: "Jonah", read: 6 },
  { name: "Sam", read: 4 },
].sort((a, b) => b.read - a.read);
export const challengeRank = challengeFriends.findIndex((f) => f.you) + 1;

// Achievement earned from the real shelf: all four Different Seasons novellas read
const seasons = ["rita-hayworth", "apt-pupil", "the-body", "the-breathing-method"];
export const achievement = seasons.every((s) => books[s].shelf === "read")
  ? { title: "Different Seasons, complete", text: "All four Stephen King novellas, from Shawshank to The Breathing Method" }
  : null;

// ——— Recommendations ———
// Match % compares each book's moods with a taste profile built from the books
// Rich rated 4 stars or higher (higher ratings count for more). Popularity is ignored.
const loved = read.filter((b) => (b.myRating ?? 0) >= 4);
export const lovedCount = loved.length;
const overlap = (a: string[], b: string[]) => a.filter((m) => b.includes(m)).length / new Set([...a, ...b]).size;
const profile = loved.reduce<Record<string, number>>((acc, b) => {
  for (const m of b.moods) acc[m] = (acc[m] ?? 0) + ((b.myRating ?? 4) - 3);
  return acc;
}, {});
const profileSize = Math.hypot(...Object.values(profile));
const similarity = (b: Book) => sum(b.moods.map((m) => profile[m] ?? 0)) / (profileSize * Math.sqrt(b.moods.length));
const candidates = list.filter((b) => !b.shelf);
export const discoverPicks = candidates
  .map((b) => ({ slug: b.slug, match: Math.min(99, Math.round(similarity(b) * 100)) }))
  .sort((a, b) => b.match - a.match);
export const topPick = getBook(discoverPicks[0].slug);

/** Rough pace for the Discover filter, read from each book's tags. */
export const paceOf = (b: Book) =>
  b.moods.includes("Slow-paced") ? "Slow" : b.moods.includes("Fast-paced") ? "Fast" : "Medium";

export const moods = ["Reflective", "Adventurous", "Funny", "Dark", "Hopeful", "Tense"];
export const paces = ["Slow", "Medium", "Fast"];
export const genres = ["Sci-fi", "Fantasy", "Horror", "Thriller", "Romance", "Classics", "Literary fiction", "Mystery", "Memoir"];

// ——— Sample social content (friends are not real people) ———
export const friendsFinished = [
  { friend: "Maya", slug: "mistborn", rating: 4.5 },
  { friend: "Jonah", slug: "the-stand", rating: 4 },
  { friend: "Priya", slug: "fourth-wing", rating: 3.5 },
  { friend: "Sam", slug: "project-hail-mary", rating: 5 },
  { friend: "Lena", slug: "dune", rating: 4.5 },
];

export const friendsActivity = [
  { initial: "M", name: "Maya", text: "started A Game of Thrones with the Westeros Readalong" },
  { initial: "J", name: "Jonah", text: "finished The Poppy War and rated it 4.75" },
  { initial: "P", name: "Priya", text: "hit 11 books in her 2026 challenge" },
];

export const followReviews: Record<string, { initial: string; name: string; rating: number; text: string }[]> = {
  "the-long-walk": [
    { initial: "J", name: "Jonah", rating: 4.5, text: "I couldn't stop reading, which felt wrong given what's happening on every page." },
    { initial: "M", name: "Maya", rating: 4, text: "Simple idea, and it gets under your skin. The friendships are what got me." },
    { initial: "S", name: "Sam", rating: 3.5, text: "Bleak. Worth it, but have something lighter queued up for after." },
  ],
  "iron-gold": [
    { initial: "M", name: "Maya", rating: 4, text: "Slower start than Morning Star, but the new narrators earn their place." },
    { initial: "S", name: "Sam", rating: 4.5, text: "Lyria's chapters surprised me most." },
  ],
};

/** Books that share the most moods with this one, leaving out ones Rich has already read. */
export function similarTo(slug: string, n = 6) {
  const me = getBook(slug);
  return list
    .filter((b) => b.slug !== slug && b.shelf !== "read")
    .map((b) => ({ slug: b.slug, score: overlap(me.moods, b.moods) + (b.author === me.author ? 0.15 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((b) => b.slug);
}
