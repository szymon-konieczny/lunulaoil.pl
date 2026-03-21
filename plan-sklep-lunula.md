# Plan: Sklep internetowy Lunula Botanique

## 1. Podsumowanie wymagań

Na podstawie wiadomości właścicielki, potrzebujemy rozwiązania które obsłuży:

| Wymaganie | Priorytet |
|---|---|
| Sklep online z aktualnymi produktami (kremy Lunula Botanique) | 🔴 Krytyczny |
| Panel B2B dla gabinetów/salonów (logowanie, NIP, ceny hurtowe) | 🔴 Krytyczny |
| Progi cenowe - 5+ szt. tego samego produktu = cena bez marży | 🔴 Krytyczny |
| Sprzedaż warsztatów online | 🟡 Wysoki |
| Wysyłanie wiadomości/newslettera z ofertą i promocjami | 🟡 Wysoki |
| Subskrypcja - miesięczne mini boxy pielęgnacyjne | 🟢 Średni (faza 2) |
| Estetyczny, nowoczesny design pasujący do marki "slow care" | 🔴 Krytyczny |
| Automatyzacja Instagram - comment-to-DM z linkami do sklepu | 🟡 Wysoki |

---

## 2. Porównanie podejść

### Opcja A: WooCommerce (WordPress) + pluginy B2B

**Co to oznacza:** Modernizacja istniejącej strony WordPress, dodanie WooCommerce + pluginy typu B2BKing lub Wholesale Suite.

**Zalety:**
- Właścicielka już ma WordPress - teoretycznie mniejszy próg wejścia
- Gotowe pluginy B2B (B2BKing, Wholesale Suite) z progami cenowymi
- Duży ekosystem wtyczek (newsletter, subskrypcje, warsztaty)
- Łatwiejsze samodzielne zarządzanie treścią bez programisty

**Wady:**
- **Frankenstein-problem**: aby spełnić wszystkie wymagania, potrzeba 8-12 pluginów które mogą ze sobą kolidować
- Pluginy B2B (B2BKing Pro: ~$139/rok, Wholesale Suite: ~$149/rok) = koszty licencyjne co rok
- WordPress + WooCommerce + pluginy = wolna strona bez poważnej optymalizacji
- Brak natywnej walidacji NIP przez GUS - wymaga custom developmentu lub kolejnego pluginu
- Aktualizacje pluginów mogą łamać kompatybilność
- Trudno osiągnąć naprawdę premium estetykę bez custom theme
- **Obecna strona wymaga "liftingu"** - modernizacja starego WP to często więcej pracy niż budowa od zera

**Szacunkowy koszt utrzymania:** ~$300-500/rok (hosting + pluginy premium)

---

### Opcja B: Next.js + Medusa.js (headless e-commerce) - deploy na Railway

**Co to oznacza:** Nowa aplikacja od zera: Medusa.js jako backend e-commerce + Next.js jako frontend. Deploy backendu i frontendu na Railway.

**Zalety:**
- Pełna kontrola nad logiką B2B/B2C - progi cenowe, role użytkowników, NIP
- Szybkość działania (SSR/SSG w Next.js) - świetne SEO i UX
- Medusa.js dostarcza gotową logikę: produkty, koszyk, zamówienia, płatności, klienci
- Brak opłat licencyjnych (Medusa = open source, MIT)
- Premium estetyka - pełna wolność w designie, idealnie do marki "slow care"
- Łatwa integracja z polskimi bramkami płatności (Przelewy24, PayU)
- Subskrypcje i warsztaty to naturalne rozszerzenia backendu

**Wady:**
- Wymaga developera do początkowej budowy (~2-4 tygodnie)
- Zarządzanie treścią wymaga panelu admina Medusa (jest gotowy, ale mniej intuicyjny niż WP)
- Railway hosting: ~$5-20/mies. (backend + baza danych + frontend)

**Szacunkowy koszt utrzymania:** ~$10-20/mies. (Railway) + domena

---

### Opcja C: Next.js custom (bez Medusa) - pełny custom

**Co to oznacza:** Budowa kompletnego backendu od zera w Next.js (API routes) + Prisma + PostgreSQL.

**Zalety:**
- Maksymalna elastyczność
- Zero zależności od frameworka e-commerce

