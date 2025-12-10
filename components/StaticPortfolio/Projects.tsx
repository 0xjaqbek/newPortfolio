'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/lib/github/repos';
import styles from './StaticPortfolio.module.css';

interface PrivateProject {
  id: string;
  title: string;
  description: string;
  content: string;
  filename: string;
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [privateProjects, setPrivateProjects] = useState<PrivateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    // Fetch both GitHub repos and private projects
    Promise.all([
      fetch('/api/github/repos').then(res => res.json()),
      fetch('/api/projects/private').then(res => res.json())
    ])
      .then(([githubData, privateData]) => {
        // Handle GitHub repos
        if (githubData.repos) {
          const featuredRepos = githubData.repos.filter((repo: GitHubRepo) =>
            repo.topics.some((topic) =>
              ['portfolio', 'featured', 'showcase'].includes(topic.toLowerCase())
            )
          );

          const displayRepos =
            featuredRepos.length > 0
              ? featuredRepos
              : githubData.repos
                  .filter((repo: GitHubRepo) => !repo.name.includes('.'))
                  .slice(0, 6);

          setRepos(displayRepos);
        }

        // Handle private projects
        if (privateData.projects) {
          setPrivateProjects(privateData.projects);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>LOADING PROJECTS FROM GITHUB...</div>;
  }

  if (error) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.prompt}>$</span> ls -la projects/
        </h2>
        <div className={styles.content}>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.prompt}>$</span> ls -la projects/
      </h2>
      <div className={styles.content}>
        {repos.length === 0 && privateProjects.length === 0 ? (
          <p className={styles.noData}>
            No projects found. Add "portfolio", "featured", or "showcase" topics to your GitHub repos to display them here.
          </p>
        ) : (
          <div className={styles.projectGrid}>
            {/* Private Projects */}
            {privateProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <h3 className={styles.projectName}>
                  <span className={styles.bracket}>{'['}</span>
                  {project.title}
                  <span className={styles.bracket}>{']'}</span>
                  <span className={styles.privateTag}> [PRIVATE]</span>
                </h3>
                <p className={styles.projectDescription}>
                  {project.description}
                </p>
                <div className={styles.projectLinks}>
                  <button
                    onClick={() => setExpandedProject(
                      expandedProject === project.id ? null : project.id
                    )}
                    className={styles.projectLink}
                  >
                    {'>'} {expandedProject === project.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                {expandedProject === project.id && (
                  <div className={styles.projectReadme}>
                    <pre className={styles.readmeContent}>{project.content}</pre>
                  </div>
                )}
              </div>
            ))}

            {/* GitHub Projects */}
            {repos.map((repo) => (
              <div key={repo.id} className={styles.projectCard}>
                <h3 className={styles.projectName}>
                  <span className={styles.bracket}>{'['}</span>
                  {repo.name}
                  <span className={styles.bracket}>{']'}</span>
                </h3>
                <p className={styles.projectDescription}>
                  {repo.description || 'No description available'}
                </p>
                <div className={styles.techStack}>
                  {repo.language && (
                    <span className={styles.techTag}>{repo.language}</span>
                  )}
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span key={topic} className={styles.techTag}>
                      {topic}
                    </span>
                  ))}
                </div>
                <div className={styles.projectStats}>
                  <span className={styles.stat}>
                    ★ {repo.stargazers_count}
                  </span>
                  <span className={styles.stat}>
                    ⑂ {repo.forks_count}
                  </span>
                  <span className={styles.stat}>
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.projectLinks}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    {'>'} GitHub
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      {'>'} Live Demo
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
