import { useEffect } from 'react';
import { Section } from './DOSNav';
import styles from './DOSMobileMenu.module.css';

const MENU_ITEMS: { id: Section; label: string; num: number }[] = [
  { id: 'about',      label: 'ABOUT',       num: 1 },
  { id: 'skills',     label: 'SKILLS',      num: 2 },
  { id: 'experience', label: 'EXPERIENCE',  num: 3 },
  { id: 'projects',   label: 'PROJECTS',    num: 4 },
  { id: 'contact',    label: 'CONTACT',     num: 5 },
  { id: 'resume',     label: 'CV / RESUME', num: 6 },
  { id: 'chat',       label: 'AI CHAT',     num: 7 },
];

interface DOSMobileMenuProps {
  activeSection: Section;
  onSelect: (section: Section) => void;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function DOSMobileMenu({
  activeSection,
  onSelect,
  onClose,
  onOpenSettings,
}: DOSMobileMenuProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        const item = MENU_ITEMS[num - 1];
        if (item) {
          onSelect(item.id);
          onClose();
        }
      }
      if (e.key === '8') {
        onOpenSettings();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onSelect, onOpenSettings]);

  return (
    <div className={styles.overlay}>
      <div className={styles.menu}>
        <div className={styles.titleBar}>
          <span>MENU</span>
          <button className={styles.closeBtn} onClick={onClose}>[X]</button>
        </div>

        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`${styles.item} ${activeSection === item.id ? styles.active : ''}`}
            onClick={() => { onSelect(item.id); onClose(); }}
          >
            <span className={styles.num}>{item.num}.</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div className={styles.separator}>{'─'.repeat(24)}</div>

        <button
          className={styles.item}
          onClick={() => { onOpenSettings(); onClose(); }}
        >
          <span className={styles.num}>8.</span>
          <span>SETTINGS</span>
        </button>
      </div>
    </div>
  );
}
