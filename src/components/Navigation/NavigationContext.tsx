import React, { createContext, useState } from 'react'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface NavigationContextProps {
  pageAppTitle: string
  setPageAppTitle: Setter<string>
  isHidden: boolean
  setIsHidden: Setter<boolean>
  isScrolled: boolean
  setIsScrolled: Setter<boolean>
}

export const NavigationContext = createContext({} as NavigationContextProps)

export const NavigationProvider: React.FC = ({ children }) => {
  const [pageAppTitle, setPageAppTitle] = useState('')
  const [isHidden, setIsHidden] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  return (
    <NavigationContext.Provider
      value={{
        pageAppTitle,
        setPageAppTitle,
        isHidden,
        setIsHidden,
        isScrolled,
        setIsScrolled,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
