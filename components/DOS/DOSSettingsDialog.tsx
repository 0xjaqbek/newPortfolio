import { useEffect } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';
import styles from './DOSSettingsDialog.module.css';

interface DOSSettingsDialogProps {
  onClose: () => void;
}

export default function DOSSettingsDialog({ onClose }: DOSSettingsDialogProps) {
  const { settings, updateSettings } = useAppSettings();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.titleBar}>SETTINGS</div>

        <div className={styles.body}>
          <div className={styles.setting}>
            <button
              className={styles.toggle}
              onClick={() =>
                updateSettings({ showBootSequence: !settings.showBootSequence })
              }
            >
              {settings.showBootSequence ? '[X]' : '[ ]'}
            </button>
            <span>SHOW BOOT SEQUENCE ON LOAD</span>
          </div>

          <div className={styles.group}>
            <div className={styles.groupLabel}>AI PROVIDER:</div>
            <button
              className={styles.radio}
              onClick={() => updateSettings({ aiProvider: 'deepseek' })}
            >
              {settings.aiProvider === 'deepseek' ? '(•)' : '( )'} DIRECT (DEEPSEEK)
            </button>
            <button
              className={styles.radio}
              onClick={() => updateSettings({ aiProvider: 'rag-assistant' })}
            >
              {settings.aiProvider === 'rag-assistant' ? '(•)' : '( )'} RAG ASSISTANT
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={onClose}>[OK]</button>
          <span className={styles.hint}>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
