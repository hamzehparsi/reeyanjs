import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

// فعال‌سازی پلاگین جلالی
dayjs.extend(jalaliday)

// فعال‌سازی تقویم جلالی
dayjs.calendar('jalali')

// اختیاری: به صورت global export کنیم برای استفاده در سایر فایل‌ها
export default defineNuxtPlugin(() => {
  // اینجا نیازی به return خاصی نیست چون dayjs خودش globally mutable هست
})
