import dayjs from 'dayjs'

type Dayjs = {
  isBetween(a: dayjs.Dayjs, b: dayjs.Dayjs): boolean
  isSameOrAfter(a: dayjs.Dayjs): boolean
}
