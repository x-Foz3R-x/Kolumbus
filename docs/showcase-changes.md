# Kolumbus showcase — zakres zmian

Wersja prezentacyjna na gałęzi `codex/kolumbus-showcase`, oparta na Twojej stronie
z `transform`. Ten dokument opisuje zmiany wprowadzone przy przygotowaniu showcase.
Duża różnica względem starego `main` obejmuje również Twoją wcześniejszą pracę
z `transform`.

## Strona i koncept

- Zachowany układ, fonty, kolory, animowane karty, własne kursory i zakończenie strony z `transform`.
- Puste karty funkcji zastąpione miniaturami interfejsu i opisami faktycznych możliwości demo.
- Nowa sekcja „Inside Kolumbus” ma cztery przełączane widoki z Twoich materiałów:
  plan podróży, rozwiniętą kartę miejsca, bibliotekę i odręczny szkic.
- Obrazy można powiększyć, otworzyć osobno i przełączać klawiaturą. Animacja przełączenia
  uwzględnia ustawienie ograniczonego ruchu. Na telefonie zakładki przewijają się poziomo.
- Podpisy rozróżniają historyczne widoki aplikacji, eksploracje interfejsu i szerszą wizję
  obejmującą mapy, wydatki oraz listy pakowania.
- „About” prowadzi do sekcji konceptu, a przyciski rozpoczęcia do demo.
- Stopka i opis strony przedstawiają Kolumbus jako Twój osobisty projekt.
- W showcase usunięte są odnośniki do niedostępnych tras konta i aplikacji.
  Kontakt korzysta ze wspólnego komponentu z danymi kontaktowymi.

Materiały źródłowe w sąsiednim folderze `kolumbus assets`:

| Obraz na stronie                    | Oryginał                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `public/concept/itinerary.webp`     | `footage/Screenshot_2023-08-05_at_15.08.06.png`                                                       |
| `public/concept/place-details.webp` | `footage/Screenshot_2023-08-10_at_20.45.00.png`                                                       |
| `public/concept/library.webp`       | Kadr 12,5 s z `footage/flow/Screen Recording 2024-05-27 at 20.18.26.mov`; przycięty do okna aplikacji |
| `public/concept/first-sketch.webp`  | `ideas/Projekt podróż - początkowy szkic.png`                                                         |
| `public/place-fallback.png`         | `img/event-fallback/event-fallback.png`                                                               |

Oryginały pozostały bez zmian. Cztery obrazy galerii mają łącznie około 682 KiB;
na stronie ładuje się wybrany widok, pozostałe po przełączeniu.

## Interaktywne demo

- Dwa okna: aplikacja z biblioteką/edytorem oraz „Things to try” z ośmioma wskazówkami.
- Pierwsza wizyta otwiera przykładowy wyjazd. Kolejne wizyty otwierają zapisaną bibliotekę.
- Biblioteka umożliwia tworzenie, otwieranie, duplikowanie i usuwanie wyjazdów.
  Usunięcie wymaga drugiego kliknięcia potwierdzającego.
- Nazwa, daty, miejsca, notatki oraz ukończone wskazówki zapisują się lokalnie
  w przeglądarce, pod kluczem `kolumbus-showcase-library`.
- Niedostępny zapis lub nieczytelne dane są obsłużone komunikatem. Demo może wtedy
  działać w bieżącej karcie bez nadpisywania nieczytelnego zapisu.
- W pasku wyjazdu są powrót do biblioteki, kalendarz, cofanie, ponawianie i historia.
  Historia obejmuje bieżącą sesję edycji, do 40 zapisanych stanów.
- Zmiana dat zachowuje miejsca także przy skróceniu wyjazdu, przenosząc je na ostatni
  pozostały dzień. Limit wyjazdu to 14 dni.
- Zachowane przeciąganie miejsc, całych dni i grupy zaznaczonych kart.
  Poprawione indeksy po przenoszeniu, anulowanie ruchu i kopie stanów historii.
- Kompozytor obsługuje Google Places oraz własne miejsca dodawane klawiszem Enter.
  Wyszukiwanie ma opóźnienie 250 ms i ochronę przed spóźnionymi odpowiedziami.
- Zapis demo korzysta z lokalnych callbacków zamiast operacji tRPC i bazy.

## Google Places

- Samodzielna funkcja Vercel `api/places.ts` obsługuje wyszukiwanie, szczegóły,
  pobranie aktualnej referencji zdjęcia i przekazanie obrazu.
- Klucz `GOOGLE_KEY` jest odczytywany wyłącznie po stronie serwera.
- Parametry są walidowane, czas żądania ograniczony do 8 sekund, odpowiedzi bez cache.
- Naprawiony adapter Node na Vercelu oraz import ESM schematu z rozszerzeniem `.js`.
  `extensionAlias` pozwala rozwiązać ten import również podczas pracy lokalnej w Next.
- Karty pobierają świeże referencje zdjęć według Google Place ID. Przy braku zdjęcia
  używają lokalnej grafiki, a przy zdjęciu pokazują atrybucję Google i autora.
- Link do Google Maps używa identyfikatora Google zamiast wewnętrznego ID karty.
- Zamknięte konto rozliczeniowe Google wymagało ponownego otwarcia przez Ciebie.
  Po tej zmianie zweryfikowano na publicznej domenie wyszukiwanie, szczegóły,
  metadane zdjęcia i rzeczywisty obraz — HTTP 200, status Google `OK`.

## Uruchamianie i wdrażanie

