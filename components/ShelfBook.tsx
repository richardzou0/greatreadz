import { getBook } from "@/lib/data";
import { BookCover } from "./BookCover";
import { SpineFace } from "./Spine";

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

  return (
    <div data-shelf-cover data-spine={ratio} className="@container relative [transform-style:preserve-3d]">
      <BookCover slug={slug} {...cover} />
      <SpineFace
        slug={slug}
        className="pointer-events-none absolute inset-y-0 right-full rounded-l-[3px] py-[7cqw] [backface-visibility:hidden]"
        titleSize={`calc(${ratio} * 46cqw)`}
        authorSize={`calc(${Math.max(ratio, 0.1)} * 26cqw)`}
        style={{ width: `${ratio * 100}%`, transformOrigin: "right center", transform: "rotateY(-90deg)" }}
      />
    </div>
  );
}
