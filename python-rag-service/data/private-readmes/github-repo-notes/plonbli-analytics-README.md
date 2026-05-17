# plonbli-analytics

Fork/adaptacja Umami, czyli prywatnosciowej alternatywy dla Google Analytics. Repo jest rozbudowana aplikacja analityczna z panelem Next.js, trackerem, API, baza Prisma oraz obsluga PostgreSQL/ClickHouse.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-27 16:38:50 UTC
- Ostatni push: 2026-04-26 23:03:18 UTC
- Domyslna galaz: `master`
- Ostatni commit na `master`: 2026-04-16 22:57:37 UTC
- Liczba commitow na `master`: 6127

## Funkcje

- Panel analityczny dla stron i aplikacji.
- Tracking zdarzen, wizyt, referrerow, urzadzen, krajow i przegladarek.
- Tracker i recorder budowane jako osobne paczki.
- API serwerowe do zbierania i odczytu danych.
- Modele bazy Prisma i migracje.
- Obsluga PostgreSQL oraz ClickHouse.
- Zarzadzanie uzytkownikami i haslami.
- Eksporty, raporty, wykresy i dashboardy.
- Lokalizacje i budowanie plikow jezykowych.
- Docker, Docker Compose, Cypress i testy.

## Tech stack

- Next.js, React, TypeScript
- Prisma
- PostgreSQL i ClickHouse
- TanStack React Query
- Chart.js
- bcryptjs, jsonwebtoken
- KafkaJS
- MaxMind geo data
- Docker
- Jest, Cypress, Biome

## Struktura

- `src/` - aplikacja, API, komponenty, modele i logika analityczna.
- `prisma/` - schemat i klient bazy.
- `public/` - assety statyczne.
- `cypress/` - testy end-to-end i konfiguracja.
- `docker-compose.yml`, `Dockerfile` - deployment kontenerowy.
- `podman/` - dokumentacja uruchomienia przez Podman.

## Uruchomienie

```bash
npm install
npm run dev
```

Dla wariantu kontenerowego:

```bash
npm run build-docker
npm run start-docker
```

## Skrypty

- `npm run dev` - lokalny tryb developerski.
- `npm run build` - pelny build.
- `npm run start` - start aplikacji.
- `npm run build-db` - budowanie warstwy bazy.
- `npm run update-db` - aktualizacja bazy.
- `npm run test` - testy.
- `npm run cypress-run` - testy E2E.
- `npm run lint` / `npm run format` - jakosc kodu.

## Notatki

Historia commitow pochodzi z duzego projektu upstream Umami, dlatego liczba commitow jest znacznie wieksza niz w pozostalych repo. Nazwa `plonbli-analytics` sugeruje uzycie tej instancji jako analityki dla ekosystemu Plonbli.
