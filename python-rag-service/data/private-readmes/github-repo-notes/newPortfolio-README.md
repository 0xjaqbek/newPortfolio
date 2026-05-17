# newPortfolio

Portfolio programistyczne 0xjaqbek zbudowane jako aplikacja Next.js. Projekt laczy klasyczna strone portfolio z terminalowym UI, integracja GitHuba, czatem AI oraz osobnym serwisem RAG w Pythonie.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2025-12-04 23:44:07 UTC
- Ostatni push: 2026-05-16 22:46:29 UTC
- Ostatni commit na `main`: 2026-05-16 22:37:56 UTC
- Liczba commitow na `main`: 96

## Co robi aplikacja

- Prezentuje profil, doswiadczenie, projekty i umiejetnosci z danych JSON.
- Renderuje alternatywny, terminalowy interfejs portfolio z animowana sekwencja startowa.
- Pobiera dane o repozytoriach i aktywnosci z GitHuba przez Octokit.
- Udostepnia czat AI oparty o DeepSeek oraz osobna sciezke czatu RAG.
- Przechowuje i serwuje prywatne notatki README dla projektow GitHub.
- Zawiera panel "Guardian" z poziomami dostepu, audytem bezpieczenstwa, blokadami IP i logami.
- Ma osobny mikroserwis `python-rag-service` do indeksowania dokumentow, embeddingow i wyszukiwania semantycznego.

## Tech stack

- Next.js, React, TypeScript
- CSS Modules i globalne style efektow terminalowych/CRT
- Prisma
- Octokit REST API
- DeepSeek API
- Python FastAPI dla RAG
- ChromaDB / warstwa wektorowa w serwisie RAG
- Docker, Docker Compose, Render/Nixpacks dla backendu RAG

## Struktura

- `app/` - App Router, strony i endpointy API.
- `components/` - UI portfolio, terminal, GitHub contribution map, czat AI i ustawienia.
- `lib/` - integracje AI, GitHub, baza danych, wiedza profilowa i bezpieczenstwo.
- `data/` - profil, knowledge base oraz prywatne opisy repozytoriow.
- `python-rag-service/` - backend FastAPI do dokumentow, chatu, wyszukiwania i administracji.
- `prisma/` - schemat bazy.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje standardowo pod `http://localhost:3000`.

## Skrypty

- `npm run dev` - tryb developerski Next.js.
- `npm run build` - build produkcyjny.
- `npm run start` - start zbudowanej aplikacji.
- `npm run lint` - lint projektu.

## Notatki

Projekt jest bardziej niz wizytowka: sluzy jako osobista warstwa prezentacji, katalog wiedzy o repozytoriach i eksperyment AI/RAG. W repo sa tez dokumenty architektoniczne oraz instrukcje konfiguracji systemu Guardian i RAG.
