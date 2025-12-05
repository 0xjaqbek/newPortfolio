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

export default function Home() {
  const { theme } = useTheme();
  const [showBoot, setShowBoot] = useState(theme.showBootSequence);
  const [showSettings, setShowSettings] = useState(false);

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
              <a href="#about" className={styles.navLink}>
                [ ABOUT ]
              </a>
              <a href="#skills" className={styles.navLink}>
                [ SKILLS ]
              </a>
              <a href="#experience" className={styles.navLink}>
                [ EXPERIENCE ]
              </a>
              <a href="#projects" className={styles.navLink}>
                [ PROJECTS ]
              </a>
              <a href="#contact" className={styles.navLink}>
                [ CONTACT ]
              </a>
            </nav>
          </aside>

          <main className={styles.main}>
            <section id="about">
              <About />
            </section>
            <section id="skills">
              <Skills />
            </section>
            <section id="experience">
              <Experience />
            </section>
            <section id="projects">
              <Projects />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </main>

          <aside className={styles.chatSidebar}>
            <ChatWindow />
          </aside>
        </div>
      </Terminal>
    </>
  );
}
