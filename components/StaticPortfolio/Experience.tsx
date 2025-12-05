'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function Experience() {
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
        <span className={styles.prompt}>$</span> cat work_history.log
      </h2>
      <div className={styles.content}>
        {profile.experience.length === 0 ? (
          <p className={styles.noData}>No work experience data available.</p>
        ) : (
          <div className={styles.timeline}>
            {profile.experience.map((exp) => (
              <div key={exp.id} className={styles.timelineItem}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.jobTitle}>{exp.title}</h3>
                  <span className={styles.period}>
                    {exp.period.start} - {exp.period.end}
                  </span>
                </div>
                <div className={styles.company}>
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </div>
                <p className={styles.description}>{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className={styles.achievements}>
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className={styles.techStack}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
