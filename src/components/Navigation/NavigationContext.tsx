import React, { createContext, useState } from 'react'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface NavigationContextProps {
  pageAppTitle: string
  setPageAppTitle: Setter<string>
  isHidden: boolean
  setIsHidden: Setter<boolean>
}

export const NavigationContext = createContext({} as NavigationContextProps)

export const NavigationProvider: React.FC = ({ children }) => {
  const [pageAppTitle, setPageAppTitle] = useState('')
  const [isHidden, setIsHidden] = useState(true)

  return (
    <NavigationContext.Provider
      value={{
        pageAppTitle,
        setPageAppTitle,
        isHidden,
        setIsHidden,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
