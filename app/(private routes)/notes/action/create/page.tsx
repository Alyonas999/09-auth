import { NoteForm } from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteHub - Create Note',
  description: 'Create and save your new note quickly and easily.',
  openGraph: {
    title: 'NoteHub - Create Note',
    description: 'Create and save your new note quickly and easily.',
    url: 'https://08-zustand-puce-seven.vercel.app/notes/action/create',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create a new note on NoteHub',
      },
    ],
    type: 'article',
  },
};
const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};
export default CreateNote;