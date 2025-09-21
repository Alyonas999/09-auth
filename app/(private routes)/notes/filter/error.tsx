'use client';
import css from './error.module.css';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  return (
    <div className={css.conteiner}>
      <p className={css.text}>
        Could not fetch the list of notes. {error.message}
      </p>
      <button className={css.reset} onClick={reset}>
        reset
      </button>
    </div>
  );
};

export default Error;