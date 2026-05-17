# Rsi

Jednoplikowy trener RSI, czyli Rapid Sequence Intubation. Aplikacja pomaga cwiczyc protokol 7P i dawkowanie lekow w przeliczeniu na mase pacjenta.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-19 10:45:47 UTC
- Ostatni push: 2026-04-19 11:34:58 UTC
- Ostatni commit na `main`: 2026-04-19 11:34:58 UTC
- Liczba commitow na `main`: 11

## Funkcje

- Formularz startowy z masa pacjenta i typem pacjenta.
- Tryb treningowy krok po kroku dla protokolu 7P.
- Etapy: preparation, preoxygenation, pretreatment, induction/paralysis, placement i post-intubation management.
- Pytania wyboru dotyczace wlasciwego dzialania.
- Dawkowanie zalezne od masy ciala dla Fentanylu, Etomidatu i Rokuronium.
- Licznik bledow i ekran podsumowania.
- "Cheat sheet" z przypomnieniem procedury.
- Dodatkowe dane przypadkow w `cases.json`.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript

## Struktura

- `index.html` - UI, style i logika glownego trenera.
- `app.js` - dodatkowa logika aplikacyjna.
- `cases.json` - dane przypadkow.

## Uruchomienie

Otworz `index.html` w przegladarce albo uruchom prosty serwer statyczny.

```bash
npx serve .
```

## Notatki

Projekt jest narzedziem edukacyjnym dla medycyny ratunkowej. Najwazniejsza wartosc to szybkie cwiczenie kolejnosci dzialan oraz dawek mg/kg bez backendu.
