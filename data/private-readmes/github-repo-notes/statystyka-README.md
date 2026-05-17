# statystyka

Statyczna strona z analiza statystyczna chorob cywilizacyjnych w Unii Europejskiej. Projekt porownuje Luksemburg i Bulgarie pod katem PKB per capita, nadcisnienia i cukrzycy w latach 2000-2019.

## Status repozytorium

- Wlasciciel: `0xjaqbek`
- Widocznosc: publiczne
- Utworzone: 2026-02-21 11:33:37 UTC
- Ostatni push: 2026-05-09 07:17:42 UTC
- Ostatni commit na `main`: 2026-05-09 07:17:32 UTC
- Liczba commitow na `main`: 10

## Funkcje

- Raport o wplywie statusu ekonomicznego na choroby cywilizacyjne.
- Porownanie Luksemburga i Bulgarii.
- Dane z WHO Global Health Observatory i Banku Swiatowego.
- Sekcje opisowe: metodologia, hipoteza, analiza jednej zmiennej, analiza zaleznosci i trend.
- Wykresy Chart.js: histogram, boxplot-like view, linie czasu i scatter plot.
- Obliczenia statystyczne w JavaScript: srednia, mediana, kwartyle, odchylenie standardowe, skosnosc, OLS, R2 i tempo zmian.
- Tabela danych z mozliwoscia kopiowania.

## Tech stack

- HTML
- Tailwind CSS przez CDN
- Chart.js przez CDN
- Font Awesome przez CDN
- Vanilla JavaScript

## Struktura

- `index.html` - pelny raport, style, dane, funkcje statystyczne i wykresy.
- `docs/superpowers/` - notatki projektowe i plany zmian layoutu/sekcji tekstowych.

## Uruchomienie

Otworz `index.html` w przegladarce.

```bash
npx serve .
```

## Notatki

To samowystarczalny raport HTML. Nie wymaga bundlera ani backendu, ale korzysta z bibliotek z CDN, wiec do pelnego renderowania wykresow potrzebuje internetu.