**Wady:**
- **Ogromny nakład pracy**: trzeba zbudować od zera koszyk, zamówienia, płatności, panel admina, zarządzanie produktami
- Duplikowanie tego co Medusa daje out-of-the-box
- Więcej błędów, więcej testowania, dłuższy czas realizacji
- Nie ma sensu gdy istnieje Medusa.js

**Werdykt:** ❌ Odradzam - to jak pisanie WordPress od zera zamiast go użyć.

---

## 3. SEO i wydajność: Next.js + Medusa vs WooCommerce

To kluczowe porównanie, ponieważ Google od 2021 roku używa Core Web Vitals jako czynnika rankingowego, a od 2025 ich waga jeszcze wzrosła.

### Lighthouse / Core Web Vitals

| Metryka | WooCommerce (tradycyjny) | Next.js + Medusa (headless) |
|---|---|---|
| Lighthouse Performance (mobile) | 60-75 (typowy zakres) | 90-98 (typowy zakres) |
| LCP (Largest Contentful Paint) | 3-6s (bez cache pluginów) | 0.8-1.5s (SSR/SSG) |
| FID / INP (interaktywność) | Problematyczne (ciężki JS) | Minimalne (React hydration) |
| CLS (przesunięcia layoutu) | Częste (pluginy ładują async) | Kontrolowane (atomic CSS) |
| TTFB (Time to First Byte) | 800ms-2s (PHP + DB queries) | 50-200ms (Edge/CDN) |

**Kluczowy fakt:** Case study z branży e-commerce pokazuje skok z 63 do 91 punktów mobile Lighthouse po migracji z tradycyjnego WP do headless Next.js. Wzrost ruchu organicznego o 41%.

### Dlaczego WooCommerce jest wolniejszy

WooCommerce generuje stronę po stronie serwera w PHP przy każdym żądaniu. Każdy zainstalowany plugin dodaje czas do tego procesu - zarówno na frontendzie jak i backendzie. W przypadku Lunula, potrzebujemy 8-12 pluginów (B2B, wholesale pricing, subskrypcje, newsletter, warsztaty, wysyłki, płatności, cache), co tworzy efekt kuli śnieżnej:

- Każdy plugin ładuje własne CSS i JS
- Żądania do bazy danych mnożą się (plugin → WooCommerce → WordPress → MySQL)
- Bez drogiego hostingu (WP Engine ~$30+/mies.) strona będzie wolna pod obciążeniem
- Sam WooCommerce przyznaje, że ich admin miał problem z wydajnością - dopiero w wersji 9.8 (2025) zredukowali czas ładowania panelu o 51.9%

### Dlaczego Next.js + Medusa jest szybszy

Architektura headless rozdziela frontend od backendu, co daje:

- **SSG (Static Site Generation)** - strony produktów generowane raz przy buildzie, serwowane jako statyczny HTML z CDN. Czas ładowania: <100ms
- **ISR (Incremental Static Regeneration)** - strona odświeża się w tle co X minut, użytkownik zawsze dostaje gotowy HTML
- **React Server Components** - redukcja bundla JS o 40-60% vs tradycyjny SPA
- **Brak PHP overhead** - Node.js obsługuje requesty asynchronicznie, nie blokuje wątku
- **Każde 100ms szybszego ładowania = +1% konwersji** - przy sklepie z kremami za 100-200 PLN to realny przychód

### SEO: co Next.js daje out-of-the-box

| Funkcja SEO | WooCommerce | Next.js + Medusa |
|---|---|---|
| Server-Side Rendering | Natywne (PHP), ale wolne | Natywne (SSR/SSG), szybkie |
| Structured Data (JSON-LD) | Wymaga plugin (Yoast/Rank Math) | Kodujemy dokładnie to co potrzeba |
| Open Graph / Twitter Cards | Plugin | Wbudowane w Next.js metadata API |
| Sitemap XML | Plugin | next-sitemap (automatyczna) |
| Kontrola URL structure | Ograniczona (WP permalink) | Pełna kontrola (App Router) |
| Canonical tags | Plugin | Natywne w metadata API |
| Image optimization | Plugin (Smush/ShortPixel) | next/image (automatyczne WebP/AVIF, lazy loading, srcset) |
| Robots.txt | Plugin | Plik statyczny lub dynamiczny |
| Internacjonalizacja (i18n) | Plugin (WPML: $39/rok) | Wbudowane w Next.js |

### Podsumowanie: wpływ na biznes Lunula

