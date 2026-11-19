import Link from "next/link";
import { CurrentlyReading } from "@/components/home/CurrentlyReading";
import { FriendsFinished } from "@/components/home/FriendsFinished";
import { ChallengeCard, FriendsActivity, Greeting, PickedForYou } from "@/components/home/HomeWidgets";
import { Eyebrow } from "@/components/ui";

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

          <FriendsFinished />

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
            <div className="mb-1 flex items-center justify-between">
              <Eyebrow>
                <span id="activity">Friends&apos; activity</span>
              </Eyebrow>
              <Link href="/community" className="flex h-9 items-center text-[13px] font-semibold text-accent">
                See all
              </Link>
            </div>
            <FriendsActivity />
          </section>
        </aside>
      </div>

      <p className="mt-10 text-center text-[11px] text-muted lg:hidden">
        Unsolicited Goodreads redesign concept. Not monetized and not affiliated with Goodreads or Amazon. Covers and ratings from Open Library.
      </p>
    </main>
  );
}
