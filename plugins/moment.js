import moment from 'moment-jalaali'

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })

export default defineNuxtPlugin(() => {
  return {
    provide: {
      moment
    }
  }
})
