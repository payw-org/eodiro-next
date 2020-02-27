import getApiHost from '@/modules/get-api-host'
import { Campus, Year, Semester } from '@/types'
import useFetch from '@/modules/use-fetch'

export default class VacantApi {
  static async buildings({
    year,
    semester,
    campus,
  }: {
    year: Year
    semester: Semester
    campus: Campus
  }) {
    const [err, data] = await useFetch(
      getApiHost() +
        `/${year}/${semester}/${encodeURIComponent(campus)}/vacant/buildings`,
      {
        method: 'get',
      }
    )

    return err ? null : data
  }

  static async classrooms({
    year,
    semester,
    campus,
    building,
  }: {
    year: Year
    semester: Semester
    campus: Campus
    building: string
  }) {
    const [err, data] = await useFetch(
      getApiHost() +
        `/${year}/${semester}/${encodeURIComponent(
          campus
        )}/vacant/${building}/classrooms`,
      {
        method: 'get',
      }
    )

    return err ? null : data
  }
}
