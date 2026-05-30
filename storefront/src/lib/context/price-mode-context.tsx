"use client"

import React, { createContext, useContext } from "react"
import { PriceMode } from "@lib/util/price-display"

const PriceModeContext = createContext<PriceMode>("gross")

export const PriceModeProvider = ({
  mode,
  children,
}: {
  mode: PriceMode
  children?: React.ReactNode
}) => {
  return (
    <PriceModeContext.Provider value={mode}>
      {children}
    </PriceModeContext.Provider>
  )
}

/** Current price presentation mode. Defaults to "gross" (B2C) outside a provider. */
export const usePriceMode = (): PriceMode => useContext(PriceModeContext)
