'use client';

import { useState } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';
import DOSHeader from './DOSHeader';
import DOSNav, { Section } from './DOSNav';
import DOSPanel from './DOSPanel';
import DOSStatusBar from './DOSStatusBar';
import DOSMobileMenu from './DOSMobileMenu';
import DOSSettingsDialog from './DOSSettingsDialog';
import BootSequence from '@/components/Terminal/BootSequence';
import About from '@/components/StaticPortfolio/About';
import Skills from '@/components/StaticPortfolio/Skills';
import Experience from '@/components/StaticPortfolio/Experience';
import Projects from '@/components/StaticPortfolio/Projects';
import Contact from '@/components/StaticPortfolio/Contact';
import Resume from '@/components/StaticPortfolio/Resume';
import ChatWindow from '@/components/AIChat/ChatWindow';
import styles from './DOSShell.module.css';

const SECTION_PATHS: Record<Section, string> = {
  about:      'C:\\PORTFOLIO\\ABOUT.TXT',
  skills:     'C:\\PORTFOLIO\\SKILLS.TXT',
  experience: 'C:\\PORTFOLIO\\EXPERIENCE.TXT',
  projects:   'C:\\PORTFOLIO\\PROJECTS.TXT',
  contact:    'C:\\PORTFOLIO\\CONTACT.TXT',
  resume:     'C:\\PORTFOLIO\\RESUME.TXT',
  chat:       'C:\\PORTFOLIO\\AI_CHAT.EXE',
};

function SectionContent({ section }: { section: Section }) {
  switch (section) {
    case 'about':      return <About />;
    case 'skills':     return <Skills />;
    case 'experience': return <Experience />;
    case 'projects':   return <Projects />;
    case 'contact':    return <Contact />;
    case 'resume':     return <Resume />;
    case 'chat':       return <ChatWindow />;
  }
}

export default function DOSShell() {
  const { settings } = useAppSettings();
  const [showBoot, setShowBoot] = useState(settings.showBootSequence);
  const [activeSection, setActiveSection] = useState<Section>('about');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (showBoot) {
    return <BootSequence onComplete={() => setShowBoot(false)} />;
  }

  return (
    <div className={styles.shell}>
      <DOSHeader />

      <div className={styles.body}>
        {/* Sidebar — hidden on mobile via CSS */}
        <div className={styles.sidebar}>
          <DOSNav activeSection={activeSection} onSelect={setActiveSection} />
        </div>

        {/* Main content area */}
        <div className={styles.mainArea}>
          {/* Mobile top bar — hidden on desktop via CSS */}
          <div className={styles.mobileTopBar}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setShowMobileMenu(true)}
            >
              [≡ MENU]
            </button>
            <span className={styles.mobileTitle}>
              {activeSection.toUpperCase()}
            </span>
          </div>

          <div className={styles.panelWrapper}>
            <DOSPanel title={SECTION_PATHS[activeSection]}>
              <SectionContent section={activeSection} />
            </DOSPanel>
          </div>
        </div>
      </div>

      <DOSStatusBar
        activeSection={activeSection}
        onOpenSettings={() => setShowSettings(true)}
      />

      {showMobileMenu && (
        <DOSMobileMenu
          activeSection={activeSection}
          onSelect={setActiveSection}
          onClose={() => setShowMobileMenu(false)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <DOSSettingsDialog onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
