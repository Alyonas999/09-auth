'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Loading from '@/app/loading';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { ErrorMessageEmpty } from '@/components/ErrorMessageEmpty/ErrorMessageEmpty';
import { NoteList } from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import css from './NotesPage.module.css';

interface NotesClientProps {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
  initialTag: string | undefined;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 1000);
  const [tag, setTag] = useState(initialTag);

  useEffect(() => {
    setTag(initialTag);
    setCurrentPage(1);
  }, [initialTag]);

  const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['notes', debouncedQuery, currentPage, tag],
    queryFn: () => fetchNotes(debouncedQuery, currentPage, tag),
    placeholderData: keepPreviousData,
    initialData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={query} onChange={handleChange} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>
      {isLoading && !data?.notes && <Loading />}
      {isError && <ErrorMessage />}
      {isSuccess && data?.notes.length === 0 && <ErrorMessageEmpty />}
      {isSuccess && data?.notes.length > 0 && (
        <div className={css.noteListWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${debouncedQuery}-${currentPage}-${tag}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <NoteList notes={data.notes} />
            </motion.div>
          </AnimatePresence>
          {isFetching && !isLoading && (
            <div className={css.overlayLoader}>
              <Loading />
            </div>
          )}
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}