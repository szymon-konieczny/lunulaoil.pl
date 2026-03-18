import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full h-[70vh] small:h-[85vh] overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Left-side gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content — left-aligned */}
      <div className="content-container relative z-10 flex flex-col items-start justify-center text-left h-full gap-5 pb-24 small:pb-32">
        <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
          Slow Care
        </span>

        <h1 className="font-heading text-4xl small:text-6xl leading-tight text-white max-w-lg drop-shadow-lg">
          Naturalna pielęgnacja tworzona z pasją
        </h1>

        <p className="text-white/90 text-lg small:text-xl max-w-md leading-relaxed drop-shadow-md">
          Odkryj olejki Lunula Oil — naturalne rytuały dla Twojej skóry,
          inspirowane naturą.
        </p>

        <div className="flex flex-col small:flex-row gap-4 mt-4">
          <LocalizedClientLink
            href="/store"
            className="px-8 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary-dark transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Zobacz produkty
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/about"
            className="px-8 py-3 border border-white/40 text-white rounded-full hover:border-white hover:bg-white/10 transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            O marce
          </LocalizedClientLink>
        </div>
      </div>

      {/* Bottom gradient fade into background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-background to-transparent" />
    </div>
  )
}

export default Hero
