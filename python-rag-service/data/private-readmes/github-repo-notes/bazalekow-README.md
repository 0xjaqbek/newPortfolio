# bazalekow

Baza lekow dla zespolow ratownictwa medycznego. Aplikacja webowa pozwala skanowac kody GS1/DataMatrix, wyszukiwac leki przez DrugsAPI, prowadzic lokalny magazyn i eksportowac/importowac dane.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-07 06:08:16 UTC
- Ostatni push: 2026-04-16 15:59:05 UTC
- Ostatni commit na `main`: 2026-04-16 15:59:00 UTC
- Liczba commitow na `main`: 28

## Funkcje

- Skanowanie kodow przez kamere z uzyciem `html5-qrcode`.
- Parser GS1/DataMatrix dla GTIN/EAN, dat waznosci, serii i numerow seryjnych.
- Reczne wyszukiwanie po EAN i substancji.
- Integracja z DrugsAPI przez endpointy Vercel w katalogu `api/`.
- Lokalny magazyn lekow z iloscia, lokalizacja, progiem alarmowym i data waznosci.
- Podzial lokalizacji na magazyn i ambulans.
- Alerty niskiego stanu oraz przeterminowania.
- Eksport i import danych JSON.
- Skrypty inicjalizacji/testowania bazy.
- Dokumentacja integracji w `drugsapi.md`.

## Tech stack

- Vite
- Vanilla JavaScript, HTML, CSS
- `html5-qrcode`
- Neon Serverless Postgres
- Vercel Functions
- `uuid`
- dotenv

## Struktura

- `index.html` - shell aplikacji i modale.
- `src/main.js` - router widokow, UI, logika skanowania i magazynu.
- `src/scanner.js` - obsluga kamery.
- `src/gs1-parser.js` - parsowanie kodow GS1.
- `src/inventory.js` - operacje magazynowe.
- `src/api.js` - komunikacja z API lekow.
- `src/data-io.js` - import/eksport JSON.
- `api/` - endpointy Vercel do bazy i proxy.
- `scripts/` - inicjalizacja i testowanie bazy.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny serwer Vite.
- `npm run build` - build produkcyjny.
- `npm run preview` - podglad buildu.

## Notatki

Projekt zawiera integracje z zewnetrznym API lekow i konfiguracje Vercel. Przed publikacja warto przeniesc wszelkie klucze API do zmiennych srodowiskowych i sprawdzic, czy w repo nie zostaly wartosci sekretow.
