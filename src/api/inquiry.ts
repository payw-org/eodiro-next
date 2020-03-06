import ApiHost from '@/modules/api-host'
import useFetch from '@/modules/use-fetch'
import queryString from 'query-string'

export type InquiryData = {
  id: number
  email: string
  title: string
  body: string
  answer?: string
  uploaded_at: string
  answered_at?: string
}

export class InquiryApi {
  static async inquirys(
    offset: number,
    amount?: number
  ): Promise<{
    inquiries: InquiryData[]
    isAdmin: boolean
  } | null> {
    const [err, data, status] = await useFetch(
      ApiHost.getHost() +
        `/inquiry?` +
        queryString.stringify({ amount, offset }),
      {
        method: 'get',
      }
    )
    return err
      ? null
      : status === 401
      ? undefined
      : status === 500
      ? null
      : data
  }
  static async post(
    title: string,
    body: string,
    email: string
  ): Promise<boolean> {
    const [err, data, status] = await useFetch(ApiHost.getHost() + `/inquiry`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `title=${title}&body=${body}&email=${email}`,
    })
    if (status === 201) {
      return true
    }
    return false
  }
}
