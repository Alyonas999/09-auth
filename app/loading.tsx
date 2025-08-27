'use client';
import { motion, type Transition } from 'framer-motion';
import css from './loading.module.css';

export default function Loading() {
  const dotAnimation = { opacity: [0.3, 1, 0.3] };

  const ease: [number, number, number, number] = [0.42, 0, 0.58, 1];

  const transitionBase: Transition = {
    repeat: Infinity,
    duration: 0.8,
    ease,
  };

  return (
    <div
      className={css.wrapper}
      role="status"
      aria-live="polite"
      aria-label="Loading…"
    >
      <motion.div
        className={css.dot}
        animate={dotAnimation}
        transition={{ ...transitionBase, delay: 0 }}
      />
      <motion.div
        className={css.dot}
        animate={dotAnimation}
        transition={{ ...transitionBase, delay: 0.2 }}
      />
      <motion.div
        className={css.dot}
        animate={dotAnimation}
        transition={{ ...transitionBase, delay: 0.4 }}
      />
    </div>
  );
}