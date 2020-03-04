import ApiHost from '@/modules/api-host'
import useFetch from '@/modules/use-fetch'

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
  static async inquirys(): Promise<InquiryData[] | null> {
    const [err, data] = await useFetch(ApiHost.getHost() + `/inquiry`, {
      method: 'get',
    })
    console.log(data)
    return err ? null : data
  }
}
