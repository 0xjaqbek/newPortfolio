# plonbli

Plonbli to aplikacja marketplace i spolecznosc dla lokalnej zywnosci. Laczy profile rolnikow, oferty produktow, koszyk i zamowienia z komunikacja, wydarzeniami, logistyka odbiorow, reputacja oraz funkcjami PWA.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: prywatne
- Utworzone: 2026-03-27 11:47:07 UTC
- Ostatni push: 2026-05-13 11:16:24 UTC
- Ostatni commit na `main`: 2026-05-13 07:10:26 UTC
- Liczba commitow na `main`: 327

## Funkcje

- Rejestracja, logowanie, profile i ustawienia konta.
- Marketplace produktow z kategoriami, listingami, dostepnoscia i edycja ofert.
- Koszyk, checkout, zamowienia klienta i panel zamowien rolnika.
- Profile rolnikow, mapa rolnikow i proxy farmer profiles.
- Wiadomosci prywatne, konwersacje i oznaczanie jako przeczytane.
- Spolecznosc: posty, komentarze, reakcje, grupy, wydarzenia i RSVP.
- Logistyka: punkty odbioru, kolekcje, statusy i wspolne odbiory.
- Reputacja: opinie i odznaki.
- Farming: crop logs i dzienniki upraw.
- Push notifications przez Firebase.
- Zaproszenia z kodami i generowanie posterow QR/PDF.
- Wielojezycznosc przez `next-intl`.
- Legal pages, consent flow, eksport danych uzytkownika i usuwanie konta.
- Analityka Umami oraz dokumentacja wdrozenia.

## Tech stack

- Next.js 16, React 19, TypeScript
- App Router, Server Actions
- Tailwind CSS 4
- Drizzle ORM i Neon Serverless Postgres
- NextAuth 5 beta
- Supabase client/storage helpers
- Firebase i Firebase Admin dla push notifications
- next-intl
- next-pwa
- React Leaflet / Leaflet
- Radix UI, Base UI, shadcn-style components, Lucide
- Vitest, Testing Library, jsdom

## Struktura

- `src/app/` - trasy Next.js z grupami auth/main/legal/public.
- `src/domains/` - domeny aplikacji: auth, marketplace, orders, messaging, social, logistics, notifications, farming, reputation, geo i marketing.
- `src/shared/` - DB schema, UI, akcje i wspolne biblioteki.
- `drizzle/` - migracje bazy.
- `tests/` - testy domen, akcji, query i komponentow.
- `messages/` - tlumaczenia.
- `docs/` - plany, specyfikacje i instrukcje deploymentu.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny Next.js.
- `npm run build` - build produkcyjny.
- `npm run start` - start buildu.
- `npm run test` - testy Vitest.
- `npm run lint` - lint.
- `npm run db:generate` - generowanie migracji Drizzle.
- `npm run db:migrate` - migracje bazy.
- `npm run db:studio` - Drizzle Studio.

## Notatki

Repo jest juz duze i domenowo rozdzielone. Najwazniejszy model mentalny: Plonbli to nie tylko sklep, ale platforma lokalnych relacji miedzy klientami, rolnikami i grupami odbioru.
