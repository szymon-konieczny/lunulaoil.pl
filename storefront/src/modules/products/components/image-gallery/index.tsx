"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  // Index of the image shown in the full-screen lightbox, or null when closed.
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const open = activeIndex !== null
  const activeImage = open ? images[activeIndex] : null

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null)
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i === null ? i : (i + 1) % images.length))
      if (e.key === "ArrowLeft")
        setActiveIndex((i) =>
          i === null ? i : (i - 1 + images.length) % images.length
        )
    }

    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, images.length])

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-square w-full overflow-hidden bg-ui-bg-subtle cursor-zoom-in"
              id={image.id}
              onClick={() => image.url && setActiveIndex(index)}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>

      {open &&
        activeImage?.url &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4 small:p-8 cursor-zoom-out"
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd zdjęcia produktu"
          onClick={() => setActiveIndex(null)}
          data-testid="image-lightbox"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Zamknij podgląd"
            className="absolute top-4 right-5 text-white/80 hover:text-white text-4xl leading-none"
          >
            ×
          </button>
          <div
            className="relative w-full max-w-5xl h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt="Podgląd produktu"
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default ImageGallery
