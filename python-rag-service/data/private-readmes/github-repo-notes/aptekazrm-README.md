# aptekazrm

Apteka ZRM to aplikacja Next.js do zarzadzania lekami w zespole ratownictwa medycznego. Laczy skanowanie kodow GS1/DataMatrix, logowanie, magazyn, prace offline i Supabase.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-02 21:33:16 UTC
- Ostatni push: 2026-04-03 02:01:52 UTC
- Ostatni commit na `main`: 2026-04-03 02:01:48 UTC
- Liczba commitow na `main`: 4

## Funkcje

- Przekierowanie uzytkownika do `dashboard` albo `login` na podstawie sesji Supabase.
- Logowanie i rejestracja.
- Panel dashboardu dla magazynu lekow.
- Tworzenie zespolu przez koordynatora.
- Skaner lekow oparty o `html5-qrcode`.
- Parsowanie GS1 DataMatrix.
- Obsluga kodow QR zespolu.
- Lista inwentarza i pojedyncze pozycje magazynu.
- Warstwa offline przez IndexedDB (`idb`) i lokalny store.
- Typy Supabase i migracje bazy.
- Middleware/proxy Next.js.

## Tech stack

- Next.js, React, TypeScript
- Supabase Auth/SSR
- Tailwind CSS
- html5-qrcode
- IndexedDB przez `idb`
- Zustand
- react-qr-code
- Lucide React
- date-fns

## Struktura

- `app/` - strony Next.js: login, register, dashboard i coordinator.
- `src/components/scanner/MedicineScanner.tsx` - skaner kodow.
- `src/components/dashboard/` - komponenty inwentarza.
- `src/lib/gs1-parser.ts` - parser GS1.
- `src/lib/offline.ts` i `src/lib/store.ts` - lokalna/offline warstwa danych.
- `src/lib/supabase/` - klienci Supabase.
- `supabase/migrations/` - schemat bazy i storage.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny Next.js.
- `npm run build` - build produkcyjny.
- `npm run start` - start buildu.
- `npm run lint` - lint.

## Notatki

Projekt wyglada jak nastepca/prototyp bardziej systemowej wersji narzedzi lekowych: ma juz auth, zespoly, dashboard, offline store i backend Supabase.
