import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import IngredientsModuleService from "../modules/ingredients/service"
import { INGREDIENTS_MODULE } from "../modules/ingredients"

const ingredientsData = [
  // ── Hydrating / Active ──────────────────────────────────────────────
  {
    name: "Kwas hialuronowy",
    name_latin: "Hyaluronic Acid",
    handle: "kwas-hialuronowy",
    description:
      "Kwas hialuronowy to naturalny polisacharyd obecny w skórze, zdolny zatrzymać nawet 1000-krotność swojej masy w wodzie. Głęboko nawilża, wypełnia drobne zmarszczki i przywraca skórze jędrność. Jest jednym z najskuteczniejszych składników nawilżających stosowanych we współczesnej kosmetyce.",
    benefits: [
      "Intensywne nawilżenie na wielu poziomach skóry",
      "Redukcja widoczności drobnych zmarszczek",
      "Wzmocnienie bariery hydrolipidowej",
      "Poprawa jędrności i elastyczności",
    ],
    source: "Otrzymywany biotechnologicznie w procesie fermentacji bakteryjnej",
    category: "hydrating",
    product_handles: ["hialcode"],
  },
  {
    name: "Skwalan",
    name_latin: "Squalane",
    handle: "skwalan",
    description:
      "Skwalan to lekki, stabilny lipid identyczny ze składnikiem naturalnie obecnym w sebum ludzkiej skóry. Doskonale nawilża bez uczucia tłustości, wzmacnia barierę ochronną i chroni przed utratą wody. Nadaje skórze jedwabistą gładkość i jest dobrze tolerowany nawet przez skórę wrażliwą.",
    benefits: [
      "Odbudowa płaszcza hydrolipidowego skóry",
      "Nawilżenie bez zatykania porów",
      "Ochrona przed transepidermalną utratą wody",
      "Wygładzenie i zmiękczenie skóry",
    ],
    source: "Pozyskiwany z oliwek lub trzciny cukrowej w procesie uwodornienia skwalenu",
    category: "hydrating",
    product_handles: ["squalanecode", "geranium-glow-moon-touch-cream", "golden-glow-solar-touch-cream"],
  },
  {
    name: "Allantoina",
    name_latin: "Allantoin",
    handle: "allantoina",
    description:
      "Allantoina to aktywny składnik o silnych właściwościach kojących i regenerujących. Łagodzi podrażnienia, przyspiesza odnowę naskórka i zmiękcza skórę. Jest bezpieczna nawet dla skóry atopowej i doskonale współdziała z innymi składnikami aktywnymi.",
    benefits: [
      "Kojenie podrażnień i zaczerwienień",
      "Stymulacja regeneracji naskórka",
      "Zmiękczanie i wygładzanie skóry",
      "Wsparcie gojenia drobnych uszkodzeń",
    ],
    source:
      "Występuje naturalnie w korzeniu żywokostu; w kosmetyce stosowana w formie syntetycznej",
    category: "active",
    product_handles: ["clear-ritual-pure-touch-cream"],
  },

  // ── Oleje ───────────────────────────────────────────────────────────
  {
    name: "Olej jojoba",
    name_latin: "Simmondsia Chinensis Seed Oil",
    handle: "olej-jojoba",
    description:
      "Olej jojoba to w rzeczywistości płynny wosk, którego struktura najbardziej przypomina naturalne sebum ludzkiej skóry. Reguluje wydzielanie sebum, nawilża bez obciążania i tworzy ochronną warstwę zapobiegającą utracie wody. Jest doskonale tolerowany przez każdy typ skóry, w tym cerę trądzikową.",
    benefits: [
      "Regulacja wydzielania sebum",
      "Długotrwałe nawilżenie bez uczucia tłustości",
      "Wzmacnianie naturalnej bariery ochronnej",
      "Ochrona przed czynnikami zewnętrznymi",
      "Odpowiedni dla skóry trądzikowej",
    ],
    source:
      "Tłoczony na zimno z nasion krzewu jojoba (Simmondsia chinensis) rosnącego na pustyniach Ameryki",
    category: "oil",
    product_handles: ["jojobacode", "lipidcode-30ml", "pelnia-ksiezyca-250ml"],
  },
  {
    name: "Olej ze słodkich migdałów",
    name_latin: "Prunus Amygdalus Dulcis Oil",
    handle: "olej-ze-slodkich-migdalow",
    description:
      "Olej migdałowy jest jednym z najdelikatniejszych olejów roślinnych, bogatym w witaminę E, kwasy tłuszczowe omega-6 i omega-9. Znakomicie zmiękcza, odżywia i łagodzi podrażnienia. Jest idealny dla skóry suchej, wrażliwej i dojrzałej.",
    benefits: [
      "Głębokie odżywienie i zmiękczenie skóry",
      "Łagodzenie podrażnień i świądu",
      "Poprawa elastyczności skóry",
      "Bogactwo witaminy E i kwasów tłuszczowych",
    ],
    source: "Tłoczony na zimno z nasion migdałowca zwyczajnego (Prunus dulcis)",
    category: "oil",
    product_handles: ["magnolia-250ml", "poranna-rosa-250ml"],
  },
  {
    name: "Olej z pestek winogron",
    name_latin: "Vitis Vinifera Seed Oil",
    handle: "olej-z-pestek-winogron",
    description:
      "Olej z pestek winogron to lekki olej bogaty w kwas linolowy i silne antyoksydanty, w tym proantocyjanidyny. Szybko się wchłania, nie zatyka porów i doskonale sprawdza się jako baza kosmetyczna. Chroni skórę przed wolnymi rodnikami i wspomaga jej regenerację.",
    benefits: [
      "Silna ochrona antyoksydacyjna",
      "Lekkość i szybkie wchłanianie",
      "Ściąganie i tonizacja porów",
      "Ochrona przed przedwczesnym starzeniem",
    ],
    source:
      "Tłoczony z pestek winogron (Vitis vinifera), często jako produkt uboczny winiarstwa",
    category: "oil",
    product_handles: ["ksiezyc-w-nowiu-250ml", "geranium-glow-moon-touch-cream", "clear-ritual-pure-touch-cream"],
  },
  {
    name: "Olej z makadamii",
    name_latin: "Macadamia Integrifolia Seed Oil",
    handle: "olej-z-makadamii",
    description:
      "Olej makadamia jest wyjątkowy dzięki wysokiej zawartości kwasu palmitooleinowego, którego ilość w skórze maleje z wiekiem. Intensywnie regeneruje, zmiękcza i przywraca elastyczność. Jest szczególnie cenny w pielęgnacji skóry dojrzałej i suchej.",
    benefits: [
      "Uzupełnianie kwasu palmitooleinowego w skórze",
      "Intensywna regeneracja skóry dojrzałej",
      "Przywracanie elastyczności i miękkości",
      "Ochrona przed przesuszeniem",
    ],
    source: "Tłoczony na zimno z orzechów makadamii pochodzących z Australii",
    category: "oil",
    product_handles: ["wschod-slonca-250ml", "ragnar-250ml"],
  },
  {
    name: "Olej awokado",
    name_latin: "Persea Gratissima Oil",
    handle: "olej-awokado",
    description:
      "Olej awokado jest jednym z najbardziej odżywczych olejów roślinnych, bogatym w witaminy A, D, E oraz sterole roślinne. Głęboko penetruje skórę, intensywnie ją odżywia i wspomaga syntezę kolagenu. Szczególnie polecany do pielęgnacji skóry suchej, szorstkiej i pozbawionej blasku.",
    benefits: [
      "Głębokie odżywienie i regeneracja",
      "Wspomaganie syntezy kolagenu",
      "Przywracanie naturalnego blasku skóry",
      "Wzmacnianie bariery lipidowej",
      "Łagodzenie suchości i szorstkości",
    ],
    source: "Tłoczony na zimno z miąższu owoców awokado (Persea americana)",
    category: "oil",
    product_handles: ["green-witch-divine-250ml"],
  },
  {
    name: "Olej z dzikiej róży",
    name_latin: "Rosa Canina Seed Oil",
    handle: "olej-z-dzikiej-rozy",
    description:
      "Olej z dzikiej róży jest ceniony za wysoką zawartość naturalnej witaminy A (retinolu) oraz kwasów tłuszczowych omega-3 i omega-6. Wspomaga regenerację skóry, redukuje przebarwienia i blizny, a także poprawia koloryt cery. Jest jednym z najcenniejszych olejów w pielęgnacji anti-age.",
    benefits: [
      "Redukcja przebarwień i blizn",
      "Naturalne źródło retinolu roślinnego",
      "Poprawa kolorytu i wyrównanie tonu skóry",
      "Wspomaganie regeneracji komórkowej",
    ],
    source:
      "Tłoczony na zimno z nasion dzikiej róży (Rosa canina), rosnącej dziko w Europie i Chile",
    category: "oil",
    product_handles: ["mokosza-mydlo-rytualne", "rose-alchemy-phyto-renew-cream"],
  },
  {
    name: "Olej konopny",
    name_latin: "Cannabis Sativa Seed Oil",
    handle: "olej-konopny",
    description:
      "Olej konopny wyróżnia się idealnym stosunkiem kwasów omega-6 do omega-3 (3:1), co czyni go wyjątkowo zbliżonym do lipidów skóry. Silnie nawilża, łagodzi stany zapalne i reguluje wydzielanie sebum. Doskonale sprawdza się w pielęgnacji skóry problematycznej, atopowej i ze skłonnością do trądziku.",
    benefits: [
      "Idealna proporcja kwasów omega-6 i omega-3",
      "Regulacja wydzielania sebum",
      "Łagodzenie stanów zapalnych skóry",
      "Wsparcie skóry atopowej i trądzikowej",
    ],
    source: "Tłoczony na zimno z nasion konopi siewnych (Cannabis sativa)",
    category: "oil",
    product_handles: ["clear-ritual-pure-touch-cream"],
  },
  {
    name: "Olej z rokitnika",
    name_latin: "Hippophae Rhamnoides Fruit Oil",
    handle: "olej-z-rokitnika",
    description:
      "Olej z rokitnika to jeden z najbogatszych roślinnych źródeł beta-karotenu, witaminy C i kwasów omega-7. Intensywnie regeneruje, przyspiesza gojenie drobnych ran i chroni skórę przed fotostarzeniem. Nadaje skórze zdrowy, naturalny blask i wspomaga jej odporność na czynniki zewnętrzne.",
    benefits: [
      "Intensywna regeneracja i przyspieszenie gojenia",
      "Bogactwo beta-karotenu i witaminy C",
      "Ochrona przed fotostarzeniem",
      "Nadawanie zdrowego blasku skórze",
      "Wzmocnienie naturalnej odporności skóry",
    ],
    source:
      "Pozyskiwany z owoców i nasion rokitnika zwyczajnego (Hippophae rhamnoides)",
    category: "oil",
    product_handles: ["golden-glow-solar-touch-cream"],
  },
  {
    name: "Olej z pestek malin",
    name_latin: "Rubus Idaeus Seed Oil",
    handle: "olej-z-pestek-malin",
    description:
      "Olej z pestek malin jest jednym z najskuteczniejszych naturalnych filtrów UV wśród olejów roślinnych. Bogaty w witaminę E, karotenoidy i kwas elagowy, oferuje silną ochronę antyoksydacyjną. Doskonale nawilża, regeneruje i chroni skórę przed przedwczesnym starzeniem.",
    benefits: [
      "Naturalna ochrona przed promieniowaniem UV",
      "Silne działanie antyoksydacyjne",
      "Regeneracja i nawilżenie skóry",
      "Ochrona przed przedwczesnym starzeniem",
    ],
    source: "Tłoczony na zimno z pestek malin (Rubus idaeus)",
    category: "oil",
    product_handles: ["golden-glow-solar-touch-cream"],
  },

  // ── Zioła ───────────────────────────────────────────────────────────
  {
    name: "Rumianek",
    name_latin: "Chamomilla Recutita",
    handle: "rumianek",
    description:
      "Rumianek pospolity to jedno z najstarszych i najlepiej przebadanych ziół leczniczych. Zawiera bisabolol i azulen, które silnie łagodzą podrażnienia, zaczerwienienia i stany zapalne. Jest niezastąpiony w pielęgnacji skóry wrażliwej, reaktywnej i skłonnej do alergii.",
    benefits: [
      "Silne działanie kojące i przeciwzapalne",
      "Redukcja zaczerwienień i podrażnień",
      "Łagodzenie skóry wrażliwej i reaktywnej",
      "Wsparcie gojenia drobnych uszkodzeń naskórka",
    ],
    source:
      "Kwiat rumianku pospolitego (Matricaria chamomilla), uprawiany i zbierany dziko w Europie",
    category: "herb",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "Lawenda",
    name_latin: "Lavandula Angustifolia",
    handle: "lawenda",
    description:
      "Lawenda wąskolistna jest ceniona za swoje wszechstronne właściwości kosmetyczne i aromaterapeutyczne. Olejek lawendowy łagodzi podrażnienia, reguluje wydzielanie sebum i wspomaga regenerację skóry. Jej uspokajający aromat działa relaksująco i pomaga w redukcji stresu.",
    benefits: [
      "Kojenie podrażnień i stanów zapalnych",
      "Regulacja wydzielania sebum",
      "Wspomaganie regeneracji skóry",
      "Relaksujące działanie aromaterapeutyczne",
      "Właściwości antyseptyczne",
    ],
    source:
      "Kwiaty lawendy wąskolistnej (Lavandula angustifolia), uprawianej głównie w Prowansji i na Bałkanach",
    category: "herb",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "May Chang",
    name_latin: "Litsea Cubeba",
    handle: "may-chang",
    description:
      "May Chang, znany też jako litsea cubeba, to egzotyczna roślina o intensywnym cytrusowo-kwiatowym aromacie. Olejek z jej owoców ma silne właściwości antyseptyczne, ściągające i rozjaśniające. Jest szczególnie polecany do pielęgnacji skóry tłustej i mieszanej.",
    benefits: [
      "Ściąganie i zmniejszanie widoczności porów",
      "Działanie antyseptyczne i oczyszczające",
      "Rozjaśnianie i wyrównywanie kolorytu skóry",
      "Energetyzujący, cytrusowy aromat",
    ],
    source:
      "Owoce drzewa Litsea cubeba, rosnącego dziko w południowo-wschodniej Azji",
    category: "herb",
    product_handles: ["rozyczka-mydlo-rytualne"],
  },
  {
    name: "Róża damasceńska",
    name_latin: "Rosa Damascena",
    handle: "roza-damascenska",
    description:
      "Róża damasceńska to jedna z najcenniejszych roślin w kosmetologii, ceniona za bogactwo składników aktywnych. Ekstrakt z jej płatków nawilża, regeneruje i działa przeciwstarzeniowo. Woda różana tonizuje i łagodzi, a olejek różany jest jednym z najdroższych surowców kosmetycznych na świecie.",
    benefits: [
      "Głębokie nawilżenie i tonizacja",
      "Działanie przeciwstarzeniowe i regenerujące",
      "Łagodzenie podrażnień i zaczerwienień",
      "Poprawa elastyczności skóry",
    ],
    source:
      "Płatki róży damasceńskiej (Rosa damascena), uprawianej głównie w Dolinie Róż w Bułgarii",
    category: "herb",
    product_handles: ["mokosza-mydlo-rytualne", "rozyczka-mydlo-rytualne"],
  },
  {
    name: "Hibiskus",
    name_latin: "Hibiscus Sabdariffa",
    handle: "hibiskus",
    description:
      "Hibiskus, nazywany roślinnym botoksem, jest bogaty w naturalne kwasy AHA, antocyjany i witaminę C. Delikatnie złuszcza, stymuluje produkcję kolagenu i wyraźnie poprawia jędrność skóry. Jego ekstrakt jest ceniony za działanie anti-age porównywalne z retinolem, lecz łagodniejsze dla skóry.",
    benefits: [
      "Naturalne złuszczanie dzięki kwasom AHA",
      "Stymulacja produkcji kolagenu",
      "Poprawa jędrności i sprężystości skóry",
      "Działanie anti-age bez podrażnień",
    ],
    source:
      "Kwiaty hibiskusa (Hibiscus sabdariffa), uprawianego w klimacie tropikalnym",
    category: "herb",
    product_handles: ["mokosza-mydlo-rytualne"],
  },
  {
    name: "Kora białej wierzby",
    name_latin: "Salix Alba Bark Extract",
    handle: "kora-bialej-wierzby",
    description:
      "Kora białej wierzby jest naturalnym źródłem salicyny - prekursora kwasu salicylowego. Delikatnie złuszcza, oczyszcza pory i reguluje wydzielanie sebum, nie podrażniając przy tym skóry. To doskonała, łagodna alternatywa dla syntetycznego BHA, idealna dla skóry wrażliwej ze skłonnością do niedoskonałości.",
    benefits: [
      "Naturalne, delikatne złuszczanie (BHA)",
      "Oczyszczanie i zmniejszanie porów",
      "Regulacja wydzielania sebum",
      "Działanie przeciwbakteryjne i przeciwzapalne",
    ],
    source:
      "Kora wierzby białej (Salix alba), pozyskiwana z drzew rosnących w Europie",
    category: "herb",
    product_handles: ["clear-ritual-pure-touch-cream"],
  },

  // ── Aktywne ─────────────────────────────────────────────────────────
  {
    name: "Bakuchiol",
    name_latin: "Bakuchiol",
    handle: "bakuchiol",
    description:
      "Bakuchiol to roślinny odpowiednik retinolu, pozyskiwany z nasion bakuczii. Stymuluje produkcję kolagenu, redukuje zmarszczki i przebarwienia, a w przeciwieństwie do retinolu nie powoduje podrażnień ani nadwrażliwości na słońce. Jest bezpieczny do stosowania w ciąży i przy skórze wrażliwej.",
    benefits: [
      "Roślinny odpowiednik retinolu bez skutków ubocznych",
      "Redukcja zmarszczek i drobnych linii",
      "Wyrównywanie kolorytu i redukcja przebarwień",
      "Bezpieczny dla skóry wrażliwej i w ciąży",
      "Stymulacja syntezy kolagenu",
    ],
    source:
      "Pozyskiwany z nasion babchi (Psoralea corylifolia), rośliny stosowanej od wieków w ajurwedzie",
    category: "active",
    product_handles: ["rose-alchemy-phyto-renew-cream"],
  },
  {
    name: "Koenzym Q10",
    name_latin: "Ubiquinone",
    handle: "koenzym-q10",
    description:
      "Koenzym Q10 to naturalny antyoksydant obecny w każdej komórce ludzkiego ciała, którego poziom spada z wiekiem. Neutralizuje wolne rodniki, wspomaga produkcję energii w komórkach skóry i zapobiega przedwczesnemu starzeniu. Jest jednym z kluczowych składników w pielęgnacji anti-age.",
    benefits: [
      "Silna ochrona antyoksydacyjna",
      "Wspomaganie produkcji energii komórkowej",
      "Redukcja widoczności zmarszczek",
      "Ochrona przed fotostarzeniem",
    ],
    source:
      "Występuje naturalnie w organizmie; w kosmetyce stosowany w formie biotechnologicznej",
    category: "active",
    product_handles: ["rose-alchemy-phyto-renew-cream"],
  },

  // ── Glinka ──────────────────────────────────────────────────────────
  {
    name: "Glinka różowa",
    name_latin: "Kaolin + Illite",
    handle: "glinka-rozowa",
    description:
      "Glinka różowa to mieszanka glinki białej (kaolin) i czerwonej (illite), łącząca delikatność z mineralizacją. Oczyszcza pory bez przesuszania, wygładza naskórek i poprawia mikrocyrkulację. Jest idealna dla skóry wrażliwej, której potrzebne jest delikatne oczyszczanie i odżywienie minerałami.",
    benefits: [
      "Delikatne oczyszczanie bez przesuszania",
      "Poprawa mikrocyrkulacji i kolorytu",
      "Wygładzenie i zmiękczenie naskórka",
      "Bogactwo minerałów odżywiających skórę",
    ],
    source:
      "Naturalna mieszanka glinki białej i czerwonej, pozyskiwana z europejskich złóż mineralnych",
    category: "clay",
    product_handles: ["mokosza-mydlo-rytualne", "rozyczka-mydlo-rytualne"],
  },

  // ── Eksfolianty ─────────────────────────────────────────────────────
  {
    name: "Płatki owsiane",
    name_latin: "Avena Sativa",
    handle: "platki-owsiane",
    description:
      "Płatki owsiane są naturalnym, niezwykle delikatnym eksfoliantem bogatym w beta-glukan, avenantramidy i lipidy. Łagodnie usuwają martwy naskórek, jednocześnie kojąc i nawilżając skórę. Są polecane przez dermatologów nawet dla skóry atopowej i z tendencją do egzemy.",
    benefits: [
      "Delikatny peeling mechaniczny bez mikrouszkodzeń",
      "Kojenie i nawilżenie dzięki beta-glukanowi",
      "Wzmacnianie bariery ochronnej skóry",
      "Łagodzenie świądu i podrażnień",
    ],
    source:
      "Mielone ziarna owsa zwyczajnego (Avena sativa), uprawianego w klimacie umiarkowanym",
    category: "exfoliant",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "Kawa",
    name_latin: "Coffea Arabica",
    handle: "kawa",
    description:
      "Kawa jest naturalnym eksfoliantem i silnym antyoksydantem bogatym w kofeinę, kwas chlorogenowy i polifenole. Pobudza mikrocyrkulację, redukuje obrzęki i poprawia jędrność skóry. Zmielone ziarna kawy stanowią skuteczny peeling mechaniczny, który nadaje skórze gładkość i zdrowy blask.",
    benefits: [
      "Pobudzenie mikrocyrkulacji i redukcja obrzęków",
      "Skuteczny peeling mechaniczny",
      "Silna ochrona antyoksydacyjna",
      "Poprawa jędrności i napięcia skóry",
      "Redukcja widoczności cellulitu",
    ],
    source:
      "Zmielone ziarna kawowca arabskiego (Coffea arabica), uprawianego w strefie międzyzwrotnikowej",
    category: "exfoliant",
    product_handles: ["mokosza-mydlo-rytualne", "slow-coffee-cream"],
  },

  // ── Nowe składniki ──────────────────────────────────────────────────
  {
    name: "Oliwa z oliwek",
    name_latin: "Olea Europaea Fruit Oil",
    handle: "oliwa-z-oliwek",
    description:
      "Oliwa z oliwek to jeden z najstarszych kosmetycznych olejow roslinnych, bogaty w kwas oleinowy, witamine E, skwalen i polifenole. Glebooko odzywia, zmiekcza i chroni skore przed utrata wilgoci. Wzmacnia bariere hydrolipidowa i wspiera naturalna regeneracje naskorka.",
    benefits: [
      "Glebokie odzywienie i zmiekczanie skory",
      "Wzmocnienie bariery hydrolipidowej",
      "Ochrona antyoksydacyjna dzieki witaminie E i polifenolom",
      "Lagodzenie podraznien i suchosci",
    ],
    source:
      "Tloczony na zimno z owocow drzewa oliwnego (Olea europaea), uprawianego w basenie Morza Srodziemnego",
    category: "oil",
    product_handles: ["rusalka-mydlo-rytualne", "rozyczka-mydlo-rytualne", "mokosza-mydlo-rytualne"],
  },
  {
    name: "Olej kokosowy",
    name_latin: "Cocos Nucifera Oil",
    handle: "olej-kokosowy",
    description:
      "Olej kokosowy jest bogaty w kwas laurynowy, ktory wykazuje wlasciwosci antybakteryjne i przeciwgrzybicze. Tworzy na skorze ochronna warstwe, ktora zapobiega utracie wilgoci, jednoczesnie zmiekczajac i wygladzajac naskorek. W mydle nadaje konsystencje i pyszna piane.",
    benefits: [
      "Wlasciwosci antybakteryjne dzieki kwasowi laurynowemu",
      "Zmiekczanie i wygladzanie skory",
      "Ochrona przed utrata wilgoci",
      "Wspiera tworzenie gęstej, kremowej piany w mydle",
    ],
    source:
      "Tłoczony na zimno z miąższu orzecha kokosowego (Cocos nucifera), uprawianego w strefie tropikalnej",
    category: "oil",
    product_handles: ["rusalka-mydlo-rytualne", "rozyczka-mydlo-rytualne", "mokosza-mydlo-rytualne"],
  },
  {
    name: "Masło shea",
    name_latin: "Butyrospermum Parkii Butter",
    handle: "maslo-shea",
    description:
      "Masło shea to bogaty w kwasy tłuszczowe i witaminy A, E, F naturalny emolient pozyskiwany z orzechów drzewa shea. Głęboko odżywia, regeneruje i chroni skórę przed czynnikami zewnętrznymi. Tworzy na skórze delikatny film ochronny bez efektu okluzji.",
    benefits: [
      "Głębokie odżywienie i regeneracja suchej skóry",
      "Ochrona przed czynnikami zewnętrznymi",
      "Przywracanie elastyczności i miękkości",
      "Łagodzenie podrażnień i stanów zapalnych",
    ],
    source:
      "Pozyskiwane z orzechów drzewa masłowego (Vitellaria paradoxa), rosnącego w Afryce Zachodniej",
    category: "oil",
    product_handles: ["rusalka-mydlo-rytualne", "rozyczka-mydlo-rytualne", "mokosza-mydlo-rytualne"],
  },
  {
    name: "Geranium",
    name_latin: "Pelargonium Graveolens Oil",
    handle: "geranium",
    description:
      "Olejek geraniowy to jeden z najcenniejszych olejków eterycznych w kosmetyce naturalnej. Reguluje wydzielanie sebum, łagodzi podrażnienia i wspiera regenerację skóry. Jego kwiatowy, lekko ziołowy aromat działa równoważąco na emocje i wspomaga relaksację.",
    benefits: [
      "Regulacja wydzielania sebum",
      "Łagodzenie podrażnień i zaczerwienień",
      "Wsparcie regeneracji i elastyczności skóry",
      "Aromaterapeutyczne działanie równoważące",
    ],
    source:
      "Destylowany z liści i łodyg pelargonii pachnącej (Pelargonium graveolens), uprawianej m.in. na Madagaskarze i w Egipcie",
    category: "herb",
    product_handles: ["geranium-glow-moon-touch-cream"],
  },
  {
    name: "Pomarańcza słodka",
    name_latin: "Citrus Aurantium Dulcis Peel Oil",
    handle: "pomarancza-slodka",
    description:
      "Olejek ze skórki pomarańczy słodkiej jest bogaty w limonen — naturalny składnik o właściwościach antyoksydacyjnych i rozświetlających. Pobudza mikrocyrkulację, wyrównuje koloryt skóry i nadaje jej zdrowy blask. Jego cytrusowy aromat podnosi nastrój i dodaje energii.",
    benefits: [
      "Rozświetlanie i wyrównywanie kolorytu skóry",
      "Pobudzenie mikrocyrkulacji",
      "Ochrona antyoksydacyjna",
      "Aromaterapeutyczne działanie energetyzujące",
    ],
    source:
      "Tłoczony na zimno ze skórek pomarańczy słodkiej (Citrus sinensis / Citrus aurantium dulcis)",
    category: "herb",
    product_handles: ["rozyczka-mydlo-rytualne"],
  },
]

export default async function seedIngredients({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const ingredientsService: IngredientsModuleService =
    container.resolve(INGREDIENTS_MODULE)

  logger.info("Starting ingredient seed for Lunula Botanique...")

  // Step 1: Delete existing ingredients for idempotency
  const existing = await ingredientsService.listIngredients({}, { take: 200 })
  if (existing.length > 0) {
    const existingIds = existing.map((i) => i.id)
    logger.info(`Deleting ${existingIds.length} existing ingredients...`)
    await ingredientsService.deleteIngredients(existingIds)
    logger.info("Existing ingredients deleted.")
  }

  // Step 2: Create all ingredients
  logger.info(`Creating ${ingredientsData.length} ingredients...`)
  const created = await ingredientsService.createIngredients(ingredientsData)
  logger.info(`Successfully created ${created.length} ingredients.`)

  // Step 3: Log summary by category
  const categories = ingredientsData.reduce(
    (acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  logger.info("Summary by category:")
  for (const [category, count] of Object.entries(categories)) {
    logger.info(`  ${category}: ${count}`)
  }

  for (const ingredient of created) {
    logger.info(`  + ${ingredient.name} [${ingredient.handle}]`)
  }

  logger.info("Ingredient seed completed.")
}
