# drkolo

Aplikacja dla serwisu rowerowego Dr Kolo. Repo zawiera publiczna strone, cennik, formularze zlecen i rezerwacji, panel administracyjny oraz osobne API czatu wdrazane na Vercel.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-05-06 11:02:39 UTC
- Ostatni push: 2026-05-13 14:59:34 UTC
- Ostatni commit na `main`: 2026-05-13 14:58:48 UTC
- Liczba commitow na `main`: 88

## Funkcje

- Landing page serwisu rowerowego z galeria, oferta i brandingiem.
- Strona cennika oparta o `cennik.json`.
- Tworzenie i podglad zlecen serwisowych po hashu.
- Rezerwacje terminow i panel kalendarza administracyjnego.
- Kwestionariusz oraz widok odpowiedzi.
- Widget czatu na stronie oraz panel `ChatAdmin`.
- API czatu z promptem systemowym, parsowaniem SMS i integracja Supabase.
- Migracje Supabase dla zlecen, terminow, czatu, katalogu uslug i ankiet.
- Testy komponentow, hookow i parsera SMS.

## Tech stack

- Vite, React, TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui / Radix UI
- Supabase
- Vitest i Testing Library
- Vercel Functions w katalogu `chat-api`

## Struktura

- `src/pages/` - glowne ekrany: start, cennik, zlecenia, rezerwacja, admin, chat i kwestionariusze.
- `src/components/` - komponenty domenowe i elementy UI.
- `src/hooks/` - logika danych dla zlecen, terminow, sesji i ankiet.
- `src/lib/` - klient Supabase, typy, API czatu i narzedzia.
- `supabase/migrations/` - schemat bazy.
- `chat-api/` - osobny pakiet API dla chatu i administracji sesjami.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny serwer Vite.
- `npm run build` - build produkcyjny.
- `npm run preview` - podglad buildu.
- `npm run test` - testy Vitest.
- `npm run lint` - lint.

## Notatki

To repo wyglada jak praktyczny system obslugi serwisu: publiczna warstwa marketingowa jest polaczona z workflow operacyjnym, danymi w Supabase i lekkim asystentem czatowym.
