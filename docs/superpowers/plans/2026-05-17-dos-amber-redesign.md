# DOS Amber Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing theme-switched terminal portfolio shell with a single committed amber DOS aesthetic — Norton Commander / EDIT.COM era (late 80s PC) — while preserving all content sections and API routes.

**Architecture:** New `components/DOS/` directory contains the full shell (DOSShell, DOSHeader, DOSNav, DOSPanel, DOSStatusBar, DOSMobileMenu, DOSSettingsDialog, BlockCursor). A new `AppSettingsContext` replaces `ThemeContext` with only two settings (boot sequence, AI provider). `app/page.tsx` becomes a thin wrapper that renders `<DOSShell />`.

**Tech Stack:** Next.js 14 App Router, React, CSS Modules, TypeScript. No new dependencies.

---

## File Map

### Created
- `context/AppSettingsContext.tsx` — minimal context: showBootSequence + aiProvider
- `components/DOS/BlockCursor.tsx` + `.module.css` — blinking █ cursor
- `components/DOS/DOSHeader.tsx` + `.module.css` — ASCII art + name + title
- `components/DOS/DOSNav.tsx` + `.module.css` — sidebar nav with inverted selection
- `components/DOS/DOSPanel.tsx` + `.module.css` — reusable panel with amber title bar
- `components/DOS/DOSStatusBar.tsx` + `.module.css` — bottom bar with F-key hints
- `components/DOS/DOSMobileMenu.tsx` + `.module.css` — mobile full-screen menu overlay
- `components/DOS/DOSSettingsDialog.tsx` + `.module.css` — settings modal
- `components/DOS/DOSShell.tsx` + `.module.css` — main shell, owns full viewport

### Modified
- `app/globals.css` — amber color variables, remove theme variables
- `app/layout.tsx` — swap ThemeProvider → AppSettingsProvider, remove effects CSS imports
- `app/page.tsx` — replace all content with `<DOSShell />`
- `components/AIChat/ChatWindow.tsx` — swap `useTheme` → `useAppSettings`
- `components/Terminal/BootSequence.tsx` — change timing 150ms → 100ms
- `components/Terminal/BootSequence.module.css` — restyle to amber

### Deleted (Task 15)
- `context/ThemeContext.tsx`
- `components/Terminal/Terminal.tsx`
- `components/Terminal/Terminal.module.css`
- `components/Settings/SettingsMenu.tsx`
- `components/Settings/SettingsMenu.module.css`
- `styles/effects/scanlines.css` (handled inline in DOSShell)
- `styles/effects/crt-curvature.css`
- `styles/effects/glow.css`
- `styles/effects/chromatic-aberration.css`
- `app/page.module.css`

---

## Task 1: AppSettingsContext

**Files:**
- Create: `context/AppSettingsContext.tsx`

- [ ] **Step 1: Create the context file**

```tsx
// context/AppSettingsContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AIProvider = 'deepseek' | 'rag-assistant';

export interface AppSettings {
  showBootSequence: boolean;
  aiProvider: AIProvider;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  showBootSequence: true,
  aiProvider: 'deepseek',
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('portfolio-settings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse stored settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('portfolio-settings', JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  if (!mounted) return null;

  return (
    <AppSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd D:/newPortfolio && npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to this file)

- [ ] **Step 3: Commit**

```bash
git add context/AppSettingsContext.tsx
git commit -m "feat: add AppSettingsContext replacing ThemeContext"
```

---

## Task 2: globals.css amber redesign

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css**

Replace the entire file content with:

```css
:root {
  --dos-bg: #1A0800;
  --dos-amber: #FFB000;
  --dos-dim: #A06000;
  --dos-highlight-bg: #FFB000;
  --dos-highlight-fg: #1A0800;
  --font-mono: 'Courier New', 'Consolas', monospace;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Compatibility aliases — component CSS files (StaticPortfolio, ChatWindow,
     MessageBubble, ContributionMap) still reference the old variable names.
     These map them to the amber palette so those files need no changes. */
  --color-primary: #FFB000;
  --color-secondary: #A06000;
  --color-background: #1A0800;
  --color-text: #FFB000;
  --color-glow: rgba(255, 176, 0, 0.4);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  background: var(--dos-bg);
  color: var(--dos-amber);
  font-family: var(--font-mono);
  line-height: 1.6;
  overflow: hidden;
}

a {
  color: var(--dos-amber);
  text-decoration: none;
}

