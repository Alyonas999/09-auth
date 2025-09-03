'use client';

import { Formik, Form, ErrorMessage, type FormikHelpers, Field } from 'formik';
import css from './NoteForm.module.css';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, Tags } from '@/lib/api';
import { Loading } from 'notiflix';
import toast from 'react-hot-toast';

interface NoteFormProps {
  categories: Tags;
  onSubmit: () => void;
  onCancel: () => void;
}

interface InitialValues {
  title: string;
  content: string;
  tag: Tags[number];
}

const initialValues: InitialValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({
  categories,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const formSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be less or equal to 50 characters')
      .required('Title is required'),
    content: Yup.string().max(
      500,
      'Content must be less or equal to 500 characters'
    ),
    tag: Yup.string().oneOf(categories),
  });

  const queryClient = useQueryClient();

  const noteCreation = useMutation({
    mutationFn: async ({ title, content, tag }: InitialValues) => {
      const data = await createNote(title, content, tag);
      return data;
    },
    onSuccess: () => {
      Loading.remove();
      toast.success('Note has been successfully created!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSubmit();
    },
    onError: () => {
      Loading.remove();
      toast.error('Error occurred while creating note!');
    },
  });

  const onFormSubmit = (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    Loading.hourglass();
    noteCreation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmit}
      validationSchema={formSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            name="content"
            id="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            {categories
              .filter((tag) => tag !== 'All')
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}