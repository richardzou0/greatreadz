import Link from "next/link";
import { getBook } from "@/lib/data";

type Props = {
  slug: string;
  className?: string;
  /** "lg" uses the bigger shadow and full author name, like the book page hero */
  size?: "sm" | "md" | "lg";
  href?: string | null;
  fullAuthor?: boolean;
  /** Colour only, no text — for tiny thumbnails */
  plain?: boolean;
};

// Typographic stand-in covers: solid colour, serif title, small-caps author.
// Text scales with the cover's own width, so one component works at every size.
export function BookCover({ slug, className = "", size = "md", href, fullAuthor, plain }: Props) {
  const book = getBook(slug);
  if (!book) return null;

  const cover = (
    <div
      className={`@container relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-[6px] ${
        size === "lg" ? "shadow-cover-lg rounded-[9px]" : "shadow-cover"
      } ${className}`}
      style={{ backgroundColor: book.cover, color: book.coverInk }}
    >
      {!plain && (
        <>
          <span
            lang="en"
            className="hyphens-auto break-words p-[9cqw] pb-0 font-serif leading-[1.1]"
            style={{ fontSize: size === "lg" ? "15cqw" : size === "sm" ? "12cqw" : "13.5cqw" }}
          >
            {book.title}
          </span>
          <span
            className="p-[9cqw] pt-0 font-sans uppercase tracking-[0.08em]"
            style={{ fontSize: size === "lg" ? "4.6cqw" : "7cqw" }}
          >
            {size === "lg" || fullAuthor ? book.author : book.shortAuthor}
          </span>
        </>
      )}
      {/* soft spine highlight */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[3%] bg-white/10" />
    </div>
  );

  if (href === null) return cover;
  return (
    <Link
      href={href ?? `/book/${slug}`}
      aria-label={`${book.title} by ${book.author}`}
      className="block transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      {cover}
    </Link>
  );
}
