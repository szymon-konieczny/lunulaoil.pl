import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności sklepu Lunula Botanique. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-background">
      <section className="py-16 small:py-24">
        <div className="content-container max-w-3xl mx-auto">
          <h1 className="text-3xl small:text-4xl font-serif font-semibold text-brand-text mb-12 text-center">
            Polityka prywatności
          </h1>

          <div className="space-y-10 text-brand-text-muted text-sm leading-relaxed">
            {/* I. Administrator danych */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                I. Administrator danych osobowych
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Administratorem danych osobowych zbieranych za pośrednictwem
                  sklepu internetowego lunulaoil.pl jest LUNULA SKIN CARE RYSZARD
                  SZULAKOWSKI, ul. Ametystowa 1a, 52-215 Wrocław, NIP:
                  7521195027, REGON: 531232096 (dalej: &bdquo;Administrator&rdquo;).
                </li>
                <li>
                  Kontakt z Administratorem w sprawach dotyczących ochrony danych
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
                    <li>Adres korespondencyjny: ul. Ametystowa 1a, 52-215 Wrocław</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* II. Podstawy prawne przetwarzania */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                II. Podstawy prawne przetwarzania danych
              </h2>
              <p className="mb-3">
                Dane osobowe są przetwarzane zgodnie z Rozporządzeniem Parlamentu
                Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w
                sprawie ochrony osób fizycznych w związku z przetwarzaniem danych
                osobowych (RODO) na następujących podstawach prawnych:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-brand-text">Art. 6 ust. 1 lit. b RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbędne do wykonania umowy (realizacja
                  zamówień, obsługa konta klienta).
                </li>
                <li>
                  <strong className="text-brand-text">Art. 6 ust. 1 lit. c RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbędne do wypełnienia obowiązku
                  prawnego (księgowość, faktury, przepisy podatkowe).
                </li>
                <li>
                  <strong className="text-brand-text">Art. 6 ust. 1 lit. a RODO</strong>{" "}
                  &mdash; osoba, której dane dotyczą, wyraziła zgodę na przetwarzanie
                  (newsletter, marketing).
                </li>
                <li>
                  <strong className="text-brand-text">Art. 6 ust. 1 lit. f RODO</strong>{" "}
                  &mdash; przetwarzanie jest niezbędne do celów wynikających z prawnie
                  uzasadnionych interesów Administratora (obsługa zapytań, analityka,
                  dochodzenie roszczeń).
                </li>
              </ul>
            </section>

            {/* III. Cele i zakres przetwarzania */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                III. Cele i zakres przetwarzania danych
              </h2>
              <p className="mb-3">
                Administrator przetwarza dane osobowe w następujących celach:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Realizacja zamówień &mdash; imię, nazwisko, adres dostawy, adres
                  e-mail, numer telefonu, dane do faktury.
                </li>
                <li>
                  Prowadzenie konta klienta &mdash; imię, nazwisko, adres e-mail,
                  historia zamówień.
                </li>
                <li>
                  Wysyłka newslettera &mdash; adres e-mail (na podstawie dobrowolnej
                  zgody).
                </li>
                <li>
                  Obsługa zapytań i reklamacji &mdash; dane kontaktowe, treść
                  korespondencji.
                </li>
                <li>
                  Cele analityczne i statystyczne &mdash; dane o aktywności na stronie
                  (pliki cookies).
                </li>
                <li>
                  Wypełnienie obowiązków prawnych &mdash; dane wymagane przepisami
                  podatkowymi i rachunkowymi.
                </li>
              </ul>
            </section>

            {/* IV. Okres przechowywania */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                IV. Okres przechowywania danych
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Dane związane z realizacją zamówień &mdash; przez okres niezbędny do
                  realizacji umowy, a następnie przez okres wymagany przepisami
                  prawa (5 lat od końca roku podatkowego).
                </li>
                <li>
                  Dane konta klienta &mdash; do czasu usunięcia konta przez Klienta.
                </li>
                <li>
                  Dane przetwarzane na podstawie zgody (newsletter) &mdash; do czasu
                  cofnięcia zgody.
                </li>
                <li>
                  Dane przetwarzane na podstawie prawnie uzasadnionego interesu
                  &mdash; do czasu wniesienia skutecznego sprzeciwu lub ustania celu
                  przetwarzania.
                </li>
                <li>
                  Dane z plików cookies &mdash; zgodnie z parametrami poszczególnych
                  plików (sesyjne: do zamknięcia przeglądarki; trwałe: do 24
                  miesięcy).
                </li>
              </ul>
            </section>

            {/* V. Prawa osób */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                V. Prawa osób, których dane dotyczą
              </h2>
              <p className="mb-3">
                Zgodnie z RODO, każdej osobie, której dane są przetwarzane,
                przysługują następujące prawa:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-brand-text">Prawo dostępu</strong> (art. 15
                  RODO) &mdash; prawo do uzyskania informacji o przetwarzanych danych
                  oraz kopii danych.
                </li>
                <li>
                  <strong className="text-brand-text">Prawo do sprostowania</strong>{" "}
                  (art. 16 RODO) &mdash; prawo do żądania poprawienia nieprawidłowych
                  lub uzupełnienia niekompletnych danych.
                </li>
                <li>
                  <strong className="text-brand-text">
                    Prawo do usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;)
                  </strong>{" "}
                  (art. 17 RODO) &mdash; prawo do żądania usunięcia danych, gdy nie są
                  już niezbędne do celów przetwarzania.
                </li>
                <li>
                  <strong className="text-brand-text">
                    Prawo do ograniczenia przetwarzania
                  </strong>{" "}
                  (art. 18 RODO) &mdash; prawo do żądania ograniczenia przetwarzania
                  danych w określonych przypadkach.
                </li>
                <li>
                  <strong className="text-brand-text">
                    Prawo do przenoszenia danych
                  </strong>{" "}
                  (art. 20 RODO) &mdash; prawo do otrzymania danych w
                  ustrukturyzowanym formacie i przekazania ich innemu
                  administratorowi.
                </li>
                <li>
                  <strong className="text-brand-text">Prawo do sprzeciwu</strong>{" "}
                  (art. 21 RODO) &mdash; prawo do wniesienia sprzeciwu wobec
                  przetwarzania opartego na prawnie uzasadnionym interesie.
                </li>
                <li>
                  <strong className="text-brand-text">Prawo do cofnięcia zgody</strong>{" "}
                  &mdash; w dowolnym momencie, bez wpływu na zgodność z prawem
                  przetwarzania dokonanego przed cofnięciem zgody.
                </li>
                <li>
                  <strong className="text-brand-text">
                    Prawo do wniesienia skargi do organu nadzorczego
                  </strong>{" "}
                  (art. 77 RODO) &mdash; prawo do złożenia skargi do Prezesa Urzędu
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
                W celu skorzystania z powyższych praw należy skontaktować się z
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
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VI. Odbiorcy danych
              </h2>
              <p className="mb-3">
                Dane osobowe mogą być przekazywane następującym kategoriom
                odbiorców:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Firmy kurierskie i operatorzy pocztowi &mdash; w celu realizacji
                  dostawy zamówień.
                </li>
                <li>
                  Operatorzy płatności &mdash; w celu obsługi transakcji płatniczych.
                </li>
                <li>
                  Dostawcy usług hostingowych i IT &mdash; w celu utrzymania
                  infrastruktury technicznej Sklepu.
                </li>
                <li>
                  Biuro rachunkowe &mdash; w celu prowadzenia księgowości.
                </li>
                <li>
                  Organy państwowe &mdash; w przypadkach przewidzianych przepisami
                  prawa.
                </li>
              </ul>
            </section>

            {/* VII. Przekazywanie danych poza EOG */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VII. Przekazywanie danych poza Europejski Obszar Gospodarczy
              </h2>
              <p>
                W związku z korzystaniem z usług Google (Google Analytics) dane
                mogą być przekazywane do Stanów Zjednoczonych. Transfer danych
                odbywa się na podstawie decyzji Komisji Europejskiej stwierdzającej
                odpowiedni stopień ochrony (EU-US Data Privacy Framework) lub na
                podstawie standardowych klauzul umownych zatwierdzonych przez
                Komisję Europejską. Więcej informacji:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  Polityka prywatności Google
                </a>
                .
              </p>
            </section>

            {/* VIII. Pliki cookies */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                VIII. Pliki cookies
              </h2>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  Sklep korzysta z plików cookies (ciasteczek) &mdash; małych plików
                  tekstowych zapisywanych na urządzeniu Użytkownika.
                </li>
                <li>
                  <strong className="text-brand-text">
                    Kategorie plików cookies:
                  </strong>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>
                      <strong className="text-brand-text">Niezbędne</strong> &mdash;
                      wymagane do prawidłowego funkcjonowania Sklepu (sesja
                      użytkownika, koszyk, bezpieczeństwo). Podstawa prawna: art. 6
                      ust. 1 lit. f RODO.
                    </li>
                    <li>
                      <strong className="text-brand-text">Analityczne</strong> &mdash;
                      umożliwiają zbieranie statystyk dotyczących korzystania ze
                      Sklepu (np. Google Analytics). Wymagają zgody użytkownika.
                    </li>
                    <li>
                      <strong className="text-brand-text">Marketingowe</strong> &mdash;
                      umożliwiają wyświetlanie spersonalizowanych reklam. Wymagają
                      zgody użytkownika.
                    </li>
                  </ul>
                </li>
                <li>
                  Użytkownik może zarządzać ustawieniami plików cookies za pomocą
                  baneru cookies wyświetlanego przy pierwszej wizycie na stronie
                  lub poprzez ustawienia przeglądarki internetowej.
                </li>
                <li>
                  Wyłączenie plików cookies może ograniczyć funkcjonalność Sklepu.
                </li>
              </ol>
            </section>

            {/* IX. Bezpieczeństwo */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                IX. Bezpieczeństwo danych
              </h2>
              <p>
                Administrator stosuje odpowiednie środki techniczne i
                organizacyjne zapewniające ochronę przetwarzanych danych osobowych,
                w tym szyfrowanie transmisji danych (SSL/TLS), ograniczenie dostępu
                do danych oraz regularne tworzenie kopii zapasowych.
              </p>
            </section>

            {/* X. Postanowienia końcowe */}
            <section>
              <h2 className="text-xl font-serif text-brand-text mb-4">
                X. Postanowienia końcowe
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Administrator zastrzega sobie prawo do wprowadzania zmian w
                  Polityce Prywatności. O istotnych zmianach Użytkownicy zostaną
                  poinformowani za pośrednictwem strony internetowej.
                </li>
                <li>
                  W sprawach nieuregulowanych niniejszą Polityką Prywatności
                  zastosowanie mają przepisy RODO oraz polskiego prawa ochrony
                  danych osobowych.
                </li>
                <li>
                  Niniejsza Polityka Prywatności obowiązuje od dnia 18.03.2026 r.
                </li>
              </ol>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
