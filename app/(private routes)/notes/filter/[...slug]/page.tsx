import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';


type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug[0]} notes`,
    description: `List of your notes filtered by tag ${slug[0]}. Browse your notes in NoteHub`,
    openGraph: {
      title: `${slug[0]} notes`,
      description: `List of your notes filtered by tag ${slug[0]}. Browse your notes in NoteHub`,
      url: `https://08-zustand-puce-seven.vercel.app/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${slug[0]} notes`,
        },
      ],
    },
  };
}
export default async function Notes({ params }: Props) {
  const { slug } = await params;
  const tagNote = slug[0] === 'All' ? undefined : slug[0];
  const initialData = await fetchNotes('', 1, tagNote);

  return <NotesClient initialData={initialData} initialTag={tagNote} />;
}