
import { fetchNoteById } from "@/lib/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import NotePreviewClient from "./NotePreview.client"


const NotePreview = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  )
}

export default NotePreview