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
  demoUrl?: string;
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [privateProjects, setPrivateProjects] = useState<PrivateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [repoReadmes, setRepoReadmes] = useState<Record<string, string>>({});
  const [loadingReadme, setLoadingReadme] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const epGalleryImages = ['/111.jpg', '/222.jpg', '/333.jpg', '/444.jpg'];

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

  const fetchReadme = async (repoFullName: string) => {
    // If already expanded, collapse it
    if (expandedProject === `repo-${repoFullName}`) {
      setExpandedProject(null);
      return;
    }

    // If README already fetched, just expand
    if (repoReadmes[repoFullName]) {
      setExpandedProject(`repo-${repoFullName}`);
      return;
    }

    // Fetch README
    setLoadingReadme(repoFullName);
    const [owner, repo] = repoFullName.split('/');

    try {
      const response = await fetch(`/api/github/readme?owner=${owner}&repo=${repo}`);
      const data = await response.json();

      if (data.readme) {
        setRepoReadmes(prev => ({ ...prev, [repoFullName]: data.readme }));
        setExpandedProject(`repo-${repoFullName}`);
      } else {
        setRepoReadmes(prev => ({ ...prev, [repoFullName]: 'README not available for this repository.' }));
        setExpandedProject(`repo-${repoFullName}`);
      }
    } catch (err) {
      console.error('Failed to fetch README:', err);
      setRepoReadmes(prev => ({ ...prev, [repoFullName]: 'Failed to load README.' }));
      setExpandedProject(`repo-${repoFullName}`);
    } finally {
      setLoadingReadme(null);
    }
  };

  const handleGalleryClick = () => {
    setShowGallery(true);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % epGalleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + epGalleryImages.length) % epGalleryImages.length);
  };

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
                  {project.id === 'protokol999' ? (
                    <button
                      onClick={handleGalleryClick}
                      className={styles.projectLink}
                    >
                      {'>'} View Gallery
                    </button>
                  ) : project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      {'>'} Live Demo
                    </a>
                  )}
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
                  <button
                    onClick={() => fetchReadme(repo.full_name)}
                    className={styles.projectLink}
                    disabled={loadingReadme === repo.full_name}
                  >
                    {'>'} {loadingReadme === repo.full_name
                      ? 'Loading...'
                      : expandedProject === `repo-${repo.full_name}`
                        ? 'Hide README'
                        : 'View README'}
                  </button>
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
                {expandedProject === `repo-${repo.full_name}` && repoReadmes[repo.full_name] && (
                  <div className={styles.projectReadme}>
                    <pre className={styles.readmeContent}>{repoReadmes[repo.full_name]}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Gallery Modal for ep (Protokół 999) */}
        {showGallery && (
          <div className={styles.galleryModal} onClick={() => setShowGallery(false)}>
            <div className={styles.galleryContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.galleryClose} onClick={() => setShowGallery(false)}>
                ✕
              </button>
              <div className={styles.galleryImageContainer}>
                <button className={styles.galleryNav} onClick={prevImage}>
                  ‹
                </button>
                <img
                  src={epGalleryImages[currentImageIndex]}
                  alt={`Protokół 999 - Medical Training Platform Screenshot ${currentImageIndex + 1}`}
                  className={styles.galleryImage}
                />
                <button className={styles.galleryNav} onClick={nextImage}>
                  ›
                </button>
              </div>
              <div className={styles.galleryCounter}>
                {currentImageIndex + 1} / {epGalleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
