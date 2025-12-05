# Developer Portfolio with AI Chatbot

A Next.js-based portfolio featuring a terminal/CRT aesthetic and an AI chatbot powered by DeepSeek.

## Features

- **Static Portfolio Sections**: About, Skills, Experience, Projects, Contact
- **AI Chatbot**: Discuss work, skills, and potential projects with an AI that knows your background
- **GitHub Integration**: Display curated projects and contribution data
- **Customizable Terminal Theme**: Multiple color schemes and CRT effects
- **Mobile Responsive**: Works on all devices
- **Faceless Design**: No profile photos required

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **AI**: DeepSeek API
- **GitHub**: Octokit REST API
- **Deployment**: Heroku
- **Styling**: CSS Modules with custom terminal/CRT effects

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Already set in `.env`:
```
AI_PROVIDER_API_KEY=your-key-here
AI_PROVIDER_BASE_URL=https://api.deepseek.com
AI_PROVIDER_MODEL=deepseek-chat
GITHUB_USERNAME=0xjaqbek
GITHUB_TOKEN=optional-token-here
```

### 3. Fill in Your Data

#### Profile Data (`data/profile.json`)
Edit this file with:
- Your name, title, bio
- Contact info (email, Twitter, Telegram)
- Skills and tech stack
- Work experience
- Curated projects list

#### Private Project READMEs (`data/private-readmes/`)
For private repos, add markdown files here with project details.
The AI will read these to answer questions about your private work.

#### Knowledge Base (`data/knowledge-base.json`)
We'll fill this together in a conversation near the end.
This adds personality and context to the AI chatbot.

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (chat, github)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── Terminal/          # CRT/terminal UI components
│   ├── StaticPortfolio/   # Static portfolio sections
│   ├── AIChat/            # Chatbot interface
│   └── Settings/          # Theme settings menu
├── lib/
│   ├── ai/                # DeepSeek integration
│   ├── github/            # GitHub API client
│   └── knowledge/         # Knowledge base loader
├── context/               # React contexts (theme, chat)
├── types/                 # TypeScript definitions
├── styles/                # CSS for themes and effects
└── data/                  # Your portfolio data
    ├── profile.json
    ├── knowledge-base.json
    └── private-readmes/
```

## Customization

### Color Schemes
- Green Phosphor (default)
- Amber Monitor
- Monochrome White
- Matrix Green

### CRT Effects
- Scanlines
- CRT Curvature
- Screen Glow
- Chromatic Aberration
- Boot Sequence
- Blinking Cursor

All customizable via the settings menu in the UI.

## Deployment to Heroku

1. Create Heroku app
2. Set environment variables
3. Push to Heroku
4. Heroku auto-builds Next.js

See `ARCHITECTURE.md` for detailed deployment instructions.

## Next Steps

1. Fill in `data/profile.json` with your information
2. Add private project READMEs to `data/private-readmes/`
3. Test the development server
4. Customize themes and effects
5. Have a conversation to build the knowledge base
6. Deploy to Heroku

## License

MIT
