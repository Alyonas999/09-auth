'use client';
import { getMe, updateMe } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/api/api';
import { User } from '@/types/user';
import { useAuthStore } from '@/lib/store/authStore';
export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const setUserAuthStore = useAuthStore(state => state.setUser);
  const router = useRouter();
  useEffect(() => {
    getMe().then(user => {
      setUser(user);
    });
  }, []);
  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = {
        username: formData.get('username') as string,
        email: user?.email as string,
      };
      console.log(formValues);
      const res = await updateMe(formValues);
      if (res) {
        setUserAuthStore(res);
        router.push('/profile');
      } else {
        setError('Invalid edit profile');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };
  const handleClose = () => {
    router.back();
  };
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              defaultValue={user?.username ?? ''}
              className={css.input}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={handleClose}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}