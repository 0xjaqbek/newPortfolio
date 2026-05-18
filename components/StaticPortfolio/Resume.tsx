'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import styles from './StaticPortfolio.module.css';

export default function Resume() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch('/data/profile.json')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile:', err));
  }, []);

  const downloadResumeJSON = () => {
    if (!profile) return;

    const resumeData = {
      name: profile.name,
      title: profile.title,
      location: profile.location,
      contact: profile.contact,
      summary: profile.bio,
      skills: {
        "languages": profile.skills.languages,
        "frameworks": profile.skills.frameworks,
        "blockchain": profile.skills.blockchain,
        "ai_ml": profile.skills['ai-ml'],
        "databases": profile.skills.databases,
        "tools": profile.skills.tools,
      },
      experience: profile.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        period: {
          start: exp.period.start,
          end: exp.period.end
        },
        description: exp.description,
        top_achievements: exp.achievements?.slice(0, 2) || [],
        technologies: exp.technologies
      })),
      highlights: [
        "3rd Place - ETH Warsaw 2025 Hackathon (Web3 mentorship platform)",
        "Founded Trenuj Ratuj — production AI medical training platform (trenujratuj.pl)",
        "Built multiple Web3 dApps with smart contracts on Base & EVM chains",
        "Delivered full-stack client projects: Dr Kolo, Plonbli, TRIAGE MCI, EMS tools suite"
      ],
      education: "Self-taught developer • Intensive project-based learning since elementary school • Active in hackathons & open-source"
    };

    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_Resume.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!profile) {
    return <div className={styles.loading}>LOADING...</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.resumeTitleRow}>
<button onClick={downloadResumeJSON} className={styles.downloadButton}>
          [ DOWNLOAD JSON ]
        </button>
      </div>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.resumeHeader}>
          <h1 className={styles.resumeName}>{profile.name}</h1>
          <p className={styles.resumeTitle}>{profile.title}</p>
          <p className={styles.resumeLocation}>
            <span className={styles.label}>Location:</span> {profile.location}
          </p>
          <div className={styles.resumeContact}>
            <a href={`mailto:${profile.contact.email}`} className={styles.contactLink}>
              {profile.contact.email}
            </a>
            {profile.contact.twitter && (
              <>
                <span className={styles.separator}> | </span>
                <a
                  href={`https://twitter.com/${profile.contact.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  {profile.contact.twitter}
                </a>
              </>
            )}
            {profile.contact.telegram && (
              <>
                <span className={styles.separator}> | </span>
                <a
                  href={`https://t.me/${profile.contact.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  {profile.contact.telegram}
                </a>
              </>
            )}
            <span className={styles.separator}> | </span>
            <a
              href="https://github.com/0xjaqbek"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              github.com/0xjaqbek
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> SUMMARY
          </h3>
          <p className={styles.resumeText}>{profile.bio}</p>
        </div>

        {/* Key Skills - Condensed */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> KEY SKILLS
          </h3>
          <div className={styles.resumeSkills}>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>Languages:</strong>
              <span className={styles.resumeSkillList}>{profile.skills.languages.join(', ')}</span>
            </div>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>Frameworks:</strong>
              <span className={styles.resumeSkillList}>{profile.skills.frameworks.join(', ')}</span>
            </div>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>AI & Data:</strong>
              <span className={styles.resumeSkillList}>{profile.skills['ai-ml'].join(', ')}</span>
            </div>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>Blockchain:</strong>
              <span className={styles.resumeSkillList}>{profile.skills.blockchain.join(', ')}</span>
            </div>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>Databases:</strong>
              <span className={styles.resumeSkillList}>{profile.skills.databases.join(', ')}</span>
            </div>
            <div className={styles.resumeSkillCategory}>
              <strong className={styles.resumeSkillLabel}>Tools:</strong>
              <span className={styles.resumeSkillList}>{profile.skills.tools.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> EXPERIENCE
          </h3>
          <div className={styles.timeline}>
            {profile.experience.map((exp) => {
              const startDate = new Date(exp.period.start);
              const endDate = exp.period.end === 'Present' ? new Date() : new Date(exp.period.end);
              const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                            (endDate.getMonth() - startDate.getMonth());
              const years = Math.floor(months / 12);
              const remainingMonths = months % 12;
              const duration = years > 0
                ? `${years}y${remainingMonths > 0 ? ` ${remainingMonths}m` : ''}`
                : `${remainingMonths}m`;

              return (
                <div key={exp.id} className={styles.resumeExperience}>
                  <div className={styles.resumeExpHeader}>
                    <h4 className={styles.resumeExpTitle}>{exp.title}</h4>
                    <span className={styles.resumeExpDuration}>{duration}</span>
                  </div>
                  <p className={styles.resumeExpCompany}>
                    {exp.company} | {new Date(exp.period.start).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })} - {exp.period.end === 'Present' ? 'Present' : new Date(exp.period.end).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className={styles.resumeExpDescription}>{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className={styles.resumeExpAchievements}>
                      {exp.achievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notable Achievements */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> HIGHLIGHTS
          </h3>
          <ul className={styles.resumeAchievements}>
            <li>3rd Place — ETH Warsaw 2025 Hackathon (Web3 mentorship platform)</li>
            <li>Founded Trenuj Ratuj — production AI medical training platform (trenujratuj.pl)</li>
            <li>Built multiple Web3 dApps with smart contracts on Base & EVM chains</li>
            <li>Delivered full-stack client projects: Dr Kolo, Plonbli, TRIAGE MCI, EMS tools suite</li>
          </ul>
        </div>

        {/* Education */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> EDUCATION
          </h3>
          <p className={styles.resumeText}>
            Self-taught developer • Intensive project-based learning since elementary school • Active in hackathons & open-source
          </p>
        </div>
      </div>
    </div>
  );
}
