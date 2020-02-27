import fetch from 'isomorphic-unfetch'

type UseFetchError = any
type UseFetchData = any

async function useFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<[UseFetchError, UseFetchData]> {
  try {
    const res = await fetch(input, init)
    return [null, res.json()]
  } catch (err) {
    console.error(err)
    return [err, null]
  }
}

export default useFetch
