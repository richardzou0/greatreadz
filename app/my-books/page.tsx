import { Suspense } from "react";
import { MyBooksView } from "@/components/my-books/MyBooksView";

export const metadata = { title: "My books · Greatreadz" };

export default function MyBooksPage() {
  return (
    <Suspense>
      <MyBooksView />
    </Suspense>
  );
}
