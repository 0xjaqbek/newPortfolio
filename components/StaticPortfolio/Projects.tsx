'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function Projects() {
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

  const featuredProjects = profile.projects.filter((p) => p.featured);
  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects : profile.projects;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.prompt}>$</span> ls -la projects/
      </h2>
      <div className={styles.content}>
        {displayProjects.length === 0 ? (
          <p className={styles.noData}>No projects data available.</p>
        ) : (
          <div className={styles.projectGrid}>
            {displayProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <h3 className={styles.projectName}>
                  <span className={styles.bracket}>{'['}</span>
                  {project.name}
                  <span className={styles.bracket}>{']'}</span>
                </h3>
                <p className={styles.projectDescription}>
                  {project.description}
                </p>
                <div className={styles.techStack}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
                {project.highlights && project.highlights.length > 0 && (
                  <ul className={styles.highlights}>
                    {project.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
                <div className={styles.projectLinks}>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      {'>'} GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      {'>'} Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
