# triage

TRIAGE MCI to progresywna aplikacja webowa do segregacji poszkodowanych i zarzadzania zdarzeniem masowym. Dziala offline, implementuje algorytm START i digitalizuje procesy potrzebne podczas MCI: pacjenci, dysponowanie, szpitale, transport i raport.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-02-23 21:57:12 UTC
- Ostatni push: 2026-04-08 23:12:44 UTC
- Ostatni commit na `main`: 2026-04-08 23:12:38 UTC
- Liczba commitow na `main`: 90

## Funkcje

- Kreator triage START z kategoriami T1, T2, T3 i T4.
- Automatyczne tagowanie pacjentow.
- Re-triage z historia zmian.
- Interaktywny diagram obrazen ciala.
- Tryb dyspozytora w `dyspozytor/`.
- Konfiguracja KAM/GDM, zespolow ZRM i szpitali.
- Zarzadzanie pojemnoscia szpitali dla T1/T2.
- Przypisywanie transportow, zmiana szpitala i status dostarczenia.
- Import danych od dyspozytora przez link/SMS z Base64.
- Raport koncowy z grupowaniem pacjentow i historia.
- Pelny tryb offline przez Service Worker.
- Instalacja jako PWA na iOS, Android i Windows.
- Instrukcje w wielu jezykach: PL, EN, IT, FR, DE, CS, PT.
- Dokumenty pracy magisterskiej w `docs/thesis`.
- Lokalny serwer Go i gotowy `triage-server.exe` do instalacji offline.

## Tech stack

- Vanilla HTML, CSS i JavaScript
- PWA: Web App Manifest i Service Worker
- localStorage
- Base64 / format linku SMS
- Go dla lokalnego serwera HTTP

## Struktura

- `index.html` - glowna aplikacja triage.
- `dyspozytor/index.html` - tryb dyspozytora.
- `experiment.html` - tryb eksperymentalny.
- `instrukcja/` - instrukcja w aplikacji.
- `privacy/` - polityka prywatnosci.
- `manifest.json`, `sw.js`, `icons/` - PWA/offline.
- `server/main.go` - lokalny serwer.
- `docs/` - instrukcje, plany i material pracy.

## Uruchomienie

Najprosciej otworzyc `index.html` w przegladarce. Dla pelnego zachowania PWA/offline najlepiej uruchomic statyczny serwer:

```bash
npx serve .
```

W Windows mozna tez uzyc dolaczonego `triage-server.exe`.

## Notatki

To dojrzale repo narzedziowe. Najwieksza wartosc projektu to praca bez internetu, lokalna persystencja danych i zgodnosc workflow z realna praca podczas zdarzenia masowego.
