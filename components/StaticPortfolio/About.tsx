'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch('/data/profile.json')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile:', err));
  }, []);

  if (!profile) {
    return <div className={styles.loading}>LOADING...</div>;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.prompt}>$</span> cat about.txt
      </h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.title}>{profile.title}</p>
          {profile.location && (
            <p className={styles.location}>
              <span className={styles.label}>Location:</span> {profile.location}
            </p>
          )}
        </div>
        <div className={styles.bio}>
          <p>{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}
