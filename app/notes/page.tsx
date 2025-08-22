import { dehydrate, QueryClient } from "@tanstack/query-core";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../services/noteService";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, 9, ""], 
    queryFn: () => fetchNotes(1, 9, ""),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydrate(queryClient)}>
        <NotesClient />
      </Hydrate>
    </QueryClientProvider>
  );
}