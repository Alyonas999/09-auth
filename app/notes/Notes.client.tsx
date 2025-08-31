'use client';
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { toast } from "react-hot-toast";
import  css from '@/components/NoteForm/NoteForm';

export interface NoteFormProps {
  onClose: () => void;  
}
export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      onClose(); 
    },
    onError() {
      toast.error("Failed to create note");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation({ title, content, tag });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className={css.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <input
        className={css.input}
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag"
      />
      <div className={css.actions}>
        <button type="submit" className={css.button} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" className={css.button} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}