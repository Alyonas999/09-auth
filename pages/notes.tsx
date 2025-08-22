import { toast, Toaster } from "react-hot-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, createNote , NotesResponse} from "../lib/api";
import type { Note } from "../types/note";
import NoteList from "../components/NoteList/NoteList";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Pagination from "../components/Pagination/Pagination";
import Modal from "../components/Modal/Modal";
import SearchBox from "../components/SearchBox/SearchBox";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import NoteForm from "../components/NoteForm/NoteForm";
import css from "../components/NotesPage/NotesPage.module.css";

export default function NotesPageRoute() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce<string>(search, 500);
  const perPage = 9;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery<NotesResponse>({
    queryKey: ["notes", currentPage, perPage, debouncedSearch],
    queryFn: async () => {
      const result = await fetchNotes(currentPage, perPage, debouncedSearch);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return result;
    },
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation<
    Note,
    Error,
    { title: string; content: string; tag: Note["tag"] }
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      toast.success("Note created");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const { mutate, status } = createNoteMutation;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateNoteSubmit = (newNoteData: {
    title: string;
    content: string;
    tag: Note["tag"];
  }) => {
    mutate(newNoteData);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const hasResults = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.header}>
        <SearchBox onSearch={handleSearch} />
        <button className={css.createButton} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <strong>Loading notes...</strong>}
        {status === "pending" && <strong>Creating note...</strong>}
        {isError && <ErrorMessage message="Error loading notes" />}
        {isFetching && !isLoading && <span>Updating notes...</span>}

        {hasResults && (
          <div className={css.paginationWrapper}>
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={(selectedItem: { selected: number }) =>
                setCurrentPage(selectedItem.selected + 1)
              }
            />
          </div>
        )}

        {data && !isLoading && <NoteList notes={data.notes ?? []} />}

        <Toaster position="top-right" />

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm
              onCancel={handleCloseModal}
              onSubmit={handleCreateNoteSubmit}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}