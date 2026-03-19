import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  description:
    "Regulamin sklepu internetowego Lunula Botanique. Warunki zakupów, dostawa, zwroty i reklamacje.",
}

export default function TermsPage() {
  return (
    <div className="bg-brand-background">
      <section className="py-16 small:py-24">
        <div className="content-container max-w-3xl mx-auto">
          <h1 className="text-3xl small:text-4xl font-serif font-semibold text-brand-text mb-12 text-center">
            Regulamin sklepu internetowego
          </h1>

          <div className="prose-lunula space-y-10 text-brand-text-muted text-sm leading-relaxed">
            {/* I. Postanowienia ogólne */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                I. Postanowienia ogólne
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sklep internetowy dostępny pod adresem lunulaoil.pl prowadzony
                  jest przez LUNULA SKIN CARE RYSZARD SZULAKOWSKI, ul. Ametystowa
                  1a, 52-215 Wrocław, NIP: 7521195027, REGON: 531232096
                  (dalej: &bdquo;Sprzedawca&rdquo;).
                </li>
                <li>
                  Regulamin określa zasady korzystania ze Sklepu, składania
                  zamówień, dostawy, płatności, odstąpienia od umowy oraz
                  postępowania reklamacyjnego.
                </li>
                <li>
                  Regulamin jest udostępniany nieodpłatnie przed zawarciem umowy w
                  sposób umożliwiający jego pobranie, utrwalenie i wydrukowanie.
                </li>
              </ol>
            </section>

            {/* II. Definicje */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                II. Definicje
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-brand-text">Sklep</strong> &mdash; sklep
                  internetowy prowadzony pod adresem lunulaoil.pl.
                </li>
                <li>
                  <strong className="text-brand-text">Klient</strong> &mdash; osoba
                  fizyczna posiadająca pełną zdolność do czynności prawnych, osoba
                  prawna lub jednostka organizacyjna, która dokonuje zakupów w
                  Sklepie.
                </li>
                <li>
                  <strong className="text-brand-text">Konsument</strong> &mdash; Klient
                  będący osobą fizyczną dokonującą zakupów niezwiązanych
                  bezpośrednio z jej działalnością gospodarczą lub zawodową.
                </li>
                <li>
                  <strong className="text-brand-text">Produkt</strong> &mdash; towar
                  prezentowany w Sklepie, przeznaczony do sprzedaży.
                </li>
                <li>
                  <strong className="text-brand-text">Zamówienie</strong> &mdash;
                  oświadczenie woli Klienta zmierzające do zawarcia umowy
                  sprzedaży Produktu ze Sprzedawcą.
                </li>
              </ul>
            </section>

            {/* III. Dane kontaktowe */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                III. Dane kontaktowe
              </h2>
              <ul className="list-none space-y-1">
                <li>
                  Adres: ul. Ametystowa 1a, 52-215 Wrocław
                </li>
                <li>
                  E-mail:{" "}
                  <a
                    href="mailto:kontakt@lunulaoil.pl"
                    className="text-brand-primary hover:underline"
                  >
                    kontakt@lunulaoil.pl
                  </a>
                </li>
                <li>
                  Telefon:{" "}
                  <a
                    href="tel:+48509085064"
                    className="text-brand-primary hover:underline"
                  >
                    +48 509 085 064
                  </a>
                </li>
                <li>Numer konta: mBank 54 1140 2004 0000 3202 8217 1808</li>
              </ul>
            </section>

            {/* IV. Wymagania techniczne */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                IV. Wymagania techniczne
              </h2>
              <p>
                Do korzystania ze Sklepu niezbędne jest urządzenie z dostępem do
                Internetu, przeglądarka internetowa obsługująca JavaScript i pliki
                cookies oraz aktywne konto poczty elektronicznej.
              </p>
            </section>

            {/* V. Ceny i płatności */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                V. Ceny i płatności
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Wszystkie ceny podane w Sklepie są cenami brutto (zawierają
                  podatek VAT) i wyrażone są w złotych polskich (PLN).
                </li>
                <li>
                  Cena podana przy Produkcie nie obejmuje kosztów dostawy, które
                  są podawane w trakcie składania Zamówienia.
                </li>
                <li>
                  Dostępne metody płatności: przelew bankowy, płatność
                  elektroniczna, płatność za pobraniem.
                </li>
                <li>
                  W przypadku płatności przelewem bankowym Klient zobowiązany jest
                  do dokonania płatności w terminie 3 dni roboczych od złożenia
                  Zamówienia.
                </li>
              </ol>
            </section>

            {/* VI. Składanie zamówień */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VI. Składanie zamówień
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu
                  przez stronę internetową Sklepu.
                </li>
                <li>
                  W celu złożenia Zamówienia należy dodać wybrane Produkty do
                  koszyka, podać dane do dostawy i płatności, a następnie
                  potwierdzić Zamówienie.
                </li>
                <li>
                  Złożenie Zamówienia stanowi złożenie oferty zawarcia umowy
                  sprzedaży. Umowa zostaje zawarta z chwilą potwierdzenia
                  przyjęcia Zamówienia do realizacji przez Sprzedawcę drogą
                  elektroniczną.
                </li>
                <li>
                  Zakładanie konta w Sklepie jest bezpłatne i dobrowolne. Klient
                  może w każdej chwili usunąć konto bez ponoszenia kosztów.
                </li>
              </ol>
            </section>

            {/* VII. Dostawa */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VII. Dostawa
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sklep realizuje dostawy na terenie Polski oraz wybranych krajów
                  Unii Europejskiej.
                </li>
                <li>
                  Czas realizacji Zamówienia wynosi do 5 dni roboczych od
                  momentu zaksięgowania płatności (lub od momentu złożenia
                  Zamówienia w przypadku płatności za pobraniem).
                </li>
                <li>
                  Koszty dostawy są wskazywane podczas składania Zamówienia i
                  zależą od wybranego sposobu dostawy.
                </li>
              </ol>
            </section>

            {/* VIII. Prawo odstąpienia od umowy */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VIII. Prawo odstąpienia od umowy
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Konsument ma prawo odstąpić od umowy w terminie 14 dni bez
                  podania jakiejkolwiek przyczyny. Termin do odstąpienia od umowy
                  wygasa po upływie 14 dni od dnia, w którym Konsument wszedł w
                  posiadanie towaru.
                </li>
                <li>
                  Aby skorzystać z prawa odstąpienia od umowy, Konsument musi
                  poinformować Sprzedawcę o swojej decyzji w drodze
                  jednoznacznego oświadczenia (np. e-mail na adres
                  kontakt@lunulaoil.pl).
                </li>
                <li>
                  Sprzedawca zwróci Konsumentowi wszystkie otrzymane płatności,
                  w tym koszty dostarczenia (z wyjątkiem dodatkowych kosztów
                  wynikających z wybranego sposobu dostawy innego niż
                  najtańszy), nie później niż 14 dni od dnia otrzymania
                  oświadczenia o odstąpieniu od umowy.
                </li>
                <li>
                  Konsument ponosi bezpośrednie koszty zwrotu towaru.
                </li>
                <li>
                  Prawo odstąpienia od umowy nie przysługuje w odniesieniu do
                  umów, w których przedmiotem świadczenia jest rzecz
                  dostarczana w zapieczętowanym opakowaniu, której po otwarciu
                  opakowania nie można zwrócić ze względu na ochronę zdrowia lub
                  ze względów higienicznych, jeżeli opakowanie zostało otwarte po
                  dostarczeniu.
                </li>
              </ol>
            </section>

            {/* IX. Reklamacje i gwarancja */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                IX. Reklamacje i gwarancja
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sprzedawca jest zobowiązany dostarczyć Produkt wolny od wad.
                </li>
                <li>
                  Reklamacje należy składać drogą elektroniczną na adres
                  kontakt@lunulaoil.pl lub pisemnie na adres siedziby Sprzedawcy.
                </li>
                <li>
                  Reklamacja powinna zawierać opis wady, datę jej stwierdzenia
                  oraz żądanie Klienta (naprawa, wymiana, obniżenie ceny lub
                  odstąpienie od umowy).
                </li>
                <li>
                  Sprzedawca rozpatrzy reklamację w terminie 14 dni od dnia jej
                  otrzymania.
                </li>
              </ol>
            </section>

            {/* X. Pozasądowe rozwiązywanie sporów */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                X. Pozasądowe rozwiązywanie sporów
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Konsument ma możliwość skorzystania z pozasądowych sposobów
                  rozpatrywania reklamacji i dochodzenia roszczeń, w tym z
                  mediacji lub arbitrażu.
                </li>
                <li>
                  Szczegółowe informacje dotyczące możliwości skorzystania przez
                  Konsumenta z pozasądowych sposobów rozpatrywania reklamacji
                  dostępne są na stronie{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    platformy ODR
                  </a>
                  .
                </li>
              </ol>
            </section>

            {/* XI. Postanowienia końcowe */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                XI. Postanowienia końcowe
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sprzedawca zastrzega sobie prawo do zmiany Regulaminu.
                  O zmianach Klienci zostaną poinformowani drogą elektroniczną.
                </li>
                <li>
                  W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie
                  mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego
                  oraz ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
                </li>
                <li>
                  Regulamin obowiązuje od dnia 18.03.2026 r.
                </li>
              </ol>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
