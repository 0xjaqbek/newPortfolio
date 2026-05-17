import BlockCursor from './BlockCursor';
import { Section } from './DOSNav';
import styles from './DOSStatusBar.module.css';

const HINTS: Record<Section, string> = {
  about:      'F1=About  F9=GitHub  ESC=Chat',
  skills:     'F2=Skills  F9=GitHub  ESC=Chat',
  experience: 'F3=Exp  F9=GitHub  ESC=Chat',
  projects:   'F4=Projects  F5=GitHub  F6=Demo',
  contact:    'F5=Contact  F9=GitHub  ESC=Chat',
  resume:     'F6=Resume  F7=Download  ESC=Chat',
  chat:       'F7=Chat  F9=GitHub  ESC=About',
};

interface DOSStatusBarProps {
  activeSection: Section;
  onOpenSettings: () => void;
}

export default function DOSStatusBar({ activeSection, onOpenSettings }: DOSStatusBarProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.hints}>{HINTS[activeSection]}</span>
      <span className={styles.right}>
        <button className={styles.settingsBtn} onClick={onOpenSettings}>
          F10=Settings
        </button>
        <span className={styles.status}>[SYS READY]</span>
        <BlockCursor />
      </span>
    </div>
  );
}
