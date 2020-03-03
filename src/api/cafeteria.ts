import ApiHost from '@/modules/api-host'
import useFetch from '@/modules/use-fetch'
import { Campus } from '@/types'
import { Day } from '@payw/cau-cafeteria-menus-scraper-types'
import dayjs from 'dayjs'

export type CafeteriaMenus = Omit<Day, 'date'>

export class CafeteriaApi {
  static async menus({
    date = dayjs().format('YYYY-MM-DD'),
    campus = '서울',
  }: {
    date?: string
    campus?: Campus
  }): Promise<CafeteriaMenus> {
    const uriSafeCampus = encodeURIComponent(campus)
    const [err, data, status] = await useFetch<CafeteriaMenus>(
      ApiHost.getHost() + `/cafeteria/${date}/${uriSafeCampus}/menus`
    )

    let menusData = data

    // No Content
    if (status === 204) {
      menusData = {
        breakfast: [],
        lunch: [],
        supper: [],
      }
    }

    return err ? null : menusData
  }
}
