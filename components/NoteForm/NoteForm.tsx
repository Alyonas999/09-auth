'use client';
import css from './NoteForm.module.css';
import { createNote, Tags, type Tag } from '@/lib/api';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import toast from 'react-hot-toast';
import { Loading } from 'notiflix';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => createNote(draft.title, draft.content, draft.tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      Loading.remove();
      toast.success('Note created successfully!');
      clearDraft();
      router.back();
    },
    onError: () => {
      Loading.remove();
      toast.error('Error creating note!');
    },
    onMutate: () => {
      Loading.hourglass();
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleCancel = () => {
    clearDraft();
    router.back();
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
          disabled={mutation.isPending}
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
          disabled={mutation.isPending}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) =>
            setDraft({ ...draft, tag: e.target.value as Tag })
          }
          className={css.select}
          disabled={mutation.isPending}
        >
          {Tags.filter((tag) => tag !== 'All').map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button 
          type="button" 
          onClick={handleCancel}
          className={css.cancelButton}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={css.submitButton}
          disabled={mutation.isPending || !draft.title.trim()}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}