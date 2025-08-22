"use client"; 

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "../lib/api";
import NoteList from "../components/NoteList/NoteList";
import NoteForm from "../components/NoteForm/NoteForm";
import Pagination from "../components/Pagination/Pagination";
import Modal from "../components/Modal/Modal";
import SearchBox from "../components/SearchBox/SearchBox";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import { toast, Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import css from "../../../components/NotesPage/NotesPage.module.css";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 9;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", currentPage, perPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, perPage, debouncedSearch),
    keepPreviousData: true,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      toast.success("Note created");
    },
    onError: () => toast.error("Failed to create note"),
  });

  const handleCreateNoteSubmit = (newNote: any) => createNoteMutation.mutate(newNote);
  const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
  const hasResults = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.header}>
        <SearchBox onSearch={handleSearch} />
        <button className={css.createButton} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <strong>Loading notes...</strong>}
        {isFetching && !isLoading && <span>Updating notes...</span>}
        {isError && <ErrorMessage message="Error loading notes" />}

        {hasResults && (
          <div className={css.paginationWrapper}>
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={(selected: any) => setCurrentPage(selected.selected + 1)}
            />
          </div>
        )}

        {data && !isLoading && <NoteList notes={data.notes} />}
        <Toaster position="top-right" />

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm
              onCancel={() => setIsModalOpen(false)}
              onSubmit={handleCreateNoteSubmit}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}