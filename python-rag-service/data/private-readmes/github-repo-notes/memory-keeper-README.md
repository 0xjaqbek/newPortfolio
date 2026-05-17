# memory-keeper

Prywatne rodzinne archiwum wspomnien. Aplikacja pozwala logowac sie rodzinie, dodawac wpisy tekstowe, zdjecia, wideo i nagrania glosowe oraz udostepniac dostep czlonkom rodziny w kilku jezykach.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: prywatne
- Utworzone: 2026-05-10 18:59:33 UTC
- Ostatni push: 2026-05-13 11:43:47 UTC
- Ostatni commit na `main`: 2026-05-13 11:42:41 UTC
- Liczba commitow na `main`: 22

## Funkcje

- Landing page dla prywatnego archiwum rodzinnego.
- Logowanie i kontekst autoryzacji uzytkownika.
- Role rodzinne: rodzic/writer moze dodawac wpisy, viewer tylko przegladac.
- Lista wspomnien z autorami, data, tekstem i mediami.
- Dodawanie wpisow typu tekst, zdjecie, wideo i glos.
- Upload plikow do Supabase Storage.
- Nagrywanie notatek glosowych w przegladarce.
- Udostepnianie rodziny przez komponent `ShareFamily`.
- Trasy: `/`, `/auth`, `/home`, `/new`, `/album`, `/prompts`, `/join`.
- Lokalizacje: angielski, polski, czeski, francuski, niemiecki, hiszpanski i hiszpanski argentynski.

## Tech stack

- TanStack Start / TanStack Router
- React, TypeScript, Vite
- Supabase Auth, Database i Storage
- i18next / react-i18next
- Tailwind CSS
- Radix UI / shadcn-style components
- Lucide React
- Sonner
- Cloudflare Vite plugin

## Struktura

- `src/routes/` - file-based routing TanStack.
- `src/components/` - layout aplikacji, jezyki, udostepnianie i UI.
- `src/lib/` - auth context, upload, voice recorder i obsluga bledow.
- `src/integrations/supabase/` - klienci Supabase po stronie klienta i serwera.
- `src/locales/` - tlumaczenia.
- `supabase/migrations/` - model rodzin, wpisow, mediow i rol.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - tryb developerski.
- `npm run build` - build.
- `npm run preview` - podglad buildu.
- `npm run lint` - lint.
- `npm run format` - formatowanie.

## Notatki

Projekt jest zbudowany mobile-first i ma wyrazna domena: bezpieczne, prywatne przechowywanie rodzinnych historii z mediami i kontrola rol.
