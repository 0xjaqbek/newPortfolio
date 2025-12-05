# Portfolio Architecture Plan

## Project Overview
Interactive developer portfolio with AI chatbot integration featuring terminal/CRT aesthetic with customizable themes.

**GitHub:** https://github.com/0xjaqbek
**Deployment:** Heroku
**AI Provider:** DeepSeek (configured)

---

## Tech Stack

### Core
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + CSS Variables (for dynamic theming)
- **Package Manager:** npm/yarn

### APIs & Libraries
- **AI:** DeepSeek API (via fetch)
- **GitHub:** @octokit/rest
- **State Management:** React Context (for theme settings, chat history)
- **Local Storage:** For persisting theme preferences

### Deployment
- **Platform:** Heroku
- **Build:** Next.js standalone output
- **Environment:** Node.js

---

## Features Breakdown

### 1. Static Portfolio Sections
- **About/Bio** - Personal introduction, background
- **Skills/Tech Stack** - Technical skills, languages, frameworks
- **Work Experience/Timeline** - Professional history with dates
- **Featured Projects** - Curated project showcase
- **Contact Info** - Ways to reach you

### 2. AI Chatbot
**Capabilities:**
- Answer portfolio/work-related questions
- Discuss theoretical projects based on your skills
- Redirect off-topic questions back to portfolio
- Access to GitHub repos and READMEs
- Show contribution graph
- Display project timelines

**Behavior:**
- Stateful conversation (remembers context during session)
- Portfolio-focused responses
- Proactive project idea discussions

**Knowledge Sources:**
1. Static profile data (skills, experience, bio)
2. GitHub public repos + READMEs (via API)
3. Private repo READMEs (stored locally)
4. Conversation-derived knowledge (gathered near completion)

### 3. Terminal/CRT Aesthetic
**Customizable via Settings Menu:**
- **Color Schemes:**
  - Classic Green Phosphor (default)
  - Amber Monitor
  - Monochrome White
  - Matrix Green
  - Custom RGB
- **Visual Effects:**
  - Scanlines (on/off)
  - CRT Curvature (on/off)
  - Screen Glow (on/off)
  - Chromatic Aberration (on/off)
- **Animations:**
  - Boot-up sequence (on page load)
  - Blinking cursor
  - Text typing effects

**Mobile Responsiveness:**
- Touch-friendly interface
- Reduced effects on mobile (performance)
- Collapsible sections
- Swipe navigation

---

## Project Structure

```
newPortfolio/
├── .env                          # API keys (gitignored)
├── .gitignore
├── package.json
├── next.config.js
├── tsconfig.json
├── Procfile                      # Heroku deployment
├── server.js                     # Custom server (if needed)
│
├── public/
│   ├── fonts/                    # Monospace terminal fonts
│   └── images/                   # Profile photo, project screenshots
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Main portfolio page
│   │   ├── globals.css           # Global styles + CSS variables
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts      # AI chatbot endpoint
│   │       └── github/
│   │           ├── repos/route.ts
│   │           ├── contributions/route.ts
│   │           └── readme/route.ts
│   │
│   ├── components/
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx      # Main terminal container
│   │   │   ├── BootSequence.tsx  # Boot-up animation
│   │   │   ├── Scanlines.tsx     # CRT scanline effect
│   │   │   └── CRTEffect.tsx     # CRT curvature/glow
│   │   │
│   │   ├── StaticPortfolio/
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Contact.tsx
│   │   │
│   │   ├── AIChat/
│   │   │   ├── ChatWindow.tsx    # Chat interface
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputArea.tsx
│   │   │   └── TypingIndicator.tsx
│   │   │
│   │   └── Settings/
│   │       ├── SettingsMenu.tsx  # Theme customization
│   │       ├── ColorPicker.tsx
│   │       └── EffectsToggle.tsx
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── deepseek.ts       # DeepSeek API client
│   │   │   └── systemPrompt.ts   # AI system prompt with knowledge
│   │   │
│   │   ├── github/
│   │   │   ├── client.ts         # Octokit setup
│   │   │   ├── repos.ts          # Fetch repos
│   │   │   ├── contributions.ts  # Contribution graph
│   │   │   └── readme.ts         # Fetch README files
│   │   │
│   │   └── knowledge/
│   │       ├── profile.ts        # Load profile data
│   │       └── combineKnowledge.ts # Merge all data sources
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx      # Theme settings provider
│   │   └── ChatContext.tsx       # Chat history provider
│   │
│   ├── types/
│   │   ├── profile.ts
│   │   ├── github.ts
│   │   └── theme.ts
│   │
│   └── styles/
│       ├── themes/
│       │   ├── green-phosphor.css
│       │   ├── amber.css
│       │   ├── monochrome.css
│       │   └── matrix.css
│       └── effects/
│           ├── scanlines.css
│           ├── crt-curvature.css
│           └── glow.css
│
└── data/
    ├── profile.json              # Your static portfolio data
    ├── private-readmes/          # Private repo READMEs
    │   ├── repo-1.md
    │   └── repo-2.md
    └── knowledge-base.json       # Conversation-derived knowledge (later)
```

---

## Data Flow

