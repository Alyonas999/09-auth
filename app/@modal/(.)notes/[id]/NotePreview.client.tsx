'use client';
import css from './NotePreview.module.css';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import Loading from '@/app/loading';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { Modal } from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <Loading />;

  if (error || !note) return <ErrorMessage />;

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClose}>
            Back
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {note.updatedAt ? note.updatedAt : note.createdAt}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;