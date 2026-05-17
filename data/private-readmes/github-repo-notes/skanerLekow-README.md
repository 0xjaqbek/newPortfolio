# skanerLekow

Prosty skaner lekow po kodzie GTIN/EAN. Projekt pozwala wpisac albo zeskanowac kod leku, pobrac dane z DrugsAPI i pokazac nazwe, substancje czynna, dawke, postac, refundacje oraz dane rejestracyjne.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-04-05 12:22:35 UTC
- Ostatni push: 2026-04-05 14:19:05 UTC
- Ostatni commit na `main`: 2026-04-05 14:18:59 UTC
- Liczba commitow na `main`: 19

## Funkcje

- Wyszukiwanie leku po EAN/GTIN.
- Skanowanie kamera przez natywny `BarcodeDetector`, jesli przegladarka go wspiera.
- Obsluga kodow EAN-8, EAN-13, GTIN-14, DataMatrix i QR.
- Proxy API przez konfiguracje Vercel.
- Pobieranie szczegolow leku po ID.
- Pokazywanie substancji czynnej, dawki, postaci, ATC, kategorii dostepnosci, refundacji, ceny, podmiotu odpowiedzialnego i numeru pozwolenia.
- Skrypty Python do kolekcjonowania danych lekow, budowania SQLite i konwersji do JSON.
- Gotowy plik `leki_ratownika_grupowany.json`.

## Tech stack

- HTML, CSS, Vanilla JavaScript
- BarcodeDetector API
- DrugsAPI
- Vercel rewrites/proxy
- Python
- SQLite
- requests

## Struktura

- `index.html` - UI skanera i logika pobierania danych.
- `kolektor_lekow.py` - pobieranie lekow dla listy substancji do SQLite.
- `konwertuj_db_na_json.py` - konwersja bazy do JSON.
- `uzupelnij_brakujace*.py` - uzupelnianie danych.
- `leki_ratownika_grupowany.json` - lokalny zestaw danych lekow.
- `vercel.json` - konfiguracja proxy.

## Uruchomienie

```bash
npx serve .
```

albo otworz `index.html` lokalnie. Skanowanie kamera zwykle wymaga HTTPS albo localhost.

## Notatki

W kodzie znajduja sie odwolania do kluczy DrugsAPI. Przed publicznym uzyciem najlepiej przeniesc je do zmiennych srodowiskowych albo backendowego proxy, aby nie trzymac sekretow w froncie ani skryptach.
