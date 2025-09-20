import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Note } from '../../types/note';
import css from './NoteList.module.css';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { deleteNote } from '@/lib/api/clientApi';
import { motion } from 'framer-motion';

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success(`Note "${data.title}" deleted.`);
    },
    onError: () => {
      toast.error(`Failed to delete note.`);
    },
  });

  const handleClickDelete = (id: string) => {
    mutationDelete.mutate(id);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }, // задержка между появлением заметок
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.ul
      className={css.list}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {notes.map(({ title, tag, id, content }) => (
        <motion.li key={id} className={css.listItem} variants={itemVariants}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link className={css.link} href={`/notes/${id}`}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => handleClickDelete(id)}
            >
              Delete
            </button>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}