'use client';

import css from './NoteForm.module.css';
import { createNote, Tags } from '@/lib/api';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import toast from 'react-hot-toast';
import { Loading } from 'notiflix';

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      Loading.hourglass();
      await createNote(draft.title, draft.content, draft.tag);
      Loading.remove();
      toast.success('Note created!');
      clearDraft(); 
    } catch {
      Loading.remove();
      toast.error('Error, creating note!');
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={css.input}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) =>
            setDraft({ ...draft, tag: e.target.value as typeof draft.tag })
          }
          className={css.select}
        >
          {Tags.filter((tag) => tag !== 'All').map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
