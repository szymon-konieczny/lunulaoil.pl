# Storefront — Lunula Botanique

Frontend sklepu [lunulaoil.pl](https://www.lunulaoil.pl). Next.js 15 (App Router)
rozmawiający z backendem Medusy v2 po HTTP przez `@medusajs/js-sdk`.

Backend żyje w `../backend`, a wspólny opis architektury jest w `../CLAUDE.md`.

## Stack

| | |
|---|---|
| Framework | Next.js 15.5.28, App Router, React 19 |
| Style | Tailwind CSS 3 + `@medusajs/ui-preset`, theming na CSS variables |
| Dane | `@medusajs/js-sdk` → Medusa v2 (REST) |
| i18n | `next-intl`, komunikaty w `src/messages` |
| Płatności | Stripe (`@stripe/react-stripe-js`), PayNow, InPost Geowidget |
| Node | 22 LTS (`.nvmrc`), npm 10.9.4 (`packageManager`) |

## Uruchomienie lokalne

```bash
nvm use            # Node 22 z .nvmrc
npm install
npm run dev        # http://localhost:8000
```

`npm install` odpala `postinstall`, czyli `patches/fix-medusa-sdk-localstorage.sh`
— łatkę na `@medusajs/js-sdk`, która zabezpiecza dostęp do `localStorage` przy
renderowaniu po stronie serwera. Skrypt jest idempotentny, ale przy mylących
błędach bundlera najpewniej jest zacząć od `rm -rf node_modules && npm ci`.

### Skrypty

| skrypt | co robi |
|---|---|
| `npm run dev` | tryb deweloperski na porcie 8000 (Turbopack) |
| `npm run build` | build produkcyjny; emituje `.next/standalone` |
| `npm run lint` | `next lint` |
| `npm run analyze` | build z `ANALYZE=true` |

Żeby odpalić build produkcyjny lokalnie bez Dockera, uruchom serwer standalone
wprost — port bierze ze zmiennej `PORT`:

```bash
npm run build
PORT=8000 node .next/standalone/server.js
```

> [!NOTE]
> `npm run start` (czyli `next start -p 8000`) **nie działa** od włączenia
> `output: "standalone"` — Next wypisuje ostrzeżenie i zwraca 500. Skrypt
> pozostał w `package.json` z czasów przed zmianą obrazu produkcyjnego.

## Zmienne środowiskowe

`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` jest **wymagany** — `next.config.js` woła
`check-env-variables.js`, które przerywa build, jeśli klucza nie ma.

| zmienna | rola |
|---|---|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | publishable key Medusy; wymagany |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | adres backendu dla przeglądarki |
| `MEDUSA_BACKEND_URL` | adres backendu dla kodu serwerowego; domyślnie to samo co wyżej |
| `NEXT_PUBLIC_BASE_URL` | kanoniczny adres sklepu (sitemapa, metadane OG) |
| `NEXT_PUBLIC_DEFAULT_REGION` | domyślny region, `pl` |
| `NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN` | token mapy paczkomatów w checkoucie |

Wszystkie `NEXT_PUBLIC_*` są wstrzykiwane **w czasie builda**, nie przy starcie —
zmiana którejkolwiek wymaga przebudowania obrazu, nie restartu.

## Struktura

```
src/
  app/              # App Router: trasy [countryCode]/*, api/*, sitemap.ts
  modules/          # moduły UI: products, cart, checkout, account, quiz, layout, …
  lib/              # SDK Medusy, warstwa danych (lib/data), konfiguracja, utils
  i18n/ messages/   # konfiguracja next-intl i tłumaczenia
  styles/ types/    # globalne style i typy współdzielone
  middleware.ts     # rozpoznanie regionu i przepisanie na /[countryCode]
```

Theming siedzi w `src/lib/config/theme.config.ts` — kolory, fonty, logo i nazwa
marki. Tailwind korzysta z CSS variables, żeby dało się przestawić projekt na
inną markę bez ruszania komponentów.

## Produkcja

Hosting to Railway, build z `Dockerfile` (`railway.toml` → builder `DOCKERFILE`).
Obraz jest dwuetapowy i opiera się na `output: "standalone"`: etap produkcyjny
kopiuje tylko `.next/standalone`, `.next/static` i `public`, więc nie wozi
narzędzi build-time'owych. Serwer startuje przez `node server.js` i czyta port
z `PORT` (ustawione na 8000) oraz adres bindowania z `HOSTNAME` (`0.0.0.0`),
a nie z flagi `next start -p`.

Lokalny build obrazu wymaga przekazania zmiennych jako `--build-arg`, bo
`NEXT_PUBLIC_*` muszą być znane w trakcie builda:

```bash
docker build \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_… \
  --build-arg NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.lunulaoil.pl \
  --build-arg NEXT_PUBLIC_BASE_URL=https://www.lunulaoil.pl \
  -t lunula-storefront .
```

> [!WARNING]
> Merge na `main` przebudowuje w Railway oba serwisy sklepu — `railway.json`
> nie ma `watchPatterns`, więc zmiana w samym storefroncie rusza też backend.

## Pochodzenie kodu

Projekt wystartował z oficjalnego szablonu
[medusa-next](https://github.com/medusajs/nextjs-starter-medusa) (MIT). Plik
`LICENSE` zachowuje notę Medusy, bo tego wymaga licencja pierwotnego kodu.
