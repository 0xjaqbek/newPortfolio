# web3-onboarder-demo

Web3 Onboarder Demo to hackathonowy projekt 34us: Web3-native mentorship i matchmaking hub dla osob wchodzacych w ekosystem Base/Web3. Aplikacja laczy AI interview, dopasowanie mentorow, rozmowy wideo, transkrypcje, GolemDB, Pinecone, RedStone price feeds i logike platnych albo darmowych mentoring calls.

## Hackathon

- Projekt powstal podczas ETHWarsaw 2025.
- Wynik: 3. miejsce na hackathonie.
- Zespol: Shai, DappaDan, jaqbek, janvsz, wiki.
- Demo video: https://youtube.com/shorts/sgtYLtvcXGQ?feature=share

## Status repozytorium

- Wlasciciel: `MevWebDev`
- Repozytorium: `MevWebDev/web3-onboarder-demo`
- Widocznosc: publiczne
- Utworzone: 2025-09-05 19:04:16 UTC
- Ostatni push: 2025-12-11 21:44:34 UTC
- Ostatni commit na `main`: 2025-12-11 21:44:33 UTC
- Liczba commitow na `main`: 66

## Funkcje

- Mini app / onboarding flow dla Base z wykorzystaniem Coinbase OnchainKit MiniKit.
- Flow ekranow: welcome, connect wallet, onboarding, home.
- AI interview z 5 pytaniami, ktore klasyfikuja uzytkownika jako investor, developer albo social user.
- Generowanie profilu uzytkownika po rozmowie onboardingowej.
- Dopasowywanie mentorow do profilu uzytkownika.
- Fallback matching na danych lokalnych oraz docelowo hybrid search w Pinecone.
- Mentor cards z match score, opisem dopasowania i sugerowana sciezka nauki.
- Cennik mentorow: darmowe albo platne rozmowy.
- RedStone price feeds do przeliczenia stawek na ETH/USDC i przystepne porownania kosztu.
- Rozmowy wideo przez Stream.
- Stream transcription webhook i endpointy pobierania transkrypcji.
- Zapisywanie transkrypcji rozmow w GolemDB.
- Review flow po rozmowie i analiza jakosci mentoringu.
- Endpointy quote/settle dla call payments.
- Webhooki smart contract / Vercel / Stream.
- Testowe endpointy dla Pinecone, OpenRouter, embeddings i GolemDB.
- Skrypt inicjalizacji mentor data.

## Tech stack

- Next.js 15, React 18, TypeScript
- Tailwind CSS
- Coinbase OnchainKit / MiniKit
- Civic Auth i Civic Auth Web3
- wagmi, viem
- AI SDK, OpenAI, OpenRouter provider
- Pinecone
- Golem Base SDK / GolemDB
- Stream Video React SDK i Stream Node SDK
- Upstash Redis
- RedStone price API
- TanStack React Query
- Zod
- UUID

## Struktura

- `app/page.tsx` - glowny MiniKit flow.
- `app/components/CryptoOnboardingFlow.tsx` - onboarding: interview, matches i call mode.
- `app/components/InterviewChat.tsx` - chat onboardingowy z AI.
- `app/components/MentorMatches*.tsx` - lista mentorow i booking rozmowy.
- `app/components/Call.tsx` - integracja rozmowy wideo.
- `app/api/interview/route.ts` - sesje interview i klasyfikacja archetypu.
- `app/api/profile/generate/route.ts` - generowanie profilu po interview.
- `app/api/matches/route.ts` - dopasowanie mentorow z Pinecone/fallback.
- `app/api/auth/stream-token/route.ts` - tokeny Stream.
- `app/api/transcription*/` i `app/api/stream/*` - transkrypcje rozmow.
- `app/api/call/quote` i `app/api/call/settle` - wycena i finalizacja call flow.
- `lib/golemdb.ts` - zapis i odczyt transkrypcji z GolemDB.
- `lib/pinecone/` - klient, hybrid search, scoring i RAG dla crypto mentorow.
- `lib/redstone.ts` - pobieranie cen RedStone.
- `lib/interview/questions.ts` - pytania i sygnaly archetypow.
- `scripts/init-mentor-data.ts` - inicjalizacja danych mentorow.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje jako Next.js pod standardowym adresem lokalnym, zwykle `http://localhost:3000`.

## Skrypty

- `npm run dev` - lokalny Next.js.
- `npm run build` - build produkcyjny.
- `npm run start` - start buildu.
- `npm run lint` - lint.
- `npm run init-mentors` - inicjalizacja danych mentorow.

## Zmienne srodowiskowe

Projekt korzysta z integracji wymagajacych kluczy i konfiguracji, m.in. OpenRouter/OpenAI, Pinecone, Stream, GolemDB, Upstash Redis, Civic/OnchainKit oraz konfiguracji webhooks. Szczegoly sa rozpisane w plikach:

- `env.config.txt`
- `STREAM_WEBHOOK_SETUP.md`
- `VERCEL_WEBHOOK_SETUP.md`
- `TRANSCRIPTION_TESTING.md`
- `DEBUGGING_TRANSCRIPTION.md`

## Notatki

Najwazniejsza idea projektu: 34us ma byc onboarding layer dla Web3, gdzie osoba poczatkujaca nie dostaje tylko dokumentacji albo zadania, ale realnego mentora dobranego przez AI. Projekt laczy relacje miedzyludzkie, crypto payments, price transparency, call infrastructure i zdecentralizowane przechowywanie transkrypcji.
