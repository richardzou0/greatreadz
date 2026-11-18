import { Suspense } from "react";
import { MyBooksView } from "@/components/my-books/MyBooksView";

export const metadata = { title: "My books · Goodreads concept" };

export default function MyBooksPage() {
  return (
    <Suspense>
      <MyBooksView />
    </Suspense>
  );
}
