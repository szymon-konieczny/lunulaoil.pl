import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type IngredientInput = {
  name: string
  name_latin: string | null
  handle: string
  description: string
  benefits: string[]
  source: string
  category: string
  product_handles: string[]
}

const ingredients: IngredientInput[] = [
  {
    name: "Kwas hialuronowy",
    name_latin: "Hyaluronic Acid",
    handle: "kwas-hialuronowy",
    description:
      "Kwas hialuronowy to naturalny polisacharyd obecny w naszej skórze, odpowiedzialny za jej nawilżenie i elastyczność. Jedna cząsteczka potrafi zatrzymać nawet 1000-krotność swojej masy w wodzie, co czyni go jednym z najskuteczniejszych składników nawilżających. W biozgodnej pielęgnacji stanowi fundament głębokiego nawilżenia bez obciążania skóry.",
    benefits: [
      "Intensywne nawilżenie na wielu poziomach skóry",
      "Wygładzenie drobnych linii i zmarszczek",
      "Wzmocnienie bariery hydrolipidowej",
      "Poprawa elastyczności i jędrności skóry",
    ],
    source: "Otrzymywany na drodze biotechnologicznej fermentacji bakteryjnej",
    category: "hydrating",
    product_handles: ["hialcode"],
  },
  {
    name: "Skwalan",
    name_latin: "Squalane",
    handle: "skwalan",
    description:
      "Skwalan to stabilna forma skwalenu — lipidu naturalnie obecnego w sebum ludzkiej skóry. Dzięki swojej biozgodności doskonale wtapia się w naturalny płaszcz lipidowy, nie zatykając porów. Jest lekki, bezzapachowy i idealny nawet dla skóry wrażliwej oraz skłonnej do wyprysków.",
    benefits: [
      "Odbudowa i wzmocnienie płaszcza lipidowego skóry",
      "Nawilżenie bez efektu tłustości",
      "Ochrona przed utratą wody transepidermalnej",
      "Wygładzenie i zmiękczenie skóry",
    ],
    source: "Pozyskiwany z oliwek lub trzciny cukrowej metodą uwodornienia",
    category: "hydrating",
    product_handles: ["squalanecode", "geranium-glow-50ml", "golden-glow-50ml"],
  },
  {
    name: "Olej jojoba",
    name_latin: "Simmondsia Chinensis Seed Oil",
    handle: "olej-jojoba",
    description:
      "Olej jojoba to w rzeczywistości płynny wosk, którego struktura najbardziej przypomina naturalne sebum ludzkiej skóry. Dzięki temu jest doskonale tolerowany przez każdy typ cery i pomaga regulować produkcję łoju. W biozgodnej pielęgnacji pełni rolę uniwersalnego składnika balansującego.",
    benefits: [
      "Regulacja wydzielania sebum",
      "Głębokie odżywienie bez zatykania porów",
      "Ochrona skóry przed utratą wilgoci",
      "Łagodzenie podrażnień i zaczerwienień",
      "Wsparcie naturalnej bariery ochronnej skóry",
    ],
    source: "Tłoczony na zimno z nasion krzewu jojoba (Simmondsia chinensis)",
    category: "oil",
    product_handles: ["jojobacode", "lipidcode-30ml", "pelnia-ksiezyca-250ml"],
  },
  {
    name: "Olej ze słodkich migdałów",
    name_latin: "Prunus Amygdalus Dulcis Oil",
    handle: "olej-ze-slodkich-migdalow",
    description:
      "Olej ze słodkich migdałów to jeden z najdelikatniejszych olejów roślinnych, bogaty w witaminę E, kwasy tłuszczowe omega-6 i omega-9. Doskonale zmiękcza i wygładza skórę, jednocześnie ją odżywiając. Jest biozgodny i bezpieczny nawet dla skóry niemowląt.",
    benefits: [
      "Zmiękczanie i wygładzanie suchej skóry",
      "Odżywienie witaminą E i kwasami tłuszczowymi",
      "Łagodzenie podrażnień i swędzenia",
      "Poprawa kolorytu i elastyczności skóry",
    ],
    source: "Tłoczony na zimno z nasion migdałowca (Prunus dulcis)",
    category: "oil",
    product_handles: ["poranna-rosa-250ml", "magnolia-250ml"],
  },
  {
    name: "Olej z pestek winogron",
    name_latin: "Vitis Vinifera Seed Oil",
    handle: "olej-z-pestek-winogron",
    description:
      "Olej z pestek winogron jest bogaty w kwas linolowy i proantocyjanidyny — silne antyoksydanty chroniące skórę przed wolnymi rodnikami. Jego lekka konsystencja sprawia, że szybko się wchłania, nie pozostawiając tłustego filmu. Idealny dla skóry mieszanej i tłustej.",
    benefits: [
      "Ochrona antyoksydacyjna przed wolnymi rodnikami",
      "Lekkie nawilżenie bez obciążania skóry",
      "Zwężenie rozszerzonych porów",
      "Regulacja wydzielania sebum w skórze tłustej",
    ],
    source: "Pozyskiwany z pestek winogron (Vitis vinifera) jako produkt uboczny winiarstwa",
    category: "oil",
    product_handles: [
      "ksiezyc-w-nowiu-250ml",
      "geranium-glow-50ml",
      "clear-ritual-50ml",
    ],
  },
  {
    name: "Olej z makadamii",
    name_latin: "Macadamia Integrifolia Seed Oil",
    handle: "olej-z-makadamii",
    description:
      "Olej z makadamii wyróżnia się wysoką zawartością kwasu palmitooleinowego — rzadkiego kwasu tłuszczowego, którego ilość w naszej skórze maleje z wiekiem. Dzięki temu doskonale regeneruje skórę dojrzałą i suchą. Jego jedwabista konsystencja sprawia, że jest wyjątkowo przyjemny w aplikacji.",
    benefits: [
      "Regeneracja skóry dojrzałej i suchej",
      "Uzupełnienie kwasu palmitooleinowego",
      "Przywracanie elastyczności i miękkości",
      "Ochrona przed przesuszeniem i pękaniem skóry",
    ],
    source: "Tłoczony na zimno z orzechów makadamia (Macadamia integrifolia)",
    category: "oil",
    product_handles: ["wschod-slonca-250ml", "ragnar-250ml"],
  },
  {
    name: "Olej awokado",
    name_latin: "Persea Gratissima Oil",
    handle: "olej-awokado",
    description:
      "Olej awokado jest jednym z najbogatszych olejów roślinnych — zawiera witaminy A, D, E, lecytynę oraz fitosterole. Głęboko wnika w skórę, odżywiając ją i wspierając naturalną regenerację. W biozgodnej pielęgnacji ceniony za zdolność do odbudowy uszkodzonej bariery skórnej.",
    benefits: [
      "Głębokie odżywienie skóry suchej i odwodnionej",
      "Wsparcie regeneracji bariery lipidowej",
      "Ochrona przed stresem oksydacyjnym",
      "Łagodzenie stanów zapalnych skóry",
      "Poprawa wchłaniania innych składników aktywnych",
    ],
    source: "Tłoczony na zimno z miąższu owoców awokado (Persea americana)",
    category: "oil",
    product_handles: ["green-witch-divine-250ml"],
  },
  {
    name: "Rumianek",
    name_latin: "Chamomilla Recutita Extract",
    handle: "rumianek",
    description:
      "Rumianek pospolity to jedna z najcenniejszych roślin w tradycyjnej fitoterapii europejskiej, znana ze swoich właściwości łagodzących i przeciwzapalnych. Bisabolol i azulen obecne w rumianku skutecznie uspokajają podrażnioną skórę. W biozgodnej pielęgnacji stanowi naturalną alternatywę dla syntetycznych środków kojących.",
    benefits: [
      "Łagodzenie podrażnień i zaczerwienień",
      "Działanie przeciwzapalne i antybakteryjne",
      "Uspokajanie skóry wrażliwej i reaktywnej",
      "Wsparcie naturalnych procesów gojenia",
    ],
    source: "Ekstrakt z kwiatów rumianku pospolitego (Matricaria chamomilla)",
    category: "herb",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "Lawenda",
    name_latin: "Lavandula Angustifolia Oil",
    handle: "lawenda",
    description:
      "Lawenda wąskolistna to aromatyczna roślina o szerokim spektrum działania w pielęgnacji skóry. Olejek lawendowy łączy właściwości antyseptyczne z głębokim działaniem relaksującym, wspierając jednocześnie regenerację skóry. W rytuałach pielęgnacyjnych pomaga wyciszyć zmysły i przywrócić równowagę.",
    benefits: [
      "Działanie antyseptyczne i oczyszczające",
      "Wsparcie regeneracji drobnych uszkodzeń skóry",
      "Efekt relaksacyjny i aromaterapeutyczny",
      "Regulacja wydzielania sebum",
    ],
    source: "Olejek eteryczny destylowany z kwiatów lawendy wąskolistnej",
    category: "herb",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "Płatki owsiane",
    name_latin: "Avena Sativa Kernel",
    handle: "platki-owsiane",
    description:
      "Płatki owsiane to naturalny składnik o wyjątkowych właściwościach kojących i peelingujących, stosowany w pielęgnacji skóry od stuleci. Zawierają beta-glukan, awenantramidy i saponiny, które łagodzą podrażnienia. Delikatnie złuszczają martwy naskórek, jednocześnie nie naruszając bariery ochronnej skóry.",
    benefits: [
      "Delikatne złuszczanie bez podrażniania skóry",
      "Kojenie skóry wrażliwej i atopowej",
      "Naturalne nawilżenie dzięki beta-glukanowi",
      "Oczyszczanie porów z zanieczyszczeń",
    ],
    source: "Mielone ziarna owsa zwyczajnego (Avena sativa) z upraw ekologicznych",
    category: "exfoliant",
    product_handles: ["rusalka-mydlo-rytualne"],
  },
  {
    name: "Glinka różowa",
    name_latin: "Illite / Kaolin",
    handle: "glinka-rozowa",
    description:
      "Glinka różowa to naturalna mieszanka glinki białej (kaolin) i czerwonej (illit), łącząca delikatne oczyszczanie z odżywieniem minerałami. Jest najłagodniejszą z glinek, idealną nawet dla cery naczynkowej i wrażliwej. Bogata w krzem, magnez i żelazo, wspiera naturalną regenerację naskórka.",
    benefits: [
      "Delikatne oczyszczanie bez przesuszania",
      "Odżywienie skóry minerałami",
      "Wygładzenie i rozświetlenie kolorytu cery",
      "Poprawa mikrokrążenia w skórze",
    ],
    source: "Naturalna glinka mineralna wydobywana w regionach wulkanicznych Francji",
    category: "clay",
    product_handles: ["rozyczka-mydlo-rytualne"],
  },
  {
    name: "May Chang",
    name_latin: "Litsea Cubeba Oil",
    handle: "may-chang",
    description:
      "May Chang (Litsea cubeba) to azjatycka roślina o cytrusowym, ożywczym aromacie, ceniona w aromaterapii za właściwości podnoszące nastrój. Olejek z jej owoców zawiera cytral — substancję o działaniu antybakteryjnym i tonizującym. W biozgodnej pielęgnacji łączy korzyści dla skóry z rytuałem aromaterapeutycznym.",
    benefits: [
      "Tonizacja i ożywienie zmęczonej skóry",
      "Działanie antybakteryjne i oczyszczające",
      "Regulacja wydzielania sebum",
      "Ożywczy, cytrusowy aromat w rytuałach pielęgnacyjnych",
    ],
    source: "Olejek eteryczny destylowany z owoców drzewa Litsea cubeba",
    category: "herb",
    product_handles: ["rozyczka-mydlo-rytualne"],
  },
  {
    name: "Róża damasceńska",
    name_latin: "Rosa Damascena Flower Oil",
    handle: "roza-damascenska",
    description:
      "Róża damasceńska to królowa wśród kwiatów stosowanych w kosmetologii — jej olejek eteryczny wymaga około 4 ton płatków do produkcji jednego kilograma. Posiada wyjątkowe właściwości regenerujące, nawilżające i przeciwstarzeniowe. W biozgodnej pielęgnacji stanowi symbol luksusu połączonego z naturą.",
    benefits: [
      "Intensywna regeneracja i odmłodzenie skóry",
      "Głębokie nawilżenie i wygładzenie",
      "Redukcja zaczerwienień i podrażnień",
      "Harmonizujący aromat wspierający rytuały pielęgnacyjne",
    ],
    source: "Olejek eteryczny destylowany z płatków róży damasceńskiej (Rosa damascena)",
    category: "herb",
    product_handles: ["rozyczka-mydlo-rytualne"],
  },
  {
    name: "Kawa",
    name_latin: "Coffea Arabica Seed Powder",
    handle: "kawa",
    description:
      "Kawa to nie tylko poranny rytuał — zmielone ziarna Coffea arabica to także skuteczny składnik aktywny w pielęgnacji skóry. Kofeina pobudza mikrokrążenie, redukuje obrzęki i wspiera drenowanie toksyn. Drobinki kawy działają jako naturalny peeling mechaniczny, pozostawiając skórę gładką i rozświetloną.",
    benefits: [
      "Pobudzenie mikrokrążenia i redukcja obrzęków",
      "Naturalny peeling mechaniczny",
      "Działanie antyoksydacyjne i ochronne",
      "Wygładzenie i ujędrnienie skóry",
      "Redukcja widoczności cellulitu",
    ],
    source: "Drobno zmielone ziarna kawy arabica z upraw organicznych",
    category: "exfoliant",
    product_handles: ["mokosza-mydlo-rytualne", "slow-coffee-cream"],
  },
  {
    name: "Hibiskus",
    name_latin: "Hibiscus Sabdariffa Flower Extract",
    handle: "hibiskus",
    description:
      "Hibiskus, nazywany roślinnym botoksem, jest bogaty w naturalne kwasy AHA i antyoksydanty. Ekstrakt z jego kwiatów wspiera produkcję kolagenu i elastyny, jednocześnie delikatnie złuszczając martwy naskórek. W biozgodnej pielęgnacji stanowi naturalną alternatywę dla agresywnych zabiegów odmładzających.",
    benefits: [
      "Naturalne złuszczanie dzięki kwasom AHA",
      "Wsparcie produkcji kolagenu i elastyny",
      "Rozświetlenie i wyrównanie kolorytu cery",
      "Ochrona antyoksydacyjna przed fotostarzeniem",
    ],
    source: "Ekstrakt z kwiatów hibiskusa sudańskiego (Hibiscus sabdariffa)",
    category: "herb",
    product_handles: ["mokosza-mydlo-rytualne"],
  },
  {
    name: "Masło shea",
    name_latin: "Butyrospermum Parkii Butter",
    handle: "maslo-shea",
    description:
      "Masło shea to bogaty w witaminy A, E i F naturalny emolient, pozyskiwany z orzechów drzewa shea rosnącego w Afryce Zachodniej. Tworzy na skórze ochronną warstwę zapobiegającą utracie wilgoci, jednocześnie ją intensywnie odżywiając. W biozgodnej pielęgnacji jest niezastąpione dla skóry suchej i wymagającej regeneracji.",
    benefits: [
      "Intensywne odżywienie i natłuszczenie suchej skóry",
      "Ochrona przed utratą wilgoci i czynnikami zewnętrznymi",
      "Przyspieszenie regeneracji i gojenia naskórka",
      "Wygładzenie i zmiękczenie szorstkiej skóry",
    ],
    source: "Nierafinowane masło z orzechów drzewa shea (Vitellaria paradoxa)",
    category: "butter",
    product_handles: ["rusalka-mydlo-rytualne", "mokosza-mydlo-rytualne"],
  },
  {
    name: "Bakuchiol",
    name_latin: "Bakuchiol",
    handle: "bakuchiol",
    description:
      "Bakuchiol to roślinny odpowiednik retinolu, pozyskiwany z nasion rośliny Psoralea corylifolia. Oferuje podobne korzyści przeciwstarzeniowe — stymuluje produkcję kolagenu i przyspiesza odnowę komórkową — bez efektów ubocznych retinoidów, takich jak suchość czy nadwrażliwość na słońce. Jest w pełni biozgodny i bezpieczny nawet w ciąży.",
    benefits: [
      "Stymulacja produkcji kolagenu bez podrażnień",
      "Redukcja zmarszczek i drobnych linii",
      "Wyrównanie kolorytu i rozświetlenie cery",
      "Bezpieczna alternatywa dla retinolu",
      "Działanie antyoksydacyjne i przeciwzapalne",
    ],
    source: "Ekstrakt z nasion rośliny Psoralea corylifolia (babchi)",
    category: "active",
    product_handles: ["rose-alchemy-50ml"],
  },
  {
    name: "Koenzym Q10",
    name_latin: "Ubiquinone",
    handle: "koenzym-q10",
    description:
      "Koenzym Q10 (ubichinon) to naturalny antyoksydant obecny w każdej komórce naszego ciała, którego poziom obniża się z wiekiem. Odgrywa kluczową rolę w procesach energetycznych komórek i ochronie przed stresem oksydacyjnym. W biozgodnej pielęgnacji wspiera naturalną zdolność skóry do regeneracji i obrony przed przedwczesnym starzeniem.",
    benefits: [
      "Ochrona przed stresem oksydacyjnym i wolnymi rodnikami",
      "Wsparcie energetyczne procesów odnowy komórkowej",
      "Redukcja oznak przedwczesnego starzenia",
      "Poprawa elastyczności i jędrności skóry",
    ],
    source: "Otrzymywany na drodze biotechnologicznej fermentacji drożdżowej",
    category: "active",
    product_handles: ["rose-alchemy-50ml"],
  },
  {
    name: "Olej z dzikiej róży",
    name_latin: "Rosa Canina Seed Oil",
    handle: "olej-z-dzikiej-rozy",
    description:
      "Olej z dzikiej róży to jeden z najcenniejszych olejów w pielęgnacji anti-age, bogaty w naturalny kwas trans-retinowy, witaminę C i nienasycone kwasy tłuszczowe. Skutecznie wspiera regenerację skóry, redukuje blizny i przebarwienia. Jest lekki i szybko się wchłania, co czyni go doskonałym składnikiem biozgodnych formuł.",
    benefits: [
      "Redukcja przebarwień i wyrównanie kolorytu cery",
      "Wsparcie regeneracji blizn i rozstępów",
      "Odżywienie skóry witaminą C i kwasami tłuszczowymi",
      "Działanie przeciwzmarszczkowe i ujędrniające",
    ],
    source: "Tłoczony na zimno z nasion dzikiej róży (Rosa canina)",
    category: "oil",
    product_handles: ["rose-alchemy-50ml"],
  },
  {
    name: "Olej konopny",
    name_latin: "Cannabis Sativa Seed Oil",
    handle: "olej-konopny",
    description:
      "Olej konopny wyróżnia się idealną proporcją kwasów omega-6 do omega-3 (3:1), co czyni go wyjątkowo biozgodnym z lipidami ludzkiej skóry. Zawiera również rzadki kwas gamma-linolenowy (GLA) o silnym działaniu przeciwzapalnym. Jest lekki, szybko się wchłania i nie zatyka porów, idealny dla skóry problematycznej.",
    benefits: [
      "Regulacja procesów zapalnych w skórze",
      "Odbudowa bariery lipidowej skóry",
      "Łagodzenie podrażnień i zaczerwienień",
      "Wsparcie skóry problematycznej i trądzikowej",
      "Nawilżenie bez efektu komedogennego",
    ],
    source: "Tłoczony na zimno z nasion konopi siewnych (Cannabis sativa L.)",
    category: "oil",
    product_handles: ["clear-ritual-50ml"],
  },
  {
    name: "Alantoina",
    name_latin: "Allantoin",
    handle: "alantoina",
    description:
      "Alantoina to naturalny składnik obecny w wielu roślinach, m.in. w żywokoście lekarskim, znany ze swoich właściwości kojących i przyspieszających regenerację naskórka. Stymuluje proliferację keratynocytów i wspiera naturalne procesy gojenia. W biozgodnej pielęgnacji ceniona za łagodność i wszechstronność działania.",
    benefits: [
      "Przyspieszenie regeneracji i gojenia naskórka",
      "Kojenie podrażnionej i wrażliwej skóry",
      "Zmiękczanie i wygładzanie skóry",
      "Stymulacja odnowy komórkowej",
    ],
    source: "Pozyskiwana z korzenia żywokostu lekarskiego (Symphytum officinale)",
    category: "active",
    product_handles: ["clear-ritual-50ml"],
  },
  {
    name: "Olej z rokitnika",
    name_latin: "Hippophae Rhamnoides Oil",
    handle: "olej-z-rokitnika",
    description:
      "Olej z rokitnika to jeden z najbogatszych roślinnych źródeł witaminy C, beta-karotenu i kwasów omega-7. Jego intensywnie pomarańczowy kolor świadczy o wysokiej zawartości karotenoidów — silnych antyoksydantów. Doskonale regeneruje, rozświetla i chroni skórę przed czynnikami środowiskowymi.",
    benefits: [
      "Intensywna regeneracja uszkodzonej skóry",
      "Rozświetlenie cery i redukcja przebarwień",
      "Ochrona antyoksydacyjna dzięki karotenoidom i witaminie C",
      "Wzmocnienie odporności skóry na czynniki zewnętrzne",
    ],
    source: "Tłoczony na zimno z owoców rokitnika zwyczajnego (Hippophae rhamnoides)",
    category: "oil",
    product_handles: ["golden-glow-50ml"],
  },
  {
    name: "Olej z pestek malin",
    name_latin: "Rubus Idaeus Seed Oil",
    handle: "olej-z-pestek-malin",
    description:
      "Olej z pestek malin to naturalny filtr UV o jednym z najwyższych współczynników ochrony wśród olejów roślinnych. Jest niezwykle bogaty w kwas elagowy, witaminę E i karotenoidy, które zapewniają potężną ochronę antyoksydacyjną. W biozgodnej pielęgnacji łączy fotoprotekcję z głębokim odżywieniem skóry.",
    benefits: [
      "Naturalny filtr UV chroniący przed promieniowaniem",
      "Silna ochrona antyoksydacyjna",
      "Odżywienie skóry witaminą E i karotenoidami",
      "Wsparcie regeneracji skóry narażonej na słońce",
    ],
    source: "Tłoczony na zimno z pestek malin (Rubus idaeus)",
    category: "oil",
    product_handles: ["golden-glow-50ml"],
  },
]

export default async function seedIngredients({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const ingredientsService = container.resolve("ingredients")

  logger.info("Starting ingredients seed...")

  // Fetch existing ingredients to avoid duplicates
  const existing = await ingredientsService.listIngredients({}, { take: 100 })
  const existingHandles = new Set(existing.map((i: any) => i.handle))

  const toCreate = ingredients.filter((i) => !existingHandles.has(i.handle))

  if (toCreate.length === 0) {
    logger.info("All ingredients already exist. Nothing to seed.")
    return
  }

  logger.info(
    `Found ${existingHandles.size} existing ingredients. Creating ${toCreate.length} new ingredients...`
  )

  const created = await ingredientsService.createIngredients(toCreate)

  logger.info(`Successfully seeded ${created.length} ingredients:`)
  for (const ingredient of created) {
    logger.info(`  ✓ ${ingredient.name} (${ingredient.handle})`)
  }

  logger.info("Ingredients seed completed.")
}
