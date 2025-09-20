import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, getCategories } from "@/lib/api/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  

  const categories = await getCategories();
  const category = undefined;

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, tag: category }], 
    queryFn: () => fetchNotes("", 1, 12, category), 
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categories={categories} category={category} />
    </HydrationBoundary>
  );
}