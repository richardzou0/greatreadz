import { BookCover } from "@/components/BookCover";
import { ShelfReveal } from "@/components/ShelfReveal";
import { CurrentlyReading } from "@/components/home/CurrentlyReading";
import { ChallengeCard, FriendsActivity, Greeting, PickedForYou } from "@/components/home/HomeWidgets";
import { Eyebrow, Rating } from "@/components/ui";
import { friendsFinished } from "@/lib/data";

// Home: a calm feed. What you're reading, what friends finished, one smart pick.
export default function Home() {
  return (
    <main className="mx-auto max-w-[1216px] px-5 pb-10 pt-14 lg:px-12 lg:pt-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-muted lg:text-[14px]">Welcome back</p>
          <h1 className="mt-0.5 font-serif text-[32px] font-medium leading-tight tracking-[-0.01em] lg:text-[44px]">
            <Greeting />
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-[16px] font-semibold text-accent">R</span>
        </div>
      </header>

      <div className="mt-6 grid gap-x-8 lg:mt-10 lg:grid-cols-[minmax(0,712fr)_minmax(300px,376fr)]">
        <div className="min-w-0">
          <section aria-labelledby="current">
            <Eyebrow className="mb-3 lg:mb-4">
              <span id="current">Currently reading</span>
            </Eyebrow>
            <CurrentlyReading />
          </section>

          <section aria-labelledby="friends" className="mt-6 lg:mt-12">
            <Eyebrow className="mb-3 lg:mb-4">
              <span id="friends">Friends just finished</span>
            </Eyebrow>
            <ShelfReveal
              replayKey="friends"
              className="no-scrollbar -mx-5 flex gap-3.5 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0"
            >
              {friendsFinished.map((f) => (
                <li key={f.slug} data-shelf-item className="w-[107px] shrink-0 lg:w-auto">
                  <div data-shelf-cover>
                    <BookCover slug={f.slug} />
                  </div>
                  <p data-shelf-caption className="mt-2 flex items-center justify-between text-[13px] lg:mt-3 lg:text-[14px]">
                    <span className="font-semibold">{f.friend}</span>
                    <Rating value={f.rating} className="text-[12px] text-muted lg:text-[13px]" />
                  </p>
                </li>
              ))}
            </ShelfReveal>
          </section>

          <section className="mt-6 lg:hidden" aria-labelledby="pick-m">
            <Eyebrow className="mb-3">
              <span id="pick-m">Picked for your taste</span>
            </Eyebrow>
            <PickedForYou />
          </section>
        </div>

        <aside className="hidden min-w-0 flex-col gap-6 lg:flex">
          {/* Label sits outside the card, like "Currently reading", so both cards share a top edge */}
          <section aria-labelledby="pick">
            <Eyebrow className="mb-4">
              <span id="pick">Picked for your taste</span>
            </Eyebrow>
            <PickedForYou />
          </section>
          <ChallengeCard />
          <section aria-labelledby="activity">
            <Eyebrow className="mb-1">
              <span id="activity">Friends&apos; activity</span>
            </Eyebrow>
            <FriendsActivity />
          </section>
        </aside>
      </div>

      <p className="mt-10 text-center text-[11px] text-muted lg:hidden">
        Unsolicited Goodreads redesign concept. Not affiliated with Goodreads or Amazon. Covers and ratings from Open Library.
      </p>
    </main>
  );
}
