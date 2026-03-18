# Lunula Botanique — Sklep internetowy

## Architektura
- **Backend:** Medusa.js v2.13 (`/backend`) — port 9000
- **Storefront:** Next.js 15 + Tailwind CSS (`/storefront`) — port 8000
- **Baza danych:** PostgreSQL 16 (`lunula`)
- **Node.js:** v22 LTS (see `.nvmrc`)

## Komendy
- Backend dev: `cd backend && npm run dev`
- Storefront dev: `cd storefront && npm run dev`
- Oba jednocześnie: uruchom w osobnych terminalach

## Struktura
```
lunula/
  backend/          # Medusa.js v2 — API, admin panel, logika biznesowa
    src/
      api/          # Custom API routes
      modules/      # Custom modules (B2B, progi cenowe, NIP)
      admin/        # Custom admin widgets
  storefront/       # Next.js 15 — frontend sklepu
    src/
      app/          # App Router pages
      lib/          # Utilities, config
      modules/      # UI modules (layout, products, cart, checkout)
```

## Konwencje
- Język kodu: angielski
- Język UI/treści: polski
- Tailwind CSS z CSS variables dla theming (white-label ready)
- Feature flags w env variables (ENABLE_B2B, ENABLE_SUBSCRIPTIONS)
- Theme config w `storefront/src/lib/config/theme.config.ts`

## White-label
Projekt zaprojektowany jako konfigurowalny template:
- `theme.config.ts` — kolory, fonty, logo, nazwa marki
- Tailwind oparty na CSS variables
- Komponenty bez hardcoded treści
