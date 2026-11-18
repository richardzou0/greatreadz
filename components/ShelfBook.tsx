import { coverImage, getBook } from "@/lib/data";
import { spineColours } from "@/lib/spines";
import { BookCover } from "./BookCover";

/** Spine thickness as a share of the cover's width, from the page count. */
export const spineRatio = (pages: number) => Math.min(0.26, 0.06 + pages / 5000);

/**
 * A book with a spine, for rows that play the shelf reveal.
 * At rest it looks exactly like a BookCover; the spine sits along the left edge,
 * turned 90° away, and only shows when the reveal turns the book sideways.
 */
export function ShelfBook({ slug, ...cover }: React.ComponentProps<typeof BookCover>) {
  const book = getBook(slug);
  if (!book) return null;
  const ratio = spineRatio(book.pages);
  const colours = (coverImage(slug) && spineColours[slug]) || { bg: book.cover, ink: book.coverInk };
  const surname = book.author.split(" ").pop();

  return (
    <div data-shelf-cover data-spine={ratio} className="@container relative [transform-style:preserve-3d]">
      <BookCover slug={slug} {...cover} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-full flex flex-col items-center justify-between overflow-hidden rounded-l-[3px] py-[7cqw] [backface-visibility:hidden]"
        style={{
          width: `${ratio * 100}%`,
          backgroundColor: colours.bg,
          // Rounded-spine shading: darker at the hinges, a soft highlight just left of centre
          backgroundImage:
            "linear-gradient(90deg, rgb(0 0 0 / 0.32), rgb(255 255 255 / 0.1) 32%, rgb(0 0 0 / 0.04) 68%, rgb(0 0 0 / 0.35))",
          color: colours.ink,
          transformOrigin: "right center",
          transform: "rotateY(-90deg)",
        }}
      >
        <span
          className="min-h-0 overflow-hidden text-ellipsis whitespace-nowrap font-serif leading-none [writing-mode:vertical-rl]"
          style={{ fontSize: `calc(${ratio} * 46cqw)`, maxHeight: "74%" }}
        >
          {book.title}
        </span>
        <span
          className="font-sans font-semibold uppercase leading-none tracking-[0.12em] [writing-mode:vertical-rl]"
          style={{ fontSize: `calc(${Math.max(ratio, 0.1)} * 26cqw)` }}
        >
          {surname}
        </span>
      </div>
    </div>
  );
}
