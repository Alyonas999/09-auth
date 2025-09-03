'use client';

import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes, Tags } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import css from './NotesClient.module.css';

interface NotesClientProps {
  categories: Tags;
  category: Exclude<Tags[number], 'All'> | undefined;
}

const NotesClient = ({ categories, category }: NotesClientProps) => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const {
    data: notes,
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', { search: debouncedQuery, page, category }],
    queryFn: () => fetchNotes(debouncedQuery, page, undefined, category),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  const totalPages = notes?.totalPages ?? 1;
  const onQueryChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setQuery(e.target.value);
    },
    300
  );

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !notes)
    return <p>Could not fetch the list of notes. {error?.message}</p>;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox onChange={onQueryChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isSuccess && notes && (
        <NoteList notes={notes.notes} query={debouncedQuery} page={page} />
      )}
      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm
            categories={categories}
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;