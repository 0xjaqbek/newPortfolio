'use client';

import { useTheme, ColorScheme } from '@/context/ThemeContext';
import styles from './SettingsMenu.module.css';

interface SettingsMenuProps {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { theme, updateTheme, resetTheme } = useTheme();

  const colorSchemes: { value: ColorScheme; label: string }[] = [
    { value: 'green-phosphor', label: 'Green Phosphor' },
    { value: 'amber', label: 'Amber Monitor' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'matrix', label: 'Matrix Green' },
  ];

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    updateTheme({ colorScheme: scheme });
  };

  const toggleEffect = (effect: keyof typeof theme.effects) => {
    updateTheme({
      effects: {
        ...theme.effects,
        [effect]: !theme.effects[effect],
      },
    });
  };

  const toggleBootSequence = () => {
    updateTheme({ showBootSequence: !theme.showBootSequence });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.prompt}>$</span> system.config
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            [X]
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Color Scheme</h3>
          <div className={styles.optionGrid}>
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.value}
                className={`${styles.option} ${
                  theme.colorScheme === scheme.value ? styles.active : ''
                }`}
                onClick={() => handleColorSchemeChange(scheme.value)}
              >
                {scheme.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Visual Effects</h3>
          <div className={styles.toggleList}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={theme.effects.scanlines}
                onChange={() => toggleEffect('scanlines')}
              />
              <span>Scanlines</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={theme.effects.curvature}
                onChange={() => toggleEffect('curvature')}
              />
              <span>CRT Curvature</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={theme.effects.glow}
                onChange={() => toggleEffect('glow')}
              />
              <span>Screen Glow</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={theme.effects.chromaticAberration}
                onChange={() => toggleEffect('chromaticAberration')}
              />
              <span>Chromatic Aberration</span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Other Settings</h3>
          <div className={styles.toggleList}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={theme.showBootSequence}
                onChange={toggleBootSequence}
              />
              <span>Boot Sequence (on page load)</span>
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetButton} onClick={resetTheme}>
            Reset to Default
          </button>
          <button className={styles.closeButtonBottom} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
