'use client';
import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api"; 
import type { Note } from "../../types/note";

export type NoteFormProps = {
  onClose: () => void;
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3, "Must be at least 3 characters"),
  content: Yup.string().max(500, "Must be at most 500 characters"), 
  tag: Yup.mixed<Note["tag"]>().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); 
      onClose(); 
    },
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as Note["tag"] }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div>
            <Field type="text" name="title" placeholder="Title" />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div>
            <Field as="textarea" name="content" placeholder="Content (optional)" />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div>
            <Field as="select" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>

          {mutation.isError && (
            <div className={css.error}>Failed to save note. Try again.</div>
          )}
        </Form>
      )}
    </Formik>
  );
}