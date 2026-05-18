# Plonbli

> Farmer-consumer marketplace and social platform connecting local producers directly with consumers based on geolocation.

## About

Full-stack marketplace eliminating supply chain middlemen. Combines e-commerce (listings, cart, checkout, delivery coordination) with social features (feed, groups, events, messaging). Built as a PWA with a blockchain-ready data layer for farming documentation and reputation. 327+ commits.

## Key Features

- PostGIS geolocation-based farmer and product discovery
- Marketplace with listings, cart, checkout, delivery/pickup coordination
- Buying groups and community self-organization
- Crop documentation with blockchain-ready repository pattern
- Real-time 1:1 and group messaging via WebSockets
- Live social feed via SSE
- Farmer reputation and review system
- Multi-provider auth: email, Google, Facebook via NextAuth.js v5
- Polish full-text search with PostgreSQL tsvector/tsquery
- Image storage on Cloudflare R2
- PWA with offline support

## Tech Stack

Next.js 15 · TypeScript · PostgreSQL · PostGIS · Drizzle ORM · Neon · NextAuth.js v5 · WebSockets · SSE · Cloudflare R2 · Tailwind CSS · shadcn/ui · Zod · next-pwa · next-intl
