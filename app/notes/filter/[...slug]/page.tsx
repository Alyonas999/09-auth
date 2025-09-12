import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { fetchNotes, getCategories, type Tag, Tags } from "@/lib/api"
import NotesClient from "./Notes.client"
import { Metadata } from "next"

interface NotesFilterProps {
  params: Promise<{ slug: string[] }>
}

export const dynamicParams = false
export const revalidate = 900

type GenerateMetadataProps = {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params
  const descriptions: Record<string, string> = {
    All: `Browse all your notes in one place. Stay organized and access everything instantly with Notehub.`,
    Work: `Manage and share your work notes with ease. Stay productive and organized using Notehub.`,
    Todo: `Keep track of your tasks and to-dos effortlessly. Notehub helps you stay on top of your list.`,
    Personal: `Store and organize your personal notes securely. Notehub makes it simple and private.`,
    Meeting: `Capture and share meeting notes instantly. Stay aligned and productive with Notehub.`,
    Shopping: `Plan and manage your shopping lists in seconds. Notehub keeps your essentials organized.`,
  }
  
  const tagKey = slug[0] === "All" ? "All" : slug[0]
  const description = descriptions[tagKey] || descriptions.All
  
  return {
    title: "NoteHub - Share Notes Instantly Online",
    description,
    openGraph: {
      title: "NoteHub - Share Notes Instantly Online",
      description,
      siteName: "NoteHub",
      type: "website",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - Share Notes Instantly Online",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "NoteHub - Share Notes Instantly Online",
      description,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - Share Notes Instantly Online",
        },
      ],
    },
  }
}

export const generateStaticParams = async () => {
  const categories = await getCategories()
 
  return [
    { slug: ["All"] },
    ...categories
      .filter((category): category is Tag => category !== "All")
      .map(category => ({ slug: [category] }))
  ]
}

function isValidTag(value: string): value is Tag {
  return Tags.includes(value as Tag)
}

export default async function NotesFilter({ params }: NotesFilterProps) {
  const queryClient = new QueryClient()
  const { slug } = await params
  
  
  const tag = slug[0] === "All" ? undefined : isValidTag(slug[0]) ? slug[0] : undefined
  
  const categories = await getCategories()

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, tag }],
    queryFn: () => fetchNotes("", 1, 12, tag),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        categories={categories}
        category={tag} 
      />
    </HydrationBoundary>
  )
}