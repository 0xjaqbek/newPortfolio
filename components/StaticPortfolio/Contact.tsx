'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function Contact() {
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
        <span className={styles.prompt}>$</span> cat contact.txt
      </h2>
      <div className={styles.content}>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}></span>
            <a href={`mailto:${profile.contact.email}`} className={styles.contactLink}>
              {profile.contact.email}
            </a>
          </div>

          {profile.contact.twitter && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Twitter:</span>
              <a
                href={`https://twitter.com/${profile.contact.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                {profile.contact.twitter}
              </a>
            </div>
          )}

          {profile.contact.telegram && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Telegram:</span>
              <a
                href={`https://t.me/${profile.contact.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                {profile.contact.telegram}
              </a>
            </div>
          )}

          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>GitHub:</span>
            <a
              href="https://github.com/0xjaqbek"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              @0xjaqbek
            </a>
          </div>
        </div>

        <div className={styles.contactNote}>
          <p>
            <span className={styles.prompt}>{'>'}</span> Feel free to reach out
            for collaboration, questions, or just to say hi!
          </p>
        </div>
      </div>
    </div>
  );
}
