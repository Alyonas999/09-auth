import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes, getCategories, Tag } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

interface NotesFilterProps {
  params: Promise<{ slug: Tag[] }>;
}

export const dynamicParams = false;
export const revalidate = 900;

const descriptions: Record<Tag, string> = {
  All: 'All your notes in one place.',
  Work: 'Notes for your work projects.',
  Todo: 'Track your tasks and to-dos.',
  Personal: 'Your personal notes, safely stored.',
  Meeting: 'Meeting notes and summaries.',
  Shopping: 'Your shopping lists organized.',
};

export async function generateMetadata({
  params,
}: NotesFilterProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] || 'All';

  return {
    title: `NoteHub – ${tag} Notes`,
    description: descriptions[tag] || 'Browse your notes in NoteHub.',
    openGraph: {
      title: `NoteHub – ${tag} Notes`,
      description: descriptions[tag] || 'Browse your notes in NoteHub.',
      url: `https://08-zustand-puce-seven.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub – ${tag} Notes`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
  };
}

export const generateStaticParams = async () => {
  const tags = getCategories();
  return tags.map((tag) => ({ slug: [tag] }));
};

export default async function NotesFilter({ params }: NotesFilterProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const tag = slug[0] === 'All' ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, tag }],
    queryFn: () => fetchNotes('', 1, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}