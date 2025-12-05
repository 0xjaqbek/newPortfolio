# Web3 Onboarder - AI-Powered Crypto Mentorship Platform

[![ETH Warsaw 2025](https://img.shields.io/badge/ETH%20Warsaw-2025-blue)](https://ethwarsaw.com/)
[![3rd Place](https://img.shields.io/badge/Award-3rd%20Place-orange)](https://ethwarsaw.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![Base](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org/)
[![OnchainKit](https://img.shields.io/badge/OnchainKit-Latest-brightgreen)](https://docs.base.org/builderkits/onchainkit/)

> An intelligent Web3 onboarding platform that connects crypto newcomers with experienced mentors through AI-powered matching, video calls, and blockchain-secured payments.

**Built at ETH Warsaw Hackathon 2025 - 3rd Place Winner**

**Payout Address:** `0xE6A4Aad8dFd673c66CB1a9DfdEF9867B5F9bC069`

## Demo Video

Watch our demo: https://youtube.com/shorts/sgtYLtvcXGQ?feature=share

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Team](#team)
- [License](#license)

## Overview

**34us** is a Web3-native mentorship and matchmaking hub designed to connect people based on shared goals and backgrounds to share knowledge with each other - "You call and you are smarter".

Built as a mini app on Base, the platform connects users with mentors or peers through an AI matchmaker that analyzes the user's needs, learning requirements, and experience level to make the best match.

Users can then connect directly in the mini app to start a call with the mentor of their choice. Sessions can be tip-based or paid depending on the mentor. We use **RedStone price feeds** to translate pricing to beginners in both USDC, ETH, and how many average-priced coffees the meeting will cost.

To ensure that users are satisfied and this is a sustainable business, we lock the funds in an escrow smart contract deployed on Base that locks the funds until both the mentor and mentee have given a thumbs up review.

We know that they will not always agree, so we also take a transcript of the call and allow AI to analyze and rate if the mentor is helpful. This data is also being stored in **Golem DB** and we plan to build this integration further.

Beyond one-to-one connections, 34us positions itself as an onboarding layer into the broader Base ecosystem by offering recommendations to other decentralized apps and solutions within the platform. This creates a dual value: users gain personal growth and trusted relationships, while Base and its ecosystem partners benefit from increased visibility and adoption.

### The Problem

- Crypto adoption is hindered by complexity and lack of personalized guidance
- Traditional mentorship platforms lack trust mechanisms
- Payment disputes between mentors and mentees are common
- No objective way to measure mentorship session quality
- New users struggle to find appropriate entry points into Web3

### Our Solution

A decentralized mentorship platform that:
- Uses AI to intelligently match users with compatible mentors
- Enables secure video calls with real-time transcription
- Implements blockchain-based escrow for trustless payments
- Features AI-powered session analysis and quality verification
- Provides transparent pricing with RedStone oracle integration
- Serves as an onboarding gateway to the broader Base ecosystem

### Business Model

The business model of 34us is designed for sustainability and growth:

**Revenue Streams:**
- Commissions on paid mentor calls
- Sponsored placements for mentors and Base ecosystem apps
- Affiliate/referral fees from integrated dApps
- Ecosystem partnerships

**Key Costs:**
- Smart contract development
- AI integration
- Frontend/backend engineering
- Decentralized storage (GolemDB)
- Base RPC/indexing
- Real-time call infrastructure
- Community incentives

## Key Features

### 1. AI-Powered Mentor Matching

- **Intelligent Interview Bot**: Conducts a conversational 5-question interview to understand user goals, experience level, and learning preferences
- **Vector-Based Matching**: Uses Pinecone vector embeddings to semantically match user profiles with mentor expertise
- **OpenRouter Integration**: Leverages advanced LLMs for natural conversation and profile generation
- **Real-time Profile Generation**: Creates comprehensive user profiles from interview responses

### 2. Secure Video Mentorship

- **Stream.io Integration**: High-quality video calling infrastructure
- **Live Transcription**: Automatic call recording and transcription
- **Call Analytics**: Post-session analysis of conversation quality and topics covered
- **Session Recording**: Persistent storage of sessions for review

### 3. Blockchain Escrow & Reviews

- **Smart Contract Escrow**: Payments held securely until session completion
- **3-Party Review System**:
  - User Review: Mentee submits their feedback
  - Mentor Review: Mentor confirms session completion
  - AI Review: Automated analysis of transcription quality
- **Conditional Payment Release**: Funds released to mentor when 2/3 reviews are positive
- **Refund Protection**: Automatic refund if quality standards aren't met
- **On-chain Transparency**: All reviews permanently recorded on Base blockchain

### 4. RedStone Price Feeds Integration

- **Multi-Currency Display**: Show prices in ETH, USDC, and even "coffee equivalents"
- **Real-time Oracle Data**: Live pricing from RedStone decentralized oracles
- **Beginner-Friendly**: Make crypto pricing accessible to newcomers
- **Transparent Conversion**: Clear exchange rates for all transactions

### 5. Farcaster MiniKit Integration

- **Frame-Based UI**: Seamless integration with Farcaster ecosystem
- **Social Onboarding**: Connect directly through Farcaster identity
- **In-App Experience**: No need to leave Farcaster client
- **Account Association**: Enable notifications and account linking

### 6. Ecosystem Gateway

- **dApp Recommendations**: Curated suggestions for Base ecosystem apps
- **Progressive Onboarding**: Guide users through Web3 step-by-step
- **Integrated Discovery**: Learn about new protocols during mentorship
- **Partner Network**: Connect with verified Base ecosystem projects

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                    │
│  (Next.js 15 + OnchainKit + Farcaster MiniKit)             │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                  Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  • AI Interview Bot (OpenRouter + GPT-4)                   │
│  • Vector Matching Engine (Pinecone)                        │
│  • Video Call Manager (Stream.io SDK)                       │
│  • Transcription Processor                                  │
│  • Payment Orchestration                                     │
│  • Price Oracle Integration (RedStone)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                  Integration Layer                          │
├─────────────────────────────────────────────────────────────┤
│  • Blockchain (Base Sepolia)                                │
│  • Stream.io API (Video + Transcription)                    │
│  • Pinecone Vector Database                                 │
│  • OpenRouter/OpenAI API                                    │
│  • Redis (Upstash - State Management)                       │
│  • RedStone Oracles (Price Feeds)                           │
│  • GolemDB (Decentralized Storage)                          │
└─────────────────────────────────────────────────────────────┘
```

## Technologies Used

### Frontend & Framework
- **Next.js 15.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Web3 Stack
- **OnchainKit** - Coinbase's toolkit for onchain apps
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **Base Sepolia** - L2 blockchain network
- **RedStone Oracles** - Decentralized price feeds

### AI & Matching
- **OpenAI SDK** - GPT-4 powered conversations
- **OpenRouter** - Multi-model AI provider
- **Pinecone** - Vector database for semantic search
- **AI SDK (Vercel)** - Unified AI interface

### Video & Communications
- **Stream.io Video SDK** - Video calling infrastructure
- **Stream.io Transcription** - Real-time call transcription
- **GetStream Node SDK** - Backend API integration

### Data & Storage
- **Upstash Redis** - Serverless Redis for caching
- **Tanstack Query** - Data fetching and caching
- **GolemDB** - Decentralized database for transcripts

### Authentication & Social
- **Civic Auth** - Web3 authentication
- **Farcaster MiniKit** - Social integration

## Smart Contracts

### MentorPaymentEscrow Contract

Deployed on Base Sepolia: `0x6b3398c941887a28c994802f6b22a84cc0a9322b`

#### Core Functions

```solidity
// Create a new mentorship session with escrow
function createMeeting(address payable _receiver) external payable

// Submit review (user, mentor, or AI can call this)
function submitReview(uint256 _meetId, bool _positive) external

// Automatic payment release when 2/3 reviews are positive
```

#### Key Features

- **Escrow Mechanism**: Holds funds until session completion
- **Triple Review System**: User, Mentor, and AI reviews
- **Automatic Release**: Smart contract releases payment when threshold met
- **Event Logging**: All actions emit events for transparency
- **Ownable Pattern**: Secure administrative functions

#### Events

```solidity
event MeetingCreated(uint256 indexed meetId, address indexed sender, address indexed receiver, uint256 amount)
event ReviewSubmitted(uint256 indexed meetId, address indexed reviewer, bool positive)
event PaymentReleased(uint256 indexed meetId, address indexed receiver, uint256 amount)
event PaymentRefunded(uint256 indexed meetId, address indexed sender, uint256 amount)
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MevWebDev/web3-onboarder-demo.git
cd web3-onboarder-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables))

4. Initialize mentor data (optional):
```bash
npm run init-mentors
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### For Mentees (Users)

1. **Connect Wallet**: Connect your Web3 wallet through the app
2. **AI Interview**: Answer 5 questions about your crypto goals and experience
3. **View Matches**: See top mentor matches based on AI analysis
4. **Schedule Session**: Choose a mentor and set meeting fee (held in escrow)
5. **Video Call**: Join video call with your mentor
6. **Submit Review**: After the call, submit your review on-chain
7. **Automated Resolution**: Payment released or refunded based on reviews

### For Mentors

1. **Connect Wallet**: Access mentor dashboard
2. **Profile Setup**: Configure expertise areas and availability
3. **Receive Requests**: Get matched with compatible mentees
4. **Conduct Session**: Hold video mentorship call
5. **Submit Review**: Confirm session completion
6. **Receive Payment**: Automatic payment release to your wallet

### AI Review Process

1. Call transcription captured via Stream.io
2. Transcript analyzed by AI for:
   - Topic relevance
   - Educational value
   - Conversation quality
   - Time spent on crypto topics
3. AI submits on-chain review automatically
4. Combined with human reviews for payment decision

## API Routes

### Core APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/interview` | POST | AI interview conversation endpoint |
| `/api/matches` | POST | Generate mentor matches from profile |
| `/api/profile/generate` | POST | Create user profile from interview |
| `/api/stream/configure-call-type` | POST | Configure Stream.io call settings |
| `/api/transcription` | POST | Create transcription job |
| `/api/transcription/[meetId]` | GET | Fetch transcription by meeting ID |
| `/api/transcription-result/[callId]` | GET | Get transcription analysis result |
| `/api/auth/stream-token` | POST | Generate Stream.io authentication token |
| `/api/prices` | GET | Get current crypto prices from RedStone |
| `/api/call/quote` | POST | Get payment quote for mentor call |
| `/api/call/settle` | POST | Settle payment after call completion |

### Webhooks

| Endpoint | Description |
|----------|-------------|
| `/api/webhooks/stream-transcription` | Stream.io transcription webhook |
| `/api/webhooks/smart-contract` | Blockchain event webhook |
| `/api/webhook` | Generic notification webhook |

## Environment Variables

Create a `.env` file in the root directory:

```bash
# OnchainKit & Project Config
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Web3 Onboarder
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key

# OpenAI API
OPENAI_API_KEY=your_openai_key

# OpenRouter API (Alternative AI provider)
OPENROUTER_API_KEY=your_openrouter_key

# Pinecone Vector Database
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=mentors

# Stream.io Video
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_secret

# Redis (Upstash)
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_token

# Farcaster Frame Config (Optional)
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=
NEXT_PUBLIC_APP_SUBTITLE=AI-Powered Crypto Mentorship
NEXT_PUBLIC_APP_DESCRIPTION=Connect with crypto mentors through AI matching
```

### Getting API Keys

- **OnchainKit**: [OnchainKit Dashboard](https://portal.cdp.coinbase.com/)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/)
- **OpenRouter**: [OpenRouter](https://openrouter.ai/)
- **Pinecone**: [Pinecone Console](https://app.pinecone.io/)
- **Stream.io**: [Stream Dashboard](https://dashboard.getstream.io/)
- **Upstash Redis**: [Upstash Console](https://console.upstash.com/)

## Project Structure

```
web3-onboarder-demo/
├── app/
│   ├── api/                      # Next.js API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── call/                # Payment quote/settlement
│   │   ├── interview/           # AI interview logic
│   │   ├── matches/             # Mentor matching
│   │   ├── prices/              # RedStone price feeds
│   │   ├── profile/             # Profile generation
│   │   ├── stream/              # Stream.io integration
│   │   ├── transcription/       # Transcription processing
│   │   └── webhooks/            # External service webhooks
│   ├── components/              # React components
│   │   ├── BlockchainCallReview.tsx  # On-chain review UI
│   │   ├── Call.tsx             # Video call component
│   │   ├── CallReview.tsx       # Review submission
│   │   ├── CryptoOnboardingFlow.tsx  # Main flow
│   │   ├── InterviewChat.tsx    # AI interview UI
│   │   ├── MeetingCreator.tsx   # Escrow transaction UI
│   │   ├── MentorMatches.tsx    # Match display
│   │   └── ReviewSubmitter.tsx  # Review handler
│   ├── hooks/                   # Custom React hooks
│   └── page.tsx                 # Main app entry
├── lib/
│   ├── contracts/               # Smart contract ABIs
│   │   └── MentorPaymentEscrowABI.ts
│   ├── data/                    # Static data (mentors, etc.)
│   ├── logger/                  # Logging utilities
│   ├── redstone.ts              # RedStone oracle integration
│   └── notification-client.ts   # Push notifications
├── scripts/
│   └── init-mentor-data.ts      # Initialize mentor database
└── public/                      # Static assets
```

## Key Components Explained

### CryptoOnboardingFlow
Main orchestrator component managing the user journey from interview to mentor matching.

### InterviewChat
AI-powered interview chatbot that asks contextual questions and generates user profiles.

### MentorMatches
Displays matched mentors using vector similarity scores from Pinecone. Includes RedStone pricing integration.

### MeetingCreator
Handles blockchain transaction for creating escrow and initiating video call with RedStone price quotes.

### Call Component
Manages Stream.io video call lifecycle, transcription, and real-time controls.

### BlockchainCallReview
On-chain review submission interface with wallet integration.

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Initialize mentor database
npm run init-mentors
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Railway
- Render
- AWS Amplify
- Netlify

## Future Enhancements

- [ ] Multi-chain support (Ethereum, Polygon, Arbitrum)
- [ ] NFT credentials for completed mentorship tracks
- [ ] Group mentorship sessions
- [ ] Reputation system with on-chain badges
- [ ] DAO governance for platform decisions
- [ ] Mentor staking mechanisms
- [ ] Advanced analytics dashboard
- [ ] Mobile app with React Native
- [ ] Integration with more social platforms (Lens, Farcaster channels)
- [ ] Expanded GolemDB integration for knowledge graph
- [ ] AI-powered learning path recommendations
- [ ] Mentor certification program

## Team

Built with passion by our team at ETH Warsaw 2025:

- **Shai** - Team Lead
- **DappaDan** - Smart Contract Development
- **jaqbek** - Full Stack Development
- **janvsz** - Frontend & UX
- **wiki** - Backend & AI Integration

## Unique Value Proposition

The project addresses a clear gap in the Web3 space: while there are social protocols, learning platforms, and task-based onboarding apps, there is **no hub that combines mentorship, instant crypto payments, AI-enhanced knowledge capture, and ecosystem discovery** in a single mini app.

With 34us, we aim to become the **go-to gateway** for people entering or expanding their journey in Web3, supported by trusted mentors, transparent crypto incentives, and the power of the Base ecosystem.

## Acknowledgments

- **ETH Warsaw** - For hosting an amazing hackathon
- **Base** - For L2 infrastructure and OnchainKit
- **Coinbase** - For OnchainKit and developer tools
- **Stream.io** - For excellent video infrastructure
- **Pinecone** - For vector database technology
- **OpenAI** - For AI capabilities
- **RedStone** - For decentralized oracle infrastructure
- **GolemDB** - For decentralized storage solutions

## Resources & Links

- [Demo Video](https://youtube.com/shorts/sgtYLtvcXGQ?feature=share)
- [Smart Contract on BaseScan](https://sepolia.basescan.org/address/0x6b3398c941887a28c994802f6b22a84cc0a9322b)
- [GitHub Repository](https://github.com/MevWebDev/web3-onboarder-demo)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

### GPL v3.0 License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

---

**Built at ETH Warsaw 2025 | Made with ❤️ by the 34us Team**

**Payout Address:** `0xE6A4Aad8dFd673c66CB1a9DfdEF9867B5F9bC069`

For questions or support, please open an issue or reach out to the team.
