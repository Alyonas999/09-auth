'use client';

import { useEffect, useRef, useState } from 'react';
import css from './TagsMenu.module.css';
import Link from 'next/link';
export default function TagsMenu() {
  const categories = ['All', 'Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggleMenu = () => {
    setIsOpenMenu(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpenMenu(false);
      }
    };

    if (isOpenMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenMenu]);
  const handleLinkClick = () => {
    setIsOpenMenu(false);
  };
  return (
    <div className={css.menuContainer}>
      <button ref={buttonRef} onClick={toggleMenu} className={css.menuButton}>
        {isOpenMenu ? 'Notes ▴' : 'Notes ▾'}
      </button>
      {isOpenMenu && (
        <ul ref={menuRef} className={css.menuList}>
          {categories.map(category => (
            <li key={category} className={css.menuItem}>
              <Link
                href={`/notes/filter/${category}`}
                className={css.menuLink}
                onClick={handleLinkClick}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}