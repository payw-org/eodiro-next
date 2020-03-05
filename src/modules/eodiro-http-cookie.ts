import eodiroAxios from './eodiro-axios'

export type Cookie = {
  expires?: string // Expiry date in UTC time
  name: string
  value: string | number
}

export type Cookies = Cookie[]

const eodiroHttpCookie = async (
  cookieData: Cookie | Cookies
): Promise<boolean> => {
  const [err] = await eodiroAxios({
    url: '/cookie',
    method: 'POST',
    data: Array.isArray(cookieData) ? cookieData : [cookieData],
  })

  return err ? false : true
}

export default eodiroHttpCookie
