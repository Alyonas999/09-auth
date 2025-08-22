"use client"; 

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../lib/api";
import NoteDetails from "../../components/NoteDetails/NoteDetails";

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;


  const { data: note, isLoading, isError } = useQuery(
    ["note", id],
    () => fetchNoteById(id as string),
    { enabled: !!id } 
  );

  if (isLoading) return <p>Loading note...</p>;
  if (isError || !note) return <p>Error loading note</p>;

  return (
    <main>
      <NoteDetails note={note} />
    </main>
  );
}