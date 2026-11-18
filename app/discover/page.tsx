import { Suspense } from "react";
import { DiscoverView } from "@/components/discover/DiscoverView";

export const metadata = { title: "Discover · Goodreads concept" };

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverView />
    </Suspense>
  );
}
