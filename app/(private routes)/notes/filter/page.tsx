import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, getCategories } from "@/lib/api/serverApi";
import NotesClient from "../filter/[...slug]/Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const category = undefined;
  const initialData = await fetchNotes("", 1, category);

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, category], 
    queryFn: () => fetchNotes("", 1, category), 
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} initialTag={category}/>
    </HydrationBoundary>
  );
}