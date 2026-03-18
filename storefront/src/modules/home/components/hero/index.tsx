"use client"

import AnimateIn from "@modules/common/components/animate-in"

const Hero = () => {
  return (
    <div className="relative w-full h-[70vh] small:h-[85vh] overflow-hidden" id="hero">
      {/* Background video with image fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-bg.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://pub-52b434aaf6f64430938d4f3287fbd44e.r2.dev/hero-video.mp4" type="video/mp4" />
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content — left-aligned */}
      <div className="content-container relative z-10 flex flex-col items-start justify-center text-left h-full gap-4 py-16">
        <AnimateIn variant="fade-in" duration={1000}>
          <span className="text-white/80 text-lg small:text-xl tracking-wide font-light">
            LUNULA OIL
          </span>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={200} duration={900}>
          <h1 className="font-heading text-5xl small:text-7xl leading-none text-white font-bold">
            BIO OLEJKI
            <span className="block mt-3 h-[2px] w-32 bg-brand-accent" />
          </h1>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={400} duration={900}>
          <p className="text-white/90 text-base small:text-lg max-w-2xl leading-relaxed mt-4">
            Linia luksusowych olejków do masażu i pielęgnacji twarzy, ciała
            i włosów. Lunula Oil to seria olejków pielęgnujących Twoją skórę,
            dostarczających Ci niepowtarzalnych doznań zapachowych oraz dawkę
            witamin, nienasyconych kwasów tłuszczowych i antyoksydantów,
            niezbędnych do zachowania pięknej i zdrowej skóry.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={600} duration={900}>
          <p className="text-white/80 text-sm small:text-base max-w-2xl leading-relaxed">
            Wszystkie produkty Lunula Oil spełniają surowe normy
            mikrobiologiczne i dermatologiczne (baza CPNP). Zarejestrowane
            są również w farmaceutycznej Bazie Leków i Środków Ochrony Zdrowia.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={800} duration={900}>
          <button
            onClick={() => {
              const hero = document.getElementById("hero")
              if (hero) {
                const nextSection = hero.nextElementSibling
                nextSection?.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="mt-4 text-brand-accent hover:text-brand-accent/80 transition-colors duration-300 text-lg font-medium cursor-pointer"
          >
            Dowiedz się więcej →
          </button>
        </AnimateIn>
      </div>

      {/* Bottom gradient fade into background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-background to-transparent" />
    </div>
  )
}

export default Hero
