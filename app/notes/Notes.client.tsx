'use client';
import { useState, useEffect } from 'react';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import Loading from '@/app/loading';
import { Toaster } from 'react-hot-toast';
import css from '../notes/NotePage.module.css';


const NotesClient = () => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const {
    data: notes,
    isSuccess,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes( page, 12, query ),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading || isFetching) {
      setShowLoader(true);
    } else if (showLoader) {
      timeout = setTimeout(() => setShowLoader(false), 300);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, isFetching, showLoader]);

  const totalPages = notes?.totalPages ?? 1;

  const onQueryChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setQuery(e.target.value);
    },
    300
  );

  const handleClose = () => setIsModalOpen(false);

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

      {showLoader ? (
        <Loading />
      ) : (
        isSuccess &&
        notes && (
          <NoteList
            query={debouncedQuery}
            
            notes={notes.notes}
           
          />
        )
      )}

      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal>
      )}

      {error && (
        <p className={css.error}>Could not fetch notes. {error?.message}</p>
      )}
    </div>
  );
};

export default NotesClient;
