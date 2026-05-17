# DOS Amber Redesign — Design Spec
Date: 2026-05-17

## Summary

Full visual redesign of the portfolio to a committed amber DOS aesthetic — Norton Commander / EDIT.COM era (late 80s PC). One opinionated look, no theme switcher. The existing section content (About, Skills, Experience, Projects, Contact, Resume, Chat) is preserved; only the shell around it changes.

---

## Section 1: Color & Typography

### Palette
```
Background:   #1A0800  (near-black with deep amber undertone)
Primary text: #FFB000  (warm amber phosphor — all main text, borders)
Dim text:     #A06000  (secondary info, labels, inactive items)
Highlight bg: #FFB000  (inverted selection background)
Highlight fg: #1A0800  (dark text on amber selection bar)
```

### Typography
- Font: `'Courier New', 'Consolas', monospace` — no webfont dependency
- All UI chrome (panel titles, nav labels, status bar) in ALL CAPS
- Mixed case only for actual content text
- No bold/italic — differentiation via color and case only

### CRT Effects (minimal)
- Scanlines: `rgba(0,0,0,0.15)` opacity, thin lines, barely visible
- Text glow: `text-shadow: 0 0 4px rgba(255,176,0,0.4)` on primary text only
- No screen curvature
- No chromatic aberration
- Effects are CSS-only constants — no runtime toggles

### Removed
- `ThemeContext` — deleted entirely
- Settings menu — removed
- All theme variants (green-phosphor, monochrome, matrix, custom)

---

## Section 2: Layout Architecture

### Desktop Layout (>768px)

```
╔══════════════════════════════════════════════════════════════╗
║  ▄▄▄ ▄▄▄ ▄▄▄ ▄▄▄ ▄▄▄    JAKUB SKWIERAWSKI                  ║
║  ███ ███ ███ ███ ███    Full-Stack Developer                  ║
╠══════════════╦═══════════════════════════════════════════════╣
║ NAVIGATION   ║ C:\PORTFOLIO\ABOUT.TXT                        ║
║──────────────║───────────────────────────────────────────────║
║►[ABOUT      ]║ $ cat about.txt                               ║
║ [SKILLS     ]║                                               ║
║ [EXPERIENCE ]║  content here...                              ║
║ [PROJECTS   ]║                                               ║
║ [CONTACT    ]║                                               ║
║ [RESUME     ]║                                               ║
║ [AI CHAT    ]║                                               ║
║              ║                                               ║
╠══════════════╩═══════════════════════════════════════════════╣
║ F1=About  F2=Skills  F3=Projects  ESC=Chat  [SYS READY] █   ║
╚══════════════════════════════════════════════════════════════╝
```

- Outer frame: double-line box characters (╔╗╚╝║═╠╣╦╩╬)
- Inner sidebar/content divider: single vertical line junction at top (╦), resolves at bottom (╩)
- Sidebar width: ~18 characters wide (fixed)
- Main panel: fills remaining width, scrolls independently
- Shell itself: fixed `100vh`, no outer scroll

### Mobile Layout (≤768px)
- Outer double-line frame collapses
- Top bar: `[≡ MENU]` button + current section name
- Main content: full width, fills screen
- Status bar: remains at bottom
- `[MENU]` opens full-screen `DOSMobileMenu` overlay

---

## Section 3: Components

### New Components

**`DOSShell`** (`components/DOS/DOSShell.tsx`)
- Replaces `Terminal.tsx`
- Owns the full viewport frame with double-line border
- Manages `activeSection` state (moved from `page.tsx`)
- Renders: `DOSHeader`, `DOSNav`, `DOSPanel`, `DOSStatusBar`

**`DOSHeader`** (`components/DOS/DOSHeader.tsx`)
- Pre-formatted ASCII figlet name + developer title
- Optional uptime/date line
- Pure presentational, no state

**`DOSNav`** (`components/DOS/DOSNav.tsx`)
- Props: `activeSection`, `onSelect`
- Full-width inverted amber block on active item
- `►` prefix on active, space prefix on inactive
- Instant selection, no animation

**`DOSPanel`** (`components/DOS/DOSPanel.tsx`)
- Props: `title` (string), `children`
- Renders title in top border: `╔═ TITLE ══╗`
- Wraps scrollable content area
- Used for both main content and sidebar inner sections

