import { ChangeEvent } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange(event: ChangeEvent<HTMLInputElement>): void;
  value: string;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      value={value}
      className={css.input}
      onChange={onChange}
      type="text"
      placeholder="Search notes"
    />
  );
}