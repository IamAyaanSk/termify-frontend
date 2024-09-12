import { useEffect, useState } from 'react'

const useDebounce = (
  debounceFunction: (arg: string) => void,
  delay: number
) => {
  const [editable, setEditable] = useState<string>()

  useEffect(() => {
    if (editable === undefined) return
    const handler = setTimeout(() => {
      debounceFunction(editable)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [editable, debounceFunction, delay])

  return setEditable
}

export default useDebounce