Lunula sprzedaje produkty premium - klienci oczekują strony, która ładuje się natychmiast i wygląda profesjonalnie. Wolna strona WooCommerce z 10 pluginami:
- Traci pozycje w Google (Core Web Vitals jako ranking signal)
- Traci klientów (53% użytkowników mobilnych opuszcza stronę ładującą się >3s)
- Traci konwersje (każde 100ms = 1% konwersji)

Next.js + Medusa eliminuje te problemy na poziomie architektury, a nie przez "łatanie" kolejnymi pluginami cache.

---

## 4. Rekomendacja: Opcja B - Next.js + Medusa.js na Railway

### Dlaczego to najlepszy wybór dla Lunula:

1. **Marka premium wymaga premium UX** - WooCommerce z 10 pluginami nigdy nie da takiego efektu wizualnego jak custom Next.js frontend z Tailwind CSS. Lunula Slow Care to marka oparta na estetyce i doświadczeniu - strona musi to odzwierciedlać.

2. **SEO i wydajność bez kompromisów** - Lighthouse 90+ na mobile, LCP <1.5s, pełna kontrola nad structured data i metadanymi. Google nagradza szybkie strony wyższymi pozycjami.

3. **Logika B2B jest zbyt specyficzna na pluginy** - weryfikacja NIP przez API GUS, dynamiczne progi cenowe per produkt, dwa oddzielne panele (klient indywidualny vs gabinet) - to lepiej zakodować raz porządnie niż łatać pluginami.

4. **Koszty w dłuższej perspektywie** - Railway za ~$15/mies. vs WordPress hosting + 4 pluginy premium za ~$400-500/rok. Medusa.js jest darmowa.

5. **Skalowalność** - dodanie subskrypcji, warsztatów, newslettera, bota IG to kwestia rozbudowy istniejącego backendu, a nie szukania kolejnego pluginu.

---

## 5. Architektura techniczna

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│            Next.js 14 + Tailwind CSS             │
│         Deploy: Railway (lub Vercel)             │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │  Sklep   │ │ Panel    │ │   Warsztaty     │  │
│  │  B2C     │ │ B2B      │ │   & Booking     │  │
│  └──────────┘ └──────────┘ └─────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────────┐
│                   BACKEND                        │
│              Medusa.js v2                         │
│           Deploy: Railway                        │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │Produkty  │ │ Klienci  │ │  Zamówienia     │  │
│  │& Ceny    │ │ & Role   │ │  & Płatności    │  │
│  └──────────┘ └──────────┘ └─────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │ Progi    │ │ NIP/GUS  │ │  Subskrypcje   │  │
│  │ cenowe   │ │ verify   │ │  (faza 2)      │  │
│  └──────────┘ └──────────┘ └─────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              BAZA DANYCH                         │
│         PostgreSQL (Railway)                     │
└─────────────────────────────────────────────────┘

Integracje:
  📧 Resend / Mailchimp - newsletter i powiadomienia
  💳 Przelewy24 / Stripe - płatności
  🏛️ API REGON (GUS) - weryfikacja NIP
  📦 InPost / DPD - integracja wysyłki
  🖼️ Cloudinary / S3 - zdjęcia produktów
  📸 Instagram Graph API - automatyzacja comment-to-DM
