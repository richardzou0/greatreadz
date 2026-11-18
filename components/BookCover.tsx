import Image from "next/image";
import Link from "next/link";
import { coverImage, getBook } from "@/lib/data";

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

// Shows the real cover when there is one. Otherwise draws a typographic stand-in:
// solid colour, serif title, small-caps author, scaled to the cover's own width.
export function BookCover({
  slug,
  className = "",
  size = "md",
  href,
  fullAuthor,
  plain,
}: Props) {
  const book = getBook(slug);
  if (!book) return null;
  const image = coverImage(slug);

  const cover = (
    <div
      className={`@container relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-[6px] ${
        size === "lg" ? "shadow-cover-lg rounded-[9px]" : "shadow-cover"
      } ${className}`}
      style={{ backgroundColor: book.cover, color: book.coverInk }}
    >
      {image ? (
        <Image
          src={image}
          alt={`Cover of ${book.title}`}
          fill
          sizes={size === "lg" ? "260px" : "160px"}
          className="object-cover"
          priority={size === "lg"}
        />
      ) : (
        !plain && (
          <>
            <span
              lang="en"
              className="hyphens-auto break-words p-[9cqw] pb-0 font-serif leading-[1.1]"
              style={{
                fontSize:
                  size === "lg" ? "15cqw" : size === "sm" ? "12cqw" : "13.5cqw",
              }}
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
        )
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
