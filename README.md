# Audi Import — kalkulator importu z Niemiec

Aplikacja webowa z formularzem kosztów importu, wyszukiwaniem podobnych ofert w Polsce, medianą i średnią ceną ofertową oraz linkami do ogłoszeń.

## Źródło danych rynkowych
Backend używa **Brave Search API** do wyszukiwania publicznie indeksowanych stron z ofertami (m.in. OTOMOTO, OLX, Autoplac). Wyniki zależą od indeksu wyszukiwarki i fragmentów stron; nie jest to pełny feed ogłoszeń ani oficjalna baza wszystkich transakcji.

OTOMOTO informuje, że ich API jest dostępne dla klientów biznesowych i wymaga uzyskania dostępu. Jeśli otrzymasz uprawnienia do oficjalnego API, można dodać dedykowany konektor. Zobacz: https://www.otomoto.pl/news/jak-uzyskac-dostep-do-api

## Uruchomienie lokalne
1. Zainstaluj Node.js 18 lub nowszy.
2. Rozpakuj projekt i otwórz katalog w terminalu.
3. Skopiuj `.env.example` do `.env`.
4. Dodaj własny `BRAVE_SEARCH_API_KEY` z https://brave.com/search/api/
5. Uruchom:
   ```bash
   npm install
   npm start
   ```
6. Otwórz http://localhost:3000

Klucz API pozostaje na serwerze i nie jest wysyłany do przeglądarki.

## Co robi kalkulator
- Koszt zakupu w EUR przeliczony na PLN.
- Akcyza (3,1% do 2000 cm³ lub 18,6% powyżej 2000 cm³; można zmienić stawkę).
- Transport, badanie, rejestracja, dokumenty, inspekcja, serwis, OC i dodatkowa rezerwa.
- Wyszukiwanie podobnych ofert w Polsce według modelu, rocznika, paliwa, silnika i zakresu przebiegu.
- Mediana i średnia arytmetyczna cen znalezionych ofert, zakres cen i linki źródłowe.
- Porównanie całkowitego kosztu importu z medianą rynku polskiego.

## Ważne ograniczenia
- Przed pierwszym użyciem wymagany jest klucz Brave Search API. Bez niego aplikacja nie udaje, że pobrała aktualne ogłoszenia.
- Wyniki wyszukiwania mogą zawierać duplikaty, brakujące parametry lub ceny w niejednolitym formacie. Aplikacja deduplikuje URL-e i próbuje wyciągnąć cenę z tytułu/fragmentu, ale zalecana jest weryfikacja ogłoszeń.
- Średnia i mediana dotyczą znalezionych ofert, nie wszystkich transakcji na rynku.
- Kalkulacja akcyzy jest orientacyjna. Podstawa podatkowa może wymagać korekty; sprawdź aktualne zasady na podatki.gov.pl. Nie jest to porada podatkowa.
- Aplikacja nie scrapuje bezpośrednio stron portali i nie omija zabezpieczeń. Korzysta z wyników wyszukiwarki.
