'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Terminal from '@/components/Terminal/Terminal';
import BootSequence from '@/components/Terminal/BootSequence';
import About from '@/components/StaticPortfolio/About';
import Skills from '@/components/StaticPortfolio/Skills';
import Experience from '@/components/StaticPortfolio/Experience';
import Projects from '@/components/StaticPortfolio/Projects';
import Contact from '@/components/StaticPortfolio/Contact';
import ChatWindow from '@/components/AIChat/ChatWindow';
import SettingsMenu from '@/components/Settings/SettingsMenu';
import styles from './page.module.css';

type Section = 'about' | 'skills' | 'experience' | 'projects' | 'contact' | 'chat';

export default function Home() {
  const { theme } = useTheme();
  const [showBoot, setShowBoot] = useState(theme.showBootSequence);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('about');

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'chat':
        return <ChatWindow />;
      default:
        return <About />;
    }
  };

  return (
    <>
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      <Terminal>
        <div className={styles.header}>
          <h1 className={styles.logo}>
            <span className={styles.prompt}>root@portfolio:~$</span>
          </h1>
          <button
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            [SETTINGS]
          </button>
        </div>

        {showSettings && (
          <SettingsMenu onClose={() => setShowSettings(false)} />
        )}

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <button
                onClick={() => setActiveSection('about')}
                className={`${styles.navLink} ${activeSection === 'about' ? styles.navLinkActive : ''}`}
              >
                [ ABOUT ]
              </button>
              <button
                onClick={() => setActiveSection('skills')}
                className={`${styles.navLink} ${activeSection === 'skills' ? styles.navLinkActive : ''}`}
              >
                [ SKILLS ]
              </button>
              <button
                onClick={() => setActiveSection('experience')}
                className={`${styles.navLink} ${activeSection === 'experience' ? styles.navLinkActive : ''}`}
              >
                [ EXPERIENCE ]
              </button>
              <button
                onClick={() => setActiveSection('projects')}
                className={`${styles.navLink} ${activeSection === 'projects' ? styles.navLinkActive : ''}`}
              >
                [ PROJECTS ]
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className={`${styles.navLink} ${activeSection === 'contact' ? styles.navLinkActive : ''}`}
              >
                [ CONTACT ]
              </button>
              <button
                onClick={() => setActiveSection('chat')}
                className={`${styles.navLink} ${activeSection === 'chat' ? styles.navLinkActive : ''}`}
              >
                [ AI CHAT ]
              </button>
            </nav>
          </aside>

          <main className={styles.main}>
            <div className={styles.contentContainer}>
              {renderContent()}
            </div>
          </main>
        </div>
      </Terminal>
    </>
  );
}
