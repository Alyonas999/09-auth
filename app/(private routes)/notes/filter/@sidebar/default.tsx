import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { getCategories, Tags } from '@/lib/api/api';
import { Routes } from '@/path/routes';

const SidebarNotes = async () => {
  const categories: Tags = await getCategories();

  return (
    <ul className={css.menuList}>
      {categories.map((category) => (
        <li key={category} className={css.menuItem}>
          <Link
            href={Routes.NotesFilter + category}
            scroll={false}
            className={css.menuLink}
          >
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;