import getApiHost from '@/modules/get-api-host'
import { Campus, Year, Semester } from '@/types'
import useFetch from '@/modules/use-fetch'
import dayjs from 'dayjs'
import getSemester from '@/modules/get-semester'

export type VacantBuildings = {
  building_number: string
  total: number
  empty: number
}[]

export type VacantClassrooms = {
  classroom_number: string
  lectures: {
    name: string
    professor: string
    start_h: number
    start_m: number
    end_h: number
    end_m: number
  }[]
}[]

export default class VacantApi {
  static async buildings({
    year,
    semester,
    campus,
  }: {
    year: Year
    semester: Semester
    campus: Campus
  }): Promise<VacantBuildings | null> {
    const now = dayjs()
    year = year || now.year()
    semester = semester || getSemester()

    const [err, data] = await useFetch(
      getApiHost() +
        `/${year}/${encodeURIComponent(semester)}/${encodeURIComponent(
          campus
        )}/vacant/buildings`,
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
    year?: Year
    semester?: Semester
    campus: Campus
    building: string
  }): Promise<VacantClassrooms | null> {
    const now = dayjs()
    year = year || now.year()
    semester = semester || getSemester()

    const [err, data] = await useFetch(
      getApiHost() +
        `/${year}/${encodeURIComponent(semester)}/${encodeURIComponent(
          campus
        )}/vacant/${building}/classrooms`,
      {
        method: 'get',
      }
    )

    return err ? null : data
  }
}