'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function Skills() {
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
        <span className={styles.prompt}>$</span> ls -la skills/
      </h2>
      <div className={styles.content}>
        <div className={styles.skillCategory}>
          <h3 className={styles.skillTitle}>
            <span className={styles.bracket}>{'['}</span>Languages
            <span className={styles.bracket}>{']'}</span>
          </h3>
          <div className={styles.skillList}>
            {profile.skills.languages.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.skillCategory}>
          <h3 className={styles.skillTitle}>
            <span className={styles.bracket}>{'['}</span>Frameworks
            <span className={styles.bracket}>{']'}</span>
          </h3>
          <div className={styles.skillList}>
            {profile.skills.frameworks.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.skillCategory}>
          <h3 className={styles.skillTitle}>
            <span className={styles.bracket}>{'['}</span>Tools
            <span className={styles.bracket}>{']'}</span>
          </h3>
          <div className={styles.skillList}>
            {profile.skills.tools.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.skillCategory}>
          <h3 className={styles.skillTitle}>
            <span className={styles.bracket}>{'['}</span>Other
            <span className={styles.bracket}>{']'}</span>
          </h3>
          <div className={styles.skillList}>
            {profile.skills.other.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
