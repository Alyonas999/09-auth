import { fetchNoteById } from "@/lib/api"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import NotePreviewClient from "./NotePreview.client"

interface PageProps {
  params: { id: string }
}

const NotePreview = async ({ params }: PageProps) => {
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