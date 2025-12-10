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

  if (!profile) {
    return <div className={styles.loading}>LOADING...</div>;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.prompt}>$</span> cat resume.txt
      </h2>
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
            <span className={styles.prompt}>{'>'}</span> PROFESSIONAL SUMMARY
          </h3>
          <p className={styles.resumeText}>{profile.bio}</p>
        </div>

        {/* Technical Skills */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> TECHNICAL SKILLS
          </h3>
          <div className={styles.resumeSkills}>
            {Object.entries(profile.skills).map(([category, skills]) => (
              <div key={category} className={styles.resumeSkillCategory}>
                <strong className={styles.resumeSkillLabel}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}:
                </strong>
                <span className={styles.resumeSkillList}>
                  {Array.isArray(skills) ? skills.join(', ') : skills}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> PROFESSIONAL EXPERIENCE
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
                ? `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
                : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;

              return (
                <div key={exp.id} className={styles.resumeExperience}>
                  <div className={styles.resumeExpHeader}>
                    <h4 className={styles.resumeExpTitle}>{exp.title}</h4>
                    <span className={styles.resumeExpDuration}>({duration})</span>
                  </div>
                  <p className={styles.resumeExpCompany}>
                    {exp.company} | {exp.location}
                  </p>
                  <p className={styles.resumeExpPeriod}>
                    {new Date(exp.period.start).toLocaleDateString('en-US', {
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
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.resumeExpTech}>
                    <strong>Technologies:</strong> {exp.technologies.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> EDUCATION & LEARNING
          </h3>
          <div className={styles.resumeEducation}>
            <p className={styles.resumeText}>
              <strong>Self-Taught Developer</strong> - Intensive self-directed learning since elementary school
            </p>
            <p className={styles.resumeText}>
              • Leveraged AI-assisted learning to rapidly expand skill set across multiple domains
            </p>
            <p className={styles.resumeText}>
              • Focused on practical, project-based learning with real-world applications
            </p>
            <p className={styles.resumeText}>
              • Continuous learning through hackathons, open-source contributions, and production projects
            </p>
          </div>
        </div>

        {/* Notable Achievements */}
        <div className={styles.resumeSection}>
          <h3 className={styles.resumeSectionTitle}>
            <span className={styles.prompt}>{'>'}</span> NOTABLE ACHIEVEMENTS
          </h3>
          <ul className={styles.resumeAchievements}>
            <li>3rd Place Winner - ETH Warsaw 2025 Hackathon</li>
            <li>Launched production medical training platform serving students across Poland</li>
            <li>Built and deployed multiple Web3 dApps on EVM-compatible blockchains</li>
            <li>Developed AI-powered platforms with real-time assessment and analytics</li>
            <li>Active contributor to open-source Web3 and blockchain projects</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className={styles.resumeFooter}>
          <p className={styles.resumeNote}>
            <span className={styles.prompt}>{'>'}</span> For detailed project information and code samples,
            visit the Projects section or check my GitHub profile.
          </p>
        </div>
      </div>
    </div>
  );
}
