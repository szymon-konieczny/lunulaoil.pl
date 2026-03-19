"use client"

import AnimateIn from "@modules/common/components/animate-in"

const Hero = () => {
  return (
    <div className="relative w-full h-[100dvh] -mt-28 overflow-hidden" id="hero">
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

      {/* Content — centered with logo */}
      <div className="content-container relative z-10 flex flex-col items-center justify-center text-center h-full gap-6 py-16">
        <AnimateIn variant="fade-up" delay={200} duration={900}>
          <h1 className="font-heading text-4xl small:text-6xl leading-none text-white font-bold">
            Biozgodna Pielęgnacja
            <span className="block mt-3 h-[2px] w-32 bg-brand-accent mx-auto" />
          </h1>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={400} duration={900}>
          <p className="text-white/90 text-base small:text-lg max-w-2xl leading-relaxed mt-2">
            Składniki rozpoznawalne przez skórę, w harmonii z jej naturalnymi
            procesami. Pielęgnacja tak czysta, że mogłabyś ją zjeść.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={600} duration={900}>
          <p className="text-white/60 text-sm small:text-base italic">
            Czystość to luksus. Prostota to siła.
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
            className="mt-2 text-brand-accent hover:text-brand-accent-light transition-colors duration-300 text-lg font-medium cursor-pointer"
          >
            Odkryj więcej →
          </button>
        </AnimateIn>
      </div>

      {/* Bottom gradient fade into next section (dark manifest) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

export default Hero
