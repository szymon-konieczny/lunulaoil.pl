import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polityka prywatnosci",
  description:
    "Polityka prywatnosci sklepu Lunula Oil & More. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-background">
      <section className="py-16 small:py-24">
        <div className="content-container max-w-3xl mx-auto">
          <h1 className="text-3xl small:text-4xl font-serif font-semibold text-white mb-12 text-center">
            Polityka prywatnosci
          </h1>

          <div className="space-y-10 text-white/80 text-sm leading-relaxed">
            {/* I. Administrator danych */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                I. Administrator danych osobowych
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Administratorem danych osobowych zbieranych za posrednictwem
                  sklepu internetowego lunulaoil.pl jest LUNULA SKIN CARE RYSZARD
                  SZULAKOWSKI, ul. Ametystowa 1a, 52-215 Wroclaw, NIP:
                  7521195027, REGON: 531232096 (dalej: &bdquo;Administrator&rdquo;).
                </li>
                <li>
                  Kontakt z Administratorem w sprawach dotyczacych ochrony danych
                  osobowych:
                  <ul className="list-none mt-2 space-y-1 ml-2">
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
                    <li>Adres korespondencyjny: ul. Ametystowa 1a, 52-215 Wroclaw</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* II. Podstawy prawne przetwarzania */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                II. Podstawy prawne przetwarzania danych
              </h2>
              <p className="mb-3">
                Dane osobowe sa przetwarzane zgodnie z Rozporzadzeniem Parlamentu
                Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w
                sprawie ochrony osob fizycznych w zwiazku z przetwarzaniem danych
                osobowych (RODO) na nastepujacych podstawach prawnych:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Art. 6 ust. 1 lit. b RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbedne do wykonania umowy (realizacja
                  zamowien, obsluga konta klienta).
                </li>
                <li>
                  <strong className="text-white">Art. 6 ust. 1 lit. c RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbedne do wypelnienia obowiazku
                  prawnego (ksiegowosc, faktury, przepisy podatkowe).
                </li>
                <li>
                  <strong className="text-white">Art. 6 ust. 1 lit. a RODO</strong>{" "}
                  &mdash; osoba, ktorej dane dotycza, wyrazila zgode na przetwarzanie
                  (newsletter, marketing).
                </li>
                <li>
                  <strong className="text-white">Art. 6 ust. 1 lit. f RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbedne do celow wynikajacych z prawnie
                  uzasadnionych interesow Administratora (obsluga zapytan, analityka,
                  dochodzenie roszczen).
                </li>
              </ul>
            </section>

            {/* III. Cele i zakres przetwarzania */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                III. Cele i zakres przetwarzania danych
              </h2>
              <p className="mb-3">
                Administrator przetwarza dane osobowe w nastepujacych celach:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Realizacja zamowien &mdash; imie, nazwisko, adres dostawy, adres
                  e-mail, numer telefonu, dane do faktury.
                </li>
                <li>
                  Prowadzenie konta klienta &mdash; imie, nazwisko, adres e-mail,
                  historia zamowien.
                </li>
                <li>
                  Wysylka newslettera &mdash; adres e-mail (na podstawie dobrowolnej
                  zgody).
                </li>
                <li>
                  Obsluga zapytan i reklamacji &mdash; dane kontaktowe, tresc
                  korespondencji.
                </li>
                <li>
                  Cele analityczne i statystyczne &mdash; dane o aktywnosci na stronie
                  (pliki cookies).
                </li>
                <li>
                  Wypelnienie obowiazkow prawnych &mdash; dane wymagane przepisami
                  podatkowymi i rachunkowymi.
                </li>
              </ul>
            </section>

            {/* IV. Okres przechowywania */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                IV. Okres przechowywania danych
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Dane zwiazane z realizacja zamowien &mdash; przez okres niezbedny do
                  realizacji umowy, a nastepnie przez okres wymagany przepisami
                  prawa (5 lat od konca roku podatkowego).
                </li>
                <li>
                  Dane konta klienta &mdash; do czasu usuniecia konta przez Klienta.
                </li>
                <li>
                  Dane przetwarzane na podstawie zgody (newsletter) &mdash; do czasu
                  cofniecia zgody.
                </li>
                <li>
                  Dane przetwarzane na podstawie prawnie uzasadnionego interesu
                  &mdash; do czasu wniesienia skutecznego sprzeciwu lub ustania celu
                  przetwarzania.
                </li>
                <li>
                  Dane z plikow cookies &mdash; zgodnie z parametrami poszczegolnych
                  plikow (sesyjne: do zamkniecia przegladarki; trwale: do 24
                  miesiecy).
                </li>
              </ul>
            </section>

            {/* V. Prawa osob */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                V. Prawa osob, ktorych dane dotycza
              </h2>
              <p className="mb-3">
                Zgodnie z RODO, kazdej osobie, ktorej dane sa przetwarzane,
                przysluguja nastepujace prawa:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Prawo dostepu</strong> (art. 15
                  RODO) &mdash; prawo do uzyskania informacji o przetwarzanych danych
                  oraz kopii danych.
                </li>
                <li>
                  <strong className="text-white">Prawo do sprostowania</strong>{" "}
                  (art. 16 RODO) &mdash; prawo do zadania poprawienia nieprawidlowych
                  lub uzupelnienia niekompletnych danych.
                </li>
                <li>
                  <strong className="text-white">
                    Prawo do usunieciadanych (&bdquo;prawo do bycia zapomnianym&rdquo;)
                  </strong>{" "}
                  (art. 17 RODO) &mdash; prawo do zadania usuniecia danych, gdy nie sa
                  juz niezbedne do celow przetwarzania.
                </li>
                <li>
                  <strong className="text-white">
                    Prawo do ograniczenia przetwarzania
                  </strong>{" "}
                  (art. 18 RODO) &mdash; prawo do zadania ograniczenia przetwarzania
                  danych w okreslonych przypadkach.
                </li>
                <li>
                  <strong className="text-white">
                    Prawo do przenoszenia danych
                  </strong>{" "}
                  (art. 20 RODO) &mdash; prawo do otrzymania danych w
                  ustrukturyzowanym formacie i przekazania ich innemu
                  administratorowi.
                </li>
                <li>
                  <strong className="text-white">Prawo do sprzeciwu</strong>{" "}
                  (art. 21 RODO) &mdash; prawo do wniesienia sprzeciwu wobec
                  przetwarzania opartego na prawnie uzasadnionym interesie.
                </li>
                <li>
                  <strong className="text-white">Prawo do cofniecia zgody</strong>{" "}
                  &mdash; w dowolnym momencie, bez wplywu na zgodnosc z prawem
                  przetwarzania dokonanego przed cofnieciem zgody.
                </li>
                <li>
                  <strong className="text-white">
                    Prawo do wniesienia skargi do organu nadzorczego
                  </strong>{" "}
                  (art. 77 RODO) &mdash; prawo do zlozenia skargi do Prezesa Urzedu
                  Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa,{" "}
                  <a
                    href="https://uodo.gov.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    uodo.gov.pl
                  </a>
                  .
                </li>
              </ul>
              <p className="mt-3">
                W celu skorzystania z powyzszych praw nalezy skontaktowac sie z
                Administratorem pod adresem{" "}
                <a
                  href="mailto:kontakt@lunulaoil.pl"
                  className="text-brand-primary hover:underline"
                >
                  kontakt@lunulaoil.pl
                </a>
                .
              </p>
            </section>

            {/* VI. Odbiorcy danych */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VI. Odbiorcy danych
              </h2>
              <p className="mb-3">
                Dane osobowe moga byc przekazywane nastepujacym kategoriom
                odbiorcow:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Firmy kurierskie i operatorzy pocztowi &mdash; w celu realizacji
                  dostawy zamowien.
                </li>
                <li>
                  Operatorzy platnosci &mdash; w celu obslugi transakcji platniczych.
                </li>
                <li>
                  Dostawcy uslug hostingowych i IT &mdash; w celu utrzymania
                  infrastruktury technicznej Sklepu.
                </li>
                <li>
                  Biuro rachunkowe &mdash; w celu prowadzenia ksiegowosci.
                </li>
                <li>
                  Organy panstwowe &mdash; w przypadkach przewidzianych przepisami
                  prawa.
                </li>
              </ul>
            </section>

            {/* VII. Przekazywanie danych poza EOG */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VII. Przekazywanie danych poza Europejski Obszar Gospodarczy
              </h2>
              <p>
                W zwiazku z korzystaniem z uslug Google (Google Analytics) dane
                moga byc przekazywane do Stanow Zjednoczonych. Transfer danych
                odbywa sie na podstawie decyzji Komisji Europejskiej stwierdzajacej
                odpowiedni stopien ochrony (EU-US Data Privacy Framework) lub na
                podstawie standardowych klauzul umownych zatwierdzonych przez
                Komisje Europejska. Wiecej informacji:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  Polityka prywatnosci Google
                </a>
                .
              </p>
            </section>

            {/* VIII. Pliki cookies */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                VIII. Pliki cookies
              </h2>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  Sklep korzysta z plikow cookies (ciasteczek) &mdash; malych plikow
                  tekstowych zapisywanych na urzadzeniu Uzytkownika.
                </li>
                <li>
                  <strong className="text-white">
                    Kategorie plikow cookies:
                  </strong>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>
                      <strong className="text-white">Niezbedne</strong> &mdash;
                      wymagane do prawidlowego funkcjonowania Sklepu (sesja
                      uzytkownika, koszyk, bezpieczenstwo). Podstawa prawna: art. 6
                      ust. 1 lit. f RODO.
                    </li>
                    <li>
                      <strong className="text-white">Analityczne</strong> &mdash;
                      umozliwiaja zbieranie statystyk dotyczacych korzystania ze
                      Sklepu (np. Google Analytics). Wymagaja zgody uzytkownika.
                    </li>
                    <li>
                      <strong className="text-white">Marketingowe</strong> &mdash;
                      umozliwiaja wyswietlanie spersonalizowanych reklam. Wymagaja
                      zgody uzytkownika.
                    </li>
                  </ul>
                </li>
                <li>
                  Uzytkownik moze zarzadzac ustawieniami plikow cookies za pomoca
                  baneru cookies wyswietlanego przy pierwszej wizycie na stronie
                  lub poprzez ustawienia przegladarki internetowej.
                </li>
                <li>
                  Wylaczenie plikow cookies moze ograniczyc funkcjonalnosc Sklepu.
                </li>
              </ol>
            </section>

            {/* IX. Bezpieczenstwo */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                IX. Bezpieczenstwo danych
              </h2>
              <p>
                Administrator stosuje odpowiednie srodki techniczne i
                organizacyjne zapewniajace ochrone przetwarzanych danych osobowych,
                w tym szyfrowanie transmisji danych (SSL/TLS), ograniczenie dostepu
                do danych oraz regularne tworzenie kopii zapasowych.
              </p>
            </section>

            {/* X. Postanowienia koncowe */}
            <section>
              <h2 className="text-xl font-serif text-white mb-4">
                X. Postanowienia koncowe
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Administrator zastrzega sobie prawo do wprowadzania zmian w
                  Polityce Prywatnosci. O istotnych zmianach Uzytkownicy zostana
                  poinformowani za posrednictwem strony internetowej.
                </li>
                <li>
                  W sprawach nieuregulowanych niniejsza Polityka Prywatnosci
                  zastosowanie maja przepisy RODO oraz polskiego prawa ochrony
                  danych osobowych.
                </li>
                <li>
                  Niniejsza Polityka Prywatnosci obowiazuje od dnia 18.03.2026 r.
                </li>
              </ol>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
