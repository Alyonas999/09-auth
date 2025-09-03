'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';
import { useRouter } from 'next/router';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  const router = useRouter()

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

const handleBack = () => {
		router.back()
	}


  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <b>{note.tag }</b>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.updatedAt ?? note.createdAt}</p>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
