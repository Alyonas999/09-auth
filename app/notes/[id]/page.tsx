import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById, getSingleNote } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};


export async function generateMetadata({ params }: Props) {
  const { id } = await Promise.resolve(params); 
  const note = await getSingleNote(id);

  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 100),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "article",
    },
  };
}

const NoteDetails = async ({ params }: Props) => {
  const { id } = await Promise.resolve(params); 
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
};

export default NoteDetails;