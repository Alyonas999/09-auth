import css from "./CreateNote.module.css";
import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";

export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note in NoteHub application",
  openGraph: {
    title: "Create Note",
    description: "Create a new note in NoteHub application",
    url: "https://notehub.com/notes/action/create",
    siteName: 'NoteHub',
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
    type: "article",
  },
};

const CreateNote = async () => {
  
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