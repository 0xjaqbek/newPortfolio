import styles from './DOSNav.module.css';

export type Section =
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'contact'
  | 'resume'
  | 'chat';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'about',      label: 'ABOUT' },
  { id: 'skills',     label: 'SKILLS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects',   label: 'PROJECTS' },
  { id: 'contact',    label: 'CONTACT' },
  { id: 'resume',     label: 'CV / RESUME' },
  { id: 'chat',       label: 'AI CHAT' },
];

interface DOSNavProps {
  activeSection: Section;
  onSelect: (section: Section) => void;
}

export default function DOSNav({ activeSection, onSelect }: DOSNavProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navTitle}>NAVIGATION</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`${styles.item} ${activeSection === item.id ? styles.active : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.arrow}>{activeSection === item.id ? '►' : ' '}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
