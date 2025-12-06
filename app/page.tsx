'use client';

import { useState, useEffect } from 'react';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Set chat as default on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setActiveSection('chat');
    }
  }, []);

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

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (!showMobileMenu) {
      setShowSettings(false);
    }
  };

  return (
    <>
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      <Terminal>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.hamburger}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {showMobileMenu ? '[X]' : '[≡]'}
            </button>
            <h1 className={styles.logo}>
              <span className={styles.prompt}>root@portfolio:~$</span>
            </h1>
          </div>
          <button
            className={`${styles.settingsButton} ${styles.desktopOnly}`}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            [SETTINGS]
          </button>
        </div>

        {showSettings && !showMobileMenu && (
          <SettingsMenu onClose={() => setShowSettings(false)} />
        )}

        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <div className={styles.mobileNavSection}>
                <h3 className={styles.mobileNavTitle}>SECTIONS</h3>
                <button
                  onClick={() => handleSectionChange('about')}
                  className={`${styles.mobileNavLink} ${activeSection === 'about' ? styles.navLinkActive : ''}`}
                >
                  [ ABOUT ]
                </button>
                <button
                  onClick={() => handleSectionChange('skills')}
                  className={`${styles.mobileNavLink} ${activeSection === 'skills' ? styles.navLinkActive : ''}`}
                >
                  [ SKILLS ]
                </button>
                <button
                  onClick={() => handleSectionChange('experience')}
                  className={`${styles.mobileNavLink} ${activeSection === 'experience' ? styles.navLinkActive : ''}`}
                >
                  [ EXPERIENCE ]
                </button>
                <button
                  onClick={() => handleSectionChange('projects')}
                  className={`${styles.mobileNavLink} ${activeSection === 'projects' ? styles.navLinkActive : ''}`}
                >
                  [ PROJECTS ]
                </button>
                <button
                  onClick={() => handleSectionChange('contact')}
                  className={`${styles.mobileNavLink} ${activeSection === 'contact' ? styles.navLinkActive : ''}`}
                >
                  [ CONTACT ]
                </button>
                <button
                  onClick={() => handleSectionChange('chat')}
                  className={`${styles.mobileNavLink} ${activeSection === 'chat' ? styles.navLinkActive : ''}`}
                >
                  [ AI CHAT ]
                </button>
              </div>
              <div className={styles.mobileNavSection}>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowMobileMenu(false);
                  }}
                  className={styles.mobileNavLink}
                >
                  [ SETTINGS ]
                </button>
              </div>
            </nav>
          </div>
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