**`DOSStatusBar`** (`components/DOS/DOSStatusBar.tsx`)
- Fixed bottom strip
- Left: F-key hints (update per active section)
- Right: blinking `█` cursor
- Updates dynamically based on active section

**`BlockCursor`** (`components/DOS/BlockCursor.tsx`)
- Renders `█` with CSS `animation: blink 1s step-end infinite`
- Used in status bar and after ASCII header name line
- NOT scattered through content sections

**`DOSMobileMenu`** (`components/DOS/DOSMobileMenu.tsx`)
- Full-screen overlay on mobile
- Background: `#1A0800`, double-line border around menu box
- Numbered items: `1. ABOUT`, `2. SKILLS`, etc.
- Click or number key to select, `[X]` / ESC to close
- No slide animation — instant open/close

### Kept Unchanged (content only)
- `About`, `Skills`, `Experience`, `Projects`, `Contact`, `Resume` — render inside `DOSPanel`
- `ChatWindow` — renders inside `DOSPanel`
- `BootSequence` — kept, restyled amber (see Section 4)

### Removed
- `Terminal.tsx` — replaced by `DOSShell`
- `SettingsMenu` — removed
- `context/ThemeContext.tsx` — deleted

---

## Section 4: Behaviors & Interactions

### Navigation
- Clicking nav item: instantly updates main panel title bar (`C:\PORTFOLIO\SKILLS.TXT`) and swaps content
- No transition animations — DOS-authentic instant swap
- Status bar F-key hints update per section

### F-key hints per section
```
ABOUT:      F1=About   F9=GitHub   ESC=Chat
SKILLS:     F2=Skills  F9=GitHub   ESC=Chat
EXPERIENCE: F3=Exp     F9=GitHub   ESC=Chat
PROJECTS:   F4=Projects F5=GitHub  F6=Demo   ESC=Chat
CONTACT:    F5=Contact  F9=GitHub  ESC=Chat
RESUME:     F6=Resume   F7=Download ESC=Chat
CHAT:       F7=Chat     F9=GitHub  ESC=About
```

### Blinking Cursor
- CSS: `animation: blink 1s step-end infinite`
- Positions: end of status bar, after ASCII header name line
- NOT scattered through content sections

### Boot Sequence
- Kept, restyled in amber on `#1A0800`
- Slightly faster timing (100ms per line instead of 150ms)
- Same messages, no changes to content
- Appears before `DOSShell` mounts, then fades and yields
- Show/hide logic: shown on first visit per session (`sessionStorage` flag). No settings toggle — if you loaded the page fresh, you see the boot. Refresh = boot again.

### Scrolling
- Only the main content panel scrolls
- Outer frame, sidebar, header, status bar: all fixed position
- Custom scrollbar: amber thumb, dark track (existing CSS, recolored)

### Mobile Menu
- Opens instantly (no animation)
- Full screen, `#1A0800` background
- Double-line border around the menu list box
- Items: `1. ABOUT`, `2. SKILLS`, etc.
- Select by click; `[X]` label visible to close
- ESC key also closes

---

## Files Affected

### Created
- `components/DOS/DOSShell.tsx`
- `components/DOS/DOSShell.module.css`
- `components/DOS/DOSHeader.tsx`
- `components/DOS/DOSNav.tsx`
- `components/DOS/DOSPanel.tsx`
- `components/DOS/DOSPanel.module.css`
- `components/DOS/DOSStatusBar.tsx`
- `components/DOS/BlockCursor.tsx`
- `components/DOS/DOSMobileMenu.tsx`

### Modified
- `app/globals.css` — amber color constants, remove theme variables
- `app/page.tsx` — remove ThemeContext usage, swap `Terminal` for `DOSShell`, remove settings state
- `app/layout.tsx` — remove `ThemeProvider` wrapper
- `components/Terminal/BootSequence.module.css` — restyle to amber

### Deleted
- `components/Terminal/Terminal.tsx`
- `components/Terminal/Terminal.module.css`
- `components/Settings/SettingsMenu.tsx` (and related files)
- `context/ThemeContext.tsx`

### Untouched
- All section components: `About`, `Skills`, `Experience`, `Projects`, `Contact`, `Resume`
- `ChatWindow` and all AI chat components
- `components/GitHub/ContributionMap`
- All API routes and backend logic
