import { dehydrate, QueryClient } from "@tanstack/query-core";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "../../../lib/api";

interface NotePageProps {
  params: { id: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const queryClient = new QueryClient();


  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydrate(queryClient)}>
        <NoteDetailsClient noteId={params.id} />
      </Hydrate>
    </QueryClientProvider>
  );
}