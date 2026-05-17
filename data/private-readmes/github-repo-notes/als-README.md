# als

Jednoplikowy symulator treningowy algorytmow ALS/ZRM. Aplikacja pozwala wybrac scenariusz zatrzymania krazenia i ulozyc prawidlowa kolejnosc postepowania.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-05-09 17:09:23 UTC
- Ostatni push: 2026-05-09 17:10:11 UTC
- Ostatni commit na `main`: 2026-05-09 17:10:10 UTC
- Liczba commitow na `main`: 1

## Funkcje

- Dwa scenariusze szkoleniowe:
  - rytm do defibrylacji, VF,
  - rytm niedefibrylacyjny, asystolia.
- Losowe mieszanie dostepnych czynnosci.
- Klikanie czynnosci w celu ulozenia wlasnego algorytmu.
- Cofanie wybranych krokow.
- Walidacja odpowiedzi z komunikatem poprawnie/niepoprawnie.
- Responsywny layout z panelami "Dostepne czynnosci" i "Twoj algorytm".

## Tech stack

- HTML
- CSS
- Vanilla JavaScript

## Struktura

- `index.html` - cala aplikacja: markup, style, dane scenariuszy i logika JS.

## Uruchomienie

Otworz `index.html` w przegladarce albo wystaw katalog dowolnym statycznym serwerem.

```bash
npx serve .
```

## Notatki

Projekt jest maly i edukacyjny. Najwieksza wartosc to prosty, szybki trening kolejnosci czynnosci w algorytmach ALS bez potrzeby backendu.