a:hover {
  color: var(--dos-highlight-bg);
  text-shadow: 0 0 4px rgba(255, 176, 0, 0.4);
}

button {
  font-family: var(--font-mono);
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--dos-bg);
  border-left: 1px solid var(--dos-dim);
}

::-webkit-scrollbar-thumb {
  background: var(--dos-amber);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dos-highlight-bg);
}

::selection {
  background: var(--dos-amber);
  color: var(--dos-bg);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace theme variables with amber DOS palette"
```

---

## Task 3: BlockCursor component

**Files:**
- Create: `components/DOS/BlockCursor.tsx`
- Create: `components/DOS/BlockCursor.module.css`

- [ ] **Step 1: Create BlockCursor.module.css**

```css
/* components/DOS/BlockCursor.module.css */
.cursor {
  animation: blink 1s step-end infinite;
  color: var(--dos-amber);
  line-height: 1;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Create BlockCursor.tsx**

```tsx
// components/DOS/BlockCursor.tsx
import styles from './BlockCursor.module.css';

export default function BlockCursor() {
  return <span className={styles.cursor}>█</span>;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/BlockCursor.tsx components/DOS/BlockCursor.module.css
git commit -m "feat: add BlockCursor component"
```

---

## Task 4: DOSHeader component

**Files:**
- Create: `components/DOS/DOSHeader.tsx`
- Create: `components/DOS/DOSHeader.module.css`

- [ ] **Step 1: Create DOSHeader.module.css**

```css
/* components/DOS/DOSHeader.module.css */
.header {
  border-bottom: 1px solid var(--dos-amber);
  padding: 0.4rem 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  overflow: hidden;
}

.ascii {
  font-size: 0.5rem;
  line-height: 1.15;
  white-space: pre;
  color: var(--dos-amber);
  text-shadow: 0 0 4px rgba(255, 176, 0, 0.4);
  flex-shrink: 0;
  user-select: none;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: hidden;
}

.name {
  font-size: 1rem;
  color: var(--dos-amber);
  text-shadow: 0 0 4px rgba(255, 176, 0, 0.4);
  letter-spacing: 2px;
  white-space: nowrap;
}

.title {
  font-size: 0.75rem;
  color: var(--dos-dim);
  letter-spacing: 3px;
}

.location {
  font-size: 0.7rem;
  color: var(--dos-dim);
}

@media (max-width: 768px) {
  .ascii {
    display: none;
  }

  .name {
    font-size: 0.85rem;
    letter-spacing: 1px;
  }

  .header {
    padding: 0.3rem 0.75rem;
  }
}
```

- [ ] **Step 2: Create DOSHeader.tsx**

```tsx
// components/DOS/DOSHeader.tsx
import BlockCursor from './BlockCursor';
import styles from './DOSHeader.module.css';

// ASCII block letters for "JS" (initials)
const ASCII_ART = `
     ██╗ ███████╗
     ██║ ██╔════╝
     ██║ ███████╗
██   ██║ ╚════██║
╚██████╔╝ ███████║
 ╚═════╝  ╚══════╝`.trim();

export default function DOSHeader() {
  return (
    <div className={styles.header}>
      <pre className={styles.ascii} aria-hidden="true">{ASCII_ART}</pre>
      <div className={styles.info}>
        <div className={styles.name}>
          JAKUB SKWIERAWSKI<BlockCursor />
        </div>
        <div className={styles.title}>FULL-STACK DEVELOPER</div>
        <div className={styles.location}>Warsaw, Poland</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSHeader.tsx components/DOS/DOSHeader.module.css
git commit -m "feat: add DOSHeader component with ASCII art"
```

---

## Task 5: DOSNav component

**Files:**
- Create: `components/DOS/DOSNav.tsx`
- Create: `components/DOS/DOSNav.module.css`

- [ ] **Step 1: Create DOSNav.module.css**

```css
/* components/DOS/DOSNav.module.css */
.nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navTitle {
  padding: 3px 8px;
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
  font-size: 0.7rem;
  letter-spacing: 2px;
  flex-shrink: 0;
  user-select: none;
}

.item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 6px;
  background: none;
  border: none;
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  gap: 4px;
  line-height: 1.4;
}

.item:hover {
  background: rgba(255, 176, 0, 0.12);
}

.item.active {
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
}

.arrow {
  width: 1em;
  flex-shrink: 0;
  font-size: 0.7rem;
}

.label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

- [ ] **Step 2: Create DOSNav.tsx**

Note: `Section` type is defined here and re-exported — import it from this file in other components.

```tsx
// components/DOS/DOSNav.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSNav.tsx components/DOS/DOSNav.module.css
git commit -m "feat: add DOSNav component with inverted selection"
```

---

## Task 6: DOSPanel component

**Files:**
- Create: `components/DOS/DOSPanel.tsx`
- Create: `components/DOS/DOSPanel.module.css`

- [ ] **Step 1: Create DOSPanel.module.css**

```css
/* components/DOS/DOSPanel.module.css */
.panel {
  border: 1px solid var(--dos-amber);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panelTitle {
  padding: 2px 8px;
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
  font-size: 0.7rem;
  letter-spacing: 1px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.panelContent {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .panel {
    border: none;
    border-top: 1px solid var(--dos-amber);
  }

  .panelContent {
    padding: 0.75rem;
  }
}
```

- [ ] **Step 2: Create DOSPanel.tsx**

```tsx
// components/DOS/DOSPanel.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSPanel.tsx components/DOS/DOSPanel.module.css
git commit -m "feat: add DOSPanel component with amber title bar"
```

---

## Task 7: DOSStatusBar component

**Files:**
- Create: `components/DOS/DOSStatusBar.tsx`
- Create: `components/DOS/DOSStatusBar.module.css`

- [ ] **Step 1: Create DOSStatusBar.module.css**

```css
/* components/DOS/DOSStatusBar.module.css */
.bar {
  border-top: 1px solid var(--dos-amber);
  padding: 2px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  font-size: 0.7rem;
  background: var(--dos-bg);
  gap: 1rem;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.hints {
  color: var(--dos-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.settingsBtn {
  background: none;
  border: none;
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 0;
}

.settingsBtn:hover {
  background: var(--dos-amber);
  color: var(--dos-bg);
  padding: 0 3px;
}

.status {
  color: var(--dos-dim);
}
```

- [ ] **Step 2: Create DOSStatusBar.tsx**

Import `Section` from `DOSNav` (defined there).

```tsx
// components/DOS/DOSStatusBar.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSStatusBar.tsx components/DOS/DOSStatusBar.module.css
git commit -m "feat: add DOSStatusBar with F-key hints and settings trigger"
```

---

## Task 8: DOSMobileMenu component

**Files:**
- Create: `components/DOS/DOSMobileMenu.tsx`
- Create: `components/DOS/DOSMobileMenu.module.css`

- [ ] **Step 1: Create DOSMobileMenu.module.css**

```css
/* components/DOS/DOSMobileMenu.module.css */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 8, 0, 0.97);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.menu {
  border: 2px solid var(--dos-amber);
  background: var(--dos-bg);
  min-width: 280px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
}

.titleBar {
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  letter-spacing: 2px;
}

.closeBtn {
  background: none;
  border: none;
  color: var(--dos-highlight-fg);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
}

.closeBtn:hover {
  text-decoration: underline;
}

.item {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  padding: 7px 12px;
  background: none;
  border: none;
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
}

.item:hover,
.item.active {
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
}

.num {
  color: var(--dos-dim);
  min-width: 1.5em;
  flex-shrink: 0;
}

.item:hover .num,
.item.active .num {
  color: var(--dos-highlight-fg);
}

.separator {
  padding: 2px 12px;
  color: var(--dos-dim);
  font-size: 0.75rem;
  user-select: none;
}
```

- [ ] **Step 2: Create DOSMobileMenu.tsx**

```tsx
// components/DOS/DOSMobileMenu.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSMobileMenu.tsx components/DOS/DOSMobileMenu.module.css
git commit -m "feat: add DOSMobileMenu overlay for mobile navigation"
```

---

## Task 9: DOSSettingsDialog component

**Files:**
- Create: `components/DOS/DOSSettingsDialog.tsx`
- Create: `components/DOS/DOSSettingsDialog.module.css`

- [ ] **Step 1: Create DOSSettingsDialog.module.css**

```css
/* components/DOS/DOSSettingsDialog.module.css */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 600;
}

.dialog {
  border: 2px solid var(--dos-amber);
  background: var(--dos-bg);
  min-width: 340px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
}

.titleBar {
  background: var(--dos-amber);
  color: var(--dos-highlight-fg);
  padding: 4px 12px;
  font-size: 0.8rem;
  letter-spacing: 3px;
  user-select: none;
}

.body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.setting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.82rem;
  color: var(--dos-amber);
}

.toggle {
  background: none;
  border: none;
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.toggle:hover {
  color: var(--dos-highlight-bg);
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.groupLabel {
  font-size: 0.7rem;
  color: var(--dos-dim);
  letter-spacing: 1px;
  margin-bottom: 0.15rem;
}

.radio {
  background: none;
  border: none;
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 2px 0;
  text-align: left;
}

.radio:hover {
  color: var(--dos-highlight-bg);
}

.footer {
  border-top: 1px solid var(--dos-dim);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.okBtn {
  background: var(--dos-amber);
  border: none;
  color: var(--dos-highlight-fg);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 2px 10px;
}

.okBtn:hover {
  opacity: 0.85;
}

.hint {
  font-size: 0.7rem;
  color: var(--dos-dim);
}
```

- [ ] **Step 2: Create DOSSettingsDialog.tsx**

```tsx
// components/DOS/DOSSettingsDialog.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/DOS/DOSSettingsDialog.tsx components/DOS/DOSSettingsDialog.module.css
git commit -m "feat: add DOSSettingsDialog with boot sequence and AI provider toggles"
```

---

## Task 10: DOSShell component

**Files:**
- Create: `components/DOS/DOSShell.tsx`
- Create: `components/DOS/DOSShell.module.css`

- [ ] **Step 1: Create DOSShell.module.css**

```css
/* components/DOS/DOSShell.module.css */
.shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--dos-bg);
  color: var(--dos-amber);
  font-family: var(--font-mono);
  border: 2px solid var(--dos-amber);
  overflow: hidden;
}

/* Scanlines overlay */
.shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
  z-index: 50;
}

.body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.sidebar {
  width: 190px;
  flex-shrink: 0;
  border-right: 1px solid var(--dos-amber);
  overflow-y: auto;
}

.mainArea {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mobile top bar - hidden on desktop */
.mobileTopBar {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 4px 8px;
  border-bottom: 1px solid var(--dos-amber);
  flex-shrink: 0;
  font-size: 0.8rem;
  position: relative;
  z-index: 1;
}

.mobileMenuBtn {
  background: none;
  border: 1px solid var(--dos-amber);
  color: var(--dos-amber);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 1px 6px;
}

.mobileMenuBtn:hover {
  background: var(--dos-amber);
  color: var(--dos-bg);
}

.mobileTitle {
  color: var(--dos-dim);
  letter-spacing: 1px;
  font-size: 0.75rem;
}

.panelWrapper {
  flex: 1;
  overflow: hidden;
  padding: 4px;
}

@media (max-width: 768px) {
  .shell {
    border: none;
  }

  .sidebar {
    display: none;
  }

  .mobileTopBar {
    display: flex;
  }

  .panelWrapper {
    padding: 0;
  }
}
```

- [ ] **Step 2: Create DOSShell.tsx**

```tsx
// components/DOS/DOSShell.tsx
'use client';

import { useState } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';
import DOSHeader from './DOSHeader';
import DOSNav, { Section } from './DOSNav';
import DOSPanel from './DOSPanel';
import DOSStatusBar from './DOSStatusBar';
import DOSMobileMenu from './DOSMobileMenu';
import DOSSettingsDialog from './DOSSettingsDialog';
import BootSequence from '@/components/Terminal/BootSequence';
import About from '@/components/StaticPortfolio/About';
import Skills from '@/components/StaticPortfolio/Skills';
import Experience from '@/components/StaticPortfolio/Experience';
import Projects from '@/components/StaticPortfolio/Projects';
import Contact from '@/components/StaticPortfolio/Contact';
import Resume from '@/components/StaticPortfolio/Resume';
import ChatWindow from '@/components/AIChat/ChatWindow';
import styles from './DOSShell.module.css';

const SECTION_PATHS: Record<Section, string> = {
  about:      'C:\\PORTFOLIO\\ABOUT.TXT',
  skills:     'C:\\PORTFOLIO\\SKILLS.TXT',
  experience: 'C:\\PORTFOLIO\\EXPERIENCE.TXT',
  projects:   'C:\\PORTFOLIO\\PROJECTS.TXT',
  contact:    'C:\\PORTFOLIO\\CONTACT.TXT',
  resume:     'C:\\PORTFOLIO\\RESUME.TXT',
  chat:       'C:\\PORTFOLIO\\AI_CHAT.EXE',
};

function SectionContent({ section }: { section: Section }) {
  switch (section) {
    case 'about':      return <About />;
    case 'skills':     return <Skills />;
    case 'experience': return <Experience />;
    case 'projects':   return <Projects />;
    case 'contact':    return <Contact />;
    case 'resume':     return <Resume />;
    case 'chat':       return <ChatWindow />;
  }
}

export default function DOSShell() {
  const { settings } = useAppSettings();
  const [showBoot, setShowBoot] = useState(settings.showBootSequence);
  const [activeSection, setActiveSection] = useState<Section>('about');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (showBoot) {
    return <BootSequence onComplete={() => setShowBoot(false)} />;
  }

  return (
    <div className={styles.shell}>
      <DOSHeader />

      <div className={styles.body}>
        {/* Sidebar — hidden on mobile via CSS */}
        <div className={styles.sidebar}>
          <DOSNav activeSection={activeSection} onSelect={setActiveSection} />
        </div>

        {/* Main content area */}
        <div className={styles.mainArea}>
          {/* Mobile top bar — hidden on desktop via CSS */}
          <div className={styles.mobileTopBar}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setShowMobileMenu(true)}
            >
              [≡ MENU]
            </button>
            <span className={styles.mobileTitle}>
              {activeSection.toUpperCase()}
            </span>
          </div>

          <div className={styles.panelWrapper}>
            <DOSPanel title={SECTION_PATHS[activeSection]}>
              <SectionContent section={activeSection} />
            </DOSPanel>
          </div>
        </div>
      </div>

      <DOSStatusBar
        activeSection={activeSection}
        onOpenSettings={() => setShowSettings(true)}
      />

      {showMobileMenu && (
        <DOSMobileMenu
          activeSection={activeSection}
          onSelect={setActiveSection}
          onClose={() => setShowMobileMenu(false)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <DOSSettingsDialog onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd D:/newPortfolio && npx tsc --noEmit`
Expected: No errors on the new DOS components

- [ ] **Step 4: Commit**

```bash
git add components/DOS/DOSShell.tsx components/DOS/DOSShell.module.css
git commit -m "feat: add DOSShell main component"
```

---

## Task 11: Update layout.tsx

**Files:**
- Modify: `app/layout.tsx`

Current file imports `ThemeProvider` and four effect CSS files. Replace with `AppSettingsProvider` and remove effect imports.

- [ ] **Step 1: Replace layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { ChatProvider } from '@/context/ChatContext';
import ConsoleEasterEgg from '@/components/ConsoleEasterEgg';

export const metadata: Metadata = {
  title: 'Jakub Skwierawski | Developer Portfolio',
  description: 'Full Stack Developer specializing in blockchain and AI technologies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const easterEggEnabled = process.env.NEXT_PUBLIC_ENABLE_EASTER_EGG === 'true';

  return (
    <html lang="en">
      <body>
        <AppSettingsProvider>
          <ChatProvider>
            {easterEggEnabled && <ConsoleEasterEgg />}
            {children}
          </ChatProvider>
        </AppSettingsProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: swap ThemeProvider for AppSettingsProvider in layout"
```

---

## Task 12: Update page.tsx

**Files:**
- Modify: `app/page.tsx`

The current `page.tsx` is 217 lines managing all layout state. It becomes a 7-line wrapper.

- [ ] **Step 1: Replace page.tsx**

```tsx
// app/page.tsx
import DOSShell from '@/components/DOS/DOSShell';

export default function Home() {
  return <DOSShell />;
}
```

- [ ] **Step 2: Run build to check for compile errors**

Run: `cd D:/newPortfolio && npm run build`
Expected: Build succeeds. If errors appear, they will be about missing imports in other files — fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace page.tsx shell with DOSShell"
```

---

## Task 13: Update ChatWindow.tsx

**Files:**
- Modify: `components/AIChat/ChatWindow.tsx`

ChatWindow currently imports `useTheme` and reads `theme.aiProvider`. Swap to `useAppSettings` and `settings.aiProvider`.

- [ ] **Step 1: Change the import line**

Find line 4:
```tsx
import { useTheme } from '@/context/ThemeContext';
```
Replace with:
```tsx
import { useAppSettings } from '@/context/AppSettingsContext';
```

- [ ] **Step 2: Change the hook call**

Find line 11:
```tsx
  const { theme } = useTheme();
```
Replace with:
```tsx
  const { settings } = useAppSettings();
```

- [ ] **Step 3: Replace all `theme.aiProvider` references with `settings.aiProvider`**

There are 4 occurrences (lines 35, 68, 94, 97). Change every `theme.aiProvider` to `settings.aiProvider`.

Line 35:
```tsx
      const endpoint = settings.aiProvider === 'rag-assistant' ? '/api/chat-rag' : '/api/chat';
```

Line 68:
```tsx
            [{settings.aiProvider === 'rag-assistant' ? 'RAG' : 'Direct'}]
```

Line 94:
```tsx
                <span className={styles.prompt}>{'>'}</span> AI Mode: {settings.aiProvider === 'rag-assistant' ? 'RAG Assistant' : 'DeepSeek Direct'}
```

Line 97:
```tsx
                {settings.aiProvider === 'rag-assistant'
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd D:/newPortfolio && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add components/AIChat/ChatWindow.tsx
git commit -m "feat: migrate ChatWindow from ThemeContext to AppSettingsContext"
```

---

## Task 14: Restyle BootSequence to amber

**Files:**
- Modify: `components/Terminal/BootSequence.module.css`
- Modify: `components/Terminal/BootSequence.tsx`

- [ ] **Step 1: Replace BootSequence.module.css**

```css
/* components/Terminal/BootSequence.module.css */
.bootSequence {
  position: fixed;
  inset: 0;
  background: #1A0800;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 0.9rem;
  color: #FFB000;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  text-shadow: 0 0 4px rgba(255, 176, 0, 0.4);
}

.line {
  margin-bottom: 0.25rem;
}

.prompt {
  color: #A06000;
  margin-right: 0.5rem;
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 15px;
  background: #FFB000;
  animation: blink 0.8s step-end infinite;
  margin-left: 0.5rem;
  vertical-align: middle;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Update timing in BootSequence.tsx**

Find line:
```tsx
      const delay = currentLine === bootMessages.length - 1 ? 1000 : 150;
```
Replace with:
```tsx
      const delay = currentLine === bootMessages.length - 1 ? 800 : 100;
```

- [ ] **Step 3: Commit**

```bash
git add components/Terminal/BootSequence.module.css components/Terminal/BootSequence.tsx
git commit -m "feat: restyle BootSequence to amber DOS aesthetic"
```

---

## Task 15: Cleanup old files

**Files:**
- Delete: `context/ThemeContext.tsx`
- Delete: `components/Terminal/Terminal.tsx`
- Delete: `components/Terminal/Terminal.module.css`
- Delete: `components/Settings/SettingsMenu.tsx`
- Delete: `components/Settings/SettingsMenu.module.css`
- Delete: `styles/effects/scanlines.css`
- Delete: `styles/effects/crt-curvature.css`
- Delete: `styles/effects/glow.css`
- Delete: `styles/effects/chromatic-aberration.css`
- Delete: `app/page.module.css`

- [ ] **Step 1: Delete old files**

```bash
cd D:/newPortfolio
rm context/ThemeContext.tsx
rm components/Terminal/Terminal.tsx
rm components/Terminal/Terminal.module.css
rm components/Settings/SettingsMenu.tsx
rm components/Settings/SettingsMenu.module.css
rm styles/effects/scanlines.css
rm styles/effects/crt-curvature.css
rm styles/effects/glow.css
rm styles/effects/chromatic-aberration.css
rm app/page.module.css
```

- [ ] **Step 2: Run build to confirm nothing is broken**

Run: `cd D:/newPortfolio && npm run build`
Expected: Build succeeds with no errors.

If build fails citing a missing import, trace it and fix the import in the relevant file before deleting.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete ThemeContext, Terminal, SettingsMenu, and effect CSS files"
```

---

## Task 16: Final build verification

- [ ] **Step 1: Run full build**

Run: `cd D:/newPortfolio && npm run build`
Expected: Build completes successfully.

- [ ] **Step 2: Run dev server and visually verify**

Run: `cd D:/newPortfolio && npm run dev`

Check:
- Boot sequence appears in amber on dark background, runs faster
- Main shell renders: outer border, DOS header with ASCII art, sidebar nav, content panel, status bar
- Clicking nav items swaps content instantly
- Active nav item shows amber inverted block with ► arrow
- Panel title bar shows `C:\PORTFOLIO\ABOUT.TXT` etc.
- Status bar shows correct F-key hints per section
- F10=Settings opens the dialog
- Settings dialog toggles boot sequence and AI provider correctly
- On mobile (<768px): sidebar hidden, [≡ MENU] button visible, menu overlay works
- ChatWindow uses the AI provider from settings

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: DOS amber portfolio redesign complete"
```