- `pnpm dev:showcase` uruchamia stronę lokalnie, `pnpm build:showcase` buduje statyczny eksport.
- Showcase publikuje `/` oraz `/contact` bez wymagania Supabase i Clerk.
  Produkcyjna funkcja Places działa osobno; lokalnie obsługuje ją trasa deweloperska Next.
- Build showcase nie wymaga `.env`. Działające wyszukiwanie i zdjęcia wymagają
  `GOOGLE_KEY` w środowisku serwera oraz aktywnego rozliczania projektu Google.
- Zwykły tryb aplikacji nadal ma oddzielny layout i nawigację konta.
  Nie wykonano pełnego sprawdzenia działającej aplikacji z kontami i bazą.
- `vercel.json` wybiera statyczny eksport `out/` i samodzielną funkcję API.
  Środowisko Node ustawione na wersję 22.
- Sprawdzenie typów obejmuje również starsze moduły. Poprawione rozbieżności
  w propsach zaproszenia, polu zdjęcia, typach Discorda i kalkulatorze uprawnień.
  Kilka zmian pojedynczych linii dotyczy wyłącznie zgodności z ESLint/TypeScript.

## Pliki zmienione przy przygotowaniu showcase

Poniżej zakres względem zapisanego stanu `transform` z Twoimi trzema lokalnymi poprawkami
(`2675986`), z pominięciem setek wcześniejszych commitów Twojej aplikacji.

| Obszar                     | Pliki                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Składanie strony i layout  | `src/app/_components/home-page.tsx`, `src/app/_components/root-document.tsx`, `src/app/layout.tsx`, `src/app/layout.showcase.tsx`, `src/app/page.tsx`, `src/app/page.showcase.tsx`                                                                                                                                            |
| Sekcje strony              | `src/app/_components/hero.tsx`, `src/app/_components/hero-feature.tsx`, `src/app/_components/event.tsx`, `src/app/_components/features.tsx`, `src/app/_components/feature-card.tsx`, `src/app/_components/concept.tsx`, `src/app/_components/cta.tsx`, `src/app/_components/footer.tsx`                                       |
| Nawigacja                  | `src/app/_components/top-nav.tsx`, `src/app/_components/top-nav-menu.tsx`, `src/app/_components/account-top-nav.tsx`, `src/app/_components/slide-animation.tsx`, `src/config/site.ts`                                                                                                                                         |
| Demo                       | `src/app/_components/demo.tsx`, `src/app/_components/demo/demo-trip.tsx`, `src/app/_components/demo/demo-library.tsx`, `src/app/_components/demo/demo-tasks.tsx`, `src/app/_components/demo/use-demo-library.ts`                                                                                                              |
| Układanie planu i historia | `src/components/dnd-itinerary/dnd-itinerary.tsx`, `src/components/dnd-itinerary/item-composer.tsx`, `src/hooks/use-history-state.ts`, `src/hooks/use-random-trip.ts`                                                                                                                                                          |
| Karty miejsc               | `src/components/dnd-itinerary/place/place.tsx`, `src/components/dnd-itinerary/place/place-overlay.tsx`, `src/components/dnd-itinerary/place/place-details.tsx`, `src/components/dnd-itinerary/place/place-image.tsx`, `src/components/dnd-itinerary/place/place-ui-overlay.tsx`                                               |
| API Places                 | `api/places.ts`, `src/app/api/places/route.showcase.dev.ts`                                                                                                                                                                                                                                                                   |
| Wspólne UI                 | `src/components/calendar/index.tsx`, `src/components/window.tsx`, `src/components/ui/combobox/combobox.tsx`, `src/components/ui/floating/floating.tsx`, `src/components/ui/menu/menu-component.tsx`, `src/components/ui/modal/modal.tsx`                                                                                      |
| Kontakt                    | `src/app/contact/page.tsx`, `src/app/contact/page.showcase.tsx`, `src/app/contact/_components/contact-details.tsx`, `src/app/contact/_components/discord-widget.tsx`                                                                                                                                                          |
| Zgodność typów i lint      | `.eslintrc.cjs`, `src/app/api/uploadthing/core.ts`, `src/app/invite/[inviteCode]/page.tsx`, `src/app/invite/[inviteCode]/_components/invite-trip.tsx`, `src/app/playground/permission-calculator/page.tsx`, `src/app/playground/permission-calculator/_components/permission-display.tsx`, `src/hooks/use-location-search.ts` |
| Konfiguracja i provider    | `next.config.js`, `package.json`, `tsconfig.json`, `vercel.json`, `src/lib/utils.ts`, `src/trpc/react.tsx`                                                                                                                                                                                                                    |
| Grafiki i dokumentacja     | `public/place-fallback.png`, cztery obrazy w `public/concept/`, `README.md`, `docs/showcase-changes.md`                                                                                                                                                                                                                       |

Trzy pierwotne lokalne poprawki w `top-nav.tsx` i `trip-provider.tsx` wyjazdu oraz
`scroll-indicator.tsx` są zachowane. Checkout roboczy `transform` pozostał z Twoimi zmianami;
praca nad showcase odbywa się w osobnej kopii.

## Sprawdzanie wersji

Automatyczne kontrole: produkcyjny build showcase, TypeScript, ESLint i `git diff --check`.
Sprawdzenia w przeglądarce obejmują bibliotekę i zapis po odświeżeniu, wskazówki demo,
przeciąganie, historię, kalendarz, wyszukiwanie i zdjęcia. Nowa galeria jest sprawdzana
na komputerze i telefonie, z przełączaniem klawiaturą oraz zamykaniem podglądu klawiszem Escape.

Nie dodano nowych zależności ani nie zmieniano schematu bazy danych.
