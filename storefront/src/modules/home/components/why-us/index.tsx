import Image from "next/image"

const sections = [
  {
    image: "/olejki-1.jpg",
    title: "Pielęgnacja",
    text: "Olejki Lunula Oil odżywiają, nawilżają i chronią Twoją skórę. Naturalne składniki aktywne wspierają regenerację i przywracają zdrowy blask.",
  },
  {
    image: "/olejki-2.jpg",
    title: "Zdrowie",
    text: "Bogate w witaminy A, E, B i D oraz nienasycone kwasy tłuszczowe. Nasze olejki to codzienna dawka zdrowia dla Twojej skóry.",
  },
  {
    image: "/olejki-3.jpg",
    title: "Siła Zapachów",
    text: "Kompozycje zapachowe tworzone z naturalnych olejków eterycznych z Maroka, Hiszpanii i Francji. Aromaterapia w każdej kropli.",
  },
]

const WhyUs = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-background">
      <div className="content-container">
        <h2 className="text-center text-brand-accent text-sm tracking-[0.3em] uppercase font-medium mb-12">
          Dlaczego my
        </h2>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col items-center text-center gap-6">
              <div className="relative w-full aspect-[5/4] overflow-hidden rounded-sm">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-white text-xl font-heading font-semibold">
                {section.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs
