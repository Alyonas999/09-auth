'use client';

import { motion, Variants } from 'framer-motion';
import css from './NoteList.module.css';
import type { Note } from '../../types/user';
import { deleteNote } from '@/lib/api/api';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Routes } from '@/path/routes';

interface NoteListProps {
  query: string;
  page: number;
  notes: Note[];
  isFetching?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.2 },
  },
};

export default function NoteList({ notes, query, page }: NoteListProps) {
  const queryClient = useQueryClient();

  const noteDeletion = useMutation({
    mutationFn: async (id: string) => await deleteNote(id),
    onSuccess: () => {
      toast.success('Note has been successfully deleted!');
      queryClient.invalidateQueries({ queryKey: ['notes', query, page] });
    },
    onError: () => {
      toast.error('Error occurred while deleting note!');
    },
  });

  const onDelete = (id: string) => noteDeletion.mutate(id);

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <motion.ul
      className={css.list}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {notes.map((note) => (
        <motion.li
          key={note.id}
          className={css.listItem}
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
          }}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.tag} href={Routes.NoteDetails + note.id}>
              View details
            </Link>
            <button className={css.button} onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}