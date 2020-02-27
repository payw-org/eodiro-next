import getApiHost from '@/modules/get-api-host'
import { Campus, Year, Semester } from '@/types'

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
    try {
      const res = await fetch(
        getApiHost() + `/${year}/${semester}/${campus}/vacant/buildings`,
        {
          method: 'get',
        }
      )
      return res.json()
    } catch (err) {
      return err
    }
  }
}
