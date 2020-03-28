import ApiHost from '@/modules/api-host'
import getSemester from '@/modules/get-semester'
import useFetch from '@/modules/use-fetch'
import { Campus, LecturesWithMajorCode, Semester } from '@/types'
import dayjs from 'dayjs'
import queryString from 'query-string'

export class LecturesApi {
  static async lectures(options: {
    year?: number
    semeseter?: Semester
    campus: Campus
    amount?: number
    offset: number
  }): Promise<LecturesWithMajorCode> {
    const now = dayjs()
    const year = options?.year || now.year()
    const semeseter = encodeURIComponent(options?.semeseter || getSemester())
    const campus = encodeURIComponent(options.campus)
    const amount = options.amount
    const offset = options.offset

    const [err, data] = await useFetch<LecturesWithMajorCode>(
      ApiHost.getHost() +
        `/lectures/${year}/${semeseter}/${campus}/list?` +
        queryString.stringify({
          amount,
          offset,
        })
    )

    return err ? null : data
  }

  static async search(
    query = '',
    options: {
      year?: number
      semeseter?: Semester
      campus: Campus
      amount?: number
      offset: number
    }
  ): Promise<LecturesWithMajorCode> {
    const now = dayjs()
    const year = options?.year || now.year()
    const semeseter = encodeURIComponent(options?.semeseter || getSemester())
    const campus = encodeURIComponent(options.campus)
    const q = query
    const amount = options.amount
    const offset = options.offset

    const [err, data] = await useFetch<LecturesWithMajorCode>(
      ApiHost.getHost() +
        `/lectures/${year}/${semeseter}/${campus}/search?` +
        queryString.stringify({
          q,
          amount,
          offset,
        })
    )

    return err ? null : data
  }
}
