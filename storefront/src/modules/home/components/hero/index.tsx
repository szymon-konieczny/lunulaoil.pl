"use client"

import AnimateIn from "@modules/common/components/animate-in"
import ScrollDownButton from "@modules/common/components/scroll-down-button"

const Hero = () => {
  return (
    <div className="relative w-full h-[100dvh] -mt-20 overflow-hidden" id="hero">
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

      {/* Content - centered */}
      <div className="content-container relative z-10 flex flex-col items-center justify-center text-center h-full gap-6 small:gap-8 pt-40 small:pt-52 pb-16">
        <AnimateIn variant="fade-up" delay={200} duration={1000}>
          <h1 className="font-heading text-4xl small:text-6xl medium:text-7xl leading-none text-white font-bold tracking-tight">
            Biozgodna Pielęgnacja
            <span className="block mt-4 h-[1px] w-24 bg-brand-accent mx-auto opacity-80" />
          </h1>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={500} duration={1000}>
          <p className="text-white/80 text-base small:text-lg max-w-xl leading-relaxed">
            Składniki rozpoznawalne przez skórę, w harmonii z jej naturalnymi
            procesami. Pielęgnacja tak czysta, że mogłabyś ją zjeść.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={700} duration={1000}>
          <p className="text-white/50 text-sm small:text-base italic font-light">
            Czystość to luksus. Prostota to siła.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={900} duration={1000}>
          <ScrollDownButton />
        </AnimateIn>
      </div>

      {/* Bottom gradient fade into next section (dark manifest) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  )
}

export default Hero
