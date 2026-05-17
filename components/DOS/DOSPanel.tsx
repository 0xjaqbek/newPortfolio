import { ReactNode } from 'react';
import styles from './DOSPanel.module.css';

interface DOSPanelProps {
  title: string;
  children: ReactNode;
}

export default function DOSPanel({ title, children }: DOSPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>{title}</div>
      <div className={styles.panelContent}>
        {children}
      </div>
    </div>
  );
}
