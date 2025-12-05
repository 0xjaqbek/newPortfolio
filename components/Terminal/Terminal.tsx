'use client';

import { useTheme } from '@/context/ThemeContext';
import styles from './Terminal.module.css';
import { ReactNode } from 'react';

interface TerminalProps {
  children: ReactNode;
}

export default function Terminal({ children }: TerminalProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`${styles.terminal} ${
        theme.effects.scanlines ? 'scanlines' : ''
      } ${theme.effects.curvature ? 'crt-curvature crt-border' : ''} ${
        theme.effects.glow ? 'screen-glow' : ''
      }`}
    >
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}
