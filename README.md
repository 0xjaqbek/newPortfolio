# Terminal-Themed Portfolio with AI Chatbot

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Heroku-purple)](https://heroku.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, terminal-inspired portfolio website featuring an AI-powered chatbot, dynamic GitHub integration, and customizable retro CRT themes. Built with Next.js 14, TypeScript, and deployed on Heroku.

**Live Demo:** [https://safe-castle-87400-f5309544f58b.herokuapp.com/](https://safe-castle-87400-f5309544f58b.herokuapp.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎨 Terminal-Inspired UI
- **Retro CRT Terminal Theme** - Multiple vintage terminal color schemes
- **4 Built-in Color Schemes:**
  - Claude Code (Orange/Purple - Default)
  - Amber Monitor (Classic amber CRT)
  - Monochrome (Green/White)
  - Matrix Green (Iconic matrix green)
- **Visual Effects:**
  - Scanlines overlay
  - CRT screen curvature
  - Phosphor glow
  - Chromatic aberration
  - Boot sequence animation
- **Fully Customizable** - Toggle effects and switch themes in real-time

### 🤖 AI-Powered Chatbot
- **Intelligent Assistant** - Powered by DeepSeek AI
- **Contextual Responses** - Trained on your portfolio data
- **Project Knowledge** - Reads both GitHub READMEs and private project documentation
- **Mobile-First Design** - Opens by default on mobile devices
- **Conversation Management** - Clear chat history, loading states
- **Persistent Scroll** - Messages scroll within chat window

### 📊 Dynamic GitHub Integration
- **Live Repository Data** - Fetches repos via GitHub API
- **Public & Private Repos** - Access with GitHub token
- **Topic-Based Filtering** - Displays repos tagged with `portfolio`, `featured`, or `showcase`
- **Contribution Calendar** - GitHub-style contribution heatmap
  - Theme-aware color schemes
  - Horizontal scrolling on mobile
  - Hover tooltips with contribution counts
- **README Viewer** - View full READMEs directly in portfolio
- **Repository Stats** - Stars, forks, last updated, language, topics

### 📄 Private Project Documentation
- **Markdown-Based** - Store project docs in `/data/private-readmes/`
- **Auto-Detection** - Automatically parses and displays markdown files
- **Expandable Content** - Click to view full project documentation
- **Side-by-Side Display** - Private projects + GitHub repos in same view

### 📱 Responsive Design
- **Mobile-Optimized** - Hamburger menu, touch-friendly controls
- **Adaptive Layouts** - Different UX for mobile vs desktop
  - Mobile: Opens chat by default
  - Desktop: Shows "About" by default
- **Single-Section View** - Clean, focused content display
- **Smooth Transitions** - Animated section switching

### 🎯 Complete Portfolio Sections
1. **About** - Bio, location, GitHub contribution calendar
2. **Skills** - Categorized technical skills (Languages, Frameworks, Blockchain, AI/ML, Tools, Databases)
3. **Experience** - Timeline-based professional experience with achievements
4. **Projects** - GitHub repos + private projects with README viewers
5. **Contact** - Email, Twitter, Telegram, GitHub links
6. **CV/Resume** - Comprehensive resume with professional summary, skills, experience, achievements
7. **AI Chat** - Interactive chatbot for visitor engagement

### ⚙️ Settings & Customization
- **Theme Switcher** - Change color schemes on the fly
- **Effect Toggles** - Enable/disable visual effects individually
- **Boot Sequence Control** - Show/hide boot animation on page load
- **Persistent Settings** - Saved to localStorage
- **Real-time Updates** - CSS variables update instantly

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 14.2.33](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 18](https://react.dev/)** - UI component library
- **CSS Modules** - Scoped styling with CSS variables
- **Context API** - Global state management (Theme, Chat)

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **[GitHub GraphQL API](https://docs.github.com/en/graphql)** - Contribution calendar data
- **[GitHub REST API](https://docs.github.com/en/rest)** - Repository data
- **[@octokit/rest](https://www.npmjs.com/package/@octokit/rest)** - GitHub API client
- **DeepSeek AI API** - Chatbot intelligence

### Deployment & Infrastructure
- **[Heroku](https://www.heroku.com/)** - Cloud platform deployment
- **Git** - Version control
- **Environment Variables** - Secure API key management

### Development Tools
- **ESLint** - Code linting
- **npm** - Package management
- **Git** - Version control

---

## 📁 Project Structure

```
newPortfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── chat/                 # AI chatbot endpoint
│   │   ├── github/
│   │   │   ├── contributions/    # GitHub GraphQL API
│   │   │   ├── readme/           # Repository README fetcher
│   │   │   └── repos/            # Repository list endpoint
│   │   └── projects/
│   │       └── private/          # Private project docs API
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main page component
│
├── components/
│   ├── AIChat/                   # Chatbot components
│   │   ├── ChatWindow.tsx        # Main chat interface
│   │   ├── MessageBubble.tsx     # Chat message component
│   │   └── *.module.css          # Component styles
│   ├── GitHub/                   # GitHub integration
│   │   ├── ContributionMap.tsx   # Contribution calendar
│   │   └── *.module.css          # Component styles
│   ├── Settings/                 # Settings menu
│   │   ├── SettingsMenu.tsx      # Theme & effects controls
│   │   └── *.module.css          # Component styles
│   ├── StaticPortfolio/          # Portfolio sections
│   │   ├── About.tsx             # About section
│   │   ├── Skills.tsx            # Skills section
│   │   ├── Experience.tsx        # Experience timeline
│   │   ├── Projects.tsx          # Projects with READMEs
│   │   ├── Contact.tsx           # Contact information
│   │   ├── Resume.tsx            # CV/Resume section
│   │   └── StaticPortfolio.module.css  # Shared styles
│   └── Terminal/                 # Terminal UI components
│       ├── Terminal.tsx          # Terminal container
│       ├── BootSequence.tsx      # Boot animation
│       └── *.module.css          # Component styles
│
├── context/
│   ├── ChatContext.tsx           # Chat state management
│   └── ThemeContext.tsx          # Theme & settings state
│
├── lib/
│   └── github/                   # GitHub API utilities
│       ├── client.ts             # Octokit client setup
│       ├── contributions.ts      # GraphQL contribution fetcher
│       └── repos.ts              # Repository data fetcher
│
├── data/
│   └── private-readmes/          # Private project documentation
│       ├── README.md             # Example: Protokół 999
│       ├── readme2.md            # Example: Web3 Onboarder
│       └── example-project.md    # Template file
│
├── public/
│   └── data/
│       └── profile.json          # Portfolio data (bio, skills, experience)
│
├── types/
│   └── profile.ts                # TypeScript interfaces
│
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── Procfile                      # Heroku deployment config
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Git**
- **GitHub Account** (for API integration)
- **AI API Key** (DeepSeek or OpenAI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/0xjaqbek/newPortfolio.git
   cd newPortfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your environment variables:**
   ```env
   # AI Provider
   AI_PROVIDER_API_KEY=your_deepseek_or_openai_api_key

   # GitHub Integration
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## ⚙️ Configuration

### Portfolio Data

Edit `public/data/profile.json` to customize your portfolio:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "bio": "Your professional summary...",
  "location": "Your Location",
  "contact": {
    "email": "your@email.com",
    "twitter": "@yourhandle",
    "telegram": "@yourhandle"
  },
  "skills": {
    "languages": ["JavaScript", "TypeScript", ...],
    "frameworks": ["Next.js", "React", ...],
    "blockchain": ["Solidity", "Web3.js", ...],
    "ai-ml": ["OpenAI API", "LangChain", ...],
    "tools": ["Git", "Docker", ...],
    "databases": ["MongoDB", "PostgreSQL", ...],
    "other": ["REST APIs", "GraphQL", ...]
  },
  "experience": [
    {
      "id": "exp-1",
      "title": "Your Job Title",
      "company": "Company Name",
      "location": "Location",
      "period": {
        "start": "2023-01",
        "end": "Present"
      },
      "description": "Job description...",
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ],
      "technologies": ["Tech1", "Tech2"]
    }
  ]
}
```

### Private Projects

Add markdown files to `data/private-readmes/`:

```markdown
# Project Name

> Brief description

## Overview
Project details...

## Technologies
- Technology 1
- Technology 2

## Key Features
- Feature 1
- Feature 2
```

### GitHub Repositories

Tag your GitHub repos with topics to display them:
- `portfolio` - Portfolio projects
- `featured` - Featured work
- `showcase` - Showcase projects

### Theme Customization

Modify color schemes in `context/ThemeContext.tsx`:

```typescript
const colorSchemes = {
  'your-theme': {
    primary: '#yourcolor',
    secondary: '#yourcolor',
    background: '#yourcolor',
    text: '#yourcolor',
    glow: 'rgba(r, g, b, a)',
  },
};
```

---

## 🔌 API Endpoints

### Chat API
```
POST /api/chat
Body: { messages: ChatMessage[] }
Response: { message: string }
```

### GitHub Contributions
```
GET /api/github/contributions
Response: { totalContributions, weeks: Week[] }
```

### GitHub Repositories
```
GET /api/github/repos
Response: { repos: GitHubRepo[] }
```

### GitHub README
```
GET /api/github/readme?owner=username&repo=reponame
Response: { readme: string }
```

### Private Projects
```
GET /api/projects/private
Response: { projects: PrivateProject[] }
```

---

## 🎨 Customization

### Adding a New Color Scheme

1. **Update `ThemeContext.tsx`:**
   ```typescript
   const colorSchemes = {
     // ... existing schemes
     'your-scheme': {
       primary: '#color',
       secondary: '#color',
       background: '#color',
       text: '#color',
       glow: 'rgba(r,g,b,a)',
     }
   };
   ```

2. **Update `SettingsMenu.tsx`:**
   ```typescript
   const colorSchemes = [
     // ... existing schemes
     { value: 'your-scheme', label: 'Your Scheme Name' },
   ];
   ```

### Adding a New Section

1. **Create component:**
   ```typescript
   // components/StaticPortfolio/YourSection.tsx
   export default function YourSection() {
     return <div>Your content</div>;
   }
   ```

2. **Add to `page.tsx`:**
   ```typescript
   type Section = 'about' | ... | 'your-section';

   const renderContent = () => {
     switch (activeSection) {
       // ... existing cases
       case 'your-section':
         return <YourSection />;
     }
   };
   ```

3. **Add navigation:**
   - Update desktop sidebar
   - Update mobile menu

---

## 🌐 Deployment

### Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set AI_PROVIDER_API_KEY=your_key
   heroku config:set GITHUB_TOKEN=your_token
   heroku config:set GITHUB_USERNAME=your_username
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **View logs:**
   ```bash
   heroku logs --tail
   ```

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel Dashboard**

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_PROVIDER_API_KEY` | Yes | DeepSeek or OpenAI API key for chatbot |
| `GITHUB_TOKEN` | Optional | GitHub personal access token (enables private repos & contributions) |
| `GITHUB_USERNAME` | Yes | Your GitHub username for fetching repos |

### Generating GitHub Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes:
   - `repo` (for private repos)
   - `read:user` (for contributions)
4. Copy token and add to environment variables

---

## 📊 Performance

- **First Load JS:** ~95 kB (gzipped)
- **API Revalidation:** 1 hour cache
- **Static Generation:** Pre-rendered routes
- **Serverless Functions:** API routes
- **README Caching:** Client-side memo

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment
- **GitHub** - API and code hosting
- **DeepSeek AI** - Chatbot intelligence
- **Claude Code** - Development assistance

---

## 📧 Contact

**Jakub Skwierawski**
- Email: jaqbek.eth@gmail.com
- GitHub: [@0xjaqbek](https://github.com/0xjaqbek)
- Twitter: [@jaqbek_eth](https://twitter.com/jaqbek_eth)
- Telegram: [@jaqbek](https://t.me/jaqbek)

---

## 🎯 Future Enhancements

- [ ] Blog section with markdown support
- [ ] Dark/Light mode toggle
- [ ] Analytics integration
- [ ] RSS feed
- [ ] Downloadable PDF resume
- [ ] Project search and filtering
- [ ] Multi-language support
- [ ] WebSocket chat for real-time AI responses
- [ ] Voice input for chatbot
- [ ] Code syntax highlighting in READMEs

---

**Built with 🤖 by Jakub Skwierawski using Claude Code**