```

---

## 6. Plan realizacji - fazy

### Faza 1: MVP sklepu (2-3 tygodnie)
- Setup Medusa.js + PostgreSQL na Railway
- Frontend Next.js: strona główna, katalog produktów, strona produktu
- Koszyk i checkout z Przelewy24/Stripe
- Responsywny design dopasowany do estetyki Lunula
- Panel admina Medusa do zarządzania produktami
- Podstawowe SEO (meta tagi, sitemap, Open Graph)

### Faza 2: System B2B (1-2 tygodnie)
- Rejestracja gabinetu z podaniem NIP
- Weryfikacja NIP przez API REGON (GUS)
- Role użytkowników: klient indywidualny vs gabinet
- Logika progów cenowych: ≥5 szt. tego samego produktu = cena hurtowa (bez marży)
- Panel B2B po zalogowaniu z cenami hurtowymi
- Historia zamówień dla gabinetów

### Faza 3: Warsztaty i komunikacja (1 tydzień)
- Sekcja warsztatów z kalendarzem i rejestracją
- Integracja z Resend/Mailchimp do newslettera
- System powiadomień e-mail (potwierdzenia, promocje)
- Strona "O marce" i blog/aktualności

### Faza 4: Automatyzacja Instagram (3-5 dni)

Instagram **nie pozwala** na automatyczne odpowiedzi publiczne na komentarze z linkami - takie boty skutkują shadowbanem lub blokadą konta. Istnieje jednak legalna, bardzo skuteczna alternatywa: **comment-to-DM**.

**Jak to działa:**
1. Klientka publikuje post z produktem (np. krem Lunula Botanique Rose)
2. W opisie pisze: *"Napisz ROSE w komentarzu, a wyślemy Ci link do zakupu!"*
3. Gdy ktoś skomentuje trigger word „ROSE", bot automatycznie wysyła DM z linkiem do produktu w sklepie
4. Dodatkowo: bot może odpowiedzieć publicznym komentarzem "Wysłaliśmy Ci wiadomość! 💌" (bez linka)

**Dwie opcje realizacji:**

**Opcja A: Gotowe narzędzie (szybciej, drożej miesięcznie)**
Narzędzia jak ManyChat (~$15/mies.), CreatorFlow (~$15/mies.) lub InstantDM (~$8/mies.) oferują to jako gotową funkcję. Konfiguracja zajmuje ~30 minut. Wadą jest kolejna stała opłata miesięczna i brak integracji z naszym sklepem (linki trzeba aktualizować ręcznie).

**Opcja B: Custom bot na Instagram Graph API (rekomendowana)**
Budujemy własny mikroserwis (Node.js, deploy razem na Railway) który:
- Nasłuchuje na komentarze przez Instagram Webhooks
- Wykrywa trigger words zdefiniowane w panelu admina
- Wysyła DM z linkiem do konkretnego produktu w sklepie Lunula (deep link)
- Generuje linki dynamicznie z backendu Medusa - zawsze aktualne ceny i dostępność
- Loguje statystyki: ile osób kliknęło, ile kupiło (atrybucja sprzedaży z IG)
- Koszt: $0/mies. dodatkowego (działa na tym samym Railway)

**Wymagania od właścicielki:**
- Konto Instagram Professional (Business lub Creator) - wymagane przez Meta
- Połączenie z Facebook Page (wymagane przez Graph API)
- Zatwierdzenie aplikacji w Meta Developer Console

**Ograniczenia API (stan na 2026):**
- Limit 200 DM/godzinę (w zupełności wystarczający dla marki tej skali)
- Bot nie może inicjować konwersacji - reaguje tylko na akcje użytkownika (komentarz/story reply)

### Faza 5: Subskrypcje (1 tydzień)
- Model subskrypcji: miesięczne mini boxy pielęgnacyjne
- Zarządzanie subskrypcjami (pauza, anulowanie, zmiana)
- Automatyczne płatności cykliczne przez Stripe
- Panel klienta z historią subskrypcji

---

## 7. Szacunkowe koszty

### Jednorazowe (development)
| Pozycja | Koszt |
|---|---|
| Setup infrastruktury (Railway, domena, SSL) | wliczone |
| Frontend Next.js (design + implementacja) | wycena indywidualna |
| Backend Medusa.js + logika B2B | wycena indywidualna |
| Integracja płatności (Przelewy24) | wliczone |
| Integracja wysyłek | wliczone |

### Miesięczne (utrzymanie)
| Pozycja | Koszt/mies. |
|---|---|
| Railway (backend + DB + frontend) | ~$15-25 |
| Domena lunulaoil.pl | ~$5 (rocznie ~$50-60) |
| Resend (email, do 3000/mies. free) | $0 |
| Cloudinary (zdjęcia, free tier) | $0 |
| Instagram bot (custom, na Railway) | $0 (wspólny hosting) |
| **Razem** | **~$20-30/mies.** |

Dla porównania, WooCommerce z pluginami B2B + ManyChat:
- Hosting WordPress: ~$15-30/mies.
- B2BKing Pro: ~$139/rok
- Wholesale Suite: ~$149/rok
- WooCommerce Subscriptions: ~$239/rok
- Mailchimp plugin: ~$120/rok
- ManyChat (Instagram bot): ~$15/mies.
- **Razem: ~$85-100/mies.**

---

## 9. White-label: wielokrotne użycie u innych klientów

Architektura Next.js + Medusa.js daje pełną elastyczność w zakresie ponownego użycia aplikacji. To coś, czego WooCommerce praktycznie nie umożliwia bez tworzenia osobnej instalacji od zera dla każdego klienta.

### Trzy modele white-label

**Model A: Fork per klient (najprostszy)**
Każdy klient dostaje kopię repozytorium z własnym frontendem i backendem. Wspólny "core" aktualizowany przez git merge z głównego repo.

- ✅ Pełna izolacja danych i konfiguracji
- ✅ Każdy klient może mieć unikalny design
- ✅ Osobny deploy na Railway (~$15-25/mies. per klient)
- ⚠️ Aktualizacje core'a wymagają merge do każdego forka
- **Najlepszy dla:** 2-10 klientów z różnym brandingiem

**Model B: Multi-tenant (jedna instancja, wielu klientów)**
Jeden backend Medusa z PostgreSQL Row Level Security (RLS) - dane klientów izolowane na poziomie bazy danych. Frontend rozpoznaje tenanta po domenie (np. lunulaoil.pl → tenant "lunula", innaklientka.pl → tenant "inna").

- ✅ Jeden deploy, wiele sklepów - znacząco niższy koszt hostingu
- ✅ Aktualizacje aplikują się do wszystkich klientów jednocześnie
- ✅ Medusa wspiera multi-tenancy przez RLS (guide od Rigby)
- ⚠️ Większa złożoność początkowa (~3-5 dni więcej na setup)
- ⚠️ Wymaga starannego testowania izolacji danych
- **Najlepszy dla:** 10+ klientów, model SaaS

**Model C: Konfigurowalny template (hybrydowy, rekomendowany)**
Budujemy Lunulę jako pierwszy "wzorcowy" sklep, ale od początku projektujemy z myślą o konfigurowalności:

- Kolory, fonty, logo - z pliku konfiguracyjnego (theme.config.ts)
- Logika B2B/B2C - feature flags (włącz/wyłącz per klient)
- Progi cenowe, kategorie, branding - konfiguracja w panelu admina Medusa
- Integracja IG, subskrypcje, warsztaty - moduły opt-in

Nowy klient = nowy deploy z Railway template + zmiana konfiguracji. Czas wdrożenia: **1-2 dni** zamiast 2-3 tygodni.

- ✅ Najlepszy balans między elastycznością a utrzymywalnością
- ✅ Każdy klient ma osobną infrastrukturę (izolacja)
- ✅ Wspólny codebase, łatwe aktualizacje (git pull + redeploy)
- ✅ Niski koszt wdrożenia nowego klienta
- **Najlepszy dla:** agencja/freelancer obsługujący marki kosmetyczne, wellness, premium retail

### Co to oznacza w praktyce

Jeśli od początku zastosujemy **Model C**, to:

1. Lunula jest pierwszym klientem i "showcase" projektu
2. Kolejna marka kosmetyczna/wellness potrzebuje sklepu z B2B? Fork repo, zmień theme.config.ts, deploy - gotowe w 1-2 dni
3. Każda nowa funkcja (np. subskrypcje) wraca do głównego repo i jest dostępna dla wszystkich klientów
4. Możesz oferować to jako usługę SaaS lub jako jednorazowe wdrożenie

### Wpływ na architekturę Fazy 1

Żeby to zadziałało, w Fazie 1 dodajemy niewielki overhead:

- Plik `theme.config.ts` z kolorami, fontami, logo, nazwą marki
- Tailwind theme oparty na CSS variables (nie hardcoded kolory)
- Feature flags w env variables (ENABLE_B2B=true/false, ENABLE_SUBSCRIPTIONS=true/false)
- Komponenty UI bez hardcoded treści - wszystko z CMS/config

To dodaje ~1-2 dni do Fazy 1, ale oszczędza tygodnie przy każdym kolejnym kliencie.

---

## 10. Następne kroki

1. **Potwierdzenie podejścia** z właścicielką Lunula
2. **Zebranie materiałów**: zdjęcia produktów, opisy, ceny (B2C i hurtowe), logo w wysokiej rozdzielczości
3. **Ustalenie listy produktów** - 4 kremy Botanique + inne produkty + warsztaty
4. **Wybór bramki płatności** - Przelewy24 (najpopularniejsza w PL) vs Stripe
5. **Design** - moodboard / wireframes dopasowane do estetyki "slow care"
6. **Start developmentu** - Faza 1

---

*Plan przygotowany: marzec 2026*
