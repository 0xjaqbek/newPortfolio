'use client';

import { useEffect, useState } from 'react';
import styles from './BootSequence.module.css';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  'INITIALIZING SYSTEM...',
  'LOADING MODULES...',
  'CHECKING MEMORY... OK',
  'MOUNTING FILESYSTEMS... OK',
  'STARTING SERVICES...',
  'NETWORK INTERFACE... CONNECTED',
  'LOADING PORTFOLIO DATA...',
  'AI CHATBOT... ONLINE',
  'SYSTEM READY.',
  '',
  'WELCOME TO JAKUB SKWIERAWSKI PORTFOLIO v1.0',
  '',
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (currentLine < bootMessages.length) {
      const delay = currentLine === bootMessages.length - 1 ? 1000 : 150;
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  if (!visible) return null;

  return (
    <div className={styles.bootSequence}>
      <div className={styles.content}>
        {bootMessages.slice(0, currentLine).map((message, index) => (
          <div key={index} className={styles.line}>
            {message && <span className={styles.prompt}>{'>'}</span>}
            {message}
          </div>
        ))}
        {currentLine < bootMessages.length && (
          <div className={styles.cursor}></div>
        )}
      </div>
    </div>
  );
}
