'use client'
import { createContext, ReactNode, useContext, useState } from "react";

export type ViewMode = 'grid' | 'list' 

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider = ({children}: {children: ReactNode}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return  (
    <ViewModeContext.Provider value = {{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }

  return context
}