import eodiroAxios from './eodiro-axios'

export type Cookie = {
  expires?: string // Expiry date in UTC time
  name: string
  value: string | number
}

export type Cookies = Cookie[]

export default class EodiroHttpCookie {
  static async set(cookieData: Cookie): Promise<boolean> {
    const [err] = await eodiroAxios({
      url: '/cookie',
      method: 'POST',
      data: cookieData,
    })

    return err ? false : true
  }

  static async get(): Promise<Record<string, string | number>> {
    const [err, data] = await eodiroAxios({
      url: '/cookie',
      method: 'GET',
    })

    return err ? {} : ((data as unknown) as Record<string, string | number>)
  }
}
