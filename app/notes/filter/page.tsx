import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, getCategories } from "@/lib/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
export default async function NotesPage() {
  const queryClient = new QueryClient();
  const categories = getCategories;
  const category = undefined;
  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, category }],
    queryFn: () => fetchNotes("", 1, undefined, category),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categories={categories} category={category} />
    </HydrationBoundary>
  );
}