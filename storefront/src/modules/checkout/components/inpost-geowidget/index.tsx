"use client"

import { updateCart } from "@lib/data/cart"
import { Button, Text } from "@medusajs/ui"
import Script from "next/script"
import { useCallback, useEffect, useRef, useState } from "react"

type InpostPoint = {
  name: string
  address: {
    line1: string
    line2: string
  }
}

declare global {
  interface Window {
    __inpostPointCallback?: (point: InpostPoint) => void
  }
  namespace JSX {
    interface IntrinsicElements {
      "inpost-geowidget": React.HTMLAttributes<HTMLElement> & {
        token?: string
        language?: string
        config?: string
        onpoint?: string
      }
    }
  }
}

type Props = {
  initialPoint?: { name: string; address: string } | null
}

export default function InpostGeowidget({ initialPoint }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string
    address: string
  } | null>(initialPoint || null)
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const widgetContainerRef = useRef<HTMLDivElement>(null)

  const handlePointSelected = useCallback(async (point: InpostPoint) => {
    const address = [point.address.line1, point.address.line2]
      .filter(Boolean)
      .join(", ")
    setSelectedPoint({ name: point.name, address })
    setIsWidgetOpen(false)
    setIsSaving(true)

    try {
      await updateCart({
        metadata: {
          inpost_point_name: point.name,
          inpost_point_address: address,
        },
      })
    } finally {
      setIsSaving(false)
    }
  }, [])

  useEffect(() => {
    window.__inpostPointCallback = handlePointSelected
    return () => {
      delete window.__inpostPointCallback
    }
  }, [handlePointSelected])

  useEffect(() => {
    if (!document.querySelector('link[href*="inpost-geowidget"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://geowidget.inpost.pl/inpost-geowidget.css"
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    if (isWidgetOpen && widgetContainerRef.current) {
      widgetContainerRef.current.innerHTML = `
        <inpost-geowidget
          token="${process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN || ""}"
          language="pl"
          config="parcelCollect"
          onpoint="__inpostPointCallback"
          style="width:100%;height:100%;display:block"
        ></inpost-geowidget>
      `
    }
  }, [isWidgetOpen])

  return (
    <div className="mt-4">
      <Script
        src="https://geowidget.inpost.pl/inpost-geowidget.js"
        strategy="lazyOnload"
      />

      <div className="mb-2">
        <span className="font-medium txt-medium text-ui-fg-base">
          Paczkomat InPost
        </span>
        <p className="text-ui-fg-muted txt-medium mb-3">
          Wybierz paczkomat do odbioru przesyłki
        </p>
      </div>

      {selectedPoint ? (
        <div className="flex items-start justify-between p-4 border border-ui-border-interactive rounded-rounded bg-brand-surface">
          <div>
            <Text className="font-semibold">{selectedPoint.name}</Text>
            <Text className="text-ui-fg-subtle text-sm">
              {selectedPoint.address}
            </Text>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsWidgetOpen(true)}
          >
            Zmień
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsWidgetOpen(true)}
          isLoading={isSaving}
        >
          Wybierz paczkomat
        </Button>
      )}

      {isWidgetOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60"
          onClick={() => setIsWidgetOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[95vw] max-w-3xl flex flex-col overflow-hidden"
            style={{ height: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <span className="font-semibold text-lg">
                Wybierz paczkomat InPost
              </span>
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="text-2xl text-gray-500 hover:text-black leading-none px-2"
              >
                ×
              </button>
            </div>
            <div
              ref={widgetContainerRef}
              className="flex-1 overflow-hidden"
            />
          </div>
        </div>
      )}
    </div>
  )
}
