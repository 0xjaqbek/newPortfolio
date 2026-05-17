# newAffirm

Nowoczesny sklep / galeria kart Pokemon pod marka aFFiRM. Projekt laczy karuzele produktow, galerie, motywy, lokalne konto demo oraz dashboard klienta i administratora.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2025-04-09 17:33:08 UTC
- Ostatni push: 2026-04-27 12:31:24 UTC
- Ostatni commit na `main`: 2026-04-27 12:30:05 UTC
- Liczba commitow na `main`: 51

## Funkcje

- Strona sklepu z karuzela kart i sekcja galerii.
- Seedowane dane kart i zamowien w `localStorage`.
- Dashboard klienta i administratora ladowane lazy przez `React.lazy`.
- Modal logowania i kontekst autoryzacji demo.
- Przelaczanie motywu jasny/ciemny.
- Detekcja mobile i osobne zachowania karuzeli.
- Manifest modal i sekcje marketingowe marki.
- Style Swiper, animacje Framer Motion i assety graficzne.
- Hook `usePokemonTCG` sugerujacy mozliwa integracje z danymi kart Pokemon.

## Tech stack

- Vite, React, JavaScript
- Tailwind CSS
- Framer Motion
- Swiper
- React Icons
- Three.js / React Three Fiber / Drei
- Solana Web3.js
- Stripe.js
- EmailJS
- gh-pages

## Struktura

- `src/App.jsx` - glowny shell aplikacji, sekcje shop/gallery/dashboard.
- `src/components/` - navbar, karuzele, modale, footer i dashboardy.
- `src/contexts/` - auth i motyw.
- `src/hooks/` - wykrywanie mobile, localStorage i Pokemon TCG.
- `src/data/` - seed kart oraz zamowien.
- `public/images/` - grafiki produktow, logo i assety brandowe.

## Uruchomienie

```bash
npm install
npm run dev
```

## Skrypty

- `npm run dev` - lokalny serwer Vite.
- `npm run build` - build produkcyjny.
- `npm run preview` - podglad buildu.
- `npm run deploy` - publikacja przez GitHub Pages.

## Notatki

To repo jest front-endowym prototypem sklepu/brand experience. Dane sa lokalne i seedowane, wiec projekt nadaje sie do demo UI oraz dalszego podpiecia pod prawdziwy backend platnosci, kont i magazynu.
