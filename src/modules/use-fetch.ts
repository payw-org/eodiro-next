import fetch from 'isomorphic-unfetch'

type UseFetchError = any
type UseFetchStatusCode = number

async function useFetch<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<[UseFetchError, T, UseFetchStatusCode]> {
  const res = await fetch(input, init)
  try {
    try {
      const data = (await res.json()) as T
      return [null, data, res.status]
    } catch (error) {
      return [null, null, res.status]
    }
  } catch (err) {
    console.error(err)
    return [err, null, res.status]
  }
}

export default useFetch
