import React, { useEffect, useRef, useState } from 'react'

export function useStateRef<T = any>(
  initialState: T
): [T, React.Dispatch<T>, React.MutableRefObject<T>] {
  const [state, setState] = useState(initialState)

  const ref = useRef<T>(state)

  useEffect(() => {
    ref.current = state
  }, [state])

  return [state, setState, ref]
}
