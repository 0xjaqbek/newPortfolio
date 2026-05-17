# plonbli-landing-page

Landing page dla Plonbli, czyli aplikacji laczacej kupujacych z lokalnymi rolnikami. Strona pelni role zapowiedzi produktu, zbiera adresy newslettera i prowadzi do kanalow social media.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-09 17:12:01 UTC
- Ostatni push: 2026-04-11 13:01:46 UTC
- Ostatni commit na `main`: 2026-04-11 13:01:33 UTC
- Liczba commitow na `main`: 34

## Funkcje

- Responsywna strona "coming soon" dla marki Plonbli.
- Logo i claim "plon blisko Ciebie".
- Linki do Telegrama, Instagrama, Facebooka i X.
- Formularz newslettera zapisujacy email do Supabase.
- Obsluga duplikatu emaila i komunikaty toast.
- Motyw jasny/ciemny przez `ThemeToggle`.
- Animacje wejscia przez Framer Motion.
- Test newslettera w Vitest/Testing Library.
- Konfiguracja Playwright.
- Pliki `robots.txt`, favicon i CNAME.

## Tech stack

- Vite, React, TypeScript
- Tailwind CSS
- shadcn/ui / Radix UI
- Supabase
- Framer Motion
- Lucide React
- Sonner
- Vitest, Testing Library
- Playwright

## Struktura

- `src/pages/Index.tsx` - glowny ekran landing page.
- `src/components/` - nawigacja, theme toggle i komponenty UI.
- `src/lib/supabase.ts` - klient Supabase.
- `src/test/` - testy.
- `public/` - logo, favicon, robots.
- `docs/superpowers/` - specyfikacja zapisu emaili newslettera.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny Vite.
- `npm run build` - build produkcyjny.
- `npm run preview` - podglad buildu.
- `npm run test` - testy Vitest.
- `npm run lint` - lint.

## Notatki

To lekka, marketingowa warstwa Plonbli. Glowny punkt integracji to tabela `subscribers` w Supabase.
