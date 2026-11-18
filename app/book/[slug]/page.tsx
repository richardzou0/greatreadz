import Link from "next/link";
import { notFound } from "next/navigation";
import { BookActions } from "@/components/book/BookActions";
import { RatingBreakdown } from "@/components/book/RatingBreakdown";
import { BookCover } from "@/components/BookCover";
import { BackIcon, ShareIcon, StarSmall } from "@/components/Icons";
import { Eyebrow } from "@/components/ui";
import { books, followReviews, getBook, similarTo } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(books).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const book = getBook((await params).slug);
  return { title: book ? `${book.title} · Goodreads concept` : "Book not found" };
}

const GET_IT = [
  { label: "Buy on Amazon", short: "Buy on Amazon", note: "Paperback, Kindle" },
  { label: "Borrow from your library", short: "Borrow free", note: "Free" },
  { label: "Listen on Audible", short: "Audiobook", note: "Audiobook" },
];

// Book page: cover first, one clear shelf button, people you follow before strangers.
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const reviews = followReviews[slug] ?? [];
  const friendsAvg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
  const c = book.community;
  const lovedPct = c ? c.bars[0] + c.bars[1] : 0;
  const similar = similarTo(slug, 6);

  return (
    <main className="relative">
      {/* Soft green band behind the cover */}
      <div className="absolute inset-x-0 top-0 h-[188px] bg-band lg:h-[212px]" aria-hidden />

      <div className="relative mx-auto max-w-[1216px] px-5 pb-12 lg:px-12">
        <div className="flex items-center justify-between pt-12 lg:pt-9">
          <Link href="/" className="-ml-2 flex h-11 items-center gap-2 px-2 text-[14px] font-semibold">
            <BackIcon size={20} />
            <span className="hidden lg:inline">Back</span>
          </Link>
          <button aria-label="Share" className="flex h-11 w-11 items-center justify-center lg:hidden">
            <ShareIcon size={20} />
          </button>
        </div>

        <div className="mt-2 lg:mt-3 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          {/* Left column (desktop) / top block (phone) */}
          <div>
            <div className="flex items-end gap-4 lg:block">
              <BookCover slug={slug} size="lg" href={null} className="w-[100px] shrink-0 lg:w-[260px]" />
              <div className="min-w-0 pb-1 lg:hidden">
                <h1 className="font-serif text-[28px] font-medium leading-tight">{book.title}</h1>
                <p className="mt-0.5 text-[14px] text-muted">
                  {book.author} · {book.year}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{book.series ?? book.moods.slice(0, 3).join(" · ")}</p>
                {book.myRating && (
                  <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold">
                    <StarSmall size={12} className="text-accent" /> You rated it {book.myRating}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3.5">
              <BookActions slug={slug} />
            </div>

            <div className="mt-2.5 lg:mt-8">
              <Eyebrow as="h2" className="hidden lg:block">
                Get it
              </Eyebrow>
              <ul className="grid grid-cols-3 gap-2 lg:mt-3 lg:grid-cols-1">
                {GET_IT.map((g) => (
                  <li key={g.label}>
                    <a
                      href="#"
                      className="flex h-11 items-center justify-center gap-3 whitespace-nowrap rounded-xl border border-line bg-surface px-1 text-[13px] lg:whitespace-normal lg:leading-tight font-semibold transition-colors hover:border-accent/50 lg:justify-between lg:px-4 lg:text-[14px]"
                    >
                      <span className="lg:hidden">{g.short}</span>
                      <span className="hidden lg:inline">{g.label}</span>
                      <span className="hidden font-medium text-muted lg:inline">{g.note}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="min-w-0">
            <div className="hidden lg:block lg:pt-6">
              <h1 className="font-serif text-[56px] font-medium leading-none tracking-[-0.01em]">{book.title}</h1>
              <p className="mt-5 text-[17px] text-muted">
                {book.author} · {book.year}
                {book.series && ` · ${book.series}`}
              </p>
              <p className="mt-2 flex items-center gap-2 text-[15px] text-muted">
                <StarSmall size={15} className="text-accent" />
                {book.myRating ? (
                  <>
                    You rated it <span className="font-semibold text-ink">{book.myRating}</span>
                  </>
                ) : friendsAvg ? (
                  <>
                    <span className="font-semibold text-ink">{friendsAvg.toFixed(1)}</span> from {reviews.length} friends
                  </>
                ) : c ? (
                  <>
                    <span className="font-semibold text-ink">{c.avg.toFixed(1)}</span> from {c.count} readers
                  </>
                ) : (
                  "No ratings yet"
                )}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {book.moods.map((m) => (
                  <li key={m}>
                    <Link
                      href={`/discover?mood=${m}`}
                      className="flex h-8 items-center rounded-full border border-line bg-surface px-3.5 text-[13px] text-muted transition-colors hover:text-ink"
                    >
                      {m}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[540px] text-[17px] leading-[1.6]">{book.blurb}</p>
            </div>

            <div className="mt-3.5 grid gap-3.5 lg:mt-9 lg:grid-cols-2">
              <RatingBreakdown community={book.community} />
              <div className="rounded-2xl bg-accent-soft p-4 lg:p-5">
                <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">
                  What readers say
                  <span className="rounded-lg border border-accent px-2 py-px text-[10px] normal-case tracking-normal">Summary · beta</span>
                </p>
                <p className="mt-2.5 text-[15px] leading-[1.55] lg:text-[16px]">
                  <span className="lg:hidden">{book.blurb} </span>
                  {c && c.count >= 10 ? (
                    <>
                      {lovedPct >= 75 ? "Most readers loved it" : lovedPct >= 55 ? "Most readers liked it" : "Readers are split on this one"}:{" "}
                      {lovedPct}% of {c.count} Open Library ratings are 4 or 5 stars.
                    </>
                  ) : (
                    "Too few ratings to summarise yet."
                  )}{" "}
                  {reviews.length > 0 && (
                    <a href="#reviews" className="font-semibold text-accent">
                      Read reviews
                    </a>
                  )}
                </p>
              </div>
            </div>

            {reviews.length > 0 && (
              <section id="reviews" className="mt-8 lg:mt-9" aria-labelledby="follow">
                <div className="flex items-baseline justify-between">
                  <Eyebrow>
                    <span id="follow">From people you follow</span>
                  </Eyebrow>
                  <a href="#reviews" className="text-[14px] font-semibold text-accent">
                    All {reviews.length}
                  </a>
                </div>
                <ul className="mt-3 grid gap-3.5 lg:grid-cols-2">
                  {reviews.slice(0, 2).map((r) => (
                    <li key={r.name} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 lg:p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[14px] font-semibold text-accent">
                        {r.initial}
                      </span>
                      <div className="pt-1">
                        <p className="text-[14px]">
                          <span className="font-semibold">{r.name}</span> <span className="font-medium text-muted">rated it {r.rating}</span>
                        </p>
                        <p className="mt-1 text-[15px] leading-[1.5]">{r.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8 lg:mt-9" aria-labelledby="similar">
              <Eyebrow>
                <span id="similar">Readers with your taste also loved</span>
              </Eyebrow>
              <ul className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-[18px] lg:overflow-visible lg:px-0">
                {similar.map((s) => (
                  <li key={s} className="w-[100px] shrink-0 lg:w-auto">
                    <BookCover slug={s} size="sm" />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
