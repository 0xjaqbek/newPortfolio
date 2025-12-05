export type ColorScheme = 'green-phosphor' | 'amber' | 'monochrome' | 'matrix';

export interface ThemeSettings {
  colorScheme: ColorScheme;
  effects: {
    scanlines: boolean;
    crtCurvature: boolean;
    screenGlow: boolean;
    chromaticAberration: boolean;
    bootSequence: boolean;
    blinkingCursor: boolean;
    typingEffect: boolean;
  };
}

export interface ColorSchemeConfig {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  glowColor: string;
}
