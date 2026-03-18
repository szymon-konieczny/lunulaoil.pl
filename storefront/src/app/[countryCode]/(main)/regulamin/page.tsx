import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  description:
    "Regulamin sklepu internetowego Lunula Oil & More. Warunki zakupow, dostawa, zwroty i reklamacje.",
}

export default function TermsPage() {
  return (
    <div className="bg-brand-background">
      <section className="py-16 small:py-24">
        <div className="content-container max-w-3xl mx-auto">
          <h1 className="text-3xl small:text-4xl font-serif font-semibold text-white mb-12 text-center">
            Regulamin sklepu internetowego
          </h1>

          <div className="prose-lunula space-y-10 text-white/80 text-sm leading-relaxed">
            {/* I. Postanowienia ogolne */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                I. Postanowienia ogolne
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sklep internetowy dostepny pod adresem lunulaoil.pl prowadzony
                  jest przez LUNULA SKIN CARE RYSZARD SZULAKOWSKI, ul. Ametystowa
                  1a, 52-215 Wroclaw, NIP: 7521195027, REGON: 531232096
                  (dalej: &bdquo;Sprzedawca&rdquo;).
                </li>
                <li>
                  Regulamin okresla zasady korzystania ze Sklepu, skladania
                  zamowien, dostawy, platnosci, odstapienia od umowy oraz
                  postepowania reklamacyjnego.
                </li>
                <li>
                  Regulamin jest udostepniany nieodplatnie przed zawarciem umowy w
                  sposob umozliwiajacy jego pobranie, utrwalenie i wydrukowanie.
                </li>
              </ol>
            </section>

            {/* II. Definicje */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                II. Definicje
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Sklep</strong> &mdash; sklep
                  internetowy prowadzony pod adresem lunulaoil.pl.
                </li>
                <li>
                  <strong className="text-white">Klient</strong> &mdash; osoba
                  fizyczna posiadajaca pelna zdolnosc do czynnosci prawnych, osoba
                  prawna lub jednostka organizacyjna, ktora dokonuje zakupow w
                  Sklepie.
                </li>
                <li>
                  <strong className="text-white">Konsument</strong> &mdash; Klient
                  bedacy osoba fizyczna dokonujaca zakupow niezwiazanych
                  bezposrednio z jej dzialalnoscia gospodarcza lub zawodowa.
                </li>
                <li>
                  <strong className="text-white">Produkt</strong> &mdash; towar
                  prezentowany w Sklepie, przeznaczony do sprzedazy.
                </li>
                <li>
                  <strong className="text-white">Zamowienie</strong> &mdash;
                  oswiadczenie woli Klienta zmierzajace do zawarcia umowy
                  sprzedazy Produktu ze Sprzedawca.
                </li>
              </ul>
            </section>

            {/* III. Dane kontaktowe */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                III. Dane kontaktowe
              </h2>
              <ul className="list-none space-y-1">
                <li>
                  Adres: ul. Ametystowa 1a, 52-215 Wroclaw
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
              <h2 className="text-xl font-serif text-white mb-4">
                IV. Wymagania techniczne
              </h2>
              <p>
                Do korzystania ze Sklepu niezbedne jest urzadzenie z dostepem do
                Internetu, przegladarka internetowa obslugujaca JavaScript i pliki
                cookies oraz aktywne konto poczty elektronicznej.
              </p>
            </section>

            {/* V. Ceny i platnosci */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                V. Ceny i platnosci
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Wszystkie ceny podane w Sklepie sa cenami brutto (zawieraja
                  podatek VAT) i wyrazone sa w zlotych polskich (PLN).
                </li>
                <li>
                  Cena podana przy Produkcie nie obejmuje kosztow dostawy, ktore
                  sa podawane w trakcie skladania Zamowienia.
                </li>
                <li>
                  Dostepne metody platnosci: przelew bankowy, platnosc
                  elektroniczna, platnosc za pobraniem.
                </li>
                <li>
                  W przypadku platnosci przelewem bankowym Klient zobowiazany jest
                  do dokonania platnosci w terminie 3 dni roboczych od zlozenia
                  Zamowienia.
                </li>
              </ol>
            </section>

            {/* VI. Skladanie zamowien */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VI. Skladanie zamowien
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Zamowienia mozna skladac 24 godziny na dobe, 7 dni w tygodniu
                  przez strone internetowa Sklepu.
                </li>
                <li>
                  W celu zlozenia Zamowienia nalezy dodac wybrane Produkty do
                  koszyka, podac dane do dostawy i platnosci, a nastepnie
                  potwierdzic Zamowienie.
                </li>
                <li>
                  Zlozenie Zamowienia stanowi zlozenie oferty zawarcia umowy
                  sprzedazy. Umowa zostaje zawarta z chwila potwierdzenia
                  przyjecia Zamowienia do realizacji przez Sprzedawce drogaelektroniczna.
                </li>
                <li>
                  Zakladanie konta w Sklepie jest bezplatne i dobrowolne. Klient
                  moze w kazdej chwili usunac konto bez ponoszenia kosztow.
                </li>
              </ol>
            </section>

            {/* VII. Dostawa */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VII. Dostawa
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sklep realizuje dostawy na terenie Polski oraz wybranych krajow
                  Unii Europejskiej.
                </li>
                <li>
                  Czas realizacji Zamowienia wynosi do 5 dni roboczych od
                  momentu zaksiegowania platnosci (lub od momentu zlozenia
                  Zamowienia w przypadku platnosci za pobraniem).
                </li>
                <li>
                  Koszty dostawy sa wskazywane podczas skladania Zamowienia i
                  zaleza od wybranego sposobu dostawy.
                </li>
              </ol>
            </section>

            {/* VIII. Prawo odstapienia od umowy */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VIII. Prawo odstapienia od umowy
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Konsument ma prawo odstapic od umowy w terminie 14 dni bez
                  podania jakiejkolwiek przyczyny. Termin do odstapienia od umowy
                  wygasa po uplywie 14 dni od dnia, w ktorym Konsument wszedl w
                  posiadanie towaru.
                </li>
                <li>
                  Aby skorzystac z prawa odstapienia od umowy, Konsument musi
                  poinformowac Sprzedawce o swojej decyzji w drodze
                  jednoznacznego oswiadczenia (np. e-mail na adres
                  kontakt@lunulaoil.pl).
                </li>
                <li>
                  Sprzedawca zwroci Konsumentowi wszystkie otrzymane platnosci,
                  w tym koszty dostarczenia (z wyjatkiem dodatkowych kosztow
                  wynikajacych z wybranego sposobu dostawy innego niz
                  najtanszy), nie pozniej niz 14 dni od dnia otrzymania
                  oswiadczenia o odstapienia od umowy.
                </li>
                <li>
                  Konsument ponosi bezposrednie koszty zwrotu towaru.
                </li>
                <li>
                  Prawo odstapienia od umowy nie przysluguje w odniesieniu do
                  umow, w ktorych przedmiotem swiadczenia jest rzecz
                  dostarczana w zapieczetowanym opakowaniu, ktorej po otwarciu
                  opakowania nie mozna zwrocic ze wzgledu na ochrone zdrowia lub
                  ze wzgledow higienicznych, jezeli opakowanie zostalo otwarte po
                  dostarczeniu.
                </li>
              </ol>
            </section>

            {/* IX. Reklamacje i gwarancja */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                IX. Reklamacje i gwarancja
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sprzedawca jest zobowiazany dostarczyc Produkt wolny od wad.
                </li>
                <li>
                  Reklamacje nalezy skladac droga elektroniczna na adres
                  kontakt@lunulaoil.pl lub pisemnie na adres siedziby Sprzedawcy.
                </li>
                <li>
                  Reklamacja powinna zawierac opis wady, date jej stwierdzenia
                  oraz zadanie Klienta (naprawa, wymiana, obnizenie ceny lub
                  odstapienie od umowy).
                </li>
                <li>
                  Sprzedawca rozpatrzy reklamacje w terminie 14 dni od dnia jej
                  otrzymania.
                </li>
              </ol>
            </section>

            {/* X. Pozasadowe rozwiazywanie sporow */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                X. Pozasadowe rozwiazywanie sporow
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Konsument ma mozliwosc skorzystania z pozasadowych sposobow
                  rozpatrywania reklamacji i dochodzenia roszczen, w tym z
                  mediacji lub arbitrazu.
                </li>
                <li>
                  Szczegolowe informacje dotyczace mozliwosci skorzystania przez
                  Konsumenta z pozasadowych sposobow rozpatrywania reklamacji
                  dostepne sa na stronie{" "}
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

            {/* XI. Postanowienia koncowe */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                XI. Postanowienia koncowe
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Sprzedawca zastrzega sobie prawo do zmiany Regulaminu.
                  O zmianach Klienci zostana poinformowani drogaelektroniczna.
                </li>
                <li>
                  W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie
                  maja przepisy prawa polskiego, w szczegolnosci Kodeksu cywilnego
                  oraz ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
                </li>
                <li>
                  Regulamin obowiazuje od dnia 18.03.2026 r.
                </li>
              </ol>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
