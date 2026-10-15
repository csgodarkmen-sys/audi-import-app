# Audi Import — kalkulator importu samochodu

Responsywna aplikacja po polsku do szacowania kosztu sprowadzenia samochodu z Niemiec i porównywania go z podobnymi ofertami w Polsce.

## Wersja bez płatnego API

Ta wersja **nie wymaga klucza Brave ani innego płatnego API**. Po kliknięciu „Szukaj podobnych ofert w DuckDuckGo” aplikacja przygotowuje linki do wyszukiwania w DuckDuckGo (OTOMOTO, OLX i pozostałe wyniki). Wybierz porównywalne ogłoszenia i wpisz ich ceny do pola w aplikacji. Kalkulator obliczy średnią, medianę, minimum, maksimum oraz różnicę między medianą ofert a szacowanym kosztem importu.

DuckDuckGo nie udostępnia oficjalnego, bezpłatnego API do pełnych wyników wyszukiwania, więc ta wersja nie udaje, że automatycznie pobiera ceny. Sprawdź w samych ogłoszeniach rocznik, silnik, nadwozie i przebieg.

## Wdrożenie na Render

1. Rozpakuj ZIP.
2. Wgraj pliki i folder `public` do swojego repozytorium GitHub (zastąp stare pliki).
3. Zatwierdź zmiany (commit) i wypchnij je do GitHub.
4. Render powinien wykryć commit i wdrożyć aplikację automatycznie. Jeśli nie, wybierz **Manual Deploy → Deploy latest commit**.
5. Nie musisz dodawać `BRAVE_SEARCH_API_KEY` ani tworzyć pliku `.env`.

Ustawienia usługi Render: Build Command `npm install`, Start Command `npm start`.

## Uruchomienie lokalne

Wymagany Node.js 18 lub nowszy:

```bash
npm install
npm start
```

Otwórz `http://localhost:3000`.

## Co wylicza kalkulator

- cenę zakupu w EUR przeliczoną na PLN;
- szacunkową akcyzę (stawka edytowalna; wynik nie jest poradą podatkową);
- transport, badanie, rejestrację, dokumenty, inspekcję, serwis, OC i inne koszty;
- średnią, medianę, minimum i maksimum z ręcznie wpisanych cen ofert;
- różnicę między całkowitym kosztem importu a medianą wpisanych cen.

Statystyki rynku zależą od cen ręcznie wybranych przez użytkownika. To ceny ofertowe, a nie potwierdzone ceny transakcyjne.
