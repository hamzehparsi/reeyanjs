import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

export default defineNuxtPlugin(() => {
  // نیازی به calendar('jalali') نیست، در زمان استفاده باید تقویم ست شود
})
