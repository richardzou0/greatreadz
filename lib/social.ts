// Community content. The friends, their activity, replies and clubs are SAMPLE content
// for the concept; the books they mention are real ones from lib/data.ts.
import { challengeFriends, friendsFinished, getBook, shelfBooks } from "./data";

export type Friend = {
  name: string;
  initial: string;
  /** Avatar tint, so friends are easy to tell apart at a glance */
  tint: string;
  reading: string; // slug of what they're reading now
};

export const friends: Friend[] = [
  { name: "Maya", initial: "M", tint: "#c98a6b", reading: "a-game-of-thrones" },
  { name: "Jonah", initial: "J", tint: "#6b8fc9", reading: "the-blade-itself" },
  { name: "Priya", initial: "P", tint: "#b07ac2", reading: "fourth-wing" },
  { name: "Sam", initial: "S", tint: "#6bb08a", reading: "dune" },
  { name: "Lena", initial: "L", tint: "#c9b26b", reading: "iron-gold" },
];

export const friendByName = Object.fromEntries(friends.map((f) => [f.name, f]));

/** Books this year, from the challenge leaderboard (Lena hasn't joined the challenge). */
export const booksThisYear = (name: string) => challengeFriends.find((f) => f.name === name)?.read ?? null;

/** Books a friend has finished that Rich has also read. */
export function sharedReads(name: string) {
  const mine = new Set(shelfBooks.read);
  return friendsFinished.filter((f) => f.friend === name && mine.has(f.slug)).map((f) => f.slug);
}

export type Activity = {
  id: string;
  friend: string;
  when: "Today" | "Yesterday" | "This week";
  time: string;
  verb: string; // e.g. "finished"
  slug?: string;
  rating?: number;
  review?: string;
  club?: string;
  /** A note connecting the update to Rich's own shelves */
  hook?: string;
  cheers: number;
  replies: { from: string; text: string }[];
};

const wants = new Set(shelfBooks.want);

export const activity: Activity[] = [
  {
    id: "a1", friend: "Maya", when: "Today", time: "2h", verb: "started", slug: "a-game-of-thrones",
    club: "Westeros Readalong", cheers: 3,
    hook: wants.has("a-game-of-thrones") ? "It's on your Want to read. The readalong starts this week." : undefined,
    replies: [{ from: "Lena", text: "Finally! Don't get attached to anyone." }],
  },
  {
    id: "a2", friend: "Jonah", when: "Today", time: "5h", verb: "finished", slug: "the-poppy-war", rating: 4.75,
    review: "The last third is brutal. Kuang does not pull punches, and I respect it.", cheers: 6, replies: [],
  },
  {
    id: "a3", friend: "Lena", when: "Today", time: "8h", verb: "wants to read", slug: "iron-gold", cheers: 1,
    hook: wants.has("iron-gold") ? "You both want to read this. Start it together?" : undefined,
    replies: [],
  },
  {
    id: "a4", friend: "Priya", when: "Yesterday", time: "Yesterday", verb: "hit 11 books in her 2026 challenge", cheers: 9,
    replies: [{ from: "Sam", text: "Machine." }],
  },
  {
    id: "a5", friend: "Sam", when: "Yesterday", time: "Yesterday", verb: "finished", slug: "project-hail-mary", rating: 5,
    review: "Funniest book I've read in years. Go in knowing as little as possible.", cheers: 4,
    replies: [{ from: "Maya", text: "Told you!!" }, { from: "Jonah", text: "Adding it." }],
  },
  {
    id: "a6", friend: "Jonah", when: "This week", time: "Tue", verb: "reviewed", slug: "the-long-walk", rating: 4.5,
    review: "I couldn't stop reading, which felt wrong given what's happening on every page.", cheers: 5, replies: [],
  },
  {
    id: "a7", friend: "Maya", when: "This week", time: "Mon", verb: "finished", slug: "red-rising", rating: 4.5,
    hook: "You rated it 4. You two agree on Pierce Brown.", cheers: 2, replies: [],
  },
  {
    id: "a8", friend: "Lena", when: "This week", time: "Sun", verb: "joined", club: "The Howlers", cheers: 1, replies: [],
  },
];

export type Club = {
  id: string;
  name: string;
  slug: string; // the book being read
  members: number;
  friendsIn: string[];
  thisWeek: string;
  progress: number; // % through the schedule
  posts: number;
};

export const clubs: Club[] = [
  {
    id: "westeros", name: "Westeros Readalong", slug: "a-game-of-thrones", members: 42, friendsIn: ["Maya", "Lena"],
    thisWeek: "Chapters 1–12", progress: 8, posts: 31,
  },
  {
    id: "howlers", name: "The Howlers", slug: "iron-gold", members: 118, friendsIn: ["Lena"],
    thisWeek: "Part I: Rust", progress: 22, posts: 64,
  },
  {
    id: "king", name: "Constant Readers", slug: "the-stand", members: 76, friendsIn: ["Jonah"],
    thisWeek: "Book One, chapters 1–20", progress: 15, posts: 18,
  },
];

export const bookTitle = (slug?: string) => (slug ? getBook(slug)?.title : undefined);
