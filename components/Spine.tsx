import { coverImage, getBook } from "@/lib/data";
import { spineColours } from "@/lib/spines";

/** Spine colours: sampled from the real cover, or the stand-in colours if there isn't one. */
export function spineColoursFor(slug: string) {
  const book = getBook(slug);
  return (coverImage(slug) && spineColours[slug]) || { bg: book.cover, ink: book.coverInk };
}

/**
 * A book's spine: its colour with rounded shading, the title running down it
 * and the author's surname at the foot. Fills whatever box it's given.
 */
export function SpineFace({
  slug,
  titleSize,
  authorSize,
  className = "",
  style,
}: {
  slug: string;
  /** CSS font sizes, so the text can scale with the spine */
  titleSize: string;
  authorSize: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const book = getBook(slug);
  const colours = spineColoursFor(slug);
  return (
    <div
      aria-hidden
      className={`flex flex-col items-center justify-between overflow-hidden ${className}`}
      style={{
        backgroundColor: colours.bg,
        // Rounded-spine shading: darker at the hinges, a soft highlight just left of centre
        backgroundImage:
          "linear-gradient(90deg, rgb(0 0 0 / 0.32), rgb(255 255 255 / 0.1) 32%, rgb(0 0 0 / 0.04) 68%, rgb(0 0 0 / 0.35))",
        color: colours.ink,
        ...style,
      }}
    >
      <span
        className="min-h-0 overflow-hidden text-ellipsis whitespace-nowrap font-serif leading-none [writing-mode:vertical-rl]"
        style={{ fontSize: titleSize, maxHeight: "74%" }}
      >
        {book.title}
      </span>
      <span
        className="font-sans font-semibold uppercase leading-none tracking-[0.12em] [writing-mode:vertical-rl]"
        style={{ fontSize: authorSize }}
      >
        {book.author.split(" ").pop()}
      </span>
    </div>
  );
}
