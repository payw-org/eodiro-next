import { Semester } from '@/types'
import dayjs from 'dayjs'

const getSemester = (date: Date = new Date()): Semester => {
  const now = dayjs()
  const month = now.month() + 1
  let semester: Semester

  if (month >= 1 && month <= 2) {
    semester = '겨울'
  } else if (month >= 3 && month <= 6) {
    semester = '1'
  } else if (month >= 7 && month <= 8) {
    semester = '여름'
  } else if (month >= 9 && month <= 12) {
    semester = '2'
  }

  return semester
}

export default getSemester
