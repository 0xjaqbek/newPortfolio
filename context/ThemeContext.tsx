'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorScheme = 'green-phosphor' | 'amber' | 'monochrome' | 'matrix' | 'custom';

export interface ThemeSettings {
  colorScheme: ColorScheme;
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
  effects: {
    scanlines: boolean;
    curvature: boolean;
    glow: boolean;
    chromaticAberration: boolean;
  };
  showBootSequence: boolean;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeSettings = {
  colorScheme: 'green-phosphor',
  effects: {
    scanlines: true,
    curvature: true,
    glow: true,
    chromaticAberration: false,
  },
  showBootSequence: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) {
      try {
        setTheme(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored theme:', e);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('portfolio-theme', JSON.stringify(theme));
      applyThemeToDOM(theme);
    }
  }, [theme, mounted]);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Apply theme CSS variables to the DOM
function applyThemeToDOM(theme: ThemeSettings) {
  const root = document.documentElement;

  // Color scheme presets
  const colorSchemes = {
    'green-phosphor': {
      primary: '#00ff00',
      secondary: '#00cc00',
      background: '#0a0a0a',
      text: '#00ff00',
      glow: 'rgba(0, 255, 0, 0.5)',
    },
    amber: {
      primary: '#ffb000',
      secondary: '#ff8800',
      background: '#1a0f00',
      text: '#ffb000',
      glow: 'rgba(255, 176, 0, 0.5)',
    },
    monochrome: {
      primary: '#ffffff',
      secondary: '#cccccc',
      background: '#000000',
      text: '#ffffff',
      glow: 'rgba(255, 255, 255, 0.3)',
    },
    matrix: {
      primary: '#00ff41',
      secondary: '#008f11',
      background: '#000000',
      text: '#00ff41',
      glow: 'rgba(0, 255, 65, 0.6)',
    },
    custom: {
      primary: theme.customColors?.primary || '#00ff00',
      secondary: theme.customColors?.secondary || '#00cc00',
      background: theme.customColors?.background || '#0a0a0a',
      text: theme.customColors?.primary || '#00ff00',
      glow: `rgba(0, 255, 0, 0.5)`,
    },
  };

  const colors = colorSchemes[theme.colorScheme];

  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-glow', colors.glow);

  // Effects
  root.style.setProperty('--scanlines-opacity', theme.effects.scanlines ? '0.1' : '0');
  root.style.setProperty('--curvature-amount', theme.effects.curvature ? '3px' : '0px');
  root.style.setProperty('--glow-amount', theme.effects.glow ? '10px' : '0px');
  root.style.setProperty(
    '--chromatic-aberration',
    theme.effects.chromaticAberration ? '2px' : '0px'
  );
}