### AI Chatbot Flow
```
User Question
    ↓
ChatWindow (client)
    ↓
POST /api/chat
    ↓
Combine Knowledge:
  - profile.json
  - GitHub API (repos, READMEs)
  - private-readmes/
  - knowledge-base.json
    ↓
DeepSeek API (with system prompt + knowledge)
    ↓
Response with portfolio focus
    ↓
ChatWindow (display)
```

### GitHub Integration Flow
```
Page Load / User Request
    ↓
GET /api/github/repos
GET /api/github/contributions
GET /api/github/readme/:repo
    ↓
Octokit → GitHub API
    ↓
Cache response (optional: 1 hour)
    ↓
Return to component
    ↓
Display in ChatWindow or Projects section
```

### Theme System Flow
```
User Changes Setting
    ↓
SettingsMenu (update context)
    ↓
ThemeContext → localStorage
    ↓
CSS Variables Updated (--primary-color, --bg-color, etc.)
    ↓
Re-render with new theme
```

---

## Environment Variables

### Required (.env)
```
# AI Provider
AI_PROVIDER_API_KEY=sk-084c004b45fd4ac085d8f60df02af42d
AI_PROVIDER_BASE_URL=https://api.deepseek.com
AI_PROVIDER_MODEL=deepseek-chat

# GitHub (public API - no token needed, but recommended for rate limits)
GITHUB_USERNAME=0xjaqbek
GITHUB_TOKEN=ghp_xxxxx (optional, for higher rate limits)

# App
NEXT_PUBLIC_APP_URL=https://your-app.herokuapp.com
```

---

## AI System Prompt Structure

```typescript
const systemPrompt = `
You are an AI assistant for [Your Name]'s portfolio website.

ROLE:
- Answer questions about [Name]'s skills, experience, and projects
- Discuss potential projects visitors might want to build
- Stay focused on portfolio and work-related topics
- Redirect off-topic questions politely back to portfolio

KNOWLEDGE BASE:
${JSON.stringify(profileData)}
${JSON.stringify(githubRepos)}
${privateReadmes}
${knowledgeBase}

BEHAVIOR:
- Be professional but friendly
- Use examples from the GitHub projects when relevant
- Suggest project ideas based on skills and past work
- If asked something off-topic, say: "I'm here to discuss [Name]'s work and potential projects. How can I help with that?"

CAPABILITIES:
- Show GitHub contribution graph
- Display project READMEs
- Explain technical skills and experience
- Discuss project feasibility
`;
```

---

## Heroku Deployment

### Procfile
```
web: npm start
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT",
    "lint": "next lint"
  }
}
```

### Deployment Steps
1. Create Heroku app
2. Set environment variables on Heroku
3. Connect GitHub repo (auto-deploy) or manual push
4. Heroku will auto-detect Next.js and build

---

## Mobile Responsiveness Strategy

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Optimizations
- Disable heavy effects (CRT curvature) on mobile
- Reduce scanline density
- Stack layout (portfolio sections → chat)
- Touch-friendly buttons (min 44px tap targets)
- Simplified settings menu (drawer)
- Reduced animations for performance

### Layout Strategy
- **Desktop:** Split view (static portfolio left, chat right)
- **Mobile:** Tab/accordion view or full-screen toggle

---

## Development Phases

### Phase 1: Setup (Current)
- [x] Plan architecture
- [ ] Create .gitignore
- [ ] Initialize Next.js project
- [ ] Install dependencies
- [ ] Create folder structure

### Phase 2: Theme System
- [ ] CSS variables setup
- [ ] Theme context
- [ ] Color schemes
- [ ] CRT effects (scanlines, curvature, glow)
- [ ] Settings menu
- [ ] LocalStorage persistence

### Phase 3: Static Portfolio
- [ ] Create data/profile.json structure
- [ ] Build About component
- [ ] Build Skills component
- [ ] Build Experience component
- [ ] Build Projects component
- [ ] Build Contact component

### Phase 4: GitHub Integration
- [ ] Set up Octokit
- [ ] API route: /api/github/repos
- [ ] API route: /api/github/contributions
- [ ] API route: /api/github/readme/:repo
- [ ] Display in Projects section
- [ ] Add private READMEs to data/

### Phase 5: AI Chatbot
- [ ] Create chat UI components
- [ ] Chat context (history management)
- [ ] API route: /api/chat
- [ ] DeepSeek integration
- [ ] System prompt with knowledge base
- [ ] Test conversation flow
- [ ] Add GitHub data injection

### Phase 6: Knowledge Gathering
- [ ] Interview session (you + AI)
- [ ] Create knowledge-base.json
- [ ] Integrate into system prompt

### Phase 7: Polish & Deploy
- [ ] Mobile responsive testing
- [ ] Performance optimization
- [ ] Heroku setup
- [ ] Environment variables
- [ ] Deploy
- [ ] Test production

---

## Open Questions

1. **TypeScript:** Proceed with TypeScript? (Recommended for maintainability)
2. **GitHub Token:** Do you have a GitHub personal access token for higher API rate limits?
3. **Profile Photo:** Do you have a profile photo for the About section?
4. **Featured Projects:** Should all public repos show, or do you want to curate a specific list?
5. **Contact Methods:** What contact info to include? (Email, LinkedIn, Twitter, etc.)

---

## Next Steps

1. Approve this architecture plan
2. Answer open questions above
3. Create .gitignore
4. Initialize Next.js project
5. Install dependencies
6. Start with theme system (most unique part)

Ready to proceed?
